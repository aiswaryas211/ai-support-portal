import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();

  const menuItem = (path, label) => {
    const active = location.pathname === path;

    return (
      <Link
        to={path}
        style={{
          padding: "10px 12px",
          borderRadius: "8px",
          textDecoration: "none",
          color: active ? "white" : "#0b2c5d",
          background: active ? "#0b2c5d" : "transparent",
          transition: "0.2s",
        }}
        onMouseEnter={(e) => {
          if (!active) e.target.style.background = "#dbe4f0";
        }}
        onMouseLeave={(e) => {
          if (!active) e.target.style.background = "transparent";
        }}
      >
        {label}
      </Link>
    );
  };

  return (
    <div
      style={{
        width: "240px",
        background: "#eef2f7",
        borderRight: "1px solid #e5e7eb",
        padding: "20px",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <h3 style={{ marginBottom: "20px", color: "#0b2c5d" }}>
        Admin Panel
      </h3>

      <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {menuItem("/admin", "Dashboard")}
        {menuItem("/admin/faqs", "Manage FAQs")}
        {menuItem("/admin/kb", "Manage KB")}
        {menuItem("/admin/agents", "Manage Agents")}
      </nav>
    </div>
  );
}