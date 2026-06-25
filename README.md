# GATE EE AI - RAG Powered Learning Platform

## Overview

GATE EE AI is a Retrieval-Augmented Generation (RAG) based learning platform designed specifically for **GATE Electrical Engineering** aspirants. Users can ask conceptual questions, numerical problems, or upload circuit diagrams/images, and the system retrieves relevant textbook content before generating accurate, context-aware responses.

The project combines modern LLMs with vector search to minimize hallucinations while providing high-quality technical explanations.

---

## Features

*  Retrieval-Augmented Generation (RAG)
*  Gemini 2.5 Flash powered responses
*  Semantic search using Qdrant Vector Database
*  PDF-based knowledge base
*  Image-based question solving
*  Automatic LaTeX rendering for mathematical expressions
*  FastAPI backend for AI inference
*  Node.js backend for authentication and chat history
*  React frontend
*  JWT Authentication
*  Chat history management
*  Restricted to GATE Electrical Engineering, Electronics, and Engineering Mathematics

---

# Tech Stack

## Frontend

* React
* JavaScript
* CSS
* Axios

---

## AI Backend

* FastAPI
* Uvicorn
* LangChain
* LangChain Core
* LangChain Community
* LangChain HuggingFace
* LangChain Qdrant
* LangChain Google Generative AI
* HuggingFace Embeddings
* Gemini 2.5 Flash
* Qdrant Cloud
* PyPDF
* Python Dotenv

---

## Authentication Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt.js

---

## Database

* MongoDB Atlas
* Qdrant Cloud (Vector Database)

---

# Project Architecture

```
                 React Frontend
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
 Node.js Backend                  FastAPI Backend
(Authentication)                (RAG + Gemini AI)
        │                               │
        ▼                               ▼
 MongoDB Atlas                  Qdrant Vector DB
                                        │
                                        ▼
                               Uploaded PDF Documents
```

---

# RAG Workflow

1. User submits a question.
2. Question embedding is generated using HuggingFace Embeddings.
3. Similar textbook chunks are retrieved from Qdrant.
4. Retrieved context is passed to Gemini 2.5 Flash.
5. Gemini generates a context-aware response.
6. Chat history is stored in MongoDB.

---

# Folder Structure

```
project/
│
├── frontend/              # React Frontend
│
├── backend-node/          # Express Authentication API
│
├── backend-ai/            # FastAPI RAG Engine
│
├── docs/                  # PDF Knowledge Base
│
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd project
```

---

# Backend (Node)

Install dependencies

```bash
npm install
```

Run

```bash
npm run dev
```

---

# AI Backend

Install dependencies

```bash
pip install -r requirements.txt
```

Run

```bash
uvicorn main:app --reload
```

---

# Frontend

```bash
npm install
npm start
```

---

# Environment Variables

## Node Backend

```
PORT=

MONGO_URI=

JWT_SECRET=
```

---

## FastAPI Backend

```
GEMINI_API_KEY=

HUGGINGFACEHUB_API_TOKEN=

QDRANT_URL=

QDRANT_API_KEY=
```

---

# Building the Vector Database

Place all study material PDFs inside the `docs/` folder.

Run:

```bash
python build_vector_db.py
```

This script:

* Reads all PDFs
* Splits documents into chunks
* Generates embeddings
* Uploads vectors to Qdrant Cloud

---

# API Endpoints

## AI Backend

### Ask Question

```
POST /ask-gate-bot
```

Request

```json
{
  "question": "Explain Maximum Power Transfer Theorem",
  "image": null
}
```

---

## Authentication Backend

Typical endpoints include:

* Register User
* Login User
* Store Chat History
* Retrieve Chat History

---

# Deployment

Frontend

* Vercel

Node Backend

* Render

AI Backend

* Render

Database

* MongoDB Atlas

Vector Database

* Qdrant Cloud

---

# Future Improvements

* Voice-based interaction
* OCR for handwritten questions
* Previous Year Question recommendations
* Personalized learning dashboard
* Topic-wise revision planner
* Performance analytics
* Multi-document retrieval
* Streaming AI responses

---

# License

This project is intended for educational and learning purposes.
