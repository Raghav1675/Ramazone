import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const BASE = import.meta.env.VITE_API_BASE_URL || "https://ramazone.onrender.com";

export default function Navbar({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState(searchQuery || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const [categories, setCategories] = useState(["All"]);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);

  // Fetch categories
  useEffect(() => {
    fetch(`${BASE}/api/categories`)
      .then(r => r.json())
      .then(data => {
        const names = Array.isArray(data) ? data.map(c => c.name) : (data.categories || []).map(c => c.name);
        setCategories(["All", ...names]);
      })
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowSug(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleInput = async (val) => {
    setInputVal(val);
    if (val.trim().length > 1) {
      try {
        const res = await fetch(`${BASE}/api/products?search=${encodeURIComponent(val)}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.products || []);
        setSuggestions(list.slice(0, 5).map(p => ({
          ...p, image: p.image_url || p.image || "", category: p.category_name || p.category || "", price: parseFloat(p.price),
        })));
        setShowSug(true);
      } catch { setSuggestions([]); }
    } else {
      setSuggestions([]); setShowSug(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchQuery(inputVal.trim()); setShowSug(false); navigate("/");
    }
  };

  const resetSearch = () => { setSearchQuery(""); setInputVal(""); setSelectedCategory("All"); };

  return (
    <>
      <header>
        {/* ── Top bar ── */}
        <div style={{ background: "var(--rz-nav)", padding: "0 16px", display: "flex", alignItems: "center", gap: "10px", minHeight: "58px", position: "sticky", top: 0, zIndex: 1000, boxShadow: "0 2px 8px rgba(0,0,0,.35)" }}>
          
          {/* Hamburger for mobile */}
          <button onClick={() => setMenuOpen(true)} className="show-mobile" style={{ background: "none", border: "none", color: "#fff", fontSize: "22px", cursor: "pointer", padding: "4px 6px", display: "none" }}>
            ☰
          </button>

          {/* Logo */}
          <Link to="/" onClick={resetSearch} style={{ flexShrink: 0, textDecoration: "none", display: "flex", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-head)", fontWeight: 900, fontSize: "clamp(18px,3vw,22px)", color: "#fff", letterSpacing: "-0.5px" }}>Rama<span style={{ color: "var(--rz-orange)" }}>zone</span></span>
            <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "12px", color: "var(--rz-orange-lt)", marginLeft: "2px", alignSelf: "flex-end", paddingBottom: "2px" }}>2.0</span>
          </Link>

          {/* Search (Hidden on tiny screens, moved below) */}
          <form onSubmit={handleSearch} className="hide-mobile" style={{ flex: 1, display: "flex", maxWidth: "640px", position: "relative", margin: "0 8px" }} ref={ref}>
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={{ background: "#e8e0d0", border: "none", borderRadius: "var(--r-sm) 0 0 var(--r-sm)", padding: "0 8px", fontSize: "12px", color: "#333", cursor: "pointer", minWidth: "80px", outline: "none" }}>
              {categories.map(c => <option key={c} value={c}>{c === "All" ? "All Depts." : c}</option>)}
            </select>
            <input type="text" placeholder="Search Ramazone 2.0…" value={inputVal} onChange={e => handleInput(e.target.value)} onFocus={() => inputVal.length > 1 && setShowSug(true)} style={{ flex: 1, padding: "9px 12px", border: "none", fontSize: "14px", outline: "none" }} />
            <button type="submit" style={{ background: "var(--rz-orange)", border: "none", padding: "0 12px", borderRadius: "0 var(--r-sm) var(--r-sm) 0", cursor: "pointer", fontSize: "18px" }}>🔍</button>
            {/* Autocomplete */}
            {showSug && suggestions.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", borderRadius: "0 0 var(--r-md) var(--r-md)", boxShadow: "var(--shadow-md)", zIndex: 999, overflow: "hidden" }}>
                {suggestions.map(p => (
                  <div key={p.id} onClick={() => { setInputVal(p.name); setShowSug(false); navigate(`/product/${p.id}`); }} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 14px", cursor: "pointer", borderBottom: "1px solid var(--rz-border-lt)" }}>
                    <img src={p.image} alt="" style={{ width: 34, height: 34, objectFit: "cover", borderRadius: 4 }} onError={e => e.target.src = "https://via.placeholder.com/34"} />
                    <div><div style={{ fontSize: "13px", fontWeight: 500 }}>{p.name}</div><div style={{ fontSize: "11px", color: "var(--rz-text-lt)" }}>₹{p.price.toLocaleString()}</div></div>
                  </div>
                ))}
              </div>
            )}
          </form>

          {/* User Links */}
          <div style={{ display: "flex", alignItems: "center", marginLeft: "auto", gap: "4px" }}>
            <Link to="/orders" className="hide-mobile" style={{ textDecoration: "none", padding: "6px 10px", color: "#fff", fontWeight: 600, fontSize: "14px" }}>
              Returns<br/><span style={{fontWeight: 700}}>& Orders</span>
            </Link>
            
            {/* Cart */}
            <Link to="/cart" style={{ textDecoration: "none", display: "flex", alignItems: "center", padding: "6px 10px" }}>
              <div style={{ position: "relative" }}>
                <span style={{ fontSize: "26px", lineHeight: 1 }}>🛒</span>
                {cartCount > 0 && <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "var(--rz-orange)", color: "#fff", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700 }}>{cartCount}</span>}
              </div>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "14px", fontFamily: "var(--font-head)" }} className="hide-mobile">Cart</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar (Only visible on mobile) */}
        <div className="show-mobile" style={{ background: "var(--rz-nav-mid)", padding: "10px 16px", display: "none" }}>
           <form onSubmit={handleSearch} style={{ flex: 1, display: "flex", width: "100%" }}>
             <input type="text" placeholder="Search Ramazone…" value={inputVal} onChange={e => setInputVal(e.target.value)} style={{ flex: 1, padding: "10px 12px", border: "none", borderRadius: "var(--r-sm) 0 0 var(--r-sm)", fontSize: "14px", outline: "none" }} />
             <button type="submit" style={{ background: "var(--rz-orange)", border: "none", padding: "0 14px", borderRadius: "0 var(--r-sm) var(--r-sm) 0", fontSize: "16px" }}>🔍</button>
           </form>
        </div>

        {/* ── Sub nav ── */}
        <div className="hide-mobile" style={{ background: "var(--rz-nav-mid)", padding: "0 16px", display: "flex", alignItems: "center", gap: "4px", height: "36px", overflowX: "auto" }}>
          <SubNavItem active={selectedCategory === "All"} onClick={() => { setSelectedCategory("All"); setMenuOpen(true); }}>
            <span style={{ fontWeight: 700, fontSize: "14px", marginRight: "4px" }}>☰</span> All
          </SubNavItem>
          {categories.slice(1).map(cat => (
            <SubNavItem key={cat} active={selectedCategory === cat} onClick={() => { setSelectedCategory(cat); navigate("/"); }}>{cat}</SubNavItem>
          ))}
          {["Ramazone miniTV", "Sell", "Best Sellers", "Today's Deals", "Customer Service", "Prime"].map(link => (
            <SubNavItem key={link} active={false} onClick={() => {}}>{link}</SubNavItem>
          ))}
        </div>
      </header>

      {/* ── Mobile Sidebar Drawer ── */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex" }}>
          {/* Dark Overlay */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", animation: "fadeIn .2s" }} onClick={() => setMenuOpen(false)} />
          
          {/* Drawer */}
          <div style={{ position: "relative", width: "80%", maxWidth: "320px", background: "#fff", height: "100%", overflowY: "auto", animation: "slideRight .3s ease", display: "flex", flexDirection: "column" }}>
            
            {/* Drawer Header */}
            <div style={{ background: "var(--rz-nav-mid)", padding: "24px 20px", color: "#fff" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>👤</div>
              <h2 style={{ fontFamily: "var(--font-head)", fontSize: "18px", fontWeight: 700 }}>Hello, Sign in</h2>
            </div>

            {/* Drawer Content */}
            <div style={{ padding: "16px 0", flex: 1 }}>
              <SidebarHeading>Trending</SidebarHeading>
              <SidebarLink>Best Sellers</SidebarLink>
              <SidebarLink>New Releases</SidebarLink>
              <SidebarLink>Movers and Shakers</SidebarLink>

              <div style={{ height: "1px", background: "var(--rz-border-lt)", margin: "12px 0" }} />

              <SidebarHeading>Shop By Category</SidebarHeading>
              {categories.map(c => (
                <SidebarLink key={c} onClick={() => { setSelectedCategory(c); navigate("/"); setMenuOpen(false); }}>
                  {c === "All" ? "All Products" : c}
                </SidebarLink>
              ))}

              <div style={{ height: "1px", background: "var(--rz-border-lt)", margin: "12px 0" }} />

              <SidebarHeading>Help & Settings</SidebarHeading>
              <SidebarLink onClick={() => { navigate("/orders"); setMenuOpen(false); }}>Your Orders</SidebarLink>
              <SidebarLink onClick={() => { navigate("/contact"); setMenuOpen(false); }}>Contact Us / Support</SidebarLink>
            </div>
          </div>
          
          {/* Close Button */}
          <button onClick={() => setMenuOpen(false)} style={{ position: "relative", color: "#fff", fontSize: "32px", padding: "16px", background: "none", border: "none", alignSelf: "flex-start" }}>✕</button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}

function SubNavItem({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{ color: active ? "#fff" : "#ddd", background: active ? "rgba(255,255,255,.15)" : "transparent", border: active ? "1px solid #fff" : "1px solid transparent", borderRadius: "var(--r-sm)", padding: "4px 10px", fontSize: "13px", fontWeight: active ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s", fontFamily: "var(--font-body)" }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.border = "1px solid #fff"; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.color = "#ddd"; e.currentTarget.style.border = "1px solid transparent"; } }}>
      {children}
    </button>
  );
}

function SidebarHeading({ children }) {
  return <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--rz-text)", padding: "8px 20px" }}>{children}</h3>;
}

function SidebarLink({ children, onClick }) {
  return (
    <div onClick={onClick} style={{ padding: "12px 20px", fontSize: "14px", color: "var(--rz-text-md)", cursor: "pointer", transition: "background .15s" }}
      onMouseEnter={e => e.currentTarget.style.background = "var(--rz-bg)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
      {children}
    </div>
  );
            }
