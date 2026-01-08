export default function Popup({ popupRef, popupContentRef }) {
  return (
    <div ref={popupRef} className="ol-popup map-popup">
      <div ref={popupContentRef}></div>
    </div>
  );
}
