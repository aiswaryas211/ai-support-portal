import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import AdminLayout from "./AdminLayout";

export default function ManageFAQs() {
  const { user } = useAuth();

  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState("");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");

  const [openCategory, setOpenCategory] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);

  const loadFaqs = async () => {
    try {
      const res = await api.get("/faqs");
      setFaqs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load FAQs", err);
      setFaqs([]);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const addFaq = async () => {
    if (!question.trim() || !answer.trim() || !category.trim()) {
      alert("Please fill all fields");
      return;
    }

    await api.post("/faqs", {
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim(),
    });

    setQuestion("");
    setAnswer("");
    setCategory("");
    loadFaqs();
  };

  const deleteFaq = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;
    await api.delete(`/faqs/${id}`);
    loadFaqs();
  };

  const groupedFaqs = faqs.reduce((acc, faq) => {
    if (!faq.category) return acc;

    const matchesSearch =
      !search.trim() ||
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return acc;

    acc[faq.category] = acc[faq.category] || [];
    acc[faq.category].push(faq);
    return acc;
  }, {});

  const categories = Object.keys(groupedFaqs);

  return (
    <AdminLayout>
      <div style={styles.page}>
        <h1 style={styles.title}>Manage FAQs</h1>

        <input
          placeholder="Search FAQs..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpenCategory(null);
            setOpenQuestion(null);
          }}
          style={styles.search}
        />

        <div style={styles.grid}>
          {/* LEFT — ADD FAQ */}
          {user?.role === "admin" && (
            <div style={styles.card}>
              <h3>Add New FAQ</h3>

              <input
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={styles.input}
              />

              <input
                placeholder="Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                style={styles.input}
              />

              <textarea
                placeholder="Answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                style={{ ...styles.input, height: "120px" }}
              />

              <button style={styles.primaryBtn} onClick={addFaq}>
                Add FAQ
              </button>
            </div>
          )}

          {/* RIGHT — EXISTING FAQS */}
          <div>
            <h3 style={{ marginBottom: "16px", color: "#0b2c5d" }}>
              Existing FAQs
            </h3>
            {categories.map((cat) => (
              <div key={cat} style={styles.card}>
                <div
                  style={styles.categoryHeader}
                  onClick={() => {
                    setOpenCategory(openCategory === cat ? null : cat);
                    setOpenQuestion(null);
                  }}
                >
                  <span>
                    📁 {cat} ({groupedFaqs[cat].length})
                  </span>
                  <span>{openCategory === cat ? "▲" : "▼"}</span>
                </div>

                {openCategory === cat &&
                  groupedFaqs[cat].map((faq) => (
                    <div key={faq.id} style={styles.faqItem}>
                      <div
                        style={styles.question}
                        onClick={() =>
                          setOpenQuestion(
                            openQuestion === faq.id ? null : faq.id
                          )
                        }
                      >
                        • {faq.question}
                      </div>

                      {openQuestion === faq.id && (
                        <div style={styles.answer}>
                          <p>{faq.answer}</p>

                          {user?.role === "admin" && (
                            <button
                              style={styles.deleteBtn}
                              onClick={() => deleteFaq(faq.id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

const styles = {
  page: {
    background: "#f8fafc",
    minHeight: "100vh",
  },

  title: {
    marginBottom: "24px",
    color: "#0b2c5d",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },

  search: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    marginBottom: "24px",
  },

  card: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
  },

  primaryBtn: {
    background: "#0b2c5d",
    color: "white",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  },

  categoryHeader: {
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
    fontWeight: "600",
    color: "#0b2c5d",
    marginBottom: "8px",
  },

  faqItem: {
    paddingLeft: "10px",
    marginBottom: "12px",
  },

  question: {
    cursor: "pointer",
    fontWeight: "600",
  },

  answer: {
    marginTop: "6px",
    marginLeft: "18px",
    paddingLeft: "10px",
    borderLeft: "2px solid #e5e7eb",
    color: "#374151",
  },

  deleteBtn: {
    marginTop: "8px",
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },
};