import { useState } from "react";
import FAQItem from "./FAQItem";

export default function FAQCategory({ category, items }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "16px",
          cursor: "pointer",
          fontWeight: "600",
          color: "#0b2c5d",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        📁 {category}
        <span>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          {items.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      )}
    </div>
  );
}