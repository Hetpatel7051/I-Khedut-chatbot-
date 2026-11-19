import asyncio
import unittest

from fastapi import HTTPException
from fastapi import FastAPI

from backend.app.api.v1.api_router import api_router
from backend.app.api.v1.endpoints.chat import ChatRequest, chat_endpoint
from backend.app.api.v1.endpoints.health import health_check
from backend.app.api.v1.endpoints.mandi import get_mandi_prices
from backend.app.api.v1.endpoints.weather import get_weather
from backend.app.rag.answer import answer_from_rag
from backend.app.rag.retriever import retrieve_schemes
from backend.app.rag.vector_store import vector_store
from backend.app.services.mandi_service import fetch_mandi_prices


class LocalRagTests(unittest.TestCase):
    def test_local_retrieval_matches_english_and_gujarati_queries(self):
        english_results = retrieve_schemes(
            "Tell me about tractor subsidy eligibility documents", limit=1
        )
        gujarati_results = retrieve_schemes("ટપક સિંચાઈ સહાય", limit=1)

        self.assertEqual(english_results[0]["id"], "ikhedut-sch-001")
        self.assertEqual(gujarati_results[0]["id"], "ikhedut-sch-002")

    def test_local_answer_uses_retrieved_record_and_discloses_catalog_source(self):
        result = answer_from_rag(
            "Tell me about tractor subsidy eligibility documents", {}, "en"
        )

        self.assertEqual(result["intent"], "scheme_inquiry")
        self.assertEqual(result["matched_schemes"][0]["id"], "ikhedut-sch-001")
        self.assertIn("local reference catalog", result["response_text"])
        self.assertIn("eligibility", result["response_text"].lower())
        self.assertEqual(result["citations"], [])

    def test_chat_endpoint_uses_local_rag_without_a_generation_api(self):
        result = asyncio.run(
            chat_endpoint(
                ChatRequest(
                    message="ટપક સિંચાઈ સહાય",
                    language="gu",
                    farmer_profile={"land_size_acres": 4, "caste_category": "General"},
                )
            )
        )

        self.assertEqual(result["intent"], "scheme_inquiry")
        self.assertEqual(result["matched_schemes"][0]["id"], "ikhedut-sch-002")
        self.assertIn("સ્થાનિક સંદર્ભ કેટલોગ", result["response_text"])

    def test_index_loads_independent_of_current_working_directory(self):
        self.assertGreater(len(vector_store.schemes), 0)
        self.assertEqual(vector_store.reload(), len(vector_store.schemes))


class ExternalDataGuardTests(unittest.TestCase):
    def test_api_exposes_health_and_speech_routes(self):
        app = FastAPI()
        app.include_router(api_router, prefix="/api/v1")
        paths = set(app.openapi()["paths"])

        self.assertIn("/api/v1/health", paths)
        self.assertIn("/api/v1/voice/transcribe", paths)
        self.assertIn("/api/v1/voice/synthesize", paths)
        health = asyncio.run(health_check())
        self.assertEqual(health["answer_engine"], "local_bm25_rag")
        self.assertGreater(health["indexed_schemes"], 0)
        self.assertIn(health["speech_services"]["stt"], {"Bhashini", "unconfigured"})

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

    def test_image_and_untranscribed_audio_are_not_claimed_as_verified(self):
        image_result = asyncio.run(
            chat_endpoint(
                ChatRequest(
                    message="Check this document",
                    language="en",
                    image_base64="dGVzdA==",
                )
            )
        )
        audio_result = asyncio.run(
            chat_endpoint(
                ChatRequest(message="", language="en", audio_base64="dGVzdA==")
            )
        )

        self.assertEqual(image_result["intent"], "document_verification_unavailable")
        self.assertEqual(audio_result["intent"], "transcription_unavailable")

    def test_unavailable_weather_and_mandi_apis_do_not_return_fixtures(self):
        self.assertEqual(asyncio.run(fetch_mandi_prices("Unjha", "Cumin")), [])

        with self.assertRaises(HTTPException) as mandi_error:
            asyncio.run(get_mandi_prices(market="Unjha"))
        self.assertEqual(mandi_error.exception.status_code, 503)

        with self.assertRaises(HTTPException) as weather_error:
            asyncio.run(get_weather("Rajkot"))
        self.assertEqual(weather_error.exception.status_code, 503)


if __name__ == "__main__":
    unittest.main()
