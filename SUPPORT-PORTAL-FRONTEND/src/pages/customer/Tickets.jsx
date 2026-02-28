import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Pencil, Trash2, Check } from "lucide-react";
import api from "../../api/axios";
import { formatIST } from "../../utils/time";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [editingId, setEditingId] = useState(null);
  const [editSubject, setEditSubject] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadTickets();
    const interval = setInterval(loadTickets, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadTickets = async () => {
    try {
      const res = await api.get("/tickets/my");
      setTickets(res.data);
    } catch {
      console.log("Failed to load tickets");
    }
  };

  const deleteTicket = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;

    try {
      await api.delete(`/tickets/${id}`);
      loadTickets();
    } catch {
      alert("Delete failed");
    }
  };

  const startEdit = (ticket) => {
    setEditingId(ticket.id);
    setEditSubject(ticket.subject);
    setEditDescription(ticket.description);
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/tickets/${id}`, {
        subject: editSubject,
        description: editDescription,
      });

      setEditingId(null);
      loadTickets();
    } catch {
      alert("Update failed");
    }
  };

  const statusStyle = (status) => {
    if (status === "open") return { background: "#fee2e2", color: "#b91c1c" };
    if (status === "resolved") return { background: "#dcfce7", color: "#166534" };
    if (status === "pending") return { background: "#fef9c3", color: "#854d0e" };
    return {};
  };

  const filtered = tickets
    .filter(
      (t) =>
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.ticket_number.toLowerCase().includes(search.toLowerCase())
    )
    .filter((t) => (filter === "all" ? true : t.status === filter));

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>My Tickets</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 8, width: 250 }}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: 8 }}
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {filtered.map((t) => {
        console.log("Created time:", t.created_at);

        const isEditing = editingId === t.id;

        return (
          <div
            key={t.id}
            style={{
              background: "white",
              padding: 16,
              borderRadius: 10,
              marginBottom: 12,
              display: "flex",
              justifyContent: "space-between",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ width: "70%" }}>
              {isEditing ? (
                <>
                  <input
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    style={{ width: "100%", marginBottom: 6, padding: 6 }}
                  />

                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    style={{ width: "100%", padding: 6 }}
                  />
                </>
              ) : (
                <>
                  <b>{t.subject}</b>
                  <div style={{ fontSize: 13, color: "#555" }}>
                    #{t.ticket_number}
                  </div>
                  <div style={{ fontSize: 12, color: "#777" }}>
                    Created: {formatIST(t.created_at)}
                  </div>
                </>
              )}
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontSize: 12,
                  marginBottom: 8,
                  ...statusStyle(t.status),
                }}
              >
                {t.status}
              </div>

              {/* ACTION ICONS */}
              <div style={{ display: "flex", gap: 10 }}>
                {/* MESSAGE */}
                <button
                  onClick={() => navigate(`/customer/tickets/${t.id}`)}
                  style={styles.iconBtn}
                  title="Messages"
                >
                  <MessageCircle size={18} />
                </button>

                {/* EDIT */}
                {!isEditing && t.status === "open" && (
                  <button
                    onClick={() => startEdit(t)}
                    style={styles.iconBtn}
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                )}

                {/* SAVE */}
                {isEditing && (
                  <button
                    onClick={() => saveEdit(t.id)}
                    style={styles.iconBtn}
                    title="Save"
                  >
                    <Check size={18} />
                  </button>
                )}

                {/* DELETE */}
                {t.status === "open" && (
                  <button
                    onClick={() => deleteTicket(t.id)}
                    style={styles.deleteIcon}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  iconBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#072c67",
  },

  deleteIcon: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#ef4444",
  },
};