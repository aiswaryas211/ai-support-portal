import os
from groq import Groq
from pypdf import PdfReader

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def extract_pdf_text(file_path: str) -> str:
    reader = PdfReader(file_path)
    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    return text[:4000]


def extract_text_file(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()[:4000]


def summarize_document(file_path: str) -> str:
    try:
        # FIXED EXTENSION DETECTION
        ext = os.path.splitext(file_path)[1].lower()

        print("Detected file extension:", ext)

        if ext == ".pdf":
            text = extract_pdf_text(file_path)

        elif ext in [".txt", ".log"]:
            text = extract_text_file(file_path)

        else:
            print("Unsupported file type for summary:", ext)
            return ""

        if not text.strip():
            print("No text extracted from file")
            return ""

        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "Summarize this support document in 3 lines.",
                },
                {
                    "role": "user",
                    "content": text,
                },
            ],
            temperature=0.2,
        )

        summary = completion.choices[0].message.content
        print("Generated summary:", summary)

        return summary

    except Exception as e:
        print("Groq summary failed:", e)
        return ""