import AdminLayout from "./AdminLayout";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import AgentPerformanceModal from "./AgentPerformanceModal";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    faqs: 0,
    kb: 0,
    agents: 0,
    tickets: 0,
  });

  const [activityRows, setActivityRows] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [agentsRes, faqRes, perfRes] = await Promise.all([
        api.get("/users/agents"),
        api.get("/faqs"),
        api.get("/tickets/admin/agent-performance"),
      ]);

      const agents = agentsRes.data || [];
      const faqs = faqRes.data || [];
      const perf = perfRes.data || [];

      /* ---------- FIXED EFFICIENCY CALCULATION ---------- */
      const withEfficiency = perf.map((a) => {
        const total = a.resolved + a.open;
        return {
          ...a,
          efficiency: total ? Math.round((a.resolved / total) * 100) : 0,
        };
      });

      setPerformanceData(withEfficiency);

      setStats({
        faqs: faqs.length,
        kb: 8,
        agents: agents.length,
        tickets: withEfficiency.reduce(
          (sum, a) => sum + a.resolved + a.open,
          0
        ),
      });

      const faqActivity = faqs.slice(-3).map((f) => [
        "FAQ Added",
        f.question,
        "Today",
      ]);

      const agentActivity = agents.slice(-2).map((a) => [
        "Agent Created",
        a.name,
        "Today",
      ]);

      setActivityRows([...faqActivity, ...agentActivity]);
    } catch (err) {
      console.error(err);
    }
  };

  const maxHandled = Math.max(
    ...performanceData.map((a) => a.resolved + a.open),
    1
  );

  /* ---------- EFFICIENCY DISTRIBUTION ---------- */
  const efficiencyBuckets = {
    low: [],
    medium: [],
    high: [],
  };

  performanceData.forEach((a) => {
    if (a.efficiency < 40) efficiencyBuckets.low.push(a.agent);
    else if (a.efficiency < 70) efficiencyBuckets.medium.push(a.agent);
    else efficiencyBuckets.high.push(a.agent);
  });

  const efficiencyChartData = [
    {
      name: "Low (<40%)",
      value: efficiencyBuckets.low.length,
      agents: efficiencyBuckets.low,
    },
    {
      name: "Medium (40–70%)",
      value: efficiencyBuckets.medium.length,
      agents: efficiencyBuckets.medium,
    },
    {
      name: "High (>70%)",
      value: efficiencyBuckets.high.length,
      agents: efficiencyBuckets.high,
    },
  ];

  const COLORS = ["#dc2626", "#f59e0b", "#16a34a"];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            padding: 10,
            borderRadius: 8,
          }}
        >
          <b>{data.name}</b>
          <div>
            Agents: {data.agents.length ? data.agents.join(", ") : "None"}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <AdminLayout>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin Dashboard</h1>

      <div style={statsGrid}>
        <StatCard title="FAQs" value={stats.faqs} />
        <StatCard title="KB Docs" value={stats.kb} />
        <StatCard title="Agents" value={stats.agents} />
        <StatCard title="Tickets" value={stats.tickets} />
      </div>

      <div style={mainGrid}>
        <div style={card}>
          <h3>Recent Activity</h3>
          <SimpleTable
            columns={["Activity", "Details", "Created"]}
            rows={activityRows}
          />
        </div>

        <div style={card}>
          <h3>Tickets Handled by Agent</h3>

          {performanceData.map((a) => (
            <div
              key={a.agent}
              style={{ marginTop: 14, cursor: "pointer" }}
              onClick={() =>
                setSelectedAgent({
                  id: a.agent_id,
                  name: a.agent,
                })
              }
            >
              <div style={barLabel}>
                <span>{a.agent}</span>
                <span>{a.resolved + a.open}</span>
              </div>

              <div style={barBg}>
                <div
                  style={{
                    ...barFill,
                    width: `${((a.resolved + a.open) / maxHandled) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}

          <div style={{ marginTop: 30 }}>
            <h4>Efficiency Distribution</h4>

            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={efficiencyChartData}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {efficiencyChartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {selectedAgent && (
        <AgentPerformanceModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </AdminLayout>
  );
}

function StatCard({ title, value }) {
  return (
    <div style={statCard}>
      <div style={{ color: "#64748b" }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function SimpleTable({ columns, rows }) {
  return (
    <table style={table}>
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th key={i} style={cell}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j} style={cell}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: 16,
  marginBottom: 24,
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: 24,
};

const statCard = {
  background: "white",
  borderRadius: 12,
  padding: 16,
  border: "1px solid #e5e7eb",
};

const card = {
  background: "white",
  borderRadius: 14,
  padding: 20,
  border: "1px solid #e5e7eb",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 10,
};

const cell = {
  textAlign: "left",
  padding: 8,
  borderBottom: "1px solid #e5e7eb",
};

const barBg = {
  height: 10,
  background: "#e5e7eb",
  borderRadius: 6,
};

const barFill = {
  height: 10,
  background: "#0b2c5d",
  borderRadius: 6,
};

const barLabel = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 13,
};