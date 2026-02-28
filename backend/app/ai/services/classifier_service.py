import json
from app.ai.services.summary_service import client  # reuse your Groq client


# -----------------------------
# KEYWORD QUEUE (stable)
# -----------------------------
def classify_queue(text: str):
    if any(k in text for k in ["wifi", "laptop", "network", "system"]):
        return "IT"

    if any(k in text for k in ["salary", "leave", "hr"]):
        return "HR"

    if any(k in text for k in ["invoice", "payment", "finance", "bill"]):
        return "Finance"

    return "Facilities"


# -----------------------------
# LLM PRIORITY (Groq)
# -----------------------------
def classify_priority_llm(subject: str, description: str):
    prompt = f"""
Classify the PRIORITY of this support ticket.

Return ONLY JSON:
{{"priority":"low|medium|high"}}

Subject: {subject}
Description: {description}
"""

    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
        )

        content = response.choices[0].message.content
        parsed = json.loads(content)

        return parsed["priority"]

    except Exception as e:
        print("LLM priority classification failed:", e)
        return None


# -----------------------------
# FALLBACK PRIORITY
# -----------------------------
def keyword_priority(text: str):
    if any(k in text for k in ["urgent", "down", "crash", "not working"]):
        return "high"

    if any(k in text for k in ["slow", "issue", "problem"]):
        return "medium"

    return "low"


# -----------------------------
# MAIN CLASSIFIER
# -----------------------------
def classify_ticket(subject: str, description: str):
    text = f"{subject} {description}".lower()

    queue = classify_queue(text)

    priority = classify_priority_llm(subject, description)
    if not priority:
        priority = keyword_priority(text)

    return queue, priority