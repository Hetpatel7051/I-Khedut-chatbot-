# iKhedut Farmer Support Assistant (આઈ-ખેડૂત સહાયક)

Multilingual scheme lookup for Gujarat farmers in Gujarati, Hindi, and English. Chat answers use a local BM25-style retriever over the bundled scheme catalog and deterministic response templates. The chat path does not require a generative-model API key.

---

## 🌟 Key Features

- 🎙️ **Speech Services:** Speech recognition and speech synthesis use configured Bhashini/gTTS services; text chat remains local.
- 🌾 **Local Scheme Retrieval:** BM25-style lexical ranking searches scheme names, categories, tags, criteria, and documents in the bundled JSON catalog.
- ⚠️ **Catalog Caveat:** Bundled records are reference data, not a live or independently verified government feed. Answers and calculator results disclose this and do not claim approval or individual eligibility.
- 📴 **Honest Availability:** Live APMC prices, weather, application status, and official document verification are reported unavailable until authoritative services are configured.
- 📋 **Application Guidance:** Checklists and official portal links are provided from the local catalog; the app does not create official applications.

---

## 🚀 Quick Start with Docker Compose

```bash
# 1. Clone repository and navigate to root
cd ikhedut-ai-chatbot

# 2. Add Bhashini credentials to .env only if speech recognition is enabled
# BHASHINI_API_KEY=...
# BHASHINI_USER_ID=...
# BHASHINI_ASR_SERVICE_ID=...
# BHASHINI_TTS_SERVICE_ID=...

# 3. Start the configured services
docker-compose up --build
```

Access the services:
- **Frontend App:** [http://localhost:3000](http://localhost:3000)
- **FastAPI Documentation:** [http://localhost:8080/docs](http://localhost:8080/docs)

---

## 📁 Repository Structure

```
ikhedut-ai-chatbot/
├── backend/                  # FastAPI ASGI microservice
│   ├── app/
│   │   ├── api/v1/           # REST endpoints (chat, voice, schemes, farmer, health)
│   │   ├── core/             # Configuration, Database, Security
│   │   ├── models/           # SQLAlchemy models
│   │   ├── rag/              # Local BM25 index, retriever, answer templates, and guardrails
│   │   ├── services/         # Bhashini STT/TTS, Web search, Portal scraper
│   ├── requirements.txt
│   └── Dockerfile
├── data_pipeline/            # Bundled scheme data and local index verification CLI
│   ├── sample_data/          # Bundled reference scheme dataset
│   ├── ingest.py             # Local index reload/verification command
│   └── scraper_cli.py        # Portal scraper CLI
├── frontend/ (and /src)      # React 19 + TypeScript + Tailwind CSS UI
│   ├── components/           # AudioRecorder, ChatInterface, SchemeCard, ProfileModal, Calculator
│   └── hooks/                # useAudioRecorder, useChat
├── server.ts                 # Optional Node/Vite proxy to the FastAPI backend
└── docker-compose.yml
```
