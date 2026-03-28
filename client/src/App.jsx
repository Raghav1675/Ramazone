import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import { Link } from "react-router-dom";

import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
function App() {
  return (
    <Router>
      <h1>Ramazone</h1>
      <Link to="/cart">Go to Cart</Link>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:id" element={<OrderSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;