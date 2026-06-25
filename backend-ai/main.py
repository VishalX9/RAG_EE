from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Optional
import os

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEndpointEmbeddings
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


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY")
)


embeddings = HuggingFaceEndpointEmbeddings(
    model="sentence-transformers/all-MiniLM-L6-v2",
    task="feature-extraction",
    huggingfacehub_api_token=os.getenv("HUGGINGFACEHUB_API_TOKEN")
)


qdrant = QdrantVectorStore.from_existing_collection(
    embedding=embeddings,
    collection_name="gate",
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
You are GATE EE AI, an expert tutor for GATE Electrical Engineering.

You are ONLY allowed to answer questions related to:
- Electrical Engineering
- Electronics Engineering
- Engineering Mathematics
- Control Systems
- Signals & Systems
- Digital Electronics
- Analog Electronics
- Power Systems
- Electrical Machines
- Power Electronics
- Network Theory
- Electromagnetic Fields
- Measurements & Instrumentation
- GATE EE syllabus and closely related engineering concepts.

Use the following retrieved textbook context to answer the user's question.

Retrieved Context:
{context_text}

RULES:

1. Answer ONLY questions related to the above subjects.

2. If the user's question is unrelated to Electrical Engineering, Electronics, Engineering Mathematics, GATE preparation, or the retrieved documents, politely refuse.

Example response:
"I'm designed only for GATE Electrical Engineering and related technical subjects. Please ask a question related to Electrical Engineering, Electronics, Engineering Mathematics, or the GATE EE syllabus."

3. NEVER answer unrelated questions such as:
- Movies
- Celebrities
- Politics
- Sports
- History
- Geography
- Programming unrelated to GATE EE
- General knowledge
- Personal advice

4. Do NOT use your general knowledge to answer unrelated questions.

5. If the retrieved context does not contain enough information but the question is clearly related to GATE EE, answer using your engineering knowledge while clearly stating that the textbook context was insufficient.

6. If an image is provided, analyze it only if it is related to Electrical Engineering, Electronics, Mathematics, circuits, graphs, waveforms, formulas, diagrams, or GATE problems.

7. Keep explanations technically accurate, concise, and suitable for GATE preparation.

{LATEX_RULES}
"""


        if request.image:
            human_content = [
                {"type": "text", "text": request.question},
                {"type": "image_url", "image_url": {"url": request.image}}
            ]
        else:
            human_content = request.question


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
