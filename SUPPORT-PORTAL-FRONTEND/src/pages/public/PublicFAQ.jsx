import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";
import { Link } from "react-router-dom";

export default function PublicFAQ() {
  const [faqs, setFaqs] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openQuestion, setOpenQuestion] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [liked, setLiked] = useState({});
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

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setOpenCategory(null);
    setOpenQuestion(null);
  };

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = faqs.filter((faq) => {
    if (!searchTerm) return true;
    return (
      faq?.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq?.answer?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const popularFaqs = filteredFaqs.slice(0, 3);

  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    const category = faq.category || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(faq);
    return acc;
  }, {});

  const categories = Object.keys(groupedFaqs);

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>Frequently Asked Questions</h1>
          <p style={styles.subtitle}>
            Find answers to common questions about SupportSphere
          </p>

          <div style={styles.searchRow}>
            <input
              placeholder="Search FAQs..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={styles.searchInput}
            />
            <button onClick={handleSearch} style={styles.searchBtn}>
              Search
            </button>
          </div>
        </div>

        {loading ? (
          <p style={{ padding: "40px" }}>Loading FAQs...</p>
        ) : (
          <div style={styles.layoutContainer}>
            <div style={styles.mainGrid}>
              <div style={styles.leftPanel}>
                <h2 style={styles.popularTitle}>⭐ Popular Questions</h2>

                {popularFaqs.map((faq, index) => (
                  <div key={faq.id} style={styles.popularCard}>
                    <div
                      onClick={() =>
                        setOpenQuestion(
                          openQuestion === faq.id ? null : faq.id
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <strong>
                        {index + 1}. {faq.question}
                      </strong>
                    </div>

                    <div style={styles.popularFooter}>
                      <button
                        onClick={() => toggleLike(faq.id)}
                        style={styles.likeBtn}
                      >
                        {liked[faq.id] ? "👍 Liked" : "👍"}
                      </button>

                      <span style={styles.helpful}>
                        {faq.helpful ?? 90}% helpful
                      </span>
                    </div>

                    {openQuestion === faq.id && (
                      <p style={styles.answer}>{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>

              <div style={styles.rightPanel}>
                {categories.map((category) => (
                  <div key={category} style={{ marginBottom: "24px", width: "100%" }}>
                    <div
                      style={styles.categoryHeader}
                      onClick={() =>
                        setOpenCategory(
                          openCategory === category ? null : category
                        )
                      }
                    >
                      📂 {category}
                    </div>

                    {openCategory === category &&
                      groupedFaqs[category].map((faq) => (
                        <div key={faq.id} style={styles.faqCard}>
                          <div
                            onClick={() =>
                              setOpenQuestion(
                                openQuestion === faq.id ? null : faq.id
                              )
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <strong>{faq.question}</strong>
                          </div>

                          {openQuestion === faq.id && (
                            <p style={styles.answer}>{faq.answer}</p>
                          )}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={styles.cta}>
          <h3 style={styles.ctaTitle}>Still didn’t find an answer?</h3>

          <p style={styles.ctaText}>
            Search the knowledge base or contact support for help.
          </p>

          <div style={styles.ctaActions}>
            <Link to="/login" style={styles.ctaBtnLight}>
              Contact Support
            </Link>

            {/* ✅ FIXED ROUTE */}
            <Link to="/kb" style={styles.ctaBtn}>
              Knowledge Base
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: { background: "#ffffff", minHeight: "100vh" },
  header: {
    background: "linear-gradient(120deg,#3f4c5a,#7b8794)",
    color: "white",
    padding: "80px 80px",
  },
  title: { fontSize: "46px", fontWeight: "800" },
  subtitle: { marginTop: "12px", fontSize: "18px", opacity: 0.9 },
  searchRow: { display: "flex", gap: "12px", marginTop: "26px" },
  searchInput: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    width: "420px",
  },
  searchBtn: {
    background: "#020617",
    color: "white",
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
  },
  // layoutContainer: {
  //   maxWidth: "1200px",
  //   margin: "60px auto",
  //   padding: "0 20px",
  // },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "360px 1fr",
    gap: "60px",
    alignItems: "start",
  },
  leftPanel: { position: "sticky", top: "120px" },
  rightPanel: { width: "100%" },
  popularTitle: { marginBottom: "20px" },
  popularCard: {
    background: "#fff7ed",
    border: "1px solid #fbbf24",
    padding: "18px",
    borderRadius: "12px",
    marginBottom: "14px",
  },
  popularFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  likeBtn: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "4px 10px",
    cursor: "pointer",
  },
  categoryHeader: {
    background: "white",
    padding: "16px",
    borderRadius: "10px",
    fontWeight: "600",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
  },
  faqCard: {
    background: "white",
    padding: "10px 12px",
    borderRadius: "10px",
    marginTop: "12px",
    marginLeft: "40px",
    // border: "1px solid #e2e8f0",
    border: "1px solid #e2e8f0",
    borderLeft: "6px solid #d7937a",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  helpful: { fontSize: "13px", color: "#64748b" },
  answer: { marginTop: "10px", color: "#475569" },
  cta: {
    background: "#f8fafc",
    padding: "70px 40px",
    borderRadius: "18px",
    margin: "80px auto",
    maxWidth: "1200px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
  },
  ctaTitle: { fontSize: "28px", fontWeight: "700", marginBottom: "12px" },
  ctaText: {
    fontSize: "16px",
    color: "#475569",
    marginBottom: "28px",
  },
  ctaActions: {
    display: "flex",
    gap: "18px",
    justifyContent: "center",
  },
  ctaBtn: {
    background: "#2563eb",
    color: "white",
    padding: "12px 22px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "600",
  },
  ctaBtnLight: {
    background: "white",
    color: "#2563eb",
    padding: "12px 22px",
    borderRadius: "10px",
    textDecoration: "none",
    border: "1px solid #2563eb",
    fontWeight: "600",
  },
  layoutContainer: {
    maxWidth: "1200px",
    margin: "60px auto",
    padding: "40px 20px",
    background: "#ffffff",
    borderRadius: "16px",
  },
};