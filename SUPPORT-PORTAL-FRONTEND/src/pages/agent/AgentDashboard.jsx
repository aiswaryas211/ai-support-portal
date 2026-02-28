import { useEffect, useState } from "react";
import api from "../../api/axios";
import TicketTable from "../../components/TicketTable";
import ChartCard from "../../components/ChartCard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

export default function AgentDashboard() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    loadTickets();
    loadMonthlyStats();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await api.get("/tickets/assigned");
      setTickets(res.data || []);
    } catch (err) {
      console.error("Failed to load assigned tickets", err);
    }
  };

  const loadMonthlyStats = async () => {
    try {
      const res = await api.get("/tickets/stats/monthly");
      setMonthlyData(res.data || []);
    } catch (err) {
      console.error("Failed to load monthly stats", err);
    }
  };

  const filteredTickets = tickets.filter((t) =>
    (t.subject || "").toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  return (
    <div>
      <h2 style={{ marginBottom: 18 }}>Agent Dashboard</h2>

      <div style={topRow}>
        <input
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchBox}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button style={secondaryBtn}>Filter</button>
          <button style={secondaryBtn}>Sort By</button>
        </div>
      </div>

      <div style={mainGrid}>
        {/* STATUS DISTRIBUTION */}
        <div style={card}>
          <ChartCard title="Ticket Status Distribution" data={stats} />

          <div style={{ marginTop: 18 }}>
            <div style={statRow}>
              <span>Open</span>
              <strong>{stats.open}</strong>
            </div>
            <div style={statRow}>
              <span>In Progress</span>
              <strong>{stats.in_progress}</strong>
            </div>
            <div style={statRow}>
              <span>Resolved</span>
              <strong>{stats.resolved}</strong>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div style={card}>
          <TicketTable tickets={filteredTickets} />
        </div>

        {/* MONTHLY BAR CHART */}
        <div style={card}>
          <h4 style={{ marginBottom: 12 }}>Monthly Ticket Volume</h4>

          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" interval={1} />
                  

                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />

                <Bar dataKey="tickets" name="Tickets" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const statRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
  borderBottom: "1px solid #eee",
  fontSize: 14,
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 18,
};

const searchBox = {
  flex: 1,
  marginRight: 12,
  padding: 10,
  borderRadius: 8,
  border: "1px solid #e2e8f0",
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 2fr",
  gap: 20,
};

const card = {
  background: "white",
  padding: 18,
  borderRadius: 12,
  boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
};

const secondaryBtn = {
  background: "white",
  border: "1px solid #e2e8f0",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer",
};