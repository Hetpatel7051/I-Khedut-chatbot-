import logging
from typing import List
from google import genai
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

class GeminiEmbedder:
    """Wrapper for Google GenAI text-embedding-004."""

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = None
        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.warning("Failed to initialize Google GenAI Client: %s", e)

    def embed_text(self, text: str) -> List[float]:
        """Generate embedding vector for text query."""
        if not self.client or not text:
            # Deterministic fallback vector of size 768
            return [0.0] * 768

        try:
            response = self.client.models.embed_content(
                model=settings.EMBEDDING_MODEL,
                contents=text
            )
            if hasattr(response, "embedding") and response.embedding:
                return response.embedding.values
            if hasattr(response, "embeddings") and response.embeddings:
                return response.embeddings[0].values
        except Exception as e:
            logger.warning("Gemini embedding API call failed: %s", e)

        return [0.0] * 768

    def embed_documents(self, documents: List[str]) -> List[List[float]]:
        """Generate embeddings for batch of documents."""
        return [self.embed_text(doc) for doc in documents]

gemini_embedder = GeminiEmbedder()
