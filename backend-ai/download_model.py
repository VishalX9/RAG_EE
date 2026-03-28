from sentence_transformers import SentenceTransformer
print("Pre-downloading the HuggingFace model during the build phase...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model downloaded successfully! Ready for blazing fast startup.")
