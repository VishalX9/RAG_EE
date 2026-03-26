import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore


load_dotenv()

print("1. Loading standard textbook embeddings...")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")


pdf_folder_path = "./docs" 

print(f"2. Reading PDFs from {pdf_folder_path}...")
loader = PyPDFDirectoryLoader(pdf_folder_path)
documents = loader.load()

print("3. Splitting documents into manageable chunks...")
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = text_splitter.split_documents(documents)

print(f"4. Uploading {len(chunks)} chunks to Qdrant Cloud. This might take a minute...")

qdrant = QdrantVectorStore.from_documents(
    chunks,
    embeddings,
    url=os.getenv("QUADRANT_URL"),
    api_key=os.getenv("QUADRANT_API_KEY"),
    collection_name="gate_ee_materials",
)

print("Migration Complete! Your AI Brain is now living in the cloud.")