import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { formatIST } from "../../utils/time";

export default function CustomerTicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState("");

  const chatEndRef = useRef(null);

  useEffect(() => {
    loadTicket();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket]);

  const loadTicket = async () => {
    const res = await api.get(`/tickets/${id}`);
    setTicket(res.data);
  };

  const sendReply = async () => {
    if (!reply.trim()) return;

    await api.post(`/tickets/${id}/customer-reply`, {
      message: reply,
    });

    setReply("");
    loadTicket();
  };

  if (!ticket) return <div>Loading...</div>;

  const statusStyle = {
    open: { background: "#fee2e2", color: "#b91c1c" },
    resolved: { background: "#dcfce7", color: "#166534" },
  };

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          background: "white",
          padding: 16,
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          marginBottom: 20,
        }}
      >
        <h2>{ticket.subject}</h2>

        <div style={{ color: "#475569", marginBottom: 8 }}>
          Ticket #{ticket.ticket_number}
        </div>

        <div
          style={{
            display: "inline-block",
            padding: "4px 10px",
            borderRadius: 20,
            fontSize: 12,
            ...statusStyle[ticket.status],
          }}
        >
          {ticket.status}
        </div>
      </div>

      {/* ORIGINAL REQUEST */}
      <div
        style={{
          background: "white",
          padding: 16,
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          marginBottom: 20,
        }}
      >
        <b>Your Request</b>
        <p>{ticket.description}</p>
      </div>

      {/* AI SUMMARY */}
      {ticket.ai_summary && (
        <div
          style={{
            background: "#f0f9ff",
            padding: 16,
            borderRadius: 10,
            border: "1px solid #bae6fd",
            marginBottom: 20,
          }}
        >
          <b>AI Summary</b>
          <p style={{ marginTop: 6 }}>{ticket.ai_summary}</p>
        </div>
      )}

      {/* ATTACHMENT */}
      {ticket.attachments?.length > 0 && (
        <div
          style={{
            background: "white",
            padding: 16,
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            marginBottom: 20,
          }}
        >
          <b>Attachment</b>

          {ticket.attachments.map((a) => (
            <div key={a.id} style={{ marginTop: 8 }}>
              <a
                href={`http://127.0.0.1:8000/${a.file_path}`}
                target="_blank"
                rel="noreferrer"
              >
                View uploaded file
              </a>
            </div>
          ))}
        </div>
      )}

      {/* TIMELINE */}
      <div
        style={{
          background: "#f8fafc",
          padding: 12,
          borderRadius: 8,
          marginBottom: 20,
          fontSize: 13,
        }}
      >Created — {formatIST(ticket.created_at)}
        
        {ticket.closed_at && (
          <div style={{ color: "#16a34a" }}>
            Resolved — {formatIST(ticket.closed_at)}
          </div>
        )}
      </div>

      {/* CHAT */}
      <h3>Conversation</h3>

      <div
        style={{
          background: "#f8fafc",
          padding: 12,
          borderRadius: 10,
          maxHeight: 300,
          overflowY: "auto",
          border: "1px solid #e2e8f0",
        }}
      >
        {(ticket.messages || []).map((m) => {
          const isAgent = m.sender_role === "agent";

          return (
            <div
              key={m.id}
              style={{
                display: "flex",
                justifyContent: isAgent ? "flex-start" : "flex-end",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  padding: 10,
                  borderRadius: 10,
                  maxWidth: "70%",
                  background: isAgent ? "#ffffff" : "#dbeafe",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ fontSize: 11, color: "#64748b" }}>
                  {isAgent ? "Agent" : "You"} •{" "}
                  {formatIST(m.created_at)}
                </div>
                {m.message}
              </div>
            </div>
          );
        })}

        <div ref={chatEndRef} />
      </div>

      {/* REPLY */}
      <textarea
        placeholder="Reply to agent..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        style={{
          width: "100%",
          marginTop: 12,
          padding: 10,
          borderRadius: 8,
          border: "1px solid #cbd5e1",
        }}
      />

      <button
        onClick={sendReply}
        style={{
          marginTop: 10,
          background: "#0b2c5d",
          color: "white",
          border: "none",
          padding: "8px 14px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Send Reply
      </button>
    </div>
  );
}