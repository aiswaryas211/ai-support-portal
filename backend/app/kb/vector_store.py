import chromadb
from sentence_transformers import SentenceTransformer
import uuid

# ---------------------------
# PERSISTENT CHROMA CLIENT
# ---------------------------
client = chromadb.PersistentClient(path="./chroma")

collection = client.get_or_create_collection(name="kb_documents")

embedder = SentenceTransformer("all-MiniLM-L6-v2")


# ---------------------------
# ADD CHUNKS
# ---------------------------
def add_chunks(chunks, metadatas):
    if not chunks:
        return

    embeddings = embedder.encode(chunks).tolist()

    ids = [str(uuid.uuid4()) for _ in chunks]

    collection.add(
        documents=chunks,
        metadatas=metadatas,
        embeddings=embeddings,
        ids=ids
    )

# ---------------------------
# QUERY
# ---------------------------
def query_chunks(query, n_results=4):
    embedding = embedder.encode([query]).tolist()

    return collection.query(
        query_embeddings=embedding,
        n_results=n_results
    )

   