import asyncio
import argparse
import json
import logging
import os
import tempfile
from pathlib import Path
from backend.app.services.ikhedut_scraper import ikhedut_scraper

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def main():
    parser = argparse.ArgumentParser(
        description="Fetch public iKhedut scheme-category descriptions"
    )
    parser.add_argument(
        "--output",
        default="data_pipeline/sample_data/ikhedut_scraped.json",
        help="Path to save validated category records",
    )
    args = parser.parse_args()

    logger.info("Fetching public category data from ikhedut.gujarat.gov.in/site...")
    categories = await ikhedut_scraper.fetch_portal_categories()
    if not categories or any(
        item.get("record_type") != "portal_category" for item in categories
    ):
        raise RuntimeError(
            "Scraper returned empty or invalid category data; output not written"
        )

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            dir=output_path.parent,
            prefix=f".{output_path.name}.",
            suffix=".tmp",
            delete=False,
        ) as output_file:
            temporary_path = Path(output_file.name)
            json.dump(categories, output_file, ensure_ascii=False, indent=2)
            output_file.write("\n")
        os.replace(temporary_path, output_path)
    finally:
        if temporary_path and temporary_path.exists():
            temporary_path.unlink()

    logger.info(
        "Saved %d validated portal categories to %s", len(categories), output_path
    )


if __name__ == "__main__":
    asyncio.run(main())
