import logging
from datetime import datetime, timezone
from html.parser import HTMLParser
from typing import Any

import httpx

logger = logging.getLogger(__name__)
PORTAL_HOME_DATA_URL = "https://ikhedut.gujarat.gov.in/site/home_data.json"
PORTAL_BASE_URL = "https://ikhedut.gujarat.gov.in"
LANGUAGE_FIELDS = {1: "en", 2: "hi", 3: "gu"}


class _TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []

    def handle_data(self, data: str) -> None:
        cleaned = " ".join(data.split())
        if cleaned:
            self.parts.append(cleaned)


def _plain_text(value: str) -> str:
    parser = _TextExtractor()
    parser.feed(value)
    return " ".join(parser.parts)


def normalize_portal_categories(payload: dict[str, Any]) -> list[dict[str, Any]]:
    """Normalize public homepage category descriptions, not individual schemes."""
    data = payload.get("data")
    if not isinstance(data, dict):
        raise ValueError("Portal response is missing the data object")
    rows = data.get("Schemas")
    if not isinstance(rows, list) or not rows:
        raise ValueError("Portal response contains no public category records")

    grouped: dict[str, dict[str, Any]] = {}
    for row in rows:
        if not isinstance(row, dict):
            continue
        group_id = str(row.get("groupingid") or "").strip()
        description_language = LANGUAGE_FIELDS.get(row.get("languageid"))
        name_language = LANGUAGE_FIELDS.get(row.get("grouplanguageid"))
        group_name = str(row.get("groupshortname") or "").strip()
        description = _plain_text(str(row.get("description") or ""))
        if not group_id or not group_name:
            continue

        record = grouped.setdefault(
            group_id,
            {
                "id": f"ikhedut-category-{group_id}",
                "record_type": "portal_category",
                "source_url": PORTAL_HOME_DATA_URL,
                "application_url": f"{PORTAL_BASE_URL}/site/",
                "retrieved_at": datetime.now(timezone.utc).isoformat(),
                "names": {},
                "descriptions": {},
            },
        )
        if name_language:
            record["names"][name_language] = group_name
        if description_language and description:
            record["descriptions"][description_language] = description

    categories = []
    for record in grouped.values():
        names = record.pop("names")
        descriptions = record.pop("descriptions")
        record.update(
            {
                "name_en": names.get("en", ""),
                "name_hi": names.get("hi", ""),
                "name_gu": names.get("gu", ""),
                "description_en": descriptions.get("en", ""),
                "description_hi": descriptions.get("hi", ""),
                "description_gu": descriptions.get("gu", ""),
            }
        )
        if record["name_en"] or record["name_gu"] or record["name_hi"]:
            categories.append(record)

    if not categories:
        raise ValueError("Portal category response had no usable localized records")
    return categories


class IKhedutScraper:
    async def fetch_portal_categories(self) -> list[dict[str, Any]]:
        """Fetch public portal category descriptions. Not scheme/subsidy details."""
        headers = {
            "User-Agent": "iKhedut-Reference-Scraper/1.0",
            "Accept": "application/json",
        }
        try:
            async with httpx.AsyncClient(
                timeout=httpx.Timeout(25.0), follow_redirects=True
            ) as client:
                response = await client.get(PORTAL_HOME_DATA_URL, headers=headers)
                response.raise_for_status()
                payload = response.json()
        except (httpx.HTTPError, ValueError) as error:
            logger.error("Failed to fetch public iKhedut category data: %s", error)
            raise RuntimeError(
                "Could not retrieve public iKhedut category data"
            ) from error

        return normalize_portal_categories(payload)


ikhedut_scraper = IKhedutScraper()
