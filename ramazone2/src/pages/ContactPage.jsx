import { useState } from "react";
import { Link } from "react-router-dom";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle, submitting, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("submitting");
    // Simulate network request
    setTimeout(() => {
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    }, 1500);
  };

  return (
    <div className="page-wrapper" style={{ background: "var(--rz-bg)" }}>
      <div className="container" style={{ maxWidth: "1000px", padding: "32px 16px" }}>
        
        {/* Breadcrumb */}
        <div style={{ fontSize: "13px", color: "var(--rz-text-lt)", marginBottom: "24px" }}>
          <Link to="/" style={{ color: "var(--rz-teal)", textDecoration: "none" }}>Home</Link> › Contact Us
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", alignItems: "start" }}>
          
          {/* Left Column: Info & Portfolio Plug */}
          <div style={{ background: "#fff", padding: "32px", borderRadius: "var(--r-lg)", border: "1px solid var(--rz-border-lt)", boxShadow: "var(--shadow-sm)" }}>
            <h1 style={{ fontFamily: "var(--font-head)", fontSize: "28px", fontWeight: 800, marginBottom: "16px" }}>
              Get in Touch
            </h1>
            <p style={{ color: "var(--rz-text-md)", lineHeight: 1.6, marginBottom: "32px" }}>
              Have a question about an order, a product, or want to report a bug on Ramazone 2.0? We're here to help.
            </p>

            {/* Developer Plug */}
            <div style={{ background: "linear-gradient(135deg, #fff8ec, #fff)", borderLeft: "4px solid var(--rz-orange)", padding: "16px 20px", borderRadius: "0 var(--r-sm) var(--r-sm) 0", marginBottom: "32px" }}>
              <h3 style={{ fontSize: "15px", fontFamily: "var(--font-head)", fontWeight: 700, color: "var(--rz-orange-dk)", marginBottom: "6px" }}>
                💻 Built by Raghav Gupta
              </h3>
              <p style={{ fontSize: "13px", color: "var(--rz-text-md)", marginBottom: "12px", lineHeight: 1.5 }}>
                I am a freelance web developer and engineering student at Chandigarh University. Looking to build a stunning web app or e-commerce platform for your startup? Let's collaborate.
              </p>
              <div style={{ display: "flex", gap: "12px", fontSize: "13px", fontWeight: 600 }}>
                <a href="#" style={{ color: "var(--rz-teal)", textDecoration: "none" }}>LinkedIn ↗</a>
                <a href="#" style={{ color: "var(--rz-teal)", textDecoration: "none" }}>GitHub ↗</a>
                <a href="#" style={{ color: "var(--rz-teal)", textDecoration: "none" }}>Portfolio ↗</a>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--rz-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>📧</div>
                <div>
                  <div style={{ fontSize: "12px", color: "var(--rz-text-lt)", textTransform: "uppercase", fontWeight: 600 }}>Email Support</div>
                  <div style={{ fontWeight: 500 }}>support@ramazone.com</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--rz-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>📍</div>
                <div>
                  <div style={{ fontSize: "12px", color: "var(--rz-text-lt)", textTransform: "uppercase", fontWeight: 600 }}>Headquarters</div>
                  <div style={{ fontWeight: 500 }}>Chandigarh University, Punjab</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div style={{ background: "#fff", padding: "32px", borderRadius: "var(--r-lg)", border: "1px solid var(--rz-border-lt)", boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: "20px", fontWeight: 700, marginBottom: "24px" }}>
              Send us a Message
            </h2>

            {status === "success" ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                <h3 style={{ fontFamily: "var(--font-head)", fontSize: "20px", marginBottom: "8px" }}>Message Sent!</h3>
                <p style={{ color: "var(--rz-text-lt)", fontSize: "14px" }}>Thanks for reaching out. Raghav or a team member will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--rz-text-md)", marginBottom: "6px" }}>Your Name *</label>
                  <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="form-input" placeholder="John Doe" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--rz-text-md)", marginBottom: "6px" }}>Email Address *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="form-input" placeholder="john@example.com" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--rz-text-md)", marginBottom: "6px" }}>Subject</label>
                  <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="form-input">
                    <option value="">Select a topic...</option>
                    <option value="order">Order Issue</option>
                    <option value="freelance">Hire Raghav (Freelance Inquiry)</option>
                    <option value="bug">Report a Bug</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--rz-text-md)", marginBottom: "6px" }}>Message *</label>
                  <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="form-input" rows={5} placeholder="How can we help you today?" style={{ resize: "vertical" }} />
                </div>
                <button type="submit" disabled={status === "submitting"} style={{
                  padding: "12px 24px", background: status === "submitting" ? "#f0f0f0" : "var(--rz-orange)",
                  color: status === "submitting" ? "var(--rz-text-lt)" : "#fff", border: "none", borderRadius: "var(--r-sm)",
                  fontSize: "14px", fontWeight: 700, cursor: status === "submitting" ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-head)", marginTop: "8px", transition: "background .2s"
                }}>
                  {status === "submitting" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
