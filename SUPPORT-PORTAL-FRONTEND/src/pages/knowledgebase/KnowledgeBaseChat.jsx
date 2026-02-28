import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import kbApi from "../../services/kbApi";

export default function KnowledgeBaseChat() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi 👋 How can I help you today?",
      suggestTicket: false,
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const ask = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setTyping(true);

    try {
      const res = await kbApi.ask(userText);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: res.answer,
          video: res.video || (res.videos && res.videos[0]) || null,
          suggestTicket: res.suggest_ticket ?? false,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Something went wrong. Please create a support ticket.",
          suggestTicket: true,
        },
      ]);
    }

    setTyping(false);
  };


  /* ---------------- FORMAT BOT TEXT ---------------- */

  const renderBotText = (text) => {
  if (!text) return null;

  const lines = text.split("\n");

  return lines.map((line, i) => {
    if (!line.trim()) {
      return <div key={i} style={{ height: "6px" }} />;
    }

    // Replace **bold** text
    const parts = line.split(/(\*\*.*?\*\*)/g).map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    return (
      <div key={i} style={styles.botParagraph}>
        {parts}
      </div>
    );
  });
};

  const getVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/v=([^&]+)/);
    return match ? match[1] : null;
  };

  return (
    <div style={styles.chatWrapper}>
      <div style={styles.chatHeader}>
        <span>🤖 AI Assistant</span>
        <span style={styles.online}>Online</span>
      </div>

      <div ref={messagesRef} style={styles.messages}>
        {messages.map((m, i) => {
          const videoId = getVideoId(m.video);

          return (
            <div
              key={i}
              style={{
                ...styles.bubble,
                ...(m.role === "user"
                  ? styles.userBubble
                  : styles.botBubble),
              }}
            >
              {m.role === "bot" ? renderBotText(m.text) : m.text}

              {m.video && videoId && (
                <div style={styles.videoCard}>
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
                    style={styles.thumbnail}
                  />
                  <a
                    href={m.video}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.videoBtn}
                  >
                    ▶ Watch on YouTube
                  </a>
                </div>
              )}

              {m.suggestTicket && (
                <button
                  style={styles.ticketBtn}
                  onClick={() => navigate("/login")}
                >
                  Create Support Ticket
                </button>
              )}
            </div>
          );
        })}

        {typing && (
          <div style={{ ...styles.bubble, ...styles.botBubble }}>
            <div style={styles.typingDots}>
              <div style={styles.dot}></div>
              <div style={styles.dot}></div>
              <div style={styles.dot}></div>
            </div>
          </div>
        )}
      </div>

      <div style={styles.inputBar}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          placeholder="Ask your question..."
        />
        <button style={styles.sendBtn} onClick={ask}>
          Send
        </button>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  chatWrapper: {
    height: "100%",
    // flex:1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#f1f5f9",
  },

  chatHeader: {
    background: "linear-gradient(135deg,#1e293b,#374151,#111827)",
    color: "white",
    padding: "14px 16px",
    fontWeight: "600",
    display: "flex",
    justifyContent: "space-between",
  },

  online: { fontSize: "12px", color: "#22c55e" },

  messages: {
    flex: 1,
    padding: "18px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  bubble: {
    maxWidth: "80%",
    padding: "14px 16px",
    borderRadius: "16px",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  userBubble: {
    alignSelf: "flex-end",
    background: "linear-gradient(150deg,#9ca3af,#6b7280,#4b5563)",
    color: "white",
    borderBottomRightRadius: "6px",
    backdropFilter: "blur(6px)",
    transition: "all 0.25s ease",
  },

  botBubble: {
    alignSelf: "flex-start",
    background: "white",
    border: "1px solid #e2e8f0",
  },

  stepTitle: {
    fontWeight: "700",
    marginTop: "8px",
    marginBottom: "4px",
  },

  bullet: {
    marginLeft: "10px",
    color: "#334155",
  },
  
  botParagraph: {
    marginBottom: "6px",
  },

  ticketBtn: {
    marginTop: "10px",
    background: "#0b2c5d",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },

  videoCard: {
    marginTop: "10px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "8px",
    background: "#fafafa",
  },

  thumbnail: {
    width: "100%",
    borderRadius: "8px",
  },

  videoBtn: {
    display: "block",
    marginTop: "6px",
    fontSize: "13px",
    color: "#2563eb",
    fontWeight: "600",
    textDecoration: "none",
  },

  inputBar: {
    display: "flex",
    gap: "8px",
    padding: "12px",
    borderTop: "1px solid #e5e7eb",
    background: "white",
  },

  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
  },

  sendBtn: {
    background: "linear-gradient(135deg,#1f2937,#111827)",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
  },

  typingDots: {
    display: "flex",
    gap: "6px",
  },

  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#64748b",
  },

};

