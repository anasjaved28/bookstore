const express = require("express");
const Order = require("../models/Order");
const Book = require("../models/Book");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/", isLoggedIn, async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const cart = req.session.cart || [];
    if (!cart.length || !shippingAddress) return res.redirect("/cart");

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart) {
      const book = await Book.findById(item.bookId);
      if (!book || book.stock < item.quantity) {
        return res
          .status(400)
          .send(`Insufficient stock for book: ${item.title}`);
      }
      orderItems.push({
        book: book._id,
        title: book.title,
        price: book.price,
        quantity: item.quantity,
      });
      totalAmount += book.price * item.quantity;
      book.stock -= item.quantity;
      await book.save();
    }

    await Order.create({
      customer: req.session.customer.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    req.session.cart = [];
    res.redirect("/orders");
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.session.customer.id }).sort(
      { createdAt: -1 },
    );
    res.render("orders/index", { title: "My Orders - Bookstore", orders });
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

router.get("/admin", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .sort({ createdAt: -1 });
    const books = await Book.find().sort({ createdAt: -1 });

    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;

    const bookSales = {};
    orders.forEach((o) => {
      o.items.forEach((i) => {
        bookSales[i.title] = (bookSales[i.title] || 0) + i.quantity;
      });
    });
    const topBooks = Object.entries(bookSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([title, quantity]) => ({ title, quantity }));

    res.render("admin/dashboard", {
      title: "Admin Dashboard - Bookstore",
      stats: { totalSales, totalOrders, topBooks },
      books,
      orders,
    });
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

module.exports = router;
