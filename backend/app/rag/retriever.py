from typing import Any

from backend.app.rag.vector_store import LocalSchemeStore, vector_store


def retrieve_schemes(
    query: str,
    limit: int = 3,
    store: LocalSchemeStore = vector_store,
) -> list[dict[str, Any]]:
    """Retrieve the most relevant local scheme records for a farmer query."""
    return store.search(query, limit=limit)
