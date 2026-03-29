from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re

app = FastAPI(title="Avenger – Ramazone AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Request / Response models ───────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []   # [{ "role": "user"|"bot", "text": "..." }]

class ChatResponse(BaseModel):
    reply: str
    suggestions: list[str] = []

# ─── Intent rules ─────────────────────────────────────────────────────────────
INTENTS = [
    # (regex pattern, reply, follow-up suggestions)
    (
        r"hello|hi|hey|namaste|hola|good morning|good evening",
        "Hey there! 👋 I'm **Avenger**, your Ramazone 2.0 shopping assistant. I can help you find products, compare items, track orders, or answer any shopping question. What are you looking for today?",
        ["Show me today's deals", "I want to buy a phone", "Help me find gifts", "What's trending?"]
    ),
    (
        r"who are you|what are you|your name|introduce yourself",
        "I'm **Avenger** 🛡️ – Ramazone 2.0's AI shopping assistant! Think of me as your personal shopper. I can help you:\n- 🔍 Find the right product\n- 💰 Compare prices & deals\n- 📦 Track your orders\n- 🎁 Get gift recommendations\n\nWhat can I help you with?",
        ["Find me a product", "Show deals", "Track my order"]
    ),
    (
        r"phone|mobile|smartphone|iphone|samsung|oneplus|pixel",
        "📱 Great choice! Here are some tips for picking the right smartphone:\n\n**Budget (under ₹15,000):** Redmi Note 13, Realme 12\n**Mid-range (₹15k–₹35k):** OnePlus Nord 4, Samsung Galaxy A55\n**Premium (₹35k+):** iPhone 15, Samsung S24, Pixel 8\n\nWhat's your budget and main use case — camera, gaming, or everyday use?",
        ["Under ₹15,000", "Best camera phone", "Gaming phone", "iPhone vs Android"]
    ),
    (
        r"laptop|macbook|computer|pc|notebook",
        "💻 Here's a quick laptop guide:\n\n**Students:** Acer Aspire, HP 15s – great value\n**Professionals:** MacBook Air M2, Dell XPS 13 – premium build\n**Gamers:** ASUS ROG, Lenovo Legion – powerful GPUs\n**Budget picks:** Lenovo IdeaPad, HP 14s – under ₹35,000\n\nWhat will you mainly use it for?",
        ["For college", "For gaming", "For video editing", "Under ₹40,000"]
    ),
    (
        r"headphone|earphone|earbud|airpod|earphone|speaker|audio",
        "🎧 Here's my audio guide:\n\n**True Wireless (TWS):** Apple AirPods Pro, Sony WF-1000XM5, boAt Airdopes\n**Over-ear:** Sony WH-1000XM5 (best ANC), Bose QC45\n**Budget picks:** boAt Rockerz, JBL Tune – under ₹2,000\n\nDo you want noise cancellation, or is this for gym/sports use?",
        ["With noise cancellation", "For gym", "Under ₹2,000", "For calls"]
    ),
    (
        r"tv|television|smart tv|oled|qled|samsung tv|lg tv",
        "📺 Smart TV buying guide:\n\n**32 inch:** Good for bedrooms – Samsung, Mi, TCL\n**43–50 inch:** Living room sweet spot – LG, Sony, OnePlus\n**55+ inch:** Cinematic experience – Samsung QLED, LG OLED\n\n**Must-have features:** 4K, HDR10+, at least 60Hz refresh rate\n\nWhat size and budget are you looking at?",
        ["Under ₹20,000", "55 inch 4K", "Best picture quality", "For gaming"]
    ),
    (
        r"shoe|sneaker|nike|adidas|sport shoe|running shoe|footwear",
        "👟 Here's your shoe guide:\n\n**Running:** Nike Air Max, Adidas Ultraboost, ASICS Gel\n**Casual:** Nike Air Force 1, Adidas Stan Smith, Puma Suede\n**Budget:** Campus, HRX, Sparx – under ₹1,500\n**Formal:** Clarks, Red Tape, Bata\n\nWhat's the occasion — sports, casual, or office?",
        ["For running", "Casual wear", "Under ₹2,000", "Formal shoes"]
    ),
    (
        r"book|novel|fiction|non.?fiction|self help|biography|textbook",
        "📚 Some great picks by category:\n\n**Self-help:** Atomic Habits, Psychology of Money, Deep Work\n**Fiction:** The Alchemist, Ikigai, Midnight Library\n**Business:** Zero to One, The Lean Startup\n**Tech:** Clean Code, The Pragmatic Programmer\n\nAny specific genre or author in mind?",
        ["Self-help books", "Best fiction 2024", "Tech books", "Gift a book"]
    ),
    (
        r"gift|present|birthday|anniversary|wedding|surprise|someone special",
        "🎁 I love helping with gifts! Quick questions to nail it:\n\n**By budget:**\n- Under ₹500: Books, skincare, accessories\n- ₹500–₹2,000: Headphones, perfume, gadgets\n- ₹2,000+: Smartwatch, handbag, premium experiences\n\n**Who's it for?** (partner, parent, friend, colleague)",
        ["Gift for girlfriend", "Gift for parents", "Gift under ₹1,000", "Tech gifts"]
    ),
    (
        r"gift.*girl|girlfriend|wife|her|women",
        "💝 Great picks for her:\n\n**Skincare & Beauty:** L'Oréal, Lakme, The Face Shop sets\n**Accessories:** Bags, jewellery, scarves\n**Books & Journals:** Personalised notebooks, bestseller novels\n**Electronics:** Bluetooth earbuds, mini projector, Kindle\n**Experiences:** Spa vouchers, subscription boxes\n\nWhat's your budget?",
        ["Under ₹1,000", "Under ₹3,000", "Premium gift", "Jewellery"]
    ),
    (
        r"watch|smartwatch|fitness band|fitbit|apple watch|garmin",
        "⌚ Smartwatch guide:\n\n**Apple Watch Series 9** – Best for iPhone users\n**Samsung Galaxy Watch 6** – Top Android pick\n**Garmin Forerunner** – Serious fitness tracking\n**Noise, Fire-Boltt, boAt** – Budget options under ₹3,000\n\nAre you looking for fitness tracking, notifications, or style?",
        ["Fitness tracking", "Under ₹3,000", "Best for iPhone", "Stylish watches"]
    ),
    (
        r"camera|dslr|mirrorless|gopro|photography|lens",
        "📷 Camera guide for you:\n\n**Beginner DSLR:** Canon 1500D, Nikon D3500\n**Mirrorless:** Sony Alpha ZV-E10, Fujifilm X-T30\n**Action cam:** GoPro Hero 12, DJI Osmo Action 4\n**Phone upgrade:** Pixel 8, iPhone 15 Pro (best mobile cameras)\n\nWhat kind of photography — travel, portraits, or vlogging?",
        ["Best for vlogging", "Under ₹30,000", "Action camera", "Portrait photography"]
    ),
    (
        r"deal|offer|discount|sale|cheap|budget|affordable|best price",
        "💰 Here's how to get the best deals on Ramazone:\n\n🔖 **Check badges** – Look for 'Deal of Day', 'Best Seller', 'Limited Offer'\n⭐ **Filter by rating** – 4+ stars usually means best value\n📦 **Free delivery** – Orders above ₹499 ship free\n🔔 **Tip:** Add to wishlist and check back — prices fluctuate!\n\nWhich category deals are you looking for?",
        ["Electronics deals", "Clothing sale", "Kitchen offers", "Books under ₹299"]
    ),
    (
        r"return|refund|cancel|replace|exchange|damaged|wrong item",
        "📦 Ramazone return policy:\n\n✅ **30-day easy returns** on most items\n✅ **Free pickup** for eligible returns\n✅ **Instant refund** to original payment method (3–5 business days)\n\n**How to return:**\n1. Go to Orders → Select item → Request Return\n2. Choose reason\n3. Schedule pickup or drop off\n\nNeed help with a specific order?",
        ["Track my return", "Refund status", "Exchange product", "Talk to support"]
    ),
    (
        r"delivery|shipping|track|order status|when.*arrive|dispatch",
        "🚚 Delivery information:\n\n📍 **Standard delivery:** 3–5 business days\n⚡ **Express delivery:** 1–2 days (select items)\n🆓 **FREE delivery:** On orders above ₹499\n\n**Track your order:**\n→ Go to your Profile → Orders → Select order → Track\n\nDo you have a specific order ID you want to check?",
        ["Track order", "Express delivery", "Delivery to my city", "Change address"]
    ),
    (
        r"payment|pay|upi|card|cod|cash|emi|wallet",
        "💳 Payment options on Ramazone 2.0:\n\n📱 **UPI:** PhonePe, Google Pay, Paytm – instant\n💳 **Cards:** Credit/Debit – Visa, Mastercard, Rupay\n🏦 **Net Banking:** All major banks supported\n💵 **Cash on Delivery:** Available for most items\n📅 **EMI:** No-cost EMI on orders above ₹3,000\n\nAny payment issue I can help with?",
        ["Set up UPI", "EMI options", "Cash on delivery", "Card not working"]
    ),
    (
        r"compare|vs|versus|difference|better|which is best|which one",
        "🔍 Comparing products is smart shopping! Here's my approach:\n\n1. **Identify your priority** – Price? Performance? Brand?\n2. **Check ratings** – 4+ stars = trusted by buyers\n3. **Read specs** – Don't pay for features you won't use\n4. **Consider warranty** – Especially for electronics\n\nTell me the two products you want to compare and I'll help you decide! 💪",
        ["iPhone vs Samsung", "Sony vs Bose headphones", "Nike vs Adidas", "Gas vs Electric kettle"]
    ),
    (
        r"kitchen|cookware|mixer|pressure cooker|air fryer|microwave|induction",
        "🍳 Kitchen appliance guide:\n\n**Must-haves:**\n- Pressure Cooker: Prestige, Hawkins – reliable & durable\n- Mixer Grinder: Preethi, Bajaj – 750W+\n- Microwave: Samsung, LG – 25L solo or convection\n\n**Trending:** Air fryer (Philips, Instant Pot), Induction cooktop\n\nWhat are you cooking up? 😄",
        ["Best air fryer", "Mixer grinder under ₹3,000", "Microwave oven", "Pressure cooker"]
    ),
    (
        r"cloth|shirt|dress|jeans|kurta|saree|fashion|outfit|wear",
        "👗 Fashion tips on Ramazone:\n\n**Men:** Levi's, Allen Solly, Van Heusen for formal; H&M, Zara for casual\n**Women:** FabAlley, W, Biba for ethnic; AND, Vero Moda for western\n**Kids:** H&M, United Colors of Benetton\n\n**Pro tip:** Check size guides carefully and read reviews for fit!\n\nWhat's the occasion — casual, formal, festive, or sportswear?",
        ["Men's formal wear", "Women's ethnic", "Casual outfits", "Sportswear"]
    ),
    (
        r"thank|thanks|thank you|great|awesome|helpful|perfect|good",
        "You're welcome! 😊 Happy to help anytime.\n\nIs there anything else I can assist you with — finding a product, tracking an order, or something else? I'm always here! 🛡️",
        ["Find another product", "Show me deals", "Nothing, thanks!"]
    ),
    (
        r"bye|goodbye|exit|quit|see you|cya|take care",
        "Goodbye! 👋 It was great helping you. Come back anytime — **Avenger** is always on guard at Ramazone 2.0! Happy shopping! 🛒✨",
        []
    ),
    (
        r"help|what can you do|features|assist",
        "Here's what I can help you with:\n\n🔍 **Product Discovery** – Find the right product for your needs\n💰 **Deals & Offers** – Best prices, discounts, and sales\n📦 **Orders** – Track, return, or cancel orders\n🎁 **Gift Ideas** – Personalised recommendations\n🔄 **Compare Products** – Side-by-side analysis\n💳 **Payments** – All payment methods explained\n\nJust ask naturally — like 'I need a phone under ₹20,000' or 'best gift for my dad'!",
        ["Find a product", "Today's deals", "Track my order", "Gift ideas"]
    ),
]

FALLBACK = (
    "Hmm, I'm not sure I caught that! 🤔 I'm Avenger, your Ramazone shopping assistant. You can ask me about:\n\n"
    "- 📱 **Products** – phones, laptops, headphones, clothes…\n"
    "- 💰 **Deals** – best prices and offers\n"
    "- 📦 **Orders** – tracking, returns, delivery\n"
    "- 🎁 **Gifts** – personalised recommendations\n\n"
    "Try asking: *'Best phone under ₹20,000'* or *'I want a gift for my mom'*",
    ["Show me deals", "Find a phone", "Gift ideas", "Track my order"]
)

# ─── Core matching logic ──────────────────────────────────────────────────────
def get_response(message: str) -> tuple[str, list[str]]:
    msg = message.lower().strip()

    for pattern, reply, suggestions in INTENTS:
        if re.search(pattern, msg, re.IGNORECASE):
            return reply, suggestions

    return FALLBACK

# ─── API endpoint ─────────────────────────────────────────────────────────────
@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    reply, suggestions = get_response(req.message)
    return ChatResponse(reply=reply, suggestions=suggestions)

@app.get("/")
async def root():
    return {"status": "Avenger is live 🛡️", "version": "1.0"}

@app.get("/health")
async def health():
    return {"status": "ok"}
