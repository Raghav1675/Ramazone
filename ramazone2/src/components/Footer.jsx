import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      {/* Back to top */}
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          background: "var(--rz-nav-mid)",
          textAlign: "center",
          padding: "14px",
          color: "#fff",
          fontSize: "13px",
          cursor: "pointer",
          transition: "background .15s"
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#3a4f61"}
        onMouseLeave={e => e.currentTarget.style.background = "var(--rz-nav-mid)"}
      >
        Back to top
      </div>

      {/* Main Footer */}
      <div style={{ background: "var(--rz-nav)", color: "#ddd", padding: "40px 0 0" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "32px",
            paddingBottom: "32px"
          }}>
            <FooterSection title="Get to Know Us">
              <FooterLink>About Ramazone</FooterLink>
              <FooterLink>Careers</FooterLink>
              <FooterLink>Press Releases</FooterLink>
              <FooterLink>Ramazone Science</FooterLink>
            </FooterSection>

            <FooterSection title="Connect with Us">
              <FooterLink>Facebook</FooterLink>
              <FooterLink>Twitter</FooterLink>
              <FooterLink>Instagram</FooterLink>
            </FooterSection>

            <FooterSection title="Make Money with Us">
              <FooterLink>Sell on Ramazone</FooterLink>
              <FooterLink>Sell Under Private Brands</FooterLink>
              <FooterLink>Become an Affiliate</FooterLink>
              <FooterLink>Advertise Your Products</FooterLink>
            </FooterSection>

            <FooterSection title="Let Us Help You">
              <FooterLink>Your Account</FooterLink>
              <FooterLink>Returns Centre</FooterLink>
              <FooterLink>Protect Your Account</FooterLink>
              <FooterLink>Ramazone App Download</FooterLink>
              <FooterLink>Help</FooterLink>
            </FooterSection>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,.15)", padding: "24px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{
                fontFamily: "var(--font-head)",
                fontWeight: 900,
                fontSize: "20px",
                color: "#fff"
              }}>
                Rama<span style={{ color: "var(--rz-orange)" }}>zone</span>
                <span style={{ fontSize: "12px", color: "var(--rz-orange-lt)", marginLeft: "2px" }}>2.0</span>
              </span>
              <span style={{ fontSize: "12px", color: "#888" }}>
                © {new Date().getFullYear()} Ramazone 2.0, Inc. or its affiliates. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({ title, children }) {
  return (
    <div>
      <h4 style={{ color: "#fff", fontSize: "14px", fontWeight: 700, marginBottom: "12px", fontFamily: "var(--font-head)" }}>
        {title}
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {children}
      </div>
    </div>
  );
}

function FooterLink({ children }) {
  return (
    <a href="#" style={{ color: "#aaa", fontSize: "13px", textDecoration: "none", transition: "color .15s" }}
      onMouseEnter={e => e.currentTarget.style.color = "var(--rz-orange-lt)"}
      onMouseLeave={e => e.currentTarget.style.color = "#aaa"}
    >
      {children}
    </a>
  );
}
