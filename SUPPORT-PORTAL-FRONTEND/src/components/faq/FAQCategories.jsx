import { useEffect, useState } from "react";
import FAQCategory from "./FAQCategory";

export default function FAQCategories() {
  const [groupedFaqs, setGroupedFaqs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/faqs")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch FAQs");
        }
        return res.json();
      })
      .then((data) => {
        // 🔑 Group FAQs by category
        const grouped = data.reduce((acc, faq) => {
          const category = faq.category || "Other";

          if (!acc[category]) {
            acc[category] = [];
          }

          acc[category].push({
            q: faq.question,
            a: faq.answer,
          });

          return acc;
        }, {});

        setGroupedFaqs(grouped);
      })
      .catch((err) => {
        console.error("FAQ fetch error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p style={{ color: "#475569" }}>Loading FAQs…</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {Object.keys(groupedFaqs).length === 0 ? (
        <p style={{ color: "#475569" }}>No FAQs available.</p>
      ) : (
        Object.entries(groupedFaqs).map(([category, items]) => (
          <FAQCategory
            key={category}
            category={category}
            items={items}
          />
        ))
      )}
    </div>
  );
}