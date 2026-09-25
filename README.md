# 📚 Online Book Store

A full-stack, server-side rendered (SSR) online bookstore application built with Node.js, Express, MongoDB, Mongoose, EJS, and ejs-mate.

## ✨ Features

- **Server-Side Rendering (SSR):** Fast, template-rendered pages using EJS and layouts via ejs-mate.
- **Authentication & Authorization:** Secure customer registration, encrypted password hashing (bcryptjs), and session-based login with role control (customer vs admin).
- **Session-Backed Shopping Cart:** Add items, manage quantities, and review live totals stored within session cookies.
- **Inventory & Catalog Search:** Search book inventory by title, author, or category with real-time stock validations.
- **Admin Dashboard:** Complete sales analytics, top-selling items tracking, inventory management (add, update price/stock, delete books), and customer order tracking.

## 🛠️ Prerequisites

1. Make sure you have Node.js and MongoDB installed and running on your local machine.

2. **Configure Environment Variables:**
   Create a file named `.env` inside the root folder and configure your .env:


3. **Install Dependencies:**
```bash
   npm install
   node ./init/seedAdmin.js
   node ./init/seedBooks.js
```

4. **Start the Server:**
```bash
   node server.js
```
