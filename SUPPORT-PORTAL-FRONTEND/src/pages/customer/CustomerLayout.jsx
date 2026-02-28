import { useNavigate, useLocation } from "react-router-dom";

export default function CustomerLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("token");
    navigate("/");
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
        <b>SupportSphere Customer</b>

        <button
          onClick={handleLogout}
          style={{
            background: "#ea580c",
            border: "none",
            color: "white",
            padding: "6px 12px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* BODY */}
      <div style={{ display: "flex" }}>
        
        {/* SIDEBAR */}
        <div
          style={{
            width: 220,
            background: "#cdd4de",
            padding: 20,
            minHeight: "calc(100vh - 56px)",
          }}
        >
          <h3 style={{ marginBottom: 20, color: "#0b2c5d" }}>
            Customer Panel
          </h3>

          <SidebarItem
            label="My Tickets"
            active={isActive("/customer")}
            onClick={() => navigate("/customer")}
          />

          <SidebarItem
            label="Create Ticket"
            active={isActive("/customer/create")}
            onClick={() => navigate("/customer/create")}
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
        background: active ? "#bcc7db" : "transparent",
        marginBottom: 6,
        fontWeight: active ? "600" : "500",
      }}
    >
      {label}
    </div>
  );
}
