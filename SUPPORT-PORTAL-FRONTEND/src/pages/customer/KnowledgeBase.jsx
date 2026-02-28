import KnowledgeBaseChat from "../knowledgebase/KnowledgeBaseChat";

export default function KnowledgeBase() {
  return (
    <div style={styles.page}>
      {/* Title */}
      <h2 style={styles.title}>Knowledge Base</h2>

      {/* Chatbot */}
      <div style={styles.chatWrapper}>
        <KnowledgeBaseChat />
      </div>

      {/* Feedback */}
      <div style={styles.feedback}>
        <p>Was this helpful?</p>
        <div style={styles.feedbackBtns}>
          <button style={styles.btn}>👍 Yes</button>
          <button style={styles.btn}>👎 No</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "32px",
    background: "#f1f5f9",
    minHeight: "100vh"
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "20px"
  },

  chatWrapper: {
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    height: "520px",
    overflow: "hidden"
  },

  feedback: {
    marginTop: "24px",
    textAlign: "center"
  },

  feedbackBtns: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "8px"
  },

  btn: {
    border: "1px solid #cbd5e1",
    padding: "8px 14px",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer"
  }
};