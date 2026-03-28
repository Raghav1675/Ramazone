import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const res = await axios.get("http://localhost:5000/api/cart");
    setCart(res.data);
  };

  const updateQuantity = async (product_id, quantity) => {
    await axios.put("http://localhost:5000/api/cart", {
      product_id,
      quantity,
    });
    fetchCart();
  };

  const removeItem = async (product_id) => {
    await axios.delete(`http://localhost:5000/api/cart/${product_id}`);
    fetchCart();
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Cart</h2>

      {cart.map((item) => (
        <div key={item.product_id}>
          <h3>{item.name}</h3>
          <p>₹{item.price}</p>

          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.product_id, e.target.value)}
          />

          <button onClick={() => removeItem(item.product_id)}>Remove</button>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>
      <button onClick={() => navigate("/checkout")}>
  Proceed to Checkout
</button>
    </div>
  );
}

export default Cart;