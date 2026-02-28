import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Pencil, Trash2 } from "lucide-react";
import AgentPerformanceModal from "./AgentPerformanceModal";
import AdminLayout from "./AdminLayout"; // ✅ ADD THIS

export default function ManageAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const loadAgents = async () => {
    try {
      const res = await api.get("/users/agents");
      setAgents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load agents", err);
      setAgents([]);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const saveAgent = async () => {
    if (!form.name || !form.email) {
      alert("Name and email are required");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await api.put(`/users/agents/${editingId}`, form);
        setEditingId(null);
      } else {
        const res = await api.post("/users/create-agent", form);
        alert("Generated Password: " + res.data.generated_password);
      }

      setForm({ name: "", email: "" });
      loadAgents();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteAgent = async (id) => {
    if (!window.confirm("Delete this agent?")) return;
    await api.delete(`/users/agents/${id}`);
    loadAgents();
  };

  return (
    <AdminLayout>
      <div style={{ padding: "32px", maxWidth: "1000px" }}>
        <h2 style={{ marginBottom: "24px" }}>Agent Management</h2>

        {/* CREATE / UPDATE CARD */}
        <div style={card}>
          <h4>{editingId ? "Update Agent" : "Create Support Agent"}</h4>

          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <input
              placeholder="Agent Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              style={input}
            />

            <input
              placeholder="Agent Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              style={input}
            />
          </div>

          <button onClick={saveAgent} style={btn} disabled={loading}>
            {loading
              ? "Saving..."
              : editingId
              ? "Update Agent"
              : "Create Agent"}
          </button>
        </div>

        {/* AGENT LIST */}
        <div style={{ ...card, marginTop: "32px" }}>
          <h4>Existing Agents</h4>

          {agents.length === 0 ? (
            <p style={muted}>No agents created yet</p>
          ) : (
            <table style={table}>
              <thead>
                <tr>
                  <th style={cell}>Name</th>
                  <th style={cell}>Email</th>
                  <th style={cell}>Password</th>
                  <th style={cell}>Status</th>
                  <th style={cell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((a) => (
                  <tr key={a.id}>
                    <td
                      style={{ ...cell, cursor: "pointer", color: "#0b2c5d" }}
                      onClick={() => setSelectedAgent(a)}
                    >
                      {a.name || "-"}
                    </td>

                    <td style={cell}>{a.email}</td>
                    <td style={cell}>{a.password || "-"}</td>

                    <td style={cell}>
                      <span style={badge}>
                        {a.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td style={cell}>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <Pencil
                          size={18}
                          style={{ cursor: "pointer", color: "#0b2c5d" }}
                          onClick={() => {
                            setForm({ name: a.name, email: a.email });
                            setEditingId(a.id);
                          }}
                        />

                        <Trash2
                          size={18}
                          style={{ cursor: "pointer", color: "#dc2626" }}
                          onClick={() => deleteAgent(a.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PERFORMANCE MODAL */}
        {selectedAgent && (
          <AgentPerformanceModal
            agent={selectedAgent}
            onClose={() => setSelectedAgent(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
}


/* ---------- STYLES ---------- */

const card = {
  background: "#ffffff",
  borderRadius: "14px",
  padding: "24px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const muted = {
  color: "#6b7280",
  fontSize: "14px",
};

const input = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
};

const btn = {
  marginTop: "16px",
  background: "#0b2c5d",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
};

const table = {
  width: "100%",
  marginTop: "16px",
  borderCollapse: "collapse",
};

const cell = {
  padding: "10px",
  borderBottom: "1px solid #e5e7eb",
  textAlign: "left",
};

const badge = {
  background: "#dcfce7",
  color: "#166534",
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "600",
};

