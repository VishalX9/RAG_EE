from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
import os

print("1. Loading ALL PDFs from the docs folder...")

loader = PyPDFDirectoryLoader("docs/") 
documents = loader.load()
print(f"Loaded {len(documents)} total pages across all PDFs!")

print("2. Chunking the documents into smaller pieces...")
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = text_splitter.split_documents(documents)
print(f"Created {len(chunks)} total chunks to process!")

print("3. Connecting to Local HuggingFace Embeddings...")

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

print("4. Building Qdrant Database locally at maximum speed...")

qdrant = QdrantVectorStore.from_documents(
    documents=chunks, 
    embedding=embeddings,
    path="./local_qdrant", 
    collection_name="gate_ee_materials", 
)

print("Success! The massive Qdrant database has been fully built without rate limits!")
