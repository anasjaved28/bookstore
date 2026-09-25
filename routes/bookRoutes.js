const express = require("express");
const Book = require("../models/Book");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { q, category } = req.query;
    const filter = {};

    if (q) {
      filter.$text = { $search: q };
    }
    if (category) {
      filter.category = category;
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });
    const allBooks = await Book.find({});
    const categories = [...new Set(allBooks.map((b) => b.category))];

    res.render("books/index", {
      title: "Online Book Store - Catalog",
      books,
      categories,
      searchQuery: q || "",
      selectedCategory: category || "",
    });
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

router.post("/", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const { title, author, category, price, stock, description, imageUrl } =
      req.body;
    await Book.create({
      title,
      author,
      category,
      price,
      stock: stock || 0,
      description,
      imageUrl,
    });
    res.redirect("/orders/admin");
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

router.post("/update/:id", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const { price, stock } = req.body;
    await Book.findByIdAndUpdate(req.params.id, { price, stock });
    res.redirect("/orders/admin");
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

router.post("/delete/:id", isLoggedIn, isAdmin, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect("/orders/admin");
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

module.exports = router;
