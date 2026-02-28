import { useState } from "react";
import kbApi from "../../api/kb";
import KBAnswer from "./KBAnswer";

export default function KBAsk() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const res = await kbApi.askQuestion(question.trim());
      setResult(res);
    } catch (err) {
      console.error("KB error:", err);
      setResult({
        answer: "Something went wrong. Please try again.",
        confidence: 0.2,
        source: "system",
        suggest_ticket: true
      });
    }

    setLoading(false);
  };

  return (
    <div className="card">
      <h3>Ask Knowledge Base</h3>

      <input
        placeholder="Ask your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={ask}>Ask</button>

      {loading && <p>Thinking...</p>}
      {result && <KBAnswer result={result} />}
    </div>
  );
}