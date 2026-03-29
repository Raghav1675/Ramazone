import { useEffect, useState } from "react";

const BASE = "https://ramazone.onrender.com";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/api/orders`)
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h2>Your Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "15px"
          }}>
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Total:</strong> ₹{order.total_amount}</p>
            <p><strong>Address:</strong> {order.address}</p>
          </div>
        ))
      )}
    </div>
  );
}