import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartSubtotal, deliveryCharge, grandTotal, cartCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ textAlign: "center", paddingTop: "80px" }}>
          <div style={{ fontSize: "80px", marginBottom: "20px" }}>🛒</div>
          <h2 style={{ fontFamily: "var(--font-head)", fontSize: "28px", fontWeight: 700, marginBottom: "10px" }}>
            Your cart is empty
          </h2>
          <p style={{ color: "var(--rz-text-lt)", fontSize: "15px", marginBottom: "28px" }}>
            You have no items in your shopping cart.<br />
            Start by exploring our products.
          </p>
          <button onClick={() => navigate("/")}
            style={{
              padding: "14px 36px",
              background: "var(--rz-orange)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--r-sm)",
              fontSize: "16px",
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
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 style={{ fontFamily: "var(--font-head)", fontSize: "28px", fontWeight: 700, marginBottom: "20px" }}>
          Shopping Cart
          <span style={{ fontSize: "16px", fontWeight: 400, color: "var(--rz-text-lt)", marginLeft: "10px" }}>
            ({cartCount} item{cartCount !== 1 ? "s" : ""})
          </span>
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px", alignItems: "start" }} className="cart-grid">

          {/* ── Cart Items ── */}
          <div>
            <div style={{ background: "#fff", border: "1px solid var(--rz-border-lt)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
              {cartItems.map((item, idx) => {
                const discount = item.originalPrice
                  ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                  : 0;

                return (
                  <div key={item.id} style={{
                    display: "grid",
                    gridTemplateColumns: "100px 1fr auto",
                    gap: "20px",
                    padding: "20px",
                    borderBottom: idx < cartItems.length - 1 ? "1px solid var(--rz-border-lt)" : "none",
                    alignItems: "start",
                    transition: "background .15s"
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                  >
                    {/* Image */}
                    <div onClick={() => navigate(`/product/${item.id}`)} style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "var(--r-sm)",
                      overflow: "hidden",
                      cursor: "pointer",
                      border: "1px solid var(--rz-border-lt)",
                      background: "#f5f5f5",
                      flexShrink: 0
                    }}>
                      <img src={item.image} alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => e.target.src = `https://via.placeholder.com/100?text=Product`}
                      />
                    </div>

                    {/* Info */}
                    <div>
                      <h3 onClick={() => navigate(`/product/${item.id}`)}
                        style={{ fontSize: "15px", fontWeight: 500, color: "var(--rz-teal)", cursor: "pointer", marginBottom: "4px", lineHeight: 1.4 }}>
                        {item.name}
                      </h3>
                      <div style={{ fontSize: "12px", color: "var(--rz-green)", fontWeight: 600, marginBottom: "4px" }}>In Stock</div>
                      {item.badge && (
                        <div style={{ fontSize: "11px", color: "var(--rz-orange-dk)", fontWeight: 600, marginBottom: "8px" }}>
                          {item.badge}
                        </div>
                      )}
                      <div style={{ fontSize: "12px", color: "var(--rz-text-lt)", marginBottom: "10px" }}>
                        🚚 Eligible for FREE delivery
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                        {/* Qty selector */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0", border: "1px solid var(--rz-border)", borderRadius: "var(--r-sm)", overflow: "hidden" }}>
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{ padding: "5px 12px", background: "#f5f5f5", border: "none", fontSize: "16px", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                            {item.quantity === 1 ? "🗑" : "−"}
                          </button>
                          <span style={{ padding: "5px 14px", fontSize: "14px", fontWeight: 700, background: "#fff", borderLeft: "1px solid var(--rz-border)", borderRight: "1px solid var(--rz-border)" }}>
                            {item.quantity}
                          </span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= 10}
                            style={{ padding: "5px 12px", background: "#f5f5f5", border: "none", fontSize: "16px", cursor: item.quantity >= 10 ? "not-allowed" : "pointer", fontFamily: "var(--font-body)", opacity: item.quantity >= 10 ? 0.5 : 1 }}>
                            +
                          </button>
                        </div>

                        <button onClick={() => removeFromCart(item.id)}
                          style={{ fontSize: "13px", color: "var(--rz-red)", cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "var(--font-body)", textDecoration: "underline" }}>
                          Delete
                        </button>
                        <button style={{ fontSize: "13px", color: "var(--rz-teal)", cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "var(--font-body)", textDecoration: "underline" }}>
                          Save for later
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: "right", minWidth: "100px" }}>
                      <div style={{ fontFamily: "var(--font-head)", fontSize: "18px", fontWeight: 700 }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                      {item.quantity > 1 && (
                        <div style={{ fontSize: "12px", color: "var(--rz-text-lt)" }}>
                          ₹{item.price.toLocaleString()} each
                        </div>
                      )}
                      {discount > 0 && (
                        <div style={{ fontSize: "12px", color: "var(--rz-green)", fontWeight: 600 }}>
                          -{discount}% off
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtotal row */}
            <div style={{ textAlign: "right", padding: "16px 0", fontSize: "16px", borderTop: "1px solid var(--rz-border-lt)", marginTop: "4px" }}>
              Subtotal ({cartCount} item{cartCount !== 1 ? "s" : ""}):&nbsp;
              <strong style={{ fontFamily: "var(--font-head)", fontSize: "18px" }}>₹{cartSubtotal.toLocaleString()}</strong>
            </div>
          </div>

          {/* ── Summary Card ── */}
          <div style={{
            background: "#fff",
            border: "1px solid var(--rz-border-lt)",
            borderRadius: "var(--r-lg)",
            padding: "20px",
            position: "sticky",
            top: "80px"
          }}>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>
              Order Summary
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
              <SummaryRow label={`Subtotal (${cartCount} items)`} value={`₹${cartSubtotal.toLocaleString()}`} />
              <SummaryRow
                label="Delivery charges"
                value={deliveryCharge === 0 ? <span style={{ color: "var(--rz-green)", fontWeight: 600 }}>FREE</span> : `₹${deliveryCharge}`}
              />
              {deliveryCharge > 0 && (
                <div style={{ fontSize: "12px", color: "var(--rz-text-lt)", marginTop: "-4px" }}>
                  Add ₹{(500 - cartSubtotal).toLocaleString()} more for free delivery
                </div>
              )}
              <div style={{ borderTop: "1px solid var(--rz-border-lt)", paddingTop: "10px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: "16px" }}>Order Total</span>
                <span style={{ fontFamily: "var(--font-head)", fontSize: "20px", fontWeight: 800 }}>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {cartSubtotal > cartItems.reduce((s, i) => s + (i.originalPrice || i.price) * i.quantity, 0) * -1 && (
              <div style={{
                background: "#e8f5e9",
                borderRadius: "var(--r-sm)",
                padding: "8px 12px",
                fontSize: "13px",
                color: "var(--rz-green)",
                fontWeight: 600,
                marginBottom: "14px"
              }}>
                🎉 You're saving ₹{cartItems.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0).toLocaleString()} on this order!
              </div>
            )}

            <button onClick={() => navigate("/checkout")}
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(to bottom, #f0ac00, #e47911)",
                color: "#fff",
                border: "1px solid #c07600",
                borderRadius: "var(--r-sm)",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font-head)",
                letterSpacing: ".3px",
                transition: "background .15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(to bottom, #e09f00, #d06a0a)"}
              onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(to bottom, #f0ac00, #e47911)"}
            >
              Proceed to Checkout
            </button>

            <button onClick={() => navigate("/")}
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "12px",
                background: "#fff",
                color: "var(--rz-text)",
                border: "1px solid var(--rz-border)",
                borderRadius: "var(--r-sm)",
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "background .15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--rz-bg)"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            >
              Continue Shopping
            </button>

            <div style={{ marginTop: "16px", padding: "12px", background: "var(--rz-bg)", borderRadius: "var(--r-sm)", fontSize: "12px", color: "var(--rz-text-lt)", lineHeight: 1.6 }}>
              🔒 Secure checkout &nbsp;·&nbsp; ✅ 100% authentic &nbsp;·&nbsp; 📦 Easy returns
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
      <span style={{ color: "var(--rz-text-md)" }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}
