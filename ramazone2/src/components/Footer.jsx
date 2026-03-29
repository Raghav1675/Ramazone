import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      {/* Back to top */}
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          background: "var(--rz-nav-mid)", textAlign: "center", padding: "14px",
          color: "#fff", fontSize: "13px", cursor: "pointer", transition: "background .15s"
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#3a4f61"}
        onMouseLeave={e => e.currentTarget.style.background = "var(--rz-nav-mid)"}
      >
        Back to top
      </div>

      {/* Main Footer */}
      <div style={{ background: "var(--rz-nav)", color: "#ddd", padding: "40px 0 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "32px", paddingBottom: "32px" }}>
            
            <FooterSection title="Get to Know Us">
              <FooterLink to="/contact">About Ramazone</FooterLink>
              <FooterLink to="/contact">Careers</FooterLink>
              <FooterLink to="/contact">Press Releases</FooterLink>
            </FooterSection>

            <FooterSection title="Connect with Us">
              <FooterLink to="http://linkedin.com/in/raghav1675/" external>LinkedIn</FooterLink>
              <FooterLink to="https://github.com/Raghav1675/" external>GitHub</FooterLink>
              <FooterLink to="https://www.instagram.com/raghav_gupta860/" external>Instagram</FooterLink>
            </FooterSection>

            <FooterSection title="Let Us Help You">
              <FooterLink to="/orders">Your Account & Orders</FooterLink>
              <FooterLink to="/contact">Returns Centre</FooterLink>
              {/* This is the key link we are wiring up! */}
              <FooterLink to="/contact" highlight>Contact Us / Support</FooterLink>
            </FooterSection>
            
          </div>

          {/* Divider & Copyright (Keep this exactly as you had it) */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,.15)", padding: "24px 0" }}>
             {/* ... your copyright text ... */}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({ title, children }) {
  return (
    <div>
      <h4 style={{ color: "#fff", fontSize: "14px", fontWeight: 700, marginBottom: "12px", fontFamily: "var(--font-head)" }}>{title}</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{children}</div>
    </div>
  );
}

// Updated FooterLink to handle internal routing vs external links
function FooterLink({ children, to, external, highlight }) {
  const style = { 
    color: highlight ? "var(--rz-orange-lt)" : "#aaa", 
    fontSize: "13px", 
    textDecoration: "none", 
    transition: "color .15s",
    fontWeight: highlight ? 600 : 400
  };

  const handleEnter = e => e.currentTarget.style.color = "var(--rz-orange)";
  const handleLeave = e => e.currentTarget.style.color = highlight ? "var(--rz-orange-lt)" : "#aaa";

  if (external) {
    return <a href={to} target="_blank" rel="noreferrer" style={style} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>{children}</a>;
  }

  return (
    <Link to={to} style={style} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {children}
    </Link>
  );
}
