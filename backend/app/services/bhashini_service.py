import base64
from typing import Any

import httpx
from fastapi import HTTPException

from backend.app.core.config import settings


class BhashiniService:
    async def _request(self, task: str, payload: dict[str, Any]) -> dict[str, Any]:
        if not settings.BHASHINI_API_KEY or not settings.BHASHINI_USER_ID:
            raise HTTPException(
                status_code=503,
                detail="Bhashini speech service is not configured.",
            )

        service_id = (
            settings.BHASHINI_ASR_SERVICE_ID
            if task == "asr"
            else settings.BHASHINI_TTS_SERVICE_ID
        )
        if not service_id:
            raise HTTPException(
                status_code=503,
                detail=f"Bhashini {task.upper()} service ID is not configured.",
            )

        headers = {
            "userID": settings.BHASHINI_USER_ID,
            "ulcaApiKey": settings.BHASHINI_API_KEY,
            "Content-Type": "application/json",
        }
        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                response = await client.post(
                    settings.BHASHINI_PIPELINE_ENDPOINT,
                    headers=headers,
                    json=payload,
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as error:
            raise HTTPException(
                status_code=502,
                detail="Bhashini speech service request failed.",
            ) from error

    async def speech_to_text(
        self,
        audio_base64: str,
        source_lang: str = "gu",
        mime_type: str = "audio/webm",
    ) -> dict[str, Any]:
        try:
            audio_bytes = base64.b64decode(audio_base64, validate=True)
        except (ValueError, base64.binascii.Error) as error:
            raise HTTPException(
                status_code=400, detail="Invalid audio payload."
            ) from error

        response = await self._request(
            "asr",
            {
                "pipelineTasks": [
                    {
                        "taskType": "asr",
                        "config": {
                            "language": {"sourceLanguage": source_lang},
                            "serviceId": settings.BHASHINI_ASR_SERVICE_ID,
                        },
                    }
                ],
                "inputData": {
                    "audio": [
                        {
                            "audioContent": base64.b64encode(audio_bytes).decode(
                                "ascii"
                            ),
                            "mimeType": mime_type,
                        }
                    ]
                },
            },
        )
        output = response.get("pipelineResponse", [{}])[0].get("output", [{}])[0]
        return {
            "text": output.get("source", ""),
            "source_language": source_lang,
            "confidence": output.get("confidence", 0.0),
        }

    async def text_to_speech(
        self,
        text: str,
        target_lang: str = "gu",
        gender: str = "female",
    ) -> dict[str, Any]:
        response = await self._request(
            "tts",
            {
                "pipelineTasks": [
                    {
                        "taskType": "tts",
                        "config": {
                            "language": {
                                "sourceLanguage": target_lang,
                                "targetLanguage": target_lang,
                            },
                            "serviceId": settings.BHASHINI_TTS_SERVICE_ID,
                            "gender": gender,
                        },
                    }
                ],
                "inputData": {"input": [{"source": text}]},
            },
        )
        audio = response.get("pipelineResponse", [{}])[0].get("audio", [{}])[0]
        return {"audio_base64": audio.get("audioContent", "")}


bhashini_service = BhashiniService()
