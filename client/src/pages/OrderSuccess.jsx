import React from "react";
import { useParams } from "react-router-dom";

function OrderSuccess() {
  const { id } = useParams();

  return (
    <div>
      <h2>Order Placed Successfully 🎉</h2>
      <h3>Your Order ID: {id}</h3>
    </div>
  );
}

export default OrderSuccess;