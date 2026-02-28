import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      {/* Gradient animation definition */}
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <nav style={styles.nav}>
        <div style={styles.logo}>SmartResolve</div>

        <div style={styles.rightSection}>
          <div style={styles.links}>
            <NavItem to="/" label="Home" />
            <NavItem to="/about" label="About Us" />
            <NavItem to="/faq" label="FAQ" />
            <NavItem to="/kb" label="Knowledge Base" />
            <NavItem to="/services" label="Services" />
          </div>

          <Link to="/login" style={styles.loginBtn}>
            Login
          </Link>
        </div>
      </nav>
    </>
  );
}

/* ---------------- NAV LINK COMPONENT ---------------- */

function NavItem({ to, label }) {
  const [hover, setHover] = useState(false);

  return (
    <Link
      to={to}
      style={{
        ...styles.link,
        opacity: hover ? "#38bdf8" : "#e2e8f0",
        transform: hover ? "translateY(-1px)" : "translateY(0)"
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {label}
    </Link>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  nav: {
    width: "100%",
    position: "sticky",
    top: 0,
    zIndex: 1000,

    background:
      "linear-gradient(120deg, #020617, #0e146a, #071845, #0a0a5f, #020617)",
    backgroundSize: "300% 300%",
    animation: "gradientShift 18s linear infinite",

    color: "white",
    padding: "22px 70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    boxShadow: "0 0 30px rgba(14,165,233,0.35)",
    borderBottom: "1px solid rgba(255,255,255,0.06)"
  },

  logo: {
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    textShadow: "0 0 10px rgba(0,0,0,0.8)"
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "36px",
  },

  links: {
    display: "flex",
    gap: "26px",
  },

  link: {
    color: "#e2e8f0",
    textDecoration: "none",
    fontWeight: "500",
    transition: "all 0.2s ease"
  },

  loginBtn: {
    marginLeft: "auto",
    background: "linear-gradient(90deg,#22d3ee,#3b82f6)",
    color: "white",
    padding: "9px 20px",
    borderRadius: "10px",
    fontWeight: "600",
    textDecoration: "none",
    boxShadow: "0 0 10px rgba(27, 78, 217, 0.6)",
    transition: "all 0.2s ease",
  },
};