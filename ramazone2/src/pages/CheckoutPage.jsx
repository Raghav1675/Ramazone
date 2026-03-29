import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const BASE = "https://ramazone.onrender.com" || "";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Jammu & Kashmir","Ladakh","Chandigarh","Puducherry"
];

const PAYMENT_METHODS = [
  { id: "upi",        label: "UPI / PhonePe / GPay", icon: "📱" },
  { id: "card",       label: "Credit / Debit Card",  icon: "💳" },
  { id: "netbanking", label: "Net Banking",          icon: "🏦" },
  { id: "cod",        label: "Cash on Delivery",     icon: "💵" },
];

function validate(form) {
  const e = {};
  if (!form.fullName.trim())            e.fullName = "Required";
  if (!form.mobile.match(/^[6-9]\d{9}$/)) e.mobile  = "Enter valid 10-digit number";
  if (!form.pincode.match(/^\d{6}$/))   e.pincode  = "Enter valid 6-digit PIN";
  if (!form.address.trim())             e.address  = "Required";
  if (!form.city.trim())                e.city     = "Required";
  if (!form.state)                      e.state    = "Please select state";
  return e;
}

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, deliveryCharge, grandTotal, cartCount, clearCart } = useCart();
  
  const buyNowItem = location.state?.buyNowItem;
  const isBuyNow = !!buyNowItem;
  const finalItems = isBuyNow ? [buyNowItem] : cartItems;

  // ✅ FIXED: Calculate accurate totals depending on Cart vs Buy Now
  const displaySubtotal = isBuyNow ? (buyNowItem.price * (buyNowItem.quantity || 1)) : cartSubtotal;
  const displayCount = isBuyNow ? (buyNowItem.quantity || 1) : cartCount;
  // Fallback standard logic for Buy Now (Free above 499, else 40)
  const displayDelivery = isBuyNow ? (displaySubtotal >= 499 ? 0 : 40) : deliveryCharge; 
  const displayTotal = displaySubtotal + displayDelivery;
const displayMRP = finalItems.reduce((sum, item) => sum + ((item.original_price || item.price) * (item.quantity || 1)), 0);
const displayDiscount = displayMRP - displaySubtotal;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ fullName: "", mobile: "", email: "", pincode: "", address: "", landmark: "", city: "", state: "", addressType: "Home" });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [placing, setPlacing] = useState(false);

  // ✅ FIXED: Added missing dependencies to prevent stale closures
  useEffect(() => {
    if (!isBuyNow && cartItems.length === 0) {
      navigate("/cart");
    }
  }, [isBuyNow, cartItems.length, navigate]);

  const set = (f, v) => { 
    setForm(p => ({ ...p, [f]: v })); 
    if (errors[f]) setErrors(e => ({ ...e, [f]: undefined })); 
  };

  const goPayment = () => {
    const e = validate(form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep(2); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const placeOrder = async () => {
    setPlacing(true);
    const addressStr = `${form.fullName}, ${form.mobile}, ${form.address}${form.landmark ? ", " + form.landmark : ""}, ${form.city}, ${form.state} - ${form.pincode}`;

    try {
      const res = await fetch(`${BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          address: addressStr,
          email: form.email,
          items: finalItems, // Sending exactly what was bought
          total_amount: displayTotal
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || data.error || "Order failed. Try again.");
        setPlacing(false);
        return;
      }

      // ✅ FIXED: Only clear the cart if the user actually checked out using the cart
      if (!isBuyNow) {
        setTimeout(() => clearCart(), 100);
      }

      navigate(`/order-confirmation/${data.order_id}`, {
        state: {
          orderId: data.order_id,
          items: finalItems,
          address: form,
          total: displayTotal, // ✅ FIXED: Pass the accurate total
          paymentMethod
        }
      });
    } catch (e) {
      alert("Network error. Please try again.");
      setPlacing(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Logo bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <span style={{ fontFamily: "var(--font-head)", fontWeight: 900, fontSize: "20px", color: "var(--rz-nav)" }}>
            Rama<span style={{ color: "var(--rz-orange)" }}>zone</span><span style={{ fontSize: "12px", color: "var(--rz-orange-lt)", marginLeft: "2px" }}>2.0</span>
          </span>
          <div style={{ flex: 1, borderBottom: "1px solid var(--rz-border-lt)" }} />
          <span style={{ fontSize: "12px", color: "var(--rz-text-lt)" }}>🔒 Secure Checkout</span>
        </div>

        {/* Progress steps */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "24px", gap: 0 }}>
          {[{n:1,label:"Address"},{n:2,label:"Payment"},{n:3,label:"Review"}].map(({n,label},i)=>(
            <div key={n} style={{ display:"flex", alignItems:"center", flex:1 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
                <div style={{ width:"30px", height:"30px", borderRadius:"50%", background: step>=n?"var(--rz-orange)":"var(--rz-border)", color: step>=n?"#fff":"var(--rz-text-lt)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"13px", transition:"background .3s" }}>{step>n?"✓":n}</div>
                <span style={{ fontSize:"11px", fontWeight: step===n?700:400, color: step>=n?"var(--rz-orange-dk)":"var(--rz-text-lt)" }}>{label}</span>
              </div>
              {i<2&&<div style={{ flex:1, height:"2px", background: step>n?"var(--rz-orange)":"var(--rz-border)", margin:"0 6px", marginBottom:"18px", transition:"background .3s" }} />}
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:"16px", alignItems:"start" }} className="checkout-grid">

          {/* Left — steps */}
          <div>
            {/* STEP 1 */}
            {step===1 && (
              <Section title="📍 Delivery Address">
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }} className="form-grid-2">
                  <Field label="Full Name *" error={errors.fullName}><input className="form-input" placeholder="Ramesh Kumar" value={form.fullName} onChange={e=>set("fullName",e.target.value)} /></Field>
                  <Field label="Mobile *" error={errors.mobile}><input className="form-input" placeholder="9876543210" value={form.mobile} onChange={e=>set("mobile",e.target.value)} maxLength={10} /></Field>
                  <Field label="Email" error={errors.email}><input className="form-input" placeholder="you@email.com" value={form.email} onChange={e=>set("email",e.target.value)} type="email" /></Field>
                  <Field label="PIN Code *" error={errors.pincode}><input className="form-input" placeholder="143001" value={form.pincode} onChange={e=>set("pincode",e.target.value)} maxLength={6} /></Field>
                </div>
                <Field label="Address *" error={errors.address}><textarea className="form-input" placeholder="House/Flat No, Street, Area" value={form.address} onChange={e=>set("address",e.target.value)} rows={2} style={{resize:"vertical"}} /></Field>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }} className="form-grid-2">
                  <Field label="Landmark"><input className="form-input" placeholder="Near SBI Bank" value={form.landmark} onChange={e=>set("landmark",e.target.value)} /></Field>
                  <Field label="City *" error={errors.city}><input className="form-input" placeholder="Amritsar" value={form.city} onChange={e=>set("city",e.target.value)} /></Field>
                  <Field label="State *" error={errors.state}>
                    <select className="form-input" value={form.state} onChange={e=>set("state",e.target.value)}>
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Type">
                    <div style={{display:"flex",gap:"12px",paddingTop:"8px"}}>
                      {["Home","Work"].map(t=>(
                        <label key={t} style={{display:"flex",alignItems:"center",gap:"6px",cursor:"pointer",fontSize:"14px"}}>
                          <input type="radio" name="addrType" checked={form.addressType===t} onChange={()=>set("addressType",t)} />
                          {t==="Home"?"🏠":"🏢"} {t}
                        </label>
                      ))}
                    </div>
                  </Field>
                </div>
                <button onClick={goPayment} style={btnStyle("var(--rz-orange)")}>Continue to Payment →</button>
              </Section>
            )}

            {/* STEP 2 */}
            {step===2 && (
              <Section title="💳 Payment Method">
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  {PAYMENT_METHODS.map(m=>(
                    <label key={m.id} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"12px 16px", borderRadius:"var(--r-md)", border: paymentMethod===m.id?"2px solid var(--rz-orange)":"2px solid var(--rz-border-lt)", background: paymentMethod===m.id?"#fff8ec":"#fff", cursor:"pointer" }}>
                      <input type="radio" name="payment" checked={paymentMethod===m.id} onChange={()=>setPaymentMethod(m.id)} />
                      <span style={{fontSize:"20px"}}>{m.icon}</span>
                      <span style={{fontSize:"14px",fontWeight:paymentMethod===m.id?600:400}}>{m.label}</span>
                    </label>
                  ))}
                </div>
                <div style={{ display:"flex", gap:"10px", marginTop:"18px", flexWrap:"wrap" }}>
                  <button onClick={()=>setStep(1)} style={btnStyle("#fff","var(--rz-text)","var(--rz-border)")}>← Back</button>
                  <button onClick={()=>{setStep(3);window.scrollTo({top:0,behavior:"smooth"})}} style={btnStyle("var(--rz-orange)")}>Review Order →</button>
                </div>
              </Section>
            )}

            {/* STEP 3 */}
            {step===3 && (
              <Section title="📋 Review Order">
                <div style={{background:"var(--rz-bg)",borderRadius:"var(--r-md)",padding:"14px",marginBottom:"12px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
                    <div>
                      <div style={{fontSize:"12px",fontWeight:700,color:"var(--rz-text-lt)",textTransform:"uppercase",marginBottom:"4px"}}>Delivering to</div>
                      <div style={{fontWeight:700}}>{form.fullName}</div>
                      <div style={{fontSize:"13px",color:"var(--rz-text-md)"}}>{form.address}, {form.city}, {form.state} – {form.pincode}</div>
                      <div style={{fontSize:"12px",color:"var(--rz-text-lt)"}}>📞 {form.mobile}</div>
                    </div>
                    <button onClick={()=>setStep(1)} style={{fontSize:"12px",color:"var(--rz-teal)",textDecoration:"underline",cursor:"pointer",background:"none",border:"none"}}>Change</button>
                  </div>
                </div>
                <div style={{background:"var(--rz-bg)",borderRadius:"var(--r-md)",padding:"14px",marginBottom:"16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:"12px",fontWeight:700,color:"var(--rz-text-lt)",textTransform:"uppercase",marginBottom:"4px"}}>Payment</div>
                      <div style={{fontWeight:600}}>{PAYMENT_METHODS.find(m=>m.id===paymentMethod)?.icon} {PAYMENT_METHODS.find(m=>m.id===paymentMethod)?.label}</div>
                    </div>
                    <button onClick={()=>setStep(2)} style={{fontSize:"12px",color:"var(--rz-teal)",textDecoration:"underline",cursor:"pointer",background:"none",border:"none"}}>Change</button>
                  </div>
                </div>
                {finalItems.map(item=>(
                  <div key={item.id} style={{display:"flex",gap:"12px",padding:"10px 0",borderBottom:"1px solid var(--rz-border-lt)",alignItems:"center"}}>
                    <img src={item.image} alt="" style={{width:"48px",height:"48px",objectFit:"cover",borderRadius:"var(--r-sm)",border:"1px solid var(--rz-border-lt)"}} onError={e=>e.target.src="https://via.placeholder.com/48"} />
                    <div style={{flex:1}}>
                      <div style={{fontSize:"13px",fontWeight:500}}>{item.name}</div>
                      <div style={{fontSize:"12px",color:"var(--rz-text-lt)"}}>Qty: {item.quantity || 1}</div>
                    </div>
                    <div style={{fontFamily:"var(--font-head)",fontWeight:700}}>₹{(item.price * (item.quantity || 1)).toLocaleString()}</div>
                  </div>
                ))}
                <div style={{display:"flex",gap:"10px",marginTop:"20px",flexWrap:"wrap"}}>
                  <button onClick={()=>setStep(2)} style={btnStyle("#fff","var(--rz-text)","var(--rz-border)")}>← Back</button>
                  <button onClick={placeOrder} disabled={placing}
                    style={{...btnStyle(placing?"#aaa":"linear-gradient(to bottom,#f0ac00,#e47911)"),color:"#fff",border:"1px solid #c07600",display:"flex",alignItems:"center",gap:"8px",cursor:placing?"not-allowed":"pointer"}}>
                    {placing?<><span className="spinner" style={{width:"14px",height:"14px",borderWidth:"2px"}} /> Placing…</>:"🎉 Place Order"}
                  </button>
                </div>
              </Section>
            )}
          </div>

          {/* Summary sidebar */}
          <div style={{ background:"#fff", border:"1px solid var(--rz-border-lt)", borderRadius:"var(--r-lg)", padding:"18px", position:"sticky", top:"80px" }}>
  <h3 style={{fontFamily:"var(--font-head)",fontSize:"16px",fontWeight:700,marginBottom:"12px"}}>Order Summary</h3>
  
  <div style={{maxHeight:"220px",overflowY:"auto",marginBottom:"12px",display:"flex",flexDirection:"column",gap:"8px"}}>
    {finalItems.map(i=>(
      <div key={i.id} style={{display:"flex",gap:"8px",alignItems:"center"}}>
        <img src={i.image} alt="" style={{width:"36px",height:"36px",objectFit:"cover",borderRadius:"4px",flexShrink:0}} onError={e=>e.target.src="https://via.placeholder.com/36"} />
        <div style={{flex:1,fontSize:"12px",color:"var(--rz-text-md)"}}>{i.name.slice(0,30)}{i.name.length>30?"…":""} ×{i.quantity || 1}</div>
        <div style={{fontSize:"13px",fontWeight:600,flexShrink:0}}>₹{(i.price*(i.quantity || 1)).toLocaleString()}</div>
      </div>
    ))}
  </div>

  <div style={{borderTop:"1px solid var(--rz-border-lt)",paddingTop:"10px",display:"flex",flexDirection:"column",gap:"8px"}}>
    {/* Show MRP if there is a discount */}
    {displayDiscount > 0 && (
      <SRow label="Total MRP" value={`₹${displayMRP.toLocaleString()}`} />
    )}
    
    <SRow label={`Subtotal (${displayCount})`} value={`₹${displaySubtotal.toLocaleString()}`} />
    <SRow label="Delivery" value={displayDelivery===0?<span style={{color:"var(--rz-green)"}}>FREE</span>:`₹${displayDelivery}`} />
    
    {/* Highlight the Discount in Green */}
    {displayDiscount > 0 && (
      <SRow label="Discount" value={<span style={{color:"var(--rz-green)"}}>- ₹{displayDiscount.toLocaleString()}</span>} />
    )}

    <div style={{display:"flex",justifyContent:"space-between",paddingTop:"8px",borderTop:"1px solid var(--rz-border-lt)"}}>
      <span style={{fontWeight:700}}>Total</span>
      <span style={{fontFamily:"var(--font-head)",fontWeight:800,fontSize:"18px", color:"var(--rz-red)"}}>₹{displayTotal.toLocaleString()}</span>
    </div>
    
    {displayDiscount > 0 && (
      <div style={{ fontSize: "12px", color: "var(--rz-green)", fontWeight: 600, textAlign: "right", marginTop: "4px" }}>
        You will save ₹{displayDiscount.toLocaleString()} on this order
      </div>
    )}
  </div>
</div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
          .form-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const btnStyle = (bg, color="#111", border="transparent") => ({
  padding: "11px 24px", background: bg, color, border: `1px solid ${border}`,
  borderRadius: "var(--r-sm)", fontSize: "14px", fontWeight: 700,
  cursor: "pointer", fontFamily: "var(--font-head)"
});

function Section({ title, children }) {
  return (
    <div style={{ background:"#fff", border:"1px solid var(--rz-border-lt)", borderRadius:"var(--r-lg)", padding:"20px", marginBottom:"14px" }}>
      <h2 style={{ fontFamily:"var(--font-head)", fontSize:"17px", fontWeight:700, marginBottom:"18px" }}>{title}</h2>
      {children}
    </div>
  );
}
function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom:"4px" }}>
      <label style={{ display:"block", fontSize:"13px", fontWeight:500, color:"var(--rz-text-md)", marginBottom:"5px" }}>{label}</label>
      {children}
      {error && <div style={{ fontSize:"12px", color:"var(--rz-red)", marginTop:"3px" }}>{error}</div>}
    </div>
  );
}
function SRow({ label, value }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", fontSize:"13px" }}>
      <span style={{ color:"var(--rz-text-md)" }}>{label}</span>
      <span style={{ fontWeight:500 }}>{value}</span>
    </div>
  );
                      }
