import json
import logging
import math
import re
from collections import Counter
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)
SCHEMES_PATH = (
    Path(__file__).resolve().parents[3]
    / "data_pipeline"
    / "sample_data"
    / "ikhedut_schemes.json"
)
TOKEN_PATTERN = re.compile(r"[^\W_]+", re.UNICODE)
STOP_WORDS = {
    "a",
    "an",
    "and",
    "are",
    "about",
    "for",
    "from",
    "how",
    "i",
    "in",
    "is",
    "me",
    "of",
    "on",
    "the",
    "to",
    "what",
    "which",
    "with",
    "you",
    "મને",
    "માટે",
    "છે",
    "શું",
    "કઈ",
    "કયો",
    "કેવી",
    "વિશે",
    "અને",
    "મારી",
}


def tokenize(text: str) -> list[str]:
    return [
        token
        for token in TOKEN_PATTERN.findall(text.casefold())
        if token not in STOP_WORDS and len(token) > 1
    ]


def _scheme_document(scheme: dict[str, Any]) -> str:
    fields = [
        scheme.get("name_gu", ""),
        scheme.get("name_en", ""),
        scheme.get("name_hi", ""),
        scheme.get("category", ""),
        scheme.get("category_gu", ""),
        scheme.get("subsidy_percentage", ""),
        " ".join(scheme.get("tags", [])),
        " ".join(scheme.get("eligibility_criteria_gu", [])),
        " ".join(scheme.get("eligibility_criteria_en", [])),
        " ".join(scheme.get("required_documents_gu", [])),
        " ".join(scheme.get("required_documents_en", [])),
    ]
    return " ".join(field for field in fields if field)


class LocalSchemeStore:
    """Small local BM25 index over bundled scheme records; no API embeddings."""

    def __init__(self, schemes_path: Path = SCHEMES_PATH) -> None:
        self.schemes_path = schemes_path
        self.schemes: list[dict[str, Any]] = []
        self.documents: list[list[str]] = []
        self.document_frequencies: Counter[str] = Counter()
        self.average_length = 0.0
        self.reload()

    def reload(self) -> int:
        try:
            with self.schemes_path.open(encoding="utf-8") as source:
                schemes = json.load(source)
        except (OSError, json.JSONDecodeError) as error:
            logger.warning("Could not load local scheme catalog: %s", error)
            self.schemes = []
            self.documents = []
            self.document_frequencies = Counter()
            self.average_length = 0.0
            return 0

        self.schemes = schemes if isinstance(schemes, list) else []
        self.documents = [tokenize(_scheme_document(scheme)) for scheme in self.schemes]
        self.document_frequencies = Counter(
            token for document in self.documents for token in set(document)
        )
        total_tokens = sum(len(document) for document in self.documents)
        self.average_length = total_tokens / max(len(self.documents), 1)
        return len(self.schemes)

    def search(self, query: str, limit: int = 3) -> list[dict[str, Any]]:
        query_tokens = set(tokenize(query))
        if not query_tokens or not self.schemes:
            return []

        document_count = len(self.schemes)
        ranked: list[tuple[float, int, dict[str, Any]]] = []
        for index, document in enumerate(self.documents):
            frequencies = Counter(document)
            document_length = len(document)
            score = 0.0
            for token in query_tokens:
                term_frequency = frequencies[token]
                if not term_frequency:
                    continue
                document_frequency = self.document_frequencies[token]
                inverse_frequency = math.log(
                    1
                    + (document_count - document_frequency + 0.5)
                    / (document_frequency + 0.5)
                )
                length_normalizer = term_frequency + 1.5 * (
                    0.25 + 0.75 * document_length / max(self.average_length, 1)
                )
                score += inverse_frequency * term_frequency * 2.5 / length_normalizer

            scheme = self.schemes[index]
            phrase = " ".join(tokenize(query))
            names_and_tags = " ".join(
                [
                    scheme.get("name_gu", ""),
                    scheme.get("name_en", ""),
                    scheme.get("name_hi", ""),
                    " ".join(scheme.get("tags", [])),
                ]
            ).casefold()
            if phrase and phrase in " ".join(tokenize(names_and_tags)):
                score += 3.0

            if score > 0:
                ranked.append((score, index, scheme))

        ranked.sort(key=lambda result: (-result[0], result[1]))
        return [scheme for _, _, scheme in ranked[: max(limit, 0)]]


vector_store = LocalSchemeStore()
