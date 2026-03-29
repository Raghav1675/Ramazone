export default function Toast({ message }) {
  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: 9999,
      background: "var(--rz-nav)",
      color: "#fff",
      padding: "12px 20px",
      borderRadius: "var(--r-md)",
      fontSize: "14px",
      fontWeight: 500,
      boxShadow: "0 8px 32px rgba(0,0,0,.25)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      animation: "slideInToast .3s ease"
    }}>
      {message}
    </div>
  );
}
