import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <CartProvider>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--rz-bg)" }}>
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              }
            />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />

            {/* 404 */}
            <Route path="*" element={
              <div style={{ textAlign: "center", padding: "80px 24px" }}>
                <div style={{ fontSize: "80px", marginBottom: "20px" }}>🔍</div>
                <h2 style={{ fontFamily: "var(--font-head)", fontSize: "28px", marginBottom: "10px" }}>Page Not Found</h2>
                <p style={{ color: "var(--rz-text-lt)", marginBottom: "24px" }}>The page you're looking for doesn't exist.</p>
                <a href="/" style={{
                  display: "inline-block", padding: "13px 28px",
                  background: "var(--rz-orange)", color: "#fff",
                  borderRadius: "var(--r-sm)", fontWeight: 700,
                  fontFamily: "var(--font-head)", textDecoration: "none"
                }}>Go Home</a>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}
