const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

router.get("/", (req, res) => {
  if (!req.session.cart) req.session.cart = [];
  const cartItems = req.session.cart;
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  res.render("cart/cart", {
    title: "Your Cart - Bookstore",
    cartItems,
    totalAmount,
  });
});

router.post("/add/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send("Book not found");

    if (!req.session.cart) req.session.cart = [];
    const cart = req.session.cart;

    const existing = cart.find((i) => i.bookId === book._id.toString());
    if (existing) {
      if (existing.quantity < book.stock) existing.quantity += 1;
    } else {
      cart.push({
        bookId: book._id.toString(),
        title: book.title,
        price: book.price,
        quantity: 1,
        maxStock: book.stock,
      });
    }

    res.redirect("/books");
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

router.post("/update/:id", (req, res) => {
  const { quantity } = req.body;
  if (req.session.cart) {
    const item = req.session.cart.find((i) => i.bookId === req.params.id);
    if (item) {
      let qty = parseInt(quantity, 10);
      if (qty > 0 && qty <= item.maxStock) item.quantity = qty;
    }
  }
  res.redirect("/cart");
});

router.post("/remove/:id", (req, res) => {
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter(
      (i) => i.bookId !== req.params.id,
    );
  }
  res.redirect("/cart");
});

module.exports = router;
