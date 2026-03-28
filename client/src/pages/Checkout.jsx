import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const placeOrder = async () => {
    try {
      const res = await axios.post("https://ramazone.onrender.com//api/orders", {
        address,
      });

      navigate(`/order-success/${res.data.order_id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>

      <textarea
        placeholder="Enter delivery address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <br /><br />

      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}

export default Checkout;
