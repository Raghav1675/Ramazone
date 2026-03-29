import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import StarRating from "../components/StarRating";
import ProductCard from "../components/ProductCard";
import Toast from "../components/Toast";

const BASE = "https://ramazone.onrender.com" || "";

const norm = (p) => ({
  ...p,
  image: p.image_url || p.image || "",
  category: p.category_name || p.category || "",
  rating: parseFloat(p.rating) || 4.0,
  reviews: p.review_count || 0,
  price: parseFloat(p.price),
  original_price: p.original_price ? parseFloat(p.original_price) : null,
  images: p.images?.length ? p.images : [p.image_url || p.image || ""],
  features: p.features || [],
  specs: p.specs || {},
});

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    setLoading(true);
    setActiveImg(0);
    setQty(1);

    fetch(`${BASE}/api/products/${id}`)
      .then(r => r.json())
      .then(data => { setProduct(norm(data)); setLoading(false); })
      .catch(() => setLoading(false));

    // Related — same category, try endpoint or fallback to products list
    fetch(`${BASE}/api/products/${id}/related?limit=4`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.products || []);
        setRelated(list.map(norm));
      })
      .catch(() => {});
  }, [id]);

  if (loading) return (
    <div style={{ textAlign: "center", padding: "80px 0" }}>
      <div className="spinner" style={{ width: "40px", height: "40px", borderWidth: "4px", margin: "0 auto" }} />
    </div>
  );

  if (!product) return (
    <div className="container page-wrapper" style={{ textAlign: "center", paddingTop: "80px" }}>
      <div style={{ fontSize: "64px" }}>😕</div>
      <h2 style={{ fontFamily: "var(--font-head)", margin: "16px 0 8px" }}>Product not found</h2>
      <button onClick={() => navigate("/")} className="btn btn-primary btn-lg" style={{ marginTop: "16px" }}>Back to Home</button>
    </div>
  );

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;
  const inWish = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setToastMsg(`Added to cart! 🛒`);
    setTimeout(() => setToastMsg(null), 2200);
  };

const handleBuyNow = () => {
  if (!product) return;

  navigate("/checkout", {
    state: {
      buyNowItem: {
        ...product,
        quantity: 1
      }
    }
  });
};
  return (
    <div className="page-wrapper">
      {toastMsg && <Toast message={toastMsg} />}
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px", fontSize: "13px", color: "var(--rz-text-lt)", flexWrap: "wrap" }}>
          <span style={{ cursor: "pointer", color: "var(--rz-teal)" }} onClick={() => navigate("/")}>Home</span>
          <span>›</span>
          <span style={{ cursor: "pointer", color: "var(--rz-teal)" }} onClick={() => navigate("/")}>{product.category}</span>
          <span>›</span>
          <span>{product.name.slice(0, 40)}{product.name.length > 40 ? "…" : ""}</span>
        </div>

        {/* Main grid — stacks on mobile */}
        <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 300px", gap: "24px", alignItems: "start" }} className="detail-grid">

          {/* Thumbnails */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {product.images.map((img, i) => (
              <div key={i} onClick={() => setActiveImg(i)}
                style={{ width: "52px", height: "52px", borderRadius: "var(--r-sm)", overflow: "hidden", border: activeImg === i ? "2px solid var(--rz-orange)" : "2px solid var(--rz-border)", cursor: "pointer", background: "#f5f5f5", flexShrink: 0 }}>
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.src = product.image} />
              </div>
            ))}
          </div>

          {/* Main image */}
          <div style={{ background: "#fff", border: "1px solid var(--rz-border-lt)", borderRadius: "var(--r-lg)", overflow: "hidden", position: "relative" }}>
            <img src={product.images[activeImg] || product.image} alt={product.name}
              onError={e => e.target.src = `https://via.placeholder.com/500x500?text=${encodeURIComponent(product.name)}`}
              style={{ width: "100%", maxHeight: "460px", objectFit: "contain", padding: "20px", display: "block" }} />
            {product.images.length > 1 && (
              <>
                <button onClick={() => setActiveImg(i => (i - 1 + product.images.length) % product.images.length)}
                  style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,.5)", color: "#fff", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "18px" }}>‹</button>
                <button onClick={() => setActiveImg(i => (i + 1) % product.images.length)}
                  style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,.5)", color: "#fff", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "18px" }}>›</button>
              </>
            )}
          </div>

          {/* Buy box */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ background: "#fff", border: "1px solid var(--rz-border-lt)", borderRadius: "var(--r-lg)", padding: "18px" }}>
              {product.badge && <span style={{ display: "inline-block", background: "var(--rz-orange)", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "99px", textTransform: "uppercase", marginBottom: "10px" }}>{product.badge}</span>}
              <h1 style={{ fontFamily: "var(--font-head)", fontSize: "clamp(16px,2.5vw,21px)", fontWeight: 700, lineHeight: 1.3, marginBottom: "10px" }}>{product.name}</h1>
              {product.brand && <div style={{ fontSize: "13px", marginBottom: "8px" }}>by <span style={{ color: "var(--rz-teal)" }}>{product.brand}</span></div>}
              <StarRating rating={product.rating} reviews={product.reviews} size={14} />
              <div style={{ borderTop: "1px solid var(--rz-border-lt)", paddingTop: "12px", marginTop: "12px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--font-head)", fontSize: "26px", fontWeight: 800 }}>
                    <span style={{ fontSize: "15px", verticalAlign: "super" }}>₹</span>{product.price.toLocaleString()}
                  </span>
                  {product.original_price && <span style={{ fontSize: "13px", color: "var(--rz-text-lt)", textDecoration: "line-through" }}>₹{product.original_price.toLocaleString()}</span>}
                </div>
                {discount > 0 && <div style={{ fontSize: "13px", color: "var(--rz-green)", fontWeight: 600 }}>Save {discount}% (₹{(product.original_price - product.price).toLocaleString()})</div>}
              </div>
              <div style={{ fontSize: "13px", marginTop: "8px" }}>
                <span style={{ color: (product.stock > 0) ? "var(--rz-green)" : "var(--rz-red)", fontWeight: 700 }}>
                  {product.stock > 0 ? (product.stock <= 5 ? `Only ${product.stock} left!` : "In Stock") : "Out of Stock"}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--rz-text-lt)", marginTop: "6px" }}>🚚 FREE delivery above ₹499</div>
            </div>

            <div style={{ background: "#fff", border: "1px solid var(--rz-border-lt)", borderRadius: "var(--r-lg)", padding: "18px" }}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Qty:</label>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--rz-border)", borderRadius: "var(--r-sm)", overflow: "hidden", width: "fit-content" }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: "7px 14px", background: "#f5f5f5", border: "none", fontSize: "16px", cursor: "pointer" }}>−</button>
                  <span style={{ padding: "7px 18px", fontWeight: 700 }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(10, q + 1))} style={{ padding: "7px 14px", background: "#f5f5f5", border: "none", fontSize: "16px", cursor: "pointer" }}>+</button>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button onClick={handleAddToCart} style={{ padding: "11px", width: "100%", background: "linear-gradient(to bottom,#f7dfa5,#f0c14b)", border: "1px solid #a88734", borderRadius: "var(--r-sm)", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>🛒 Add to Cart</button>
                <button
  onClick={handleBuyNow}
  style={{
    marginTop: "10px",
    padding: "10px",
    width: "100%",
    background: "#ff9900",
    border: "1px solid #a88734",
    borderRadius: "4px",
    fontWeight: "bold",
    cursor: "pointer"
  }}
>
  Buy Now
</button>
                <button onClick={() => toggleWishlist(product)} style={{ padding: "9px", width: "100%", background: "#fff", border: "1px solid var(--rz-border)", borderRadius: "var(--r-sm)", fontSize: "13px", cursor: "pointer" }}>
                  {inWish ? "❤️ Remove from Wishlist" : "🤍 Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div style={{ marginTop: "28px", background: "#fff", border: "1px solid var(--rz-border-lt)", borderRadius: "var(--r-lg)", padding: "20px" }}>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: "18px", fontWeight: 700, marginBottom: "12px" }}>About this item</h2>
            <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--rz-text-md)" }}>{product.description}</p>
            {product.features?.length > 0 && (
              <ul style={{ listStyle: "none", marginTop: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {product.features.map((f, i) => (
                  <li key={i} style={{ display: "flex", gap: "8px", fontSize: "14px" }}>
                    <span style={{ color: "var(--rz-green)", flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Specs */}
        {Object.keys(product.specs || {}).length > 0 && (
          <div style={{ marginTop: "16px", background: "#fff", border: "1px solid var(--rz-border-lt)", borderRadius: "var(--r-lg)", padding: "20px" }}>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: "18px", fontWeight: 700, marginBottom: "14px" }}>Specifications</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {Object.entries(product.specs).map(([k, v], i) => (
                  <tr key={k} style={{ background: i % 2 === 0 ? "var(--rz-bg)" : "#fff" }}>
                    <td style={{ padding: "9px 14px", fontWeight: 600, fontSize: "13px", width: "200px", borderBottom: "1px solid var(--rz-border-lt)" }}>{k}</td>
                    <td style={{ padding: "9px 14px", fontSize: "13px", borderBottom: "1px solid var(--rz-border-lt)" }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: "28px" }}>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: "20px", fontWeight: 700, marginBottom: "14px" }}>Customers also viewed</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(220px,100%), 1fr))", gap: "14px" }}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
          .detail-grid > div:first-child { display: flex !important; flex-direction: row !important; overflow-x: auto; }
          .detail-grid > div:first-child > div { width: 52px !important; height: 52px !important; flex-shrink: 0; }
        }
      `}</style>
    </div>
  );
}
