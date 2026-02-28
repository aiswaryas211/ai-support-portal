import { useLocation, useNavigate } from "react-router-dom";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f6fb" }}>
      {/* TOPBAR */}
      <div
        style={{
          background: "#0b2c5d",
          color: "white",
          padding: "14px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <b>SupportSphere Admin</b>

        <button style={logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* BELOW TOPBAR LAYOUT */}
      <div style={{ display: "flex" }}>
        {/* SIDEBAR */}
        <div
          style={{
            width: 220,
            background: "#9fa6af",
            padding: 20,
            borderRight: "1px solid #e5e7eb",
            minHeight: "calc(100vh - 56px)",
          }}
        >
          <h3 style={{ marginBottom: 20, color: "#0b2c5d" }}>
            Admin Panel
          </h3>

          <SidebarItem
            label="Dashboard"
            active={isActive("/admin")}
            onClick={() => navigate("/admin")}
          />

          <SidebarItem
            label="Manage FAQs"
            active={isActive("/admin/faqs")}
            onClick={() => navigate("/admin/faqs")}
          />

          <SidebarItem
            label="Manage KB"
            active={isActive("/admin/kb")}
            onClick={() => navigate("/admin/kb")}
          />

          <SidebarItem
            label="Manage Agents"
            active={isActive("/admin/agents")}
            onClick={() => navigate("/admin/agents")}
          />
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function SidebarItem({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "10px 12px",
        borderRadius: 8,
        cursor: "pointer",
        background: active ? "#c9daf8" : "transparent",
        marginBottom: 6,
        fontWeight: active ? "600" : "500",
        transition: "0.15s",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "#dbe7fb";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      {label}
    </div>
  );
}

const logoutBtn = {
  background: "#ea580c",
  border: "none",
  color: "white",
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer",
};