import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function KBDocumentList({ refresh }) {
  const [docs, setDocs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const loadDocs = async () => {
    try {
      const res = await api.get("/kb/documents");
      setDocs(res.data);
    } catch (err) {
      console.error("Failed to load documents", err);
    }
  };

  useEffect(() => {
    loadDocs();
  }, [refresh]);

  /* DELETE DOCUMENT */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/kb/documents/${id}`);
      setDocs((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  /* EDIT DOCUMENT */
  const handleEdit = (doc) => {
    setEditingId(doc.id);
    setTitle(doc.title);
    setCategory(doc.category || "");
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/kb/documents/${editingId}`, {
        title,
        category,
      });

      setEditingId(null);
      loadDocs();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div>
      {docs.length === 0 && <p>No documents uploaded yet.</p>}

      {docs.map((doc) => (
        <div key={doc.id} style={styles.row}>
          {editingId === doc.id ? (
            <>
              <div>
                <div style={styles.label}>Title</div>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={styles.input}
                />

                <div style={{ ...styles.label, marginTop: "6px" }}>
                  Category
                </div>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={styles.input}
                />
              </div>

              <button style={styles.saveBtn} onClick={handleUpdate}>
                Save
              </button>
            </>
          ) : (
            <>
              <div>
                <strong>{doc.title}</strong>
                <div style={styles.meta}>
                  {doc.category || "General"} • Status: {doc.status} • Chunks:{" "}
                  {doc.chunk_count}
                </div>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.editBtn}
                  onClick={() => handleEdit(doc)}
                >
                  Edit
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(doc.id)}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  row: {
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f8fafc",
  },

  meta: {
    fontSize: "13px",
    color: "#64748b",
  },

  actions: {
    display: "flex",
    gap: "8px",
  },

  label: {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "2px",
  },

  input: {
    display: "block",
    marginBottom: "6px",
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    width: "220px",
  },

  editBtn: {
    border: "1px solid #cbd5e1",
    background: "white",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  saveBtn: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};