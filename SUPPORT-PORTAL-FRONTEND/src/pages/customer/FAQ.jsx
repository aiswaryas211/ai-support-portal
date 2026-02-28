import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const res = await api.get("/faqs");
        setFaqs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load FAQs", err);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    loadFaqs();
  }, []);

  const groupedFaqs = faqs.reduce((acc, faq) => {
    if (!faq || !faq.question || !faq.answer) return acc;

    const category =
      faq.category && faq.category.trim()
        ? faq.category
        : "General";

    acc[category] = acc[category] || [];
    acc[category].push(faq);

    return acc;
  }, {});

  const categories = Object.keys(groupedFaqs);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>FAQs</h1>

        {loading && <p style={styles.muted}>Loading FAQs...</p>}

        {!loading && categories.length === 0 && (
          <p style={styles.muted}>No FAQs available</p>
        )}

        {categories.map((category) => (
          <div key={category} style={{ marginTop: "30px" }}>
            <h2 style={styles.category}>📂 {category}</h2>

            {groupedFaqs[category].map((faq, index) => (
              <div key={faq.id} style={styles.card}>
                <strong>
                  {index + 1}. {faq.question}
                </strong>
                <p style={styles.answer}>{faq.answer}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#eef2ff",
    padding: "40px 20px",
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#0f172a",
  },

  category: {
    color: "#1e293b",
    marginBottom: "10px",
  },

  card: {
    background: "white",
    padding: "16px",
    borderRadius: "10px",
    marginTop: "10px",
    border: "1px solid #e2e8f0",
  },

  answer: {
    marginTop: "8px",
    color: "#475569",
  },

  muted: {
    opacity: 0.6,
    color: "#334155",
  },
};