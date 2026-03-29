# Ramazone 2.0 🛒

> A production-ready, full-stack Amazon-clone e-commerce platform built as a monorepo for the Scaler AI Labs SDE Intern Assignment.

**Live Demo →** [ramazone20.vercel.app](https://ramazone20.vercel.app)

---

## 📁 Repository Structure

```
RAMAZONE/
├── ramazone2/                  # React Frontend (Vite SPA)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProductCard, AvengerChat, Toast
│   │   ├── pages/              # Home, ProductDetail, Cart, Checkout, OrderConfirmation
│   │   ├── context/            # CartContext (global state + API sync)
│   │   └── App.jsx             # Root with React Router v6
│   ├── .env                    # VITE_API_BASE_URL, VITE_AVENGER_URL
│   └── package.json
│
├── controllers/                # Express controller logic
│   ├── productController.js    # GET products, GET by ID, search, related
│   ├── cartController.js       # Add, get, update, remove cart items
│   └── orderController.js     # Place order, get order by ID
│
├── routes/                     # Express route definitions
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
│
├── config/
│   └── db.js                   # PostgreSQL pool (via pg + DATABASE_URL)
│
├── avenger/                    # Python AI Chatbot Microservice
│   ├── main.py                 # Flask app with 20+ intent patterns
│   ├── requirements.txt        # flask, flask-cors, gunicorn
│   ├── Procfile                # Render start command
│   └── runtime.txt             # python-3.11.9
│
├── server.js                   # Express entry point
├── package.json                # Backend dependencies
└── README.md
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, React Router v6, Context API |
| Styling | Custom CSS (no UI framework), CSS Variables, Responsive |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Render managed), `pg` driver |
| AI Chatbot | Python, Flask, Flask-CORS, Gunicorn |
| Deployment | Vercel (frontend), Render (backend + chatbot) |

---

## ✨ Features

### Core (Required)
- **Product Listing** — Grid layout, search with autocomplete, category filter, sort (price, rating, newest), paginated Load More (12 per page)
- **Product Detail** — Image carousel, description, specs table, stock status, related products
- **Shopping Cart** — Add/remove/update quantity, savings calculation, free delivery threshold (₹499+)
- **Checkout** — 3-step wizard (Address → Payment → Review), full form validation with Indian states
- **Order Confirmation** — Unique Order ID, confetti animation, itemised receipt

### Bonus
- **Responsive UI** — Mobile hamburger drawer, adaptive grid, works on all screen sizes
- **Wishlist** — Add/remove with localStorage persistence
- **Avenger AI Chatbot** — Floating assistant with 20+ shopping intents, suggestion chips, typing indicator
- **Broken Image Filtering** — Cards with failed images are automatically hidden
- **Optimistic UI** — Cart updates instantly without waiting for API

---

## 🗄️ Database Schema

**5 tables:** `products`, `categories`, `cart`, `orders`, `order_items`

```sql
-- Key relationships
products.category_id → categories.id
cart.product_id      → products.id
order_items.order_id → orders.id
order_items.product_id → products.id
```

Products table fields: `id`, `name`, `description`, `price`, `stock`, `category_id`, `image_url`, `original_price`, `rating`, `review_count`, `badge`, `brand`

---

## 🔧 Local Setup

### Prerequisites
- Node.js v18+
- Python 3.11+
- PostgreSQL running locally

### 1. Clone the repo
```bash
git clone https://github.com/Raghav1675/Ramazone.git
cd Ramazone
```

### 2. Backend setup
```bash
npm install
```

Create `.env` in root:
```env
PORT=8000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ramazone
```

```bash
npm run dev        # starts Express on port 8000
```

### 3. Frontend setup
```bash
cd ramazone2
npm install
```

Create `.env` in `ramazone2/`:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_AVENGER_URL=http://localhost:8001
```

```bash
npm run dev        # starts Vite on port 3000
```

### 4. Avenger chatbot setup
```bash
cd avenger
pip install -r requirements.txt
gunicorn main:app --bind 0.0.0.0:8001
```

---

## 🌐 Deployed Services

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | [ramazone20.vercel.app](https://ramazone20.vercel.app) |
| Backend API | Render | `https://ramazone-api.onrender.com` |
| Avenger Bot | Render | `https://avenger-ramazone.onrender.com` |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (search, category, sort, limit, offset) |
| GET | `/api/products/:id` | Single product detail |
| GET | `/api/products/:id/related` | Related products |
| GET | `/api/categories` | All categories |
| GET | `/api/cart` | Get cart items |
| POST | `/api/cart` | Add to cart |
| PUT | `/api/cart` | Update quantity |
| DELETE | `/api/cart/:product_id` | Remove item |
| POST | `/api/orders` | Place order |
| GET | `/api/orders/:id` | Get order by ID |
| POST | `/chat` | Avenger AI response (chatbot service) |

---

## 👨‍💻 Author

**Raghav Gupta**
Engineering Student — Chandigarh University

[![GitHub](https://img.shields.io/badge/GitHub-Raghav1675-black?logo=github)](https://github.com/Raghav1675)
