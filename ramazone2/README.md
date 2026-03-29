# Ramazone 2.0 🛒

> A fully functional Amazon-clone e-commerce frontend built with React.js + Vite

---

## 🚀 Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## 🏗️ Tech Stack

- **React 18** + **Vite 5**
- **React Router v6** – client-side routing
- **Context API** – global cart & wishlist state
- **localStorage** – cart persistence across sessions
- **Custom CSS** – zero UI framework dependency (no Tailwind, no MUI)
- **Google Fonts** – Outfit + DM Sans

---

## 📁 Project Structure

```
src/
├── context/
│   └── CartContext.jsx       # Global cart + wishlist state
├── data/
│   └── products.js           # Mock product data (replace with API calls)
├── components/
│   ├── Navbar.jsx             # Top nav + search + cart icon
│   ├── Footer.jsx
│   ├── ProductCard.jsx        # Reusable product card
│   ├── StarRating.jsx
│   └── Toast.jsx              # Notification toasts
├── pages/
│   ├── HomePage.jsx           # Product grid + hero + filters
│   ├── ProductDetailPage.jsx  # Image carousel + buy box
│   ├── CartPage.jsx           # Cart management
│   ├── CheckoutPage.jsx       # 3-step checkout wizard
│   └── OrderConfirmationPage.jsx
├── App.jsx
├── App.css                    # Design system (CSS variables)
└── main.jsx
```

---

## 🌐 Pages & Routes

| Route | Page |
|-------|------|
| `/` | Home – product listing, search, filter, sort |
| `/product/:id` | Product Detail – carousel, specs, add to cart |
| `/cart` | Shopping Cart – qty update, remove, summary |
| `/checkout` | Checkout – 3-step (Address → Payment → Review) |
| `/order-confirmation/:orderId` | Order Confirmation with confetti |

---

## ✅ Features Implemented

### Core
- [x] Product listing grid (Amazon-style)
- [x] Search with autocomplete suggestions
- [x] Filter by category (navbar + chips)
- [x] Sort: Featured, Price ↑↓, Rating, Newest
- [x] Product detail with image carousel + navigation arrows
- [x] Product description, features list, tech specs table
- [x] Add to Cart / Buy Now buttons
- [x] Cart: add, remove, update quantity
- [x] Cart summary with subtotal, delivery, grand total
- [x] FREE delivery threshold (above ₹499)
- [x] Checkout: 3-step wizard with progress bar
- [x] Address form with Indian states + validation
- [x] Payment method selection (UPI, Card, Net Banking, COD)
- [x] Order confirmation with animated confetti + Order ID

### Bonus
- [x] Wishlist (add/remove, persisted to localStorage)
- [x] Responsive design (mobile + tablet + desktop)
- [x] Cart persisted in localStorage
- [x] Toast notifications
- [x] Breadcrumb navigation
- [x] Product badges (Best Seller, Deal of Day, etc.)
- [x] Related products section
- [x] Savings calculation in cart

---

## 🔌 Backend API Requirements

See `API_SPEC.md` for full details.

### Endpoints needed:

**Products**
- `GET /api/products` – list with filters & pagination
- `GET /api/products/:id` – single product
- `GET /api/products/search?q=` – search

**Cart**
- `GET /api/cart` – fetch cart
- `POST /api/cart` – add item
- `PATCH /api/cart/:itemId` – update qty
- `DELETE /api/cart/:itemId` – remove item

**Orders**
- `POST /api/orders` – place order
- `GET /api/orders/:orderId` – get order

**Categories**
- `GET /api/categories` – list all

---

## 🗄️ Database Schema

See `API_SPEC.md` for full schema.

---

## 🔧 Connecting to Backend

Replace the mock data in `src/data/products.js` with real API calls.

Example in `HomePage.jsx`:
```js
// Replace this:
import { PRODUCTS } from "../data/products";

// With this:
const [products, setProducts] = useState([]);
useEffect(() => {
  fetch("/api/products").then(r => r.json()).then(setProducts);
}, []);
```

Set your API base URL in `.env`:
```
VITE_API_BASE_URL=http://localhost:8000
```

Then use it in API calls:
```js
const BASE = import.meta.env.VITE_API_BASE_URL;
fetch(`${BASE}/api/products`);
```

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host.

---

## 🧑‍💻 Author

Built for Scaler AI Labs – SDE Intern Fullstack Assignment  
Frontend: **React 18 + Vite** | All code written and understood by the author.
