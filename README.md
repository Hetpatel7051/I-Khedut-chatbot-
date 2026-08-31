# Generative AI Chatbot for iKhedut Portal Assistance (આઈ-ખેડૂત સહાયક)

An enterprise-grade multilingual Generative AI Chatbot and RAG decision support system for Gujarat farmers to query government agricultural schemes, subsidy percentages, eligibility criteria, and required documents using voice and text in Gujarati (ગુજરાતી), Hindi (हिंदी), and English.

---

## 🌟 Key Features

- 🎙️ **Voice First (STT & TTS):** Speak directly in Gujarati or Hindi; listen to synthesized spoken audio explanations.
- 🌾 **Comprehensive Scheme Engine:** Seeded with major Gujarat agricultural schemes (Tractor Sahay, Micro Irrigation / GGRC Drip & Sprinkler, Barbed Wire Fencing, Desi Cow Maintenance ₹900/month, Agricultural Drone Subsidy, Smart Phone assistance, Solar Pumps, and Farm Storage Godowns).
- 🛡️ **RAG with Anti-Hallucination Guardrails:** Embeds verified Government Resolutions (GR) using Google GenAI `text-embedding-004` and ChromaDB vector store. Guardrails strictly audit subsidy numbers and limits.
- 👨‍🌾 **Farmer Profile Personalization:** Calculates tailored subsidy amounts based on land size (Acres/Vigha), social category (General/OBC/SC/ST/Women), and district.
- 📋 **Document Checklist & Application Guidance:** Instant checklists for 7/12 & 8-A Satbara records, Aadhaar, Bank Passbooks, and direct portal links.
- ⚡ **Full-Stack Production Ready:** Dual architecture with React + Tailwind frontend, Node/Express live preview server with `@google/genai`, and Python FastAPI + ChromaDB + Docker Compose backend.

---

## 🚀 Quick Start with Docker Compose

```bash
# 1. Clone repository and navigate to root
cd ikhedut-ai-chatbot

# 2. Set environment variables in .env
echo "GEMINI_API_KEY=your_gemini_api_key" >> .env

# 3. Spin up PostgreSQL, ChromaDB, FastAPI Backend, and React Frontend
docker-compose up --build
```

Access the services:
- **Frontend App:** [http://localhost:3000](http://localhost:3000)
- **FastAPI Documentation:** [http://localhost:8080/docs](http://localhost:8080/docs)
- **ChromaDB:** [http://localhost:8000](http://localhost:8000)

---

## 📁 Repository Structure

```
ikhedut-ai-chatbot/
├── backend/                  # FastAPI ASGI microservice
│   ├── app/
│   │   ├── api/v1/           # REST endpoints (chat, voice, schemes, farmer, health)
│   │   ├── core/             # Configuration, Database, Security
│   │   ├── models/           # SQLAlchemy models
│   │   ├── rag/              # ChromaDB vector store, Gemini embedder, Hybrid retriever, Guardrails
│   │   ├── services/         # Bhashini STT/TTS, Web search, Portal scraper
│   │   └── llm/              # Gemini SDK client with Gujarati/Hindi/English prompts
│   ├── requirements.txt
│   └── Dockerfile
├── data_pipeline/            # Seed data and vector ingestion CLI
│   ├── sample_data/          # Official Gujarat iKhedut scheme dataset
│   ├── ingest.py             # Vector ingestion script
│   └── scraper_cli.py        # Portal scraper CLI
├── frontend/ (and /src)      # React 19 + TypeScript + Tailwind CSS UI
│   ├── components/           # AudioRecorder, ChatInterface, SchemeCard, ProfileModal, Calculator
│   └── hooks/                # useAudioRecorder, useChat
├── server.ts                 # Full-stack Node/Express server for live preview
└── docker-compose.yml
```
