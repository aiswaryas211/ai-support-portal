import { useState } from "react";
import api from "../../api/axios";

export default function KBUpload({ onUploaded }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !title) {
      alert("Title and file required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category || "");
    formData.append("file", file);

    try {
      setLoading(true);

      await api.post("/kb/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Upload successful");

      setTitle("");
      setCategory("");
      setFile(null);

      if (onUploaded) onUploaded();
    } catch (err) {
      console.error("Upload error:", err.response?.data || err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        <input
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.row}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={handleUpload}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload & Index"}
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  row: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
  },

  button: {
    background: "#0b2c5d",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },
};