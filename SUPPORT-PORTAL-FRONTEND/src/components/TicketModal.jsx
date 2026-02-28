import { useState } from "react";
import api from "../api/axios";

export default function TicketModal({ ticket, onClose, refresh }) {
  const [response, setResponse] = useState(ticket.agent_response || "");
  const [priority, setPriority] = useState(ticket.priority || "Medium");
  const [category, setCategory] = useState(ticket.category || "IT");

  const submitResponse = async () => {
    await api.put(`/tickets/${ticket.id}`, {
      agent_response: response,
      priority,
      category,
      status: "Closed",
    });

    refresh();
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>{ticket.subject}</h2>
        <p>{ticket.description}</p>

        {/* Attachment */}
        {ticket.attachment_url && (
          <a href={ticket.attachment_url} target="_blank">
            View Attachment
          </a>
        )}

        <div style={styles.row}>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>IT</option>
            <option>Finance</option>
            <option>HR</option>
          </select>
        </div>

        {/* Chat */}
        <textarea
          placeholder="Agent response..."
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          style={styles.textarea}
        />

        <div style={styles.buttons}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={submitResponse}>Submit</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    width: "500px",
  },
  row: {
    display: "flex",
    gap: "12px",
    marginTop: "12px",
  },
  textarea: {
    width: "100%",
    marginTop: "12px",
    height: "100px",
  },
  buttons: {
    marginTop: "16px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  },
};