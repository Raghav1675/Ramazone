export default function StarRating({ rating, reviews, size = 14, showCount = true }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <div style={{ display: "flex", gap: "1px" }}>
        {Array(full).fill(0).map((_, i) => (
          <span key={`f${i}`} style={{ color: "var(--rz-star)", fontSize: size }}>★</span>
        ))}
        {half === 1 && <span style={{ color: "var(--rz-star)", fontSize: size }}>⯨</span>}
        {Array(empty).fill(0).map((_, i) => (
          <span key={`e${i}`} style={{ color: "#c8c8c8", fontSize: size }}>★</span>
        ))}
      </div>
      {showCount && reviews != null && (
        <span style={{ fontSize: size - 1, color: "var(--rz-teal)", fontWeight: 500 }}>
          {reviews.toLocaleString()}
        </span>
      )}
    </div>
  );
}
