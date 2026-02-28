import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

/* COLORS → Resolved, Open */
const COLORS = ["#22c55e", "#f59e0b"];

export default function AgentPerformanceModal({ agent, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (agent?.id) {
      loadPerformance();
    }
  }, [agent]);

  const loadPerformance = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/tickets/admin/agent-performance/${agent.id}`
      );

      setData(res.data);
    } catch (err) {
      console.error("Failed to load agent performance", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  if (!agent) return null;

  /* DONUT DATA (Resolved + Open only) */
  const chartData =
    data && (data.resolved || data.open)
      ? [
          { name: "Resolved", value: data.resolved },
          { name: "Open", value: data.open },
        ]
      : [];

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>{agent.name} — Performance</h3>

        {loading && <p>Loading performance...</p>}

        {!loading && data && (
          <>
            {/* DONUT CHART */}
            {chartData.length > 0 && (
              <PieChart width={320} height={260}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  outerRadius={90}
                  innerRadius={55}
                  paddingAngle={3}
                  stroke="#ffffff"
                  strokeWidth={2}
                  label={false}
                  labelLine={false}
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            )}

            {/* METRICS */}
            <div style={{ marginTop: 20 }}>
              <p><b>Resolved:</b> {data.resolved}</p>
              <p><b>Open:</b> {data.open}</p>
              <p>
                <b>Avg Resolution Time:</b>{" "}
                {data.avg_resolution_time?.toFixed?.(2) ?? 0} hrs
              </p>
              <p>
                <b>Efficiency:</b>{" "}
                {data.efficiency?.toFixed?.(1) ?? 0}%
              </p>
            </div>
          </>
        )}

        {!loading && !data && (
          <p>No performance data available.</p>
        )}

        <button onClick={onClose} style={btn}>
          Close
        </button>
      </div>
    </div>
  );
}

/* STYLES */

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "white",
  padding: "24px",
  borderRadius: "12px",
  width: "380px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
};

const btn = {
  marginTop: "12px",
  padding: "8px 16px",
  background: "#0b2c5d",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};