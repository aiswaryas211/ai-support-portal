
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import KnowledgeBaseChat from "../knowledgebase/KnowledgeBaseChat";
export default function Home() {
  const [openChat] = useState(true);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Navbar />
      <div style={styles.page}>
        {/* HERO */}
        <div style={styles.hero}>
          <div style={styles.left}>
            {/* ACCENT WRAPPER */}
            <div style={styles.headingWrapper}>
              <div style={styles.cornerVertical}></div>
              <div style={styles.cornerHorizontal}></div>
              <h1 style={styles.heading}>How can we help you today?</h1>
              <p style={styles.text}>
                Get instant support with our AI-powered customer support portal.
                Search our knowledge base, chat with our intelligent assistant,
                or connect with our support team for personalized help.
              </p>
            </div>
            {/* PERFORMANCE HIGHLIGHTS */}
            <div style={styles.highlightsRow}>
              <div style={styles.highlightItem}>⚡ Instant AI Answers</div>
              <div style={styles.highlightDivider} />
              <div style={styles.highlightItem}>📘 Smart Knowledge Base</div>
              <div style={styles.highlightDivider} />
              <div style={styles.highlightItem}>🎫 Ticket Support</div>
            </div>
          </div>
          {/* CHAT CARD */}
          <div style={styles.chatCard}>
            <div style={styles.chatBody}>
              <KnowledgeBaseChat />
            </div>
          </div>
        </div>
        {/* STEPS */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Choose how you’d like to get help
          </h2>
          <div style={styles.featureRow}>
            <Link to="/faq" style={styles.featureCard}>
              <div style={styles.iconBox}>💬</div>
              <h3 style={styles.featureTitle}>Step 1 — Check FAQs</h3>
              <p style={styles.featureText}>
                Find quick answers to common questions.
              </p>
              <div style={styles.featureBtn}>View FAQs →</div>
            </Link>
            <Link to="/kb" style={styles.featureCard}>
              <div style={styles.iconBox}>📘</div>
              <h3 style={styles.featureTitle}>
                Step 2 — Search Knowledge Base
              </h3>
              <p style={styles.featureText}>
                Browse guides and documentation.
              </p>
              <div style={styles.featureBtn}>Open Knowledge Base →</div>
            </Link>
            <Link to="/login" style={styles.featureCard}>
              <div style={styles.iconBox}>🎫</div>
              <h3 style={styles.featureTitle}>Step 3 — Raise a Ticket</h3>
              <p style={styles.featureText}>
                Contact support if your issue is unresolved.
              </p>
              <div style={styles.featureBtn}>Create Ticket →</div>
            </Link>
          </div>
        </div>
        {/* DIFFERENT SECTION */}
        <div style={styles.diffSection}>
          <h2 style={styles.diffHeading}>
            What makes SupportSphere different?
          </h2>
          <div style={styles.diffGrid}>
            <div style={styles.diffItem}>
              <div style={styles.diffIcon}>🤖</div>
              <div>
                <h4 style={styles.diffTitle}>AI Knowledge Assistant</h4>
                <p style={styles.diffText}>
                  Get instant answers from our intelligent AI assistant trained
                  on support articles and documentation.
                </p>
              </div>
            </div>
            <div style={styles.diffItem}>
              <div style={styles.diffIcon}>🎯</div>
              <div>
                <h4 style={styles.diffTitle}>Smart Ticket Routing</h4>
                <p style={styles.diffText}>
                  Automatically routes tickets to the right team member for
                  faster resolution.
                </p>
              </div>
            </div>
            <div style={styles.diffItem}>
              <div style={styles.diffIcon}>💡</div>
              <div>
                <h4 style={styles.diffTitle}>Automated FAQ Suggestions</h4>
                <p style={styles.diffText}>
                  Receive personalized FAQ recommendations based on your query.
                </p>
              </div>
            </div>
            <div style={styles.diffItem}>
              <div style={styles.diffIcon}>📚</div>
              <div>
                <h4 style={styles.diffTitle}>Guided Knowledge Base</h4>
                <p style={styles.diffText}>
                  Step-by-step guides and documentation to help you resolve
                  issues quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
const styles = {
  page: {
    minHeight: "100vh",
    padding: "80px",
    background: `
      radial-gradient(circle at 80% 20%, rgba(56,189,248,0.15), transparent 40%),
      radial-gradient(circle at 20% 70%, rgba(59,130,246,0.12), transparent 40%),
      #d5d8e6
    `,
  },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: "40px",
    marginBottom: "80px",
  },
  left: { width: "55%", paddingTop: "60px" },
  headingWrapper: {
    position: "relative",
    paddingLeft: "28px",
  },
  cornerVertical: {
    position: "absolute",
    left: 5,
    top: "-8px",
    width: "7px",
    height: "100px",
    background: "#02081872",
  },
  cornerHorizontal: {
    position: "absolute",
    left: 4,
    top: "-15px",
    width: "160px",
    height: "7px",
    background: "#0000006e",
  },
  heading: {
    fontSize: "46px",
    fontWeight: "700",
    marginBottom: "18px",
  },
  text: {
    fontSize: "18px",
    color: "#64748b",
    marginBottom: "16px",
    maxWidth: "640px",
  },
  highlightsRow: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginTop: "60px",
    background: "white",
    padding: "12px 16px",
    borderRadius: "12px",
    width: "fit-content",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    border: "1px solid #eef2f7",
  },
  highlightItem: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },
  highlightDivider: {
    width: "1px",
    height: "18px",
    background: "#e2e8f0",
  },
  chatCard: {
    width: "520px",
    minWidth: "420px",
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
    overflow: "hidden",
    marginTop: "-40px",
  },
  chatBody: {
    height: "520px",
    display: "flex",
    
  },
  section: { marginTop: "20px" },
  sectionTitle: {
    textAlign: "center",
    fontSize: "30px",
    fontWeight: "700",
    marginBottom: "28px",
  },
  featureRow: {
    display: "flex",
    justifyContent: "center",
    gap: "32px",
  },
  featureCard: {
    background: "white",
    borderRadius: "20px",
    padding: "36px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textDecoration: "none",
    color: "#0f172a",
    border: "1px solid #eef2f7",
  },
  iconBox: {
    width: "64px",
    height: "64px",
    borderRadius: "14px",
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    margin: "0 auto 18px auto",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  featureTitle: { fontSize: "18px", fontWeight: "700", marginBottom: "10px" },
  featureText: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "20px",
  },
  featureBtn: {
    background: "#010712",
    color: "white",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: "600",
    display: "inline-block",
  },
  diffSection: {
    marginTop: "120px",
    maxWidth: "1100px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  diffHeading: {
    textAlign: "center",
    fontSize: "30px",
    fontWeight: "700",
    marginBottom: "50px",
  },
  diffGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "50px 80px",
  },
  diffItem: { display: "flex", gap: "18px" },
  diffIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  diffTitle: { fontWeight: "700", marginBottom: "6px" },
  diffText: { color: "#475569", lineHeight: "1.6", fontSize: "15px" },
};
