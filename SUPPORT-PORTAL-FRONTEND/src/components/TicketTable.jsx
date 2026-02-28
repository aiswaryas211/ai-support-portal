import { useNavigate } from "react-router-dom";
import { formatIST } from "../utils/time";

export default function TicketTable({ tickets }) {
  const navigate = useNavigate();

  if (!tickets?.length) {
    return (
      <div style={card}>
        <h4>Assigned Tickets</h4>
        <p style={{ color: "#6b7280" }}>No tickets assigned</p>
      </div>
    );
  }

  return (
    <div style={card}>
      <h4 style={{ marginBottom: 16 }}>Assigned Tickets</h4>

      <table style={table}>
        <thead>
          <tr>
            <th style={head}>Subject</th>
            <th style={head}>Last Updated</th>
            <th style={head}>Status</th>
            <th style={head}>Priority</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((t) => (
            <tr key={t.id} style={row}>
              {/* SUBJECT CLICKABLE */}
              <td
                style={{ ...cell, color: "#2563eb", cursor: "pointer" }}
                onClick={() => navigate(`/agent/tickets/${t.id}`)}
              >
                {t.subject}
              </td>

              {/* LAST UPDATED */}
              <td style={cell}>
                {t.updated_at
                  ? formatIST(t.updated_at)
                  : t.created_at
                  ? formatIST(t.created_at)
                  : "—"}
              </td>

              {/* STATUS */}
              <td style={cell}>
                <span style={statusBadge(t.status)}>
                  {capitalize(t.status)}
                </span>
              </td>

              {/* PRIORITY */}
              <td style={cell}>
                <span style={priorityBadge(t.priority)}>
                  {capitalize(t.priority)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- HELPERS ---------- */

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/* ---------- STYLES ---------- */

const card = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const head = {
  textAlign: "left",
  paddingBottom: 10,
  color: "#64748b",
  fontWeight: 600,
  fontSize: 14,
};

const row = {
  borderTop: "1px solid #e5e7eb",
};

const cell = {
  padding: "12px 0",
  fontSize: 14,
};

/* ---------- BADGES ---------- */

const statusBadge = (status) => ({
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: 12,
  border: "1px solid",
  color:
    status === "open"
      ? "#ef4444"
      : status === "in_progress"
      ? "#2563eb"
      : status === "resolved"
      ? "#16a34a"
      : "#64748b",
});

const priorityBadge = (priority) => ({
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: 12,
  border: "1px solid",
  color:
    priority === "high"
      ? "#ef4444"
      : priority === "medium"
      ? "#64748b"
      : "#94a3b8",
});