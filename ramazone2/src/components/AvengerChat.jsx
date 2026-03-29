import { useState, useRef, useEffect } from "react";

const AVENGER_BASE = "https://avenger-for-ramazone2-0.onrender.com/" || "http://localhost:8001";

const WELCOME = {
  role: "bot",
  text: "Hi! I'm **Avenger** 🛡️, your Ramazone 2.0 shopping assistant!\n\nAsk me anything — products, deals, gifts, orders, comparisons. I'm here to help!",
  suggestions: ["Show me today's deals", "I want to buy a phone", "Gift ideas", "Track my order"],
};

// Render markdown-lite: **bold**, \n → <br>
function Msg({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : p.split("\n").map((line, j, arr) => (
            <span key={`${i}-${j}`}>{line}{j < arr.length - 1 ? <br /> : null}</span>
          ))
      )}
    </span>
  );
}

export default function AvengerChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, open]);

  // Shake button every 30s to attract attention
  useEffect(() => {
    if (open) return;
    const t = setInterval(() => {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }, 30000);
    return () => clearInterval(t);
  }, [open]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg = { role: "user", text: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${AVENGER_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: [] }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "bot",
        text: data.reply,
        suggestions: data.suggestions || [],
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "bot",
        text: "Oops! I'm having trouble connecting right now. Please try again in a moment! 🔄",
        suggestions: [],
      }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Chat with Avenger"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9000,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #131921, #e47911)",
          border: "3px solid #ff9900",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(228,121,17,.5)",
          fontSize: "28px",
          transition: "transform .2s, box-shadow .2s",
          animation: shake ? "shake .5s ease" : "none",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(228,121,17,.7)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(228,121,17,.5)"; }}
      >
        {open ? "✕" : "🛡️"}
      </button>

      {/* Unread dot when closed */}
      {!open && (
        <div style={{
          position: "fixed", bottom: "76px", right: "22px", zIndex: 9001,
          width: "12px", height: "12px", borderRadius: "50%",
          background: "var(--rz-red)", border: "2px solid #fff",
          animation: "pulse 2s infinite"
        }} />
      )}

      {/* ── Chat window ── */}
      {open && (
        <div style={{
          position: "fixed",
          bottom: "96px",
          right: "24px",
          zIndex: 8999,
          width: "clamp(300px, 90vw, 380px)",
          height: "clamp(400px, 70vh, 560px)",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 12px 48px rgba(0,0,0,.22)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid rgba(255,153,0,.3)",
          animation: "slideUpChat .25s ease",
        }}>

          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #131921 0%, #1a2b3c 100%)",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "linear-gradient(135deg, #ff9900, #e47911)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", flexShrink: 0,
              boxShadow: "0 0 0 2px rgba(255,153,0,.4)"
            }}>🛡️</div>
            <div>
              <div style={{ color: "#fff", fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "16px", lineHeight: 1 }}>
                Avenger
              </div>
              <div style={{ color: "#febd69", fontSize: "11px", marginTop: "2px" }}>
                Ramazone 2.0 AI • Always online
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: "6px", alignItems: "center" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4caf50", boxShadow: "0 0 6px #4caf50" }} />
              <span style={{ color: "#aaa", fontSize: "11px" }}>Online</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            background: "#f7f8f8",
          }}>
            {messages.map((m, i) => (
              <div key={i}>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                  {/* Avatar */}
                  {m.role === "bot" && (
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#ff9900,#e47911)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>🛡️</div>
                  )}
                  {/* Bubble */}
                  <div style={{
                    maxWidth: "82%",
                    padding: "10px 13px",
                    borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                    background: m.role === "user" ? "linear-gradient(135deg,#ff9900,#e47911)" : "#fff",
                    color: m.role === "user" ? "#fff" : "#111",
                    fontSize: "13px",
                    lineHeight: 1.55,
                    boxShadow: "0 1px 4px rgba(0,0,0,.1)",
                    fontFamily: "var(--font-body)",
                  }}>
                    <Msg text={m.text} />
                  </div>
                </div>

                {/* Suggestion chips */}
                {m.role === "bot" && m.suggestions?.length > 0 && i === messages.length - 1 && (
                  <div style={{ marginTop: "8px", marginLeft: "36px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {m.suggestions.map((s, j) => (
                      <button key={j} onClick={() => send(s)}
                        style={{
                          padding: "5px 11px",
                          borderRadius: "99px",
                          border: "1px solid #ff9900",
                          background: "#fff8ec",
                          color: "#e47911",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all .15s",
                          fontFamily: "var(--font-body)",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#ff9900"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#fff8ec"; e.currentTarget.style.color = "#e47911"; }}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#ff9900,#e47911)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>🛡️</div>
                <div style={{ padding: "12px 16px", borderRadius: "4px 16px 16px 16px", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,.1)", display: "flex", gap: "5px", alignItems: "center" }}>
                  {[0, 1, 2].map(d => (
                    <div key={d} style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#ff9900", animation: `typingDot 1.2s ease infinite`, animationDelay: `${d * 0.2}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "10px 12px",
            borderTop: "1px solid #eee",
            display: "flex",
            gap: "8px",
            background: "#fff",
            flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask Avenger anything…"
              disabled={loading}
              style={{
                flex: 1,
                padding: "9px 13px",
                border: "1.5px solid #e0e0e0",
                borderRadius: "99px",
                fontSize: "13px",
                outline: "none",
                fontFamily: "var(--font-body)",
                background: loading ? "#fafafa" : "#fff",
                transition: "border .15s",
              }}
              onFocus={e => e.target.style.border = "1.5px solid #ff9900"}
              onBlur={e => e.target.style.border = "1.5px solid #e0e0e0"}
            />
            <button onClick={() => send()}
              disabled={loading || !input.trim()}
              style={{
                width: "38px", height: "38px", borderRadius: "50%",
                background: (loading || !input.trim()) ? "#f0f0f0" : "linear-gradient(135deg,#ff9900,#e47911)",
                border: "none", cursor: (loading || !input.trim()) ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", flexShrink: 0, transition: "background .15s",
              }}>
              {loading ? "⏳" : "➤"}
            </button>
          </div>

          {/* Footer branding */}
          <div style={{ textAlign: "center", padding: "5px", background: "#fff", borderTop: "1px solid #f5f5f5" }}>
            <span style={{ fontSize: "10px", color: "#bbb", fontFamily: "var(--font-body)" }}>
              Powered by <strong style={{ color: "#e47911" }}>Avenger AI</strong> · Ramazone 2.0
            </span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUpChat {
          from { opacity: 0; transform: translateY(20px) scale(.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   }
        }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0);    opacity: .4; }
          30%            { transform: translateY(-6px); opacity: 1;  }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1;   transform: scale(1); }
          50%       { opacity: .5; transform: scale(1.3); }
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          20%       { transform: rotate(-12deg); }
          40%       { transform: rotate(12deg); }
          60%       { transform: rotate(-8deg); }
          80%       { transform: rotate(8deg); }
        }
        @media (max-width: 480px) {
          /* Make chat window fill more of screen on mobile */
        }
      `}</style>
    </>
  );
}
