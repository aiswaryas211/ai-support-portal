import { useState } from "react";
import api from "../../api/axios";

export default function CustomerDashboard() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const createTicket = async () => {
    if (!subject || !description) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await api.post("/tickets", {
        subject,
        description,
      });

      const ticketId = res.data.id;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        await api.post(`/tickets/${ticketId}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSubject("");
      setDescription("");
      setFile(null);

      alert("Ticket created successfully!");
    } catch (err) {
      console.error("Ticket creation failed:", err);
      alert("Ticket creation failed");
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Customer Dashboard</h1>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Raise Support Ticket</h3>

        <input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={styles.input}
        />

        <textarea
          placeholder="Describe your issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />

        <div style={styles.fileRow}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button onClick={createTicket} style={styles.button}>
          Submit Ticket
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "40px",
    background: "#f6f7fb",
    minHeight: "100vh",
  },

  title: {
    marginBottom: "20px",
    fontWeight: "700",
    color: "#1f2937",
  },

  card: {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid #e5e7eb",
    maxWidth: "900px",
  },

  cardTitle: {
    marginBottom: "16px",
    fontWeight: "600",
    color: "#111827",
  },

  input: {
    width: "100%",
    marginBottom: "14px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
  },

  textarea: {
    width: "100%",
    marginBottom: "14px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    minHeight: "120px",
    resize: "vertical",
  },

  fileRow: {
    marginBottom: "16px",
  },

  button: {
    background: "#0b2c5d",
    color: "white",
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
  },
};