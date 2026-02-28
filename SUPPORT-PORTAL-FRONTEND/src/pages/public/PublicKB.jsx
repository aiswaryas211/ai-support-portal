import Navbar from "../../components/Navbar";
import KnowledgeBaseChat from "../knowledgebase/KnowledgeBaseChat";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function PublicKB() {
  const [feedback, setFeedback] = useState(null);
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    loadKB();
  }, []);

  const loadKB = async () => {
    try {
      const res = await api.get("/kb/public");
      setArticles(res.data || []);
    } catch (err) {
      console.error("Failed to load KB:", err);
      setArticles([]);
    }
  };

  const filteredArticles = articles.filter((a) =>
    (a.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        {/* HERO */}
        <div style={styles.hero}>
          <h1>How can we help you today?</h1>

          <div style={styles.searchWrapper}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              placeholder="Search the knowledge base..."
              style={styles.heroSearch}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={styles.categories}>
            <span style={styles.chip}>Account</span>
            <span style={styles.chip}>Billing</span>
            <span style={styles.chip}>Tickets</span>
            <span style={styles.chip}>Profile</span>
          </div>
        </div>

        {/* MAIN GRID */}
        <div style={styles.layout}>
          {/* ARTICLES */}
          <div style={styles.contentPanel}>
            <h3>Knowledge Articles</h3>

            {filteredArticles.length === 0 && (
              <p style={{ color: "#64748b" }}>No articles found</p>
            )}

            {filteredArticles.map((article) => (
              <div
                key={article.id}
                style={styles.articleCard}
                onClick={() => setSelectedArticle(article)}
              >
                <div style={{ fontWeight: "600" }}>{article.title}</div>
                <div style={styles.articlePreview}>
                  Click to read article
                </div>
              </div>
            ))}

            {selectedArticle && (
              <div style={styles.viewer}>
                <h3>{selectedArticle.title}</h3>
                <div style={{ lineHeight: "1.7", color: "#334155" }}>
                  {selectedArticle.content || "No content available"}
                </div>
              </div>
            )}
          </div>

          {/* CHAT */}
          <div style={styles.chatContainer}>
            <KnowledgeBaseChat />
          </div>
        </div>

        {/* FEEDBACK */}
        <div style={styles.feedback}>
          {!feedback && (
            <>
              <p style={{ fontWeight: "600" }}>Was this helpful?</p>
              <div style={styles.feedbackBtns}>
                <button style={styles.btn} onClick={() => setFeedback("yes")}>
                  👍 Yes
                </button>
                <button style={styles.btn} onClick={() => setFeedback("no")}>
                  👎 No
                </button>
              </div>
            </>
          )}

          {feedback === "yes" && (
            <p style={styles.successMsg}>🎉 Thanks for your feedback!</p>
          )}

          {feedback === "no" && (
            <div>
              <p>Sorry we couldn’t help. You can raise a support ticket.</p>
              <Link to="/login" style={styles.ticketBtn}>
                Raise Ticket
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    background: "#eef2f7",
    minHeight: "100vh",
    padding: "32px",
  },

  hero: {
    background: "linear-gradient(135deg, #021324, #85909c)",
    padding: "48px 24px",
    borderRadius: "22px",
    textAlign: "center",
    marginBottom: "30px",
    color: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },

  searchWrapper: {
    position: "relative",
    display: "inline-block",
    marginTop: "12px",
  },

  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    opacity: 0.7,
  },

  heroSearch: {
    width: "420px",
    padding: "14px 14px 14px 40px",
    borderRadius: "12px",
    border: "none",
    background: "#ffffff",
    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
    fontSize: "14px",
  },

  categories: {
    marginTop: "18px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },

  chip: {
    background: "rgba(255,255,255,0.18)",
    padding: "6px 16px",
    borderRadius: "999px",
    fontSize: "13px",
    backdropFilter: "blur(4px)",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    alignItems: "stretch",
  },

  contentPanel: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "24px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  },

  articleCard: {
    padding: "12px 14px",
    borderRadius: "12px",
    marginTop: "20px",

    border: "1px solid #e2e8f0",
    marginBottom: "10px",
    marginLeft: "14px",            // moves card slightly right
    borderLeft: "6px solid #020617", // thick left accent
    cursor: "pointer",
    background: "#f8fafc",
    transition: "all 0.2s ease",
    
  },

  articlePreview: {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "4px",
  },

  viewer: {
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid #e2e8f0",
  },

  chatContainer: {
    background: "#ffffff",
    borderRadius: "18px",
    border: "1px solid #e5e7eb",
    height: "420px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  },

  feedback: {
    background: "#ffffff",
    padding: "26px",
    borderRadius: "18px",
    textAlign: "center",
    border: "1px solid #e5e7eb",
    marginTop: "30px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  },

  feedbackBtns: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    marginTop: "12px",
  },

  btn: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    background: "white",
    cursor: "pointer",
    fontWeight: "500",
  },

  successMsg: {
    color: "#16a34a",
    fontWeight: "600",
  },

  ticketBtn: {
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "white",
    padding: "10px 18px",
    borderRadius: "10px",
    textDecoration: "none",
    display: "inline-block",
    marginTop: "8px",
    boxShadow: "0 4px 12px rgba(37,99,235,0.4)",
  },
};