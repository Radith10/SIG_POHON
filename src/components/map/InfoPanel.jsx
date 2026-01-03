export default function InfoPanel({ text }) {
  return (
    <div className="info-panel">
      <strong>Info:</strong>
      <div>{text || "—"}</div>
    </div>
  );
}
