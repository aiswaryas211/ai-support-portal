from pypdf import PdfReader


def extract_text(file_path: str, file_type: str) -> str:
    """
    Extract text from supported file types.
    Supports: PDF, TXT
    """

    # TXT SUPPORT
    if file_type == "txt":
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()

    # PDF SUPPORT
    if file_type == "pdf":
        reader = PdfReader(file_path)
        text = ""

        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

        return text

    raise Exception(f"Unsupported file type: {file_type}")


def chunk_text(text: str, chunk_size=500, overlap=100):
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap

    return chunks