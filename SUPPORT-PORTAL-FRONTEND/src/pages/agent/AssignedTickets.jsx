import { useEffect, useState } from "react";
import api from "../../api/axios";
import TicketTable from "../../components/TicketTable";

export default function AssignedTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [queueFilter, setQueueFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tickets/assigned");
      setTickets(res.data || []);
    } catch (err) {
      console.error("Failed to load assigned tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  /* ---------- FILTERING ---------- */
  const filteredTickets = tickets
    .filter((t) => {
      if (queueFilter === "all") return true;
      return (t.queue || "").toLowerCase() === queueFilter.toLowerCase();
    })
    .filter((t) => {
      if (statusFilter === "all") return true;
      return t.status === statusFilter;
    });

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Assigned Tickets</h2>

      {/* FILTER BAR */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        {/* QUEUE FILTER */}
        <select
          value={queueFilter}
          onChange={(e) => setQueueFilter(e.target.value)}
          style={{ padding: 6 }}
        >
          <option value="all">All Queues</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Facilities">Facilities</option>
          <option value="Finance">Finance</option>
        </select>

        {/* STATUS FILTER */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: 6 }}
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <button
          onClick={loadTickets}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #e2e8f0",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      {loading && <p>Loading tickets...</p>}

      {!loading && <TicketTable tickets={filteredTickets} />}
    </div>
  );
}