import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#ef4444", "#3b82f6", "#22c55e"];

export default function ChartCard({ title, data }) {
  if (!data) {
    return (
      <div style={card}>
        <h4>{title}</h4>
        <p>Chart preview</p>
      </div>
    );
  }

  const chartData = [
    { name: "Open", value: data.open || 0 },
    { name: "In Progress", value: data.in_progress || 0 },
    { name: "Resolved", value: data.resolved || 0 },
  ];

  return (
    <div style={card}>
      <h4>{title}</h4>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={45}   // ← makes donut
            outerRadius={70}
            paddingAngle={2}
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

const card = {
  background: "white",
  borderRadius: 12,
  padding: 18,
  minHeight: 220,
};