# Ramazone 2.0 — Backend API Specification

This document describes every API endpoint the frontend requires,
the request/response shapes, and the full database schema.

---

## Base URL

```
http://localhost:8000/api
```

All responses return JSON. Authentication: assume a default user
(`user_id = 1`) is logged in via a session or JWT header.

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 1. PRODUCTS
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### GET /api/products

List products with optional filters, sorting, and pagination.

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | string | — | Filter by category name |
| `search` | string | — | Search in name, brand, description |
| `sort` | string | `featured` | `price_asc`, `price_desc`, `rating`, `newest` |
| `page` | int | `1` | Page number |
| `limit` | int | `20` | Items per page (max 50) |
| `min_price` | number | — | Minimum price filter |
| `max_price` | number | — | Maximum price filter |

**Response 200:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Apple AirPods Pro (2nd Generation)",
      "price": 18999,
      "original_price": 24999,
      "category": "Electronics",
      "brand": "Apple",
      "rating": 4.8,
      "review_count": 12847,
      "stock": 15,
      "badge": "Best Seller",
      "image": "https://cdn.ramazone.com/products/1/main.jpg",
      "images": [
        "https://cdn.ramazone.com/products/1/img1.jpg",
        "https://cdn.ramazone.com/products/1/img2.jpg"
      ],
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 120,
  "page": 1,
  "limit": 20,
  "pages": 6
}
```

---

### GET /api/products/:id

Get full product details including description, features, and specs.

**Response 200:**
```json
{
  "id": 1,
  "name": "Apple AirPods Pro (2nd Generation)",
  "price": 18999,
  "original_price": 24999,
  "category": "Electronics",
  "brand": "Apple",
  "rating": 4.8,
  "review_count": 12847,
  "stock": 15,
  "badge": "Best Seller",
  "description": "Experience next-level Active Noise Cancellation...",
  "features": [
    "Active Noise Cancellation reduces unwanted background noise",
    "Adaptive Transparency"
  ],
  "specs": {
    "Connectivity": "Bluetooth 5.3",
    "Weight": "5.3g per earbud",
    "Chip": "Apple H2",
    "Water Resistance": "IPX4"
  },
  "image": "https://cdn.ramazone.com/products/1/main.jpg",
  "images": [
    "https://cdn.ramazone.com/products/1/img1.jpg",
    "https://cdn.ramazone.com/products/1/img2.jpg"
  ],
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Response 404:**
```json
{ "error": "Product not found" }
```

---

### GET /api/products/search

Autocomplete / full search.

**Query Params:** `q` (required), `limit` (default 10)

**Response 200:**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Apple AirPods Pro",
      "price": 18999,
      "category": "Electronics",
      "image": "https://..."
    }
  ]
}
```

---

### GET /api/products/:id/related

Products in the same category, excluding current product.

**Query Params:** `limit` (default 4)

**Response 200:** Same shape as `GET /api/products` (without pagination)

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 2. CATEGORIES
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### GET /api/categories

**Response 200:**
```json
{
  "categories": [
    { "id": 1, "name": "Electronics", "product_count": 45 },
    { "id": 2, "name": "Clothing", "product_count": 32 },
    { "id": 3, "name": "Books", "product_count": 28 },
    { "id": 4, "name": "Home & Kitchen", "product_count": 25 },
    { "id": 5, "name": "Sports", "product_count": 18 },
    { "id": 6, "name": "Beauty", "product_count": 20 }
  ]
}
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 3. CART
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> Note: The current frontend stores cart in localStorage.
> When you add backend auth, replace localStorage with these endpoints.

### GET /api/cart

Fetch the current user's cart.

**Response 200:**
```json
{
  "cart_id": 42,
  "user_id": 1,
  "items": [
    {
      "cart_item_id": 101,
      "product_id": 1,
      "product_name": "Apple AirPods Pro",
      "price": 18999,
      "original_price": 24999,
      "image": "https://...",
      "quantity": 2,
      "stock": 15,
      "subtotal": 37998
    }
  ],
  "subtotal": 37998,
  "delivery_charge": 0,
  "total": 37998,
  "item_count": 2
}
```

---

### POST /api/cart

Add a product to the cart. If product already in cart, increments quantity.

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 1
}
```

**Response 201:**
```json
{
  "message": "Item added to cart",
  "cart_item_id": 101,
  "quantity": 2
}
```

**Response 400:**
```json
{ "error": "Insufficient stock. Only 1 item left." }
```

---

### PATCH /api/cart/:cartItemId

Update quantity of a cart item.

**Request Body:**
```json
{ "quantity": 3 }
```

**Response 200:**
```json
{
  "message": "Quantity updated",
  "cart_item_id": 101,
  "quantity": 3,
  "subtotal": 56997
}
```

---

### DELETE /api/cart/:cartItemId

Remove an item from the cart.

**Response 200:**
```json
{ "message": "Item removed from cart" }
```

---

### DELETE /api/cart

Clear the entire cart (called after order placement).

**Response 200:**
```json
{ "message": "Cart cleared" }
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 4. ORDERS
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### POST /api/orders

Place an order. This should:
1. Validate stock availability for all items
2. Create the order record
3. Create order_items records
4. Decrement product stock
5. Clear the cart
6. Return the order ID

**Request Body:**
```json
{
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 5, "quantity": 1 }
  ],
  "shipping_address": {
    "full_name": "Ramesh Kumar",
    "mobile": "9876543210",
    "email": "ramesh@example.com",
    "address_line1": "B-12, Green Park, Near City Mall",
    "landmark": "Near SBI Bank",
    "city": "Amritsar",
    "state": "Punjab",
    "pincode": "143001",
    "address_type": "Home"
  },
  "payment_method": "upi"
}
```

**Response 201:**
```json
{
  "order_id": "RZ12345678",
  "status": "confirmed",
  "total": 56997,
  "delivery_charge": 0,
  "estimated_delivery": "2026-04-01",
  "message": "Order placed successfully"
}
```

**Response 400 (stock issue):**
```json
{
  "error": "Insufficient stock",
  "product_id": 1,
  "available": 1,
  "requested": 2
}
```

---

### GET /api/orders/:orderId

Get full order details (for confirmation page & order history).

**Response 200:**
```json
{
  "order_id": "RZ12345678",
  "user_id": 1,
  "status": "confirmed",
  "payment_method": "upi",
  "payment_status": "paid",
  "items": [
    {
      "product_id": 1,
      "product_name": "Apple AirPods Pro",
      "image": "https://...",
      "price": 18999,
      "quantity": 2,
      "subtotal": 37998
    }
  ],
  "shipping_address": {
    "full_name": "Ramesh Kumar",
    "address_line1": "B-12, Green Park",
    "city": "Amritsar",
    "state": "Punjab",
    "pincode": "143001",
    "mobile": "9876543210"
  },
  "subtotal": 37998,
  "delivery_charge": 0,
  "total": 37998,
  "estimated_delivery": "2026-04-01",
  "created_at": "2026-03-29T10:30:00Z"
}
```

---

### GET /api/orders

Get order history for the current user.

**Query Params:** `page` (default 1), `limit` (default 10)

**Response 200:**
```json
{
  "orders": [
    {
      "order_id": "RZ12345678",
      "status": "delivered",
      "total": 37998,
      "item_count": 2,
      "created_at": "2026-03-29T10:30:00Z"
    }
  ],
  "total": 5,
  "page": 1
}
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 5. WISHLIST (Bonus)
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### GET /api/wishlist
### POST /api/wishlist         → body: `{ "product_id": 1 }`
### DELETE /api/wishlist/:productId

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## DATABASE SCHEMA (PostgreSQL / MySQL)
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```sql
-- ─── USERS ───────────────────────────────────────────────
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  mobile        VARCHAR(15),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default user for the assignment (no-login mode)
INSERT INTO users (id, name, email) VALUES (1, 'Default User', 'user@ramazone.com');


-- ─── CATEGORIES ──────────────────────────────────────────
CREATE TABLE categories (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(80) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name) VALUES
  ('Electronics'), ('Clothing'), ('Books'),
  ('Home & Kitchen'), ('Sports'), ('Beauty');


-- ─── PRODUCTS ────────────────────────────────────────────
CREATE TABLE products (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(300) NOT NULL,
  description    TEXT,
  price          NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  category_id    INT REFERENCES categories(id) ON DELETE SET NULL,
  brand          VARCHAR(100),
  stock          INT NOT NULL DEFAULT 0,
  badge          VARCHAR(80),
  rating         NUMERIC(2,1) DEFAULT 0,
  review_count   INT DEFAULT 0,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── PRODUCT IMAGES ──────────────────────────────────────
CREATE TABLE product_images (
  id         SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0
);

-- ─── PRODUCT SPECS ───────────────────────────────────────
CREATE TABLE product_specs (
  id         SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  spec_key   VARCHAR(100) NOT NULL,
  spec_value VARCHAR(300) NOT NULL
);

-- ─── PRODUCT FEATURES ────────────────────────────────────
CREATE TABLE product_features (
  id          SERIAL PRIMARY KEY,
  product_id  INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  feature     TEXT NOT NULL,
  sort_order  INT DEFAULT 0
);


-- ─── CARTS ───────────────────────────────────────────────
CREATE TABLE carts (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id)   -- one cart per user
);

-- ─── CART ITEMS ──────────────────────────────────────────
CREATE TABLE cart_items (
  id         SERIAL PRIMARY KEY,
  cart_id    INT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INT NOT NULL DEFAULT 1 CHECK (quantity >= 1 AND quantity <= 10),
  added_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (cart_id, product_id)
);


-- ─── ORDERS ──────────────────────────────────────────────
CREATE TABLE orders (
  id                 VARCHAR(20) PRIMARY KEY,   -- e.g. RZ12345678
  user_id            INT NOT NULL REFERENCES users(id),
  status             VARCHAR(30) DEFAULT 'confirmed',
                     -- confirmed | processing | shipped | out_for_delivery | delivered | cancelled
  payment_method     VARCHAR(30) NOT NULL,      -- upi | card | netbanking | cod
  payment_status     VARCHAR(20) DEFAULT 'pending', -- pending | paid | failed
  subtotal           NUMERIC(12,2) NOT NULL,
  delivery_charge    NUMERIC(8,2) DEFAULT 0,
  total              NUMERIC(12,2) NOT NULL,
  estimated_delivery DATE,
  created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── ORDER ITEMS ─────────────────────────────────────────
CREATE TABLE order_items (
  id           SERIAL PRIMARY KEY,
  order_id     VARCHAR(20) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   INT REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(300) NOT NULL,   -- snapshot at time of order
  product_image TEXT,
  price        NUMERIC(10,2) NOT NULL,  -- price at time of order
  quantity     INT NOT NULL,
  subtotal     NUMERIC(12,2) NOT NULL
);

-- ─── SHIPPING ADDRESSES ──────────────────────────────────
CREATE TABLE shipping_addresses (
  id           SERIAL PRIMARY KEY,
  order_id     VARCHAR(20) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  full_name    VARCHAR(100) NOT NULL,
  mobile       VARCHAR(15) NOT NULL,
  email        VARCHAR(150),
  address_line1 TEXT NOT NULL,
  landmark     VARCHAR(200),
  city         VARCHAR(80) NOT NULL,
  state        VARCHAR(80) NOT NULL,
  pincode      VARCHAR(10) NOT NULL,
  address_type VARCHAR(20) DEFAULT 'Home'
);


-- ─── WISHLIST ────────────────────────────────────────────
CREATE TABLE wishlist_items (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, product_id)
);


-- ─── INDEXES ─────────────────────────────────────────────
CREATE INDEX idx_products_category  ON products(category_id);
CREATE INDEX idx_products_price     ON products(price);
CREATE INDEX idx_products_rating    ON products(rating);
CREATE INDEX idx_products_name      ON products USING gin(to_tsvector('english', name));
CREATE INDEX idx_cart_items_cart    ON cart_items(cart_id);
CREATE INDEX idx_order_items_order  ON order_items(order_id);
CREATE INDEX idx_orders_user        ON orders(user_id);
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ERROR RESPONSE FORMAT
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All errors follow this shape:
```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

| HTTP Code | Meaning |
|-----------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 409 | Conflict (e.g. duplicate) |
| 500 | Internal Server Error |

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ENVIRONMENT VARIABLES (Backend)
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/ramazone
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ramazone
DB_USER=postgres
DB_PASSWORD=your_password

# App
PORT=8000
NODE_ENV=development
DEFAULT_USER_ID=1

# Frontend
FRONTEND_URL=http://localhost:3000

# Optional: Email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## SEED DATA
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Seed at least 20 products across all 6 categories.
The frontend mock data in `src/data/products.js` has exactly these 20 products —
use that as your seed reference to ensure product IDs match.

```sql
-- Example seed (abbreviated):
INSERT INTO products (name, description, price, original_price, category_id, brand, stock, badge, rating, review_count)
VALUES
  ('Apple AirPods Pro (2nd Generation)', '...', 18999, 24999, 1, 'Apple', 15, 'Best Seller', 4.8, 12847),
  ('Sony WH-1000XM5 Wireless Headphones', '...', 24990, 34990, 1, 'Sony', 8, 'Deal of the Day', 4.7, 8923),
  -- ... rest of the 20 products
  ;
```
