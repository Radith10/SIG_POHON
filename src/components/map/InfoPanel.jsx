export default function InfoPanel({ text }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        background: "white",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 0 6px rgba(0,0,0,0.3)",
        minWidth: "150px",
        zIndex: 2000,
      }}
    >
      <strong>Info:</strong>
      <div>{text || "—"}</div>
    </div>
  );
}
