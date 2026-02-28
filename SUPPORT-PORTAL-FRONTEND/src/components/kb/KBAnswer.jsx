export default function KBAnswer({ result }) {
  if (!result) return null;

  return (
    <div className="card">
      <h4>Answer</h4>

      <p>{result.answer}</p>

      <p>
        <b>Confidence:</b> {(result.confidence * 100).toFixed(0)}%
      </p>

      {result.source && (
        <p>
          <b>Source:</b> {result.source}
        </p>
      )}

      {result.suggest_ticket && (
        <button>Create Support Ticket</button>
      )}
    </div>
  );
}