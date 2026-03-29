import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import StarRating from "./StarRating";
import Toast from "./Toast";
import { useState } from "react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [toastMsg, setToastMsg] = useState(null);
  const [imgErr, setImgErr] = useState(false);
if (imgErr) return null;
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const inWish = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setToastMsg("Added to cart! 🛒");
    setTimeout(() => setToastMsg(null), 2200);
  };

  return (
    <>
      {toastMsg && <Toast message={toastMsg} />}
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        style={{
          background: "var(--rz-surface)",
          borderRadius: "var(--r-md)",
          border: "1px solid var(--rz-border-lt)",
          overflow: "hidden",
          cursor: "pointer",
          transition: "box-shadow .2s, transform .2s",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,.15)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Badge */}
        {product.badge && (
          <div style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 2,
            background: product.badge.includes("Best") ? "var(--rz-orange)" :
              product.badge.includes("Off") ? "var(--rz-red)" :
                product.badge.includes("New") ? "var(--rz-green)" : "var(--rz-teal)",
            color: "#fff",
            fontSize: "10px",
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: "99px",
            textTransform: "uppercase",
            letterSpacing: ".4px"
          }}>{product.badge}</div>
        )}

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); toggleWishlist(product); }}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 2,
            background: "#fff",
            border: "1px solid var(--rz-border)",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "16px",
            boxShadow: "var(--shadow-sm)",
            transition: "transform .15s"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {inWish ? "❤️" : "🤍"}
        </button>

        {/* Image */}
        <div style={{
          aspectRatio: "1",
          overflow: "hidden",
          background: "#f9f9f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <img
            src={imgErr ? `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}` : product.image}
            alt={product.name}
            onError={() => setImgErr(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform .35s ease"
            }}
            onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"}
          />
        </div>

        {/* Info */}
        <div style={{ padding: "14px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
          {/* Category */}
          <span style={{ fontSize: "11px", color: "var(--rz-teal)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px" }}>
            {product.category}
          </span>

          {/* Name */}
          <h3 style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--rz-text)",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flex: 1
          }}>{product.name}</h3>

          {/* Rating */}
          <StarRating rating={product.rating} reviews={product.reviews} size={13} />

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-head)", fontSize: "18px", fontWeight: 700 }}>
              ₹{product.price.toLocaleString()}
            </span>
            {product.original_price && (
              <>
                <span style={{ fontSize: "12px", color: "var(--rz-text-lt)", textDecoration: "line-through" }}>
                  ₹{product.original_price.toLocaleString()}
                </span>
                {discount > 0 && (
                  <span style={{ fontSize: "12px", color: "var(--rz-green)", fontWeight: 600 }}>
                    -{discount}%
                  </span>
                )}
              </>
            )}
          </div>

          {/* Stock */}
          {product.stock <= 5 && (
            <span style={{ fontSize: "12px", color: "var(--rz-red)", fontWeight: 500 }}>
              Only {product.stock} left!
            </span>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            style={{
              marginTop: "8px",
              padding: "9px 0",
              background: "linear-gradient(to bottom, #f7dfa5, #f0c14b)",
              border: "1px solid #a88734",
              borderRadius: "var(--r-sm)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              color: "#111",
              fontFamily: "var(--font-body)",
              transition: "background .15s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(to bottom, #f5d78e, #eeb933)"}
            onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(to bottom, #f7dfa5, #f0c14b)"}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}
