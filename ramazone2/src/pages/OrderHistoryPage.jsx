import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BASE = "https://ramazone.onrender.com" || "";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${BASE}/api/orders`);
        const data = await res.json();
        
        // Fetch detailed items for each order to display images
        const detailedOrders = await Promise.all(
          data.map(async (order) => {
            const detailRes = await fetch(`${BASE}/api/orders/${order.id}`);
            const detailData = await detailRes.json();
            return detailData;
          })
        );
        setOrders(detailedOrders);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  return (
    <div className="page-wrapper" style={{ background: "#fff", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "960px", padding: "20px 16px" }}>
        
        {/* Header & Search */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
          <h1 style={{ fontFamily: "var(--font-head)", fontSize: "28px", fontWeight: 400 }}>Your Orders</h1>
          <div style={{ display: "flex", gap: "8px" }}>
            <input 
              type="text" 
              placeholder="Search all orders" 
              style={{ padding: "8px 12px", border: "1px solid var(--rz-text-xs)", borderRadius: "var(--r-sm)", fontSize: "14px", width: "240px", outline: "none" }} 
            />
            <button style={{ background: "#333", color: "#fff", padding: "0 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600 }}>
              Search Orders
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: "1px solid var(--rz-border-lt)", marginBottom: "20px", display: "flex", gap: "24px" }}>
          <div style={{ paddingBottom: "8px", borderBottom: "2px solid var(--rz-orange)", fontWeight: 700, color: "var(--rz-text)", cursor: "pointer" }}>Orders</div>
          <div style={{ paddingBottom: "8px", color: "var(--rz-text-lt)", cursor: "pointer" }}>Buy Again</div>
          <div style={{ paddingBottom: "8px", color: "var(--rz-text-lt)", cursor: "pointer" }}>Not Yet Shipped</div>
          <div style={{ paddingBottom: "8px", color: "var(--rz-text-lt)", cursor: "pointer" }}>Cancelled Orders</div>
        </div>

        <div style={{ marginBottom: "16px", fontWeight: 700, fontSize: "14px" }}>
          {orders.length} orders <span style={{ fontWeight: 400, color: "var(--rz-text-lt)" }}>placed in</span> <select style={{ padding: "4px", borderRadius: "4px", border: "1px solid #ccc", background: "#f0f2f2" }}><option>2026</option></select>
        </div>

        {/* Orders List */}
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--rz-text-lt)" }}>
            <div className="spinner" style={{ marginBottom: "16px" }}></div>
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: "40px", border: "1px solid var(--rz-border-lt)", borderRadius: "var(--r-md)", textAlign: "center" }}>
            Looks like you haven't placed any orders yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {orders.map(({ order, items }) => (
              <div key={order.id} style={{ border: "1px solid var(--rz-border-lt)", borderRadius: "var(--r-md)", overflow: "hidden" }}>
                
                {/* Grey Header Card */}
                <div style={{ background: "#f0f2f2", padding: "14px 18px", borderBottom: "1px solid var(--rz-border-lt)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", fontSize: "12px", color: "var(--rz-text-lt)" }}>
                  <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ textTransform: "uppercase", marginBottom: "2px" }}>Order Placed</div>
                      <div style={{ color: "var(--rz-text-md)" }}>
                        {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    </div>
                    <div>
                      <div style={{ textTransform: "uppercase", marginBottom: "2px" }}>Total</div>
                      <div style={{ color: "var(--rz-text-md)" }}>₹{parseFloat(order.total_amount).toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ textTransform: "uppercase", marginBottom: "2px" }}>Ship To</div>
                      <div style={{ color: "var(--rz-teal)", cursor: "pointer" }}>{order.address?.split(",")[0] || "User"} ⌄</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ textTransform: "uppercase", marginBottom: "2px" }}>Order # {order.id}</div>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <span style={{ color: "var(--rz-teal)", cursor: "pointer" }}>View order details</span>
                      <span>|</span>
                      <span style={{ color: "var(--rz-teal)", cursor: "pointer" }}>Invoice ⌄</span>
                    </div>
                  </div>
                </div>

                {/* White Body - Items */}
                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "18px", marginBottom: "16px", fontFamily: "var(--font-head)", fontWeight: 700 }}>
                    {order.status === "delivered" ? "Delivered" : "Arriving soon"}
                  </h3>
                  
                  {items?.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "20px", marginBottom: idx !== items.length - 1 ? "24px" : "0", flexWrap: "wrap" }}>
                      
                      {/* Image */}
                      <div style={{ width: "90px", flexShrink: 0 }}>
                        <img src={item.image_url || "https://via.placeholder.com/90"} alt={item.name} style={{ width: "100%", objectFit: "contain", mixBlendMode: "multiply" }} />
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <Link to={`/product/${item.product_id}`} style={{ color: "var(--rz-teal)", fontSize: "14px", fontWeight: 500, display: "block", marginBottom: "6px", lineHeight: 1.4 }}>
                          {item.name}
                        </Link>
                        <div style={{ fontSize: "12px", color: "var(--rz-text-lt)", marginBottom: "12px" }}>
                          Return window closed
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button style={{ padding: "6px 12px", background: "#ffd814", border: "1px solid #fcd200", borderRadius: "8px", fontSize: "13px", cursor: "pointer", boxShadow: "0 2px 5px rgba(213,217,217,.5)" }}>
                            ↻ Buy it again
                          </button>
                          <button style={{ padding: "6px 12px", background: "#fff", border: "1px solid #d5d9d9", borderRadius: "8px", fontSize: "13px", cursor: "pointer", boxShadow: "0 2px 5px rgba(213,217,217,.5)" }}>
                            View your item
                          </button>
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "220px" }}>
                        <button style={{ padding: "6px 0", background: "#fff", border: "1px solid #d5d9d9", borderRadius: "8px", fontSize: "13px", cursor: "pointer", boxShadow: "0 2px 5px rgba(213,217,217,.5)", textAlign: "center", width: "100%" }}>
                          Get product support
                        </button>
                        <button style={{ padding: "6px 0", background: "#fff", border: "1px solid #d5d9d9", borderRadius: "8px", fontSize: "13px", cursor: "pointer", boxShadow: "0 2px 5px rgba(213,217,217,.5)", textAlign: "center", width: "100%" }}>
                          Write a product review
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
