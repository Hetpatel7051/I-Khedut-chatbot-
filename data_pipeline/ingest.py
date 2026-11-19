import logging
from backend.app.rag.vector_store import vector_store

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def run_ingestion():
    """Reload the local lexical index from the bundled scheme catalog."""
    scheme_count = vector_store.reload()
    if scheme_count == 0:
        logger.error("No scheme records were loaded from %s", vector_store.schemes_path)
        return
    logger.info("Loaded %d schemes into the local BM25 retrieval index", scheme_count)


if __name__ == "__main__":
    run_ingestion()
