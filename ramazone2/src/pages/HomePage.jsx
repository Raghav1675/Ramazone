import { useState, useEffect, useMemo } from "react";
import ProductCard from "../components/ProductCard";

const BASE = "https://ramazone.onrender.com" || "";
// Safe fetch — returns null if response is HTML (wrong URL) or errors
const safeFetch = async (url) => {
  try {
    const res = await fetch(url);
    const text = await res.text();
    if (!text || text.trim().startsWith("<")) return null;
    return JSON.parse(text);
  } catch { return null; }
};

// Normalize backend product → frontend shape
const norm = (p) => ({
  ...p,
  image: p.image_url || p.image || `https://via.placeholder.com/300x300?text=${encodeURIComponent(p.name)}`,
  category: p.category_name || p.category || "General",
  rating: parseFloat(p.rating) || 4.0,
  reviews: p.review_count || 0,
  original_price: p.original_price ? parseFloat(p.original_price) : null,
  price: parseFloat(p.price),
  badge: p.badge || null,
  brand: p.brand || "",
});

const HERO_SLIDES = [
  { bg: "linear-gradient(135deg,#131921,#1a2b3c)", title: "Best Deals Today", subtitle: "Up to 70% off on top products", emoji: "⚡", accent: "#febd69" },
  { bg: "linear-gradient(135deg,#1a0533,#2d0b55)", title: "New Arrivals", subtitle: "Fresh products across all categories", emoji: "🛍️", accent: "#ff9900" },
  { bg: "linear-gradient(135deg,#0b2d0b,#1a4d1a)", title: "Free Delivery", subtitle: "On all orders above ₹499", emoji: "🚚", accent: "#69febd" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Avg. Customer Review" },
  { value: "newest", label: "Newest Arrivals" },
];
const PAGE_SIZE = 19;
export default function HomePage({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [slide, setSlide] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Fetch categories
  useEffect(() => {
    safeFetch(`${BASE}/api/categories`).then(data => {
      if (!data) return;
      const names = Array.isArray(data)
        ? data.map(c => c.name)
        : (data.categories || []).map(c => c.name);
      setCategories(["All", ...names]);
    });
  }, []);

  // Fetch products when filters change
  useEffect(() => {
      setLoading(true);
      setPage(0);
      setProducts([]);
      setHasMore(true);
      fetchPage(0, true);
    }, [searchQuery, selectedCategory, sortBy]);
  
    const fetchPage = async (pageNum, replace = false) => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory && selectedCategory !== "All") params.append("category", selectedCategory);
      if (sortBy !== "featured") params.append("sort", sortBy);
      params.append("limit", PAGE_SIZE);
      params.append("offset", pageNum * PAGE_SIZE);
  
      const data = await safeFetch(`${BASE}/api/products?${params}`);
      const list = data ? (Array.isArray(data) ? data : (data.products || [])) : [];
      const normed = list.map(norm);
  
      if (replace) {
        setProducts(normed);
        setLoading(false);
      } else {
        setProducts(prev => [...prev, ...normed]);
        setLoadingMore(false);
      }
      if (normed.length < PAGE_SIZE) setHasMore(false);
    };
  
    const loadMore = () => {
      const next = page + 1;
      setPage(next);
      setLoadingMore(true);
      fetchPage(next, false);
    };

  const isFiltered = searchQuery || selectedCategory !== "All";
  const cur = HERO_SLIDES[slide];

  return (
    <div>
      {/* Hero */}
      {!isFiltered && (
        <div style={{ background: cur.bg, minHeight: "280px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)", width: "clamp(120px,25vw,280px)", aspectRatio: "1", borderRadius: "50%", background: "rgba(255,255,255,.04)", pointerEvents: "none" }} />
          <div className="container" style={{ textAlign: "center", padding: "48px 16px", position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "clamp(36px,8vw,56px)", marginBottom: "12px" }}>{cur.emoji}</div>
            <h1 style={{ fontFamily: "var(--font-head)", fontSize: "clamp(22px,5vw,48px)", fontWeight: 900, color: "#fff", marginBottom: "10px", lineHeight: 1.1 }}>{cur.title}</h1>
            <p style={{ fontSize: "clamp(13px,2.5vw,17px)", color: "#ccc", marginBottom: "24px" }}>{cur.subtitle}</p>
            <button onClick={() => setSelectedCategory("All")}
              style={{ background: cur.accent, color: "#111", border: "none", borderRadius: "var(--r-sm)", padding: "clamp(10px,2vw,14px) clamp(20px,4vw,32px)", fontSize: "clamp(13px,2vw,15px)", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-head)" }}>
              Shop Now →
            </button>
          </div>
          <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px" }}>
            {HERO_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? "24px" : "8px", height: "8px", borderRadius: "99px", background: i === slide ? "var(--rz-orange)" : "rgba(255,255,255,.4)", border: "none", cursor: "pointer", transition: "all .3s", padding: 0 }} />
            ))}
          </div>
        </div>
      )}

      {/* Category chips */}
      {!searchQuery && categories.length > 1 && (
        <div style={{ background: "#fff", padding: "12px 0", borderBottom: "1px solid var(--rz-border-lt)", overflowX: "auto" }}>
          <div className="container">
            <div style={{ display: "flex", gap: "8px", flexWrap: "nowrap", overflowX: "auto", paddingBottom: "4px" }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  style={{ padding: "7px 16px", borderRadius: "99px", border: selectedCategory === cat ? "2px solid var(--rz-orange)" : "2px solid var(--rz-border)", background: selectedCategory === cat ? "var(--rz-orange)" : "#fff", color: selectedCategory === cat ? "#fff" : "var(--rz-text-md)", fontSize: "13px", fontWeight: selectedCategory === cat ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all .18s", fontFamily: "var(--font-body)" }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product grid */}
      <div className="container" style={{ paddingTop: "20px", paddingBottom: "48px" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            {searchQuery ? (
              <div style={{ fontSize: "14px" }}>
                <span style={{ color: "var(--rz-text-lt)" }}>{products.length} results for </span>
                <strong style={{ color: "var(--rz-red)" }}>{"\"" + searchQuery + "\""}</strong>
                <button onClick={() => setSearchQuery("")} style={{ marginLeft: "8px", fontSize: "12px", color: "var(--rz-teal)", textDecoration: "underline", cursor: "pointer", background: "none", border: "none" }}>Clear</button>
              </div>
            ) : (
              <h2 style={{ fontFamily: "var(--font-head)", fontSize: "clamp(16px,3vw,20px)", fontWeight: 700 }}>
                {selectedCategory === "All" ? "All Products" : selectedCategory}
                <span style={{ color: "var(--rz-text-lt)", fontSize: "13px", fontWeight: 400, marginLeft: "6px" }}>({products.length})</span>
              </h2>
            )}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding: "7px 10px", border: "1px solid var(--rz-border)", borderRadius: "var(--r-sm)", fontSize: "13px", background: "#fff", cursor: "pointer", outline: "none" }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* States */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div className="spinner" style={{ width: "40px", height: "40px", borderWidth: "4px", margin: "0 auto 16px" }} />
            <p style={{ color: "var(--rz-text-lt)" }}>Loading products…</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔍</div>
            <h3 style={{ fontFamily: "var(--font-head)", fontSize: "22px", marginBottom: "8px" }}>No products found</h3>
            <p style={{ color: "var(--rz-text-lt)", marginBottom: "20px" }}>Try a different search or category.</p>
            <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }} className="btn btn-primary btn-lg">Browse All</button>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 100%), 1fr))", gap: "16px" }}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>

            {/* Load More */}
            {!loading && hasMore && products.length > 0 && (
              <div style={{ textAlign: "center", marginTop: "32px" }}>
                <button onClick={loadMore} disabled={loadingMore}
                  style={{ padding: "12px 40px", background: loadingMore ? "#f0f0f0" : "#fff", border: "2px solid var(--rz-orange)", borderRadius: "var(--r-sm)", fontSize: "14px", fontWeight: 700, color: loadingMore ? "var(--rz-text-lt)" : "var(--rz-orange)", cursor: loadingMore ? "not-allowed" : "pointer", fontFamily: "var(--font-head)", transition: "all .2s", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  {loadingMore ? <><span className="spinner" style={{ width: "14px", height: "14px", borderWidth: "2px" }} /> Loading…</> : "Load More Products"}
                </button>
                <div style={{ fontSize: "12px", color: "var(--rz-text-lt)", marginTop: "8px" }}>
                  Showing {products.length} products
                </div>
              </div>
            )}

            {!loading && !hasMore && products.length > 0 && (
              <div style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "var(--rz-text-lt)", padding: "12px", borderTop: "1px solid var(--rz-border-lt)" }}>
                ✅ All {products.length} products loaded
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
