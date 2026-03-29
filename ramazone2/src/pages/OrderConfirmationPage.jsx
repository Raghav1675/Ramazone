import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    // ✅ FIXED: Prevent blank/broken page if accessed without routing state
    if (!state) {
      navigate("/");
      return;
    }
    const t = setTimeout(() => setConfetti(false), 4000);
    return () => clearTimeout(t);
  }, [state, navigate]);

  // Prevent render of empty component during redirect
  if (!state) return null; 

  const items = state.items || [];
  const address = state.address || {};
  const total = state.total || 0;
  const paymentMethod = state.paymentMethod || "upi";
  const estimatedDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  const PAYMENT_LABELS = {
    upi: "UPI / PhonePe / GPay",
    card: "Credit / Debit Card",
    netbanking: "Net Banking",
    cod: "Cash on Delivery"
  };

  return (
    <div className="page-wrapper" style={{ background: "var(--rz-bg)" }}>
      {/* Confetti overlay */}
      {confetti && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9998, overflow: "hidden" }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: "-20px",
              width: `${8 + Math.random() * 8}px`,
              height: `${8 + Math.random() * 8}px`,
              borderRadius: Math.random() > 0.5 ? "50%" : "0",
              background: ["#ff9900", "#febd69", "#067d62", "#007185", "#cc0c39", "#f6921e"][Math.floor(Math.random() * 6)],
              animation: `fall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s forwards`,
              transform: `rotate(${Math.random() * 360}deg)`
            }} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fall {
          to { top: 110vh; transform: rotate(720deg); opacity: 0; }
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="container" style={{ maxWidth: "720px" }}>
        {/* Success Header */}
        <div style={{
          textAlign: "center",
          padding: "48px 24px 32px",
          background: "#fff",
          borderRadius: "var(--r-xl)",
          border: "1px solid var(--rz-border-lt)",
          marginBottom: "20px",
          animation: "fadeUp .6s ease both"
        }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            background: "var(--rz-green)", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 20px",
            fontSize: "40px",
            animation: "popIn .5s ease .2s both",
            boxShadow: "0 8px 32px rgba(6,125,98,.25)"
          }}>✓</div>

          <h1 style={{
            fontFamily: "var(--font-head)",
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 900,
            color: "var(--rz-text)",
            marginBottom: "10px"
          }}>
            Order Placed Successfully! 🎉
          </h1>

          <p style={{ color: "var(--rz-text-lt)", fontSize: "15px", marginBottom: "20px" }}>
            Thank you for shopping with Ramazone 2.0!<br />
            Your order is confirmed and being processed.
          </p>

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "var(--rz-bg)",
            border: "1px solid var(--rz-border)",
            borderRadius: "var(--r-md)",
            padding: "12px 24px"
          }}>
            <div>
              <div style={{ fontSize: "11px", color: "var(--rz-text-lt)", textTransform: "uppercase", fontWeight: 600 }}>Order ID</div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: "20px", fontWeight: 800, color: "var(--rz-orange-dk)", letterSpacing: "1px" }}>
                #{orderId}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div style={{
          background: "#fff",
          borderRadius: "var(--r-lg)",
          border: "1px solid var(--rz-border-lt)",
          padding: "20px",
          marginBottom: "16px",
          animation: "fadeUp .6s ease .15s both"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "20px" }}>
            <InfoBlock icon="📦" label="Estimated Delivery" value={estimatedDate} />
            <InfoBlock icon="📍" label="Delivering to" value={`${address.city || "–"}, ${address.state || "–"}`} />
            <InfoBlock icon="💳" label="Payment" value={PAYMENT_LABELS[paymentMethod] || paymentMethod} />
            <InfoBlock icon="💰" label="Total Paid" value={`₹${total.toLocaleString()}`} bold />
          </div>
        </div>

        {/* Order Items */}
        {items.length > 0 && (
          <div style={{
            background: "#fff",
            borderRadius: "var(--r-lg)",
            border: "1px solid var(--rz-border-lt)",
            overflow: "hidden",
            marginBottom: "16px",
            animation: "fadeUp .6s ease .25s both"
          }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--rz-border-lt)" }}>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: "16px", fontWeight: 700 }}>
                Order Items ({items.reduce((s, i) => s + (i.quantity || 1), 0)})
              </h3>
            </div>
            {items.map((item, i) => (
              <div key={item.id} style={{
                display: "flex",
                gap: "16px",
                padding: "16px 20px",
                borderBottom: i < items.length - 1 ? "1px solid var(--rz-border-lt)" : "none",
                alignItems: "center"
              }}>
                <img src={item.image} alt={item.name}
                  style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "var(--r-sm)", border: "1px solid var(--rz-border-lt)" }}
                  onError={e => e.target.src = "https://via.placeholder.com/64"} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: 500, marginBottom: "2px" }}>{item.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--rz-text-lt)" }}>
                    Qty: {item.quantity || 1} · {item.category || "General"}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--rz-green)", fontWeight: 600, marginTop: "2px" }}>
                    Arriving by {estimatedDate}
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "16px" }}>
                  ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Address Card */}
        {address.fullName && (
          <div style={{
            background: "#fff",
            borderRadius: "var(--r-lg)",
            border: "1px solid var(--rz-border-lt)",
            padding: "20px",
            marginBottom: "20px",
            animation: "fadeUp .6s ease .35s both"
          }}>
            <h3 style={{ fontFamily: "var(--font-head)", fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>
              📍 Delivery Address
            </h3>
            <div style={{ fontSize: "14px", color: "var(--rz-text-md)", lineHeight: 1.7 }}>
              <strong>{address.fullName}</strong>{address.addressType ? ` (${address.addressType})` : ""}<br />
              {address.address}{address.landmark ? `, ${address.landmark}` : ""}<br />
              {address.city}, {address.state} – {address.pincode}<br />
              📞 {address.mobile}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "center",
          animation: "fadeUp .6s ease .4s both",
          paddingBottom: "16px"
        }}>
          <button onClick={() => navigate("/")}
            style={{
              padding: "13px 28px",
              background: "var(--rz-orange)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--r-sm)",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-head)",
              transition: "background .15s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--rz-orange-dk)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--rz-orange)"}
          >
            Continue Shopping
          </button>
          <button onClick={() => window.print()}
            style={{
              padding: "13px 28px",
              background: "#fff",
              color: "var(--rz-text)",
              border: "1px solid var(--rz-border)",
              borderRadius: "var(--r-sm)",
              fontSize: "15px",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              transition: "background .15s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--rz-bg)"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          >
            🖨 Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ icon, label, value, bold }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
      <span style={{ fontSize: "24px", lineHeight: 1 }}>{icon}</span>
      <div>
        <div style={{ fontSize: "11px", color: "var(--rz-text-lt)", textTransform: "uppercase", fontWeight: 600, marginBottom: "2px" }}>{label}</div>
        <div style={{ fontSize: "14px", fontWeight: bold ? 700 : 500, color: bold ? "var(--rz-orange-dk)" : "var(--rz-text)", lineHeight: 1.4 }}>
          {value}
        </div>
      </div>
    </div>
  );
}
