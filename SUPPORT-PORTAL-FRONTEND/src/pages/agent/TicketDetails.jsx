import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { formatIST } from "../../utils/time";
export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [status, setStatus] = useState("");
  const [queue, setQueue] = useState("");

  const chatEndRef = useRef(null);
  const firstLoadRef = useRef(true);

  useEffect(() => {
    if (id) loadTicket();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* Scroll only when new message arrives */
  useEffect(() => {
    if (!ticket?.messages?.length) return;

    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return;
    }

    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages?.length]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tickets/${id}`);
      setTicket(res.data);
      setStatus(res.data.status);
      setQueue(res.data.queue || "IT");
    } catch (err) {
      console.error("Failed to load ticket", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      setStatus(newStatus);
      await api.patch(`/tickets/${id}`, { status: newStatus });
      loadTicket();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const updateQueue = async (newQueue) => {
    try {
      setQueue(newQueue);
      await api.patch(`/tickets/${id}`, { queue: newQueue });
      loadTicket();
    } catch (err) {
      console.error("Queue update failed", err);
    }
  };

  const sendReply = async () => {
    if (!reply.trim()) return;

    try {
      await api.post(`/tickets/${id}/reply`, { message: reply });

      if (status === "open") {
        await updateStatus("in_progress");
      } else {
        loadTicket();
      }

      setReply("");
    } catch (err) {
      console.error("Reply failed", err);
    }
  };

  if (!ticket) {
    return <div style={{ padding: 30 }}>Loading ticket...</div>;
  }

  const getFileUrl = (path) => `http://127.0.0.1:8000/${path}`;

  const originalMessage =
    ticket.description ||
    ticket.messages?.find((m) => m.sender_role === "customer")?.message ||
    "No description provided.";

  return (
    <div style={page}>
      {/* HEADER */}
      <div style={card}>
        <div style={headerRow}>
          <div>
            <h2 style={{ margin: 0 }}>{ticket.subject}</h2>
            <div style={meta}>
              #{ticket.ticket_number} • Priority: {ticket.priority}
            </div>
            <div style={meta}>
              Customer: {ticket.customer_name || "Customer"}
            </div>
          </div>

          <button style={secondaryBtn} onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>

      {/* STATUS + QUEUE */}
      <div style={card}>
        <div style={toolbar}>
          <div>
            <label style={label}>Status</label>
            <select
              value={status}
              onChange={(e) => updateStatus(e.target.value)}
              style={select}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label style={label}>Queue</label>
            <select
              value={queue}
              onChange={(e) => updateQueue(e.target.value)}
              style={select}
            >
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Facilities">Facilities</option>
            </select>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div style={card}>
        <h4>Description</h4>
        <p>{originalMessage}</p>
      </div>

      {/* ATTACHMENTS */}
      {ticket.attachments?.length > 0 && (
        <div style={card}>
          <h4>Attachments</h4>

          {ticket.attachments.map((f) => (
            <button
              key={f.id}
              onClick={() => setPreviewFile(getFileUrl(f.file_path))}
              style={primaryBtn}
            >
              Preview attachment
            </button>
          ))}

          {previewFile && (
            <div style={previewBox}>
              <iframe
                src={previewFile}
                width="100%"
                height="320"
                style={{ border: "none" }}
              />
            </div>
          )}
        </div>
      )}

      {/* AI SUMMARY */}
      {ticket.ai_summary && (
        <div style={aiBox}>
          <b>AI Document Summary</b>
          <p>{ticket.ai_summary}</p>
        </div>
      )}

      {/* CONVERSATION */}
      <div style={card}>
        <h3>Conversation</h3>

        <div style={chatBox}>
          {(ticket.messages || []).map((m) => {
            const isAgent = m.sender_role === "agent";

            return (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isAgent ? "flex-end" : "flex-start",
                  marginBottom: 14,
                }}
              >
                <div style={nameLabel}>
                  {isAgent ? "Agent" : "Customer"}
                </div>

                <div
                  style={{
                    ...bubble,
                    background: isAgent ? "#2563eb" : "#ffffff",
                    color: isAgent ? "white" : "#334155",
                    border: isAgent ? "none" : "1px solid #e2e8f0",
                  }}
                >
                  {m.message}
                </div>

                <div style={timeLabel}>
                  {formatIST(m.created_at)}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        <textarea
          placeholder="Reply to customer..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          style={replyBox}
        />

        <button style={primaryBtn} onClick={sendReply}>
          Send Reply
        </button>
      </div>

      {loading && <p style={{ color: "#64748b" }}>Updating...</p>}
    </div>
  );
}

/* ---------- STYLES ---------- */

const page = { padding: 30, maxWidth: 1100 };

const card = {
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: 20,
  marginBottom: 20,
};

const headerRow = { display: "flex", justifyContent: "space-between" };
const toolbar = { display: "flex", gap: 30 };
const meta = { fontSize: 13, color: "#64748b" };
const label = { display: "block", fontSize: 12, marginBottom: 4 };
const select = { padding: 6 };

const chatBox = {
  background: "#f8fafc",
  padding: 16,
  borderRadius: 12,
  maxHeight: 300,
  overflowY: "auto",
  border: "1px solid #e2e8f0",
};

const bubble = {
  padding: "10px 14px",
  borderRadius: 12,
  maxWidth: "65%",
  lineHeight: 1.5,
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
};

const nameLabel = {
  fontSize: 12,
  color: "#64748b",
  marginBottom: 4,
};

const timeLabel = {
  fontSize: 11,
  color: "#94a3b8",
  marginTop: 4,
};

const replyBox = {
  width: "100%",
  marginTop: 12,
  padding: 12,
  borderRadius: 10,
  border: "1px solid #cbd5e1",
};

const previewBox = {
  marginTop: 10,
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  overflow: "hidden",
};

const aiBox = {
  background: "#eef2ff",
  padding: 16,
  borderRadius: 12,
  marginBottom: 20,
};

const primaryBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
  marginTop: 10,
};

const secondaryBtn = {
  background: "#e5e7eb",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
};