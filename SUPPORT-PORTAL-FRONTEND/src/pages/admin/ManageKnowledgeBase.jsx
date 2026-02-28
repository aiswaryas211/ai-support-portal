import { useState } from "react";
import KBUpload from "../../components/kb/KBUpload";
import KBDocumentList from "../../components/kb/KBDocumentList";
import AdminLayout from "./AdminLayout";

export default function ManageKnowledgeBase() {
  const [refresh, setRefresh] = useState(false);

  return (
    <AdminLayout>
      <div style={styles.page}>
        <h1 style={styles.title}>Knowledge Base Management</h1>

        <div style={styles.grid}>
          {/* LEFT — UPLOAD */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Upload Knowledge Document</h3>
              <p style={styles.cardDesc}>
                Upload documents to be indexed and used by the AI-powered knowledge base.
              </p>
            </div>

            <div style={styles.cardBody}>
              <KBUpload onUploaded={() => setRefresh(!refresh)} />
            </div>
          </div>

          {/* RIGHT — EXISTING KB */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Existing KB Documents</h3>
              <p style={styles.cardDesc}>
                Documents available in the knowledge base.
              </p>
            </div>

            <div style={styles.cardBody}>
              <KBDocumentList refresh={refresh} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    background: "#f8fafc",
    minHeight: "100vh",
    padding: "10px",
  },

  title: {
    marginBottom: "24px",
    color: "#0b2c5d",
    fontWeight: "600",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "24px",
    alignItems: "start",
  },

  card: {
    background: "white",
    borderRadius: "16px",
    padding: "0px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
  },

  cardHeader: {
    padding: "18px 20px",
    borderBottom: "1px solid #e2e8f0",
    background: "#f8fafc",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
  },

  cardBody: {
    padding: "20px",
  },

  cardTitle: {
    margin: 0,
    color: "#0b2c5d",
  },

  cardDesc: {
    marginTop: "4px",
    color: "#64748b",
    fontSize: "14px",
  },
};