import asyncio
import os
import tempfile
import unittest
from unittest.mock import AsyncMock, patch

from fastapi import HTTPException

from backend.app.api.v1.endpoints.chat import ChatRequest, chat_endpoint
from backend.app.api.v1.endpoints.mandi import get_mandi_prices
from backend.app.api.v1.endpoints.weather import get_weather
from backend.app.llm.gemini_client import process_chat
from backend.app.llm.prompts import get_system_prompt
from backend.app.services.mandi_service import fetch_mandi_prices


class AccuracyGuardTests(unittest.TestCase):
    def test_live_data_and_application_requests_are_not_invented(self):
        cases = (
            ("Check status IKH-2025-8841", "status_unavailable"),
            ("Current weather in Rajkot?", "weather_unavailable"),
            ("Today cumin price at Unjha market", "market_prices_unavailable"),
            ("Apply for tractor assistance", "application_creation_unavailable"),
        )

        for message, expected_intent in cases:
            with self.subTest(message=message):
                result = asyncio.run(
                    chat_endpoint(ChatRequest(message=message, language="en"))
                )
                self.assertEqual(result["intent"], expected_intent)
                self.assertEqual(result["matched_schemes"], [])
                self.assertEqual(result["citations"], [])

    def test_unavailable_weather_and_mandi_apis_do_not_return_fixtures(self):
        self.assertEqual(asyncio.run(fetch_mandi_prices("Unjha", "Cumin")), [])

        with self.assertRaises(HTTPException) as mandi_error:
            asyncio.run(get_mandi_prices(market="Unjha"))
        self.assertEqual(mandi_error.exception.status_code, 503)

        with self.assertRaises(HTTPException) as weather_error:
            asyncio.run(get_weather("Rajkot"))
        self.assertEqual(weather_error.exception.status_code, 503)

    def test_prompt_loads_catalog_and_frontend_profile_fields_outside_repo_cwd(self):
        original_cwd = os.getcwd()
        try:
            with tempfile.TemporaryDirectory() as working_directory:
                os.chdir(working_directory)
                prompt = get_system_prompt(
                    {
                        "name": "Test Farmer",
                        "district": "Rajkot",
                        "land_size_acres": 4,
                        "caste_category": "General",
                    },
                    "en",
                )
        finally:
            os.chdir(original_cwd)

        self.assertIn("Landholding: 4 acres", prompt)
        self.assertIn("Tractor Sahay Yojana", prompt)
        self.assertIn("No live APMC price feed", prompt)

    def test_missing_gemini_key_returns_unavailable_not_sample_prices(self):
        with patch.dict(os.environ, {"GEMINI_API_KEY": ""}):
            response = asyncio.run(
                process_chat("What is today's mandi price?", {}, "en")
            )

        self.assertIn("unavailable", response.lower())
        self.assertNotIn("₹4800", response)

    def test_chat_endpoint_forwards_uploaded_image_and_no_fake_citation(self):
        with patch(
            "backend.app.api.v1.endpoints.chat.process_chat",
            new_callable=AsyncMock,
        ) as process_chat_mock:
            process_chat_mock.return_value = "Visible image details only."
            response = asyncio.run(
                chat_endpoint(
                    ChatRequest(
                        message="Describe the uploaded document",
                        language="en",
                        image_base64="dGVzdA==",
                        image_mime_type="image/png",
                    )
                )
            )

        process_chat_mock.assert_awaited_once_with(
            "Describe the uploaded document",
            {},
            "en",
            None,
            None,
            "dGVzdA==",
            "image/png",
        )
        self.assertEqual(response["citations"], [])


if __name__ == "__main__":
    unittest.main()
