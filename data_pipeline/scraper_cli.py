import asyncio
import argparse
import json
import logging
from backend.app.services.ikhedut_scraper import ikhedut_scraper

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def main():
    parser = argparse.ArgumentParser(description="iKhedut Portal Scraper CLI")
    parser.add_argument("--output", default="data_pipeline/sample_data/ikhedut_scraped.json", help="Path to save scraped output")
    args = parser.parse_args()

    logger.info("Starting automated scraper for ikhedut.gujarat.gov.in...")
    schemes = await ikhedut_scraper.fetch_portal_schemes()
    logger.info("Scraped %d schemes from portal.", len(schemes))

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(schemes, f, ensure_ascii=False, indent=2)

    logger.info("Saved results to %s", args.output)

if __name__ == "__main__":
    asyncio.run(main())
