import os
import json
import logging
from backend.app.rag.vector_store import vector_store
from backend.app.rag.embeddings import gemini_embedder

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_ingestion():
    """Chunk and ingest iKhedut scheme seed dataset into ChromaDB."""
    json_path = os.path.join(os.path.dirname(__file__), "sample_data/ikhedut_schemes.json")
    if not os.path.exists(json_path):
        logger.error("Seed data file not found at: %s", json_path)
        return

    with open(json_path, "r", encoding="utf-8") as f:
        schemes = json.load(f)

    logger.info("Loaded %d schemes from %s", len(schemes), json_path)

    # Generate document texts for embedding
    texts_to_embed = []
    for s in schemes:
        text = f"{s.get('name_gu', '')} {s.get('name_en', '')} {s.get('category_gu', '')} {s.get('subsidy_percentage', '')} {' '.join(s.get('eligibility_criteria_gu', []))} {' '.join(s.get('tags', []))}"
        texts_to_embed.append(text)

    logger.info("Generating embeddings with Gemini text-embedding-004...")
    embeddings = gemini_embedder.embed_documents(texts_to_embed)

    logger.info("Indexing documents into ChromaDB collection...")
    vector_store.add_schemes(schemes, embeddings)
    logger.info("Ingestion completed successfully!")

if __name__ == "__main__":
    run_ingestion()
