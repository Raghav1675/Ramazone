from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

# ─── Intent rules ─────────────────────────────────────────────────────────────
INTENTS = [
    (
        r"hello|hi|hey|namaste|hola|good morning|good evening",
        "Hey there! 👋 I'm **Avenger**, your Ramazone 2.0 shopping assistant!\n\nAsk me anything — products, deals, gifts, orders, comparisons. What are you looking for today?",
        ["Show me today's deals", "I want to buy a phone", "Gift ideas", "Track my order"]
    ),
    (
        r"who are you|what are you|your name|introduce yourself",
        "I'm **Avenger** 🛡️ – Ramazone 2.0's AI shopping assistant! I can help you:\n- 🔍 Find the right product\n- 💰 Compare prices & deals\n- 📦 Track your orders\n- 🎁 Get gift recommendations\n\nWhat can I help you with?",
        ["Find me a product", "Show deals", "Track my order"]
    ),
    (
        r"phone|mobile|smartphone|iphone|samsung|oneplus|pixel",
        "📱 Smartphone guide:\n\n**Budget (under ₹15,000):** Redmi Note 13, Realme 12\n**Mid-range (₹15k–₹35k):** OnePlus Nord 4, Samsung Galaxy A55\n**Premium (₹35k+):** iPhone 15, Samsung S24, Pixel 8\n\nWhat's your budget and main use — camera, gaming, or everyday use?",
        ["Under ₹15,000", "Best camera phone", "Gaming phone", "iPhone vs Android"]
    ),
    (
        r"laptop|macbook|computer|pc|notebook",
        "💻 Laptop guide:\n\n**Students:** Acer Aspire, HP 15s – great value\n**Professionals:** MacBook Air M2, Dell XPS 13 – premium build\n**Gamers:** ASUS ROG, Lenovo Legion – powerful GPUs\n**Budget:** Lenovo IdeaPad, HP 14s – under ₹35,000\n\nWhat will you mainly use it for?",
        ["For college", "For gaming", "For video editing", "Under ₹40,000"]
    ),
    (
        r"headphone|earphone|earbud|airpod|speaker|audio",
        "🎧 Audio guide:\n\n**True Wireless:** Apple AirPods Pro, Sony WF-1000XM5, boAt Airdopes\n**Over-ear:** Sony WH-1000XM5 (best ANC), Bose QC45\n**Budget (under ₹2,000):** boAt Rockerz, JBL Tune\n\nDo you want noise cancellation, or is this for gym/sports use?",
        ["With noise cancellation", "For gym", "Under ₹2,000", "For calls"]
    ),
    (
        r"tv|television|smart tv|oled|qled",
        "📺 Smart TV guide:\n\n**32 inch:** Bedrooms – Samsung, Mi, TCL\n**43–50 inch:** Living room – LG, Sony, OnePlus\n**55+ inch:** Cinematic – Samsung QLED, LG OLED\n\n**Must-have:** 4K, HDR10+, 60Hz+\n\nWhat size and budget?",
        ["Under ₹20,000", "55 inch 4K", "Best picture quality", "For gaming"]
    ),
    (
        r"watch|smartwatch|fitness band|fitbit|apple watch|garmin",
        "⌚ Smartwatch guide:\n\n**Apple Watch Series 9** – Best for iPhone users\n**Samsung Galaxy Watch 6** – Top Android pick\n**Garmin Forerunner** – Serious fitness tracking\n**Budget (under ₹3,000):** Noise, Fire-Boltt, boAt\n\nFitness tracking, notifications, or style?",
        ["Fitness tracking", "Under ₹3,000", "Best for iPhone", "Stylish watches"]
    ),
    (
        r"camera|dslr|mirrorless|gopro|photography",
        "📷 Camera guide:\n\n**Beginner DSLR:** Canon 1500D, Nikon D3500\n**Mirrorless:** Sony Alpha ZV-E10, Fujifilm X-T30\n**Action cam:** GoPro Hero 12, DJI Osmo Action 4\n**Best mobile camera:** Pixel 8, iPhone 15 Pro\n\nTravel, portraits, or vlogging?",
        ["Best for vlogging", "Under ₹30,000", "Action camera", "Portrait photography"]
    ),
    (
        r"book|novel|fiction|non.?fiction|self help|biography",
        "📚 Book picks:\n\n**Self-help:** Atomic Habits, Psychology of Money, Deep Work\n**Fiction:** The Alchemist, Ikigai, Midnight Library\n**Business:** Zero to One, The Lean Startup\n**Tech:** Clean Code, Pragmatic Programmer\n\nAny specific genre or author?",
        ["Self-help books", "Best fiction", "Tech books", "Gift a book"]
    ),
    (
        r"gift|present|birthday|anniversary|wedding|surprise",
        "🎁 Gift guide by budget:\n\n**Under ₹500:** Books, skincare, accessories\n**₹500–₹2,000:** Headphones, perfume, gadgets\n**₹2,000+:** Smartwatch, handbag, premium gear\n\nWho's it for? (partner, parent, friend, colleague)",
        ["Gift for girlfriend", "Gift for parents", "Gift under ₹1,000", "Tech gifts"]
    ),
    (
        r"shoe|sneaker|nike|adidas|running shoe|footwear",
        "👟 Shoe guide:\n\n**Running:** Nike Air Max, Adidas Ultraboost, ASICS\n**Casual:** Nike Air Force 1, Adidas Stan Smith\n**Budget (under ₹1,500):** Campus, HRX, Sparx\n**Formal:** Clarks, Red Tape, Bata\n\nOccasion — sports, casual, or office?",
        ["For running", "Casual wear", "Under ₹2,000", "Formal shoes"]
    ),
    (
        r"kitchen|cookware|mixer|pressure cooker|air fryer|microwave",
        "🍳 Kitchen guide:\n\n**Pressure Cooker:** Prestige, Hawkins\n**Mixer Grinder:** Preethi, Bajaj – 750W+\n**Microwave:** Samsung, LG – 25L\n**Trending:** Philips Air Fryer, Instant Pot\n\nWhat are you looking for?",
        ["Best air fryer", "Mixer under ₹3,000", "Microwave oven", "Pressure cooker"]
    ),
    (
        r"cloth|shirt|dress|jeans|kurta|saree|fashion|outfit",
        "👗 Fashion on Ramazone:\n\n**Men:** Levi's, Allen Solly for formal; H&M for casual\n**Women:** FabAlley, W, Biba for ethnic; Vero Moda for western\n**Kids:** H&M, United Colors of Benetton\n\nOccasion — casual, formal, festive, or sport?",
        ["Men's formal", "Women's ethnic", "Casual outfits", "Sportswear"]
    ),
    (
        r"deal|offer|discount|sale|cheap|budget|affordable",
        "💰 Best deal tips on Ramazone:\n\n🔖 Check badges – 'Deal of Day', 'Best Seller'\n⭐ Filter by rating – 4+ stars = best value\n📦 Free delivery – orders above ₹499\n🔔 Wishlist items – prices drop regularly!\n\nWhich category deals?",
        ["Electronics deals", "Clothing sale", "Kitchen offers", "Books under ₹299"]
    ),
    (
        r"return|refund|cancel|replace|exchange|damaged",
        "📦 Return policy:\n\n✅ 30-day easy returns on most items\n✅ Free pickup for eligible returns\n✅ Refund in 3–5 business days\n\n**How to return:**\n1. Orders → Select item → Request Return\n2. Choose reason\n3. Schedule pickup\n\nNeed help with a specific order?",
        ["Track my return", "Refund status", "Exchange product"]
    ),
    (
        r"delivery|shipping|track|order status|when.*arrive",
        "🚚 Delivery info:\n\n📍 Standard: 3–5 business days\n⚡ Express: 1–2 days (select items)\n🆓 FREE delivery on orders above ₹499\n\n**Track your order:**\nProfile → Orders → Select → Track\n\nGot an order ID?",
        ["Track order", "Express delivery", "Change address"]
    ),
    (
        r"payment|pay|upi|card|cod|cash|emi|wallet",
        "💳 Payment options:\n\n📱 UPI – PhonePe, GPay, Paytm\n💳 Cards – Visa, Mastercard, Rupay\n🏦 Net Banking – all major banks\n💵 Cash on Delivery – most items\n📅 No-cost EMI – orders above ₹3,000\n\nAny payment issue?",
        ["Set up UPI", "EMI options", "Cash on delivery"]
    ),
    (
        r"compare|vs|versus|which is best|which one|better",
        "🔍 Smart comparison tips:\n\n1. **Priority** – Price? Performance? Brand?\n2. **Ratings** – 4+ stars = trusted\n3. **Specs** – Don't pay for what you won't use\n4. **Warranty** – Key for electronics\n\nTell me the two products you want to compare!",
        ["iPhone vs Samsung", "Sony vs Bose", "Nike vs Adidas"]
    ),
    (
        r"thank|thanks|thank you|great|awesome|helpful|perfect",
        "You're welcome! 😊 Happy to help anytime.\n\nAnything else I can assist with — products, orders, or something else? 🛡️",
        ["Find another product", "Show me deals", "Nothing, thanks!"]
    ),
    (
        r"bye|goodbye|exit|quit|see you|take care",
        "Goodbye! 👋 Come back anytime — **Avenger** is always on guard at Ramazone 2.0! Happy shopping! 🛒✨",
        []
    ),
    (
        r"help|what can you do|features|assist",
        "Here's what I can help with:\n\n🔍 **Product Discovery** – Find the right product\n💰 **Deals & Offers** – Best prices and discounts\n📦 **Orders** – Track, return, cancel\n🎁 **Gift Ideas** – Personalised picks\n🔄 **Compare** – Side-by-side analysis\n💳 **Payments** – All methods explained\n\nJust ask naturally!",
        ["Find a product", "Today's deals", "Track my order", "Gift ideas"]
    ),
]

FALLBACK = (
    "Hmm, I'm not sure about that! 🤔 I'm Avenger, your Ramazone shopping assistant. Try asking:\n\n"
    "- 📱 'Best phone under ₹20,000'\n"
    "- 🎁 'Gift ideas for my mom'\n"
    "- 💰 'Best deals today'\n"
    "- 📦 'How to return an order'",
    ["Show me deals", "Find a phone", "Gift ideas", "Track my order"]
)

def get_response(message):
    msg = message.lower().strip()
    for pattern, reply, suggestions in INTENTS:
        if re.search(pattern, msg, re.IGNORECASE):
            return reply, suggestions
    return FALLBACK

# ─── Routes ──────────────────────────────────────────────────────────────────
@app.route("/")
def root():
    return jsonify({"status": "Avenger is live 🛡️", "version": "1.0"})

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True)
    message = data.get("message", "").strip()
    if not message:
        return jsonify({"reply": "Please say something!", "suggestions": []}), 400
    reply, suggestions = get_response(message)
    return jsonify({"reply": reply, "suggestions": suggestions})

if __name__ == "__main__":
    app.run(debug=False)
