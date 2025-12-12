export default function Popup({ popupRef, popupContentRef }) {
  return (
    <div
      ref={popupRef}
      className="ol-popup"
      style={{
        background: "white",
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        position: "absolute",
        minWidth: "200px",
        zIndex: 3000,
      }}
    >
      <div ref={popupContentRef}></div>
    </div>
  );
}
