import { useState } from "react";

export default function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderTop: "1px solid #e5e7eb",
        padding: "12px 0",
      }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: "pointer",
          fontWeight: "500",
          color: "#0f172a",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {q}
        <span>{open ? "−" : "+"}</span>
      </div>

      {open && (
        <div
          style={{
            marginTop: "8px",
            color: "#475569",
            lineHeight: "1.6",
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
}