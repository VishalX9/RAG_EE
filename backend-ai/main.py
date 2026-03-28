from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Optional
import os

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_qdrant import QdrantVectorStore


load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("🚀 Booting up GATE AI Engine...")

# ------------------ MODELS ------------------
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY")
)
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")


qdrant = QdrantVectorStore.from_existing_collection(
    embedding=embeddings,
    collection_name="gate_ee_materials",
    url=os.getenv("QUADRANT_URL"),
    api_key=os.getenv("QUADRANT_API_KEY"),
)

retriever = qdrant.as_retriever(search_kwargs={"k": 3})


LATEX_RULES = """
STRICT FORMATTING RULES:
- Use LaTeX for ALL math.
- Inline math: $...$
- Block math: $$...$$
- Do NOT write math in plain text.
- Use \\frac{}{} for fractions.
- Use \\cdot for multiplication when needed.
"""


class QuestionRequest(BaseModel):
    question: str
    image: Optional[str] = None


@app.post("/ask-gate-bot")
def ask_gate_bot(request: QuestionRequest):
    try:

        docs = retriever.invoke(request.question)
        context_text = "\n\n".join([doc.page_content for doc in docs])


        sys_instructions = f"""
You are an expert Electrical Engineering tutor for GATE exam.

Use the following textbook context to answer:

{context_text}

If answer is not in context, say that clearly and then solve using your knowledge.

If image is provided, analyze it carefully.

{LATEX_RULES}
"""

        # 3. Human input (text + optional image)
        if request.image:
            human_content = [
                {"type": "text", "text": request.question},
                {"type": "image_url", "image_url": {"url": request.image}}
            ]
        else:
            human_content = request.question

        # 4. Messages
        messages = [
            SystemMessage(content=sys_instructions),
            HumanMessage(content=human_content)
        ]


        response = llm.invoke(messages)

        return {
            "status": "success",
            "answer": response.content
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@app.get("/")
def read_root():
    return {
        "message": " Python RAG Engine is running with Qdrant + Gemini!"
    }
