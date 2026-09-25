const express = require("express");
const Customer = require("../models/Customer");

const router = express.Router();

router.get("/login", (req, res) => {
  if (req.session.customer) return res.redirect("/books");
  res.render("auth/login", { title: "Login - Bookstore", error: null });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .render("auth/login", {
          title: "Login",
          error: "Email and password are required",
        });
    }

    const customer = await Customer.findOne({ email: email.toLowerCase() });
    if (!customer || !(await customer.comparePassword(password))) {
      return res
        .status(401)
        .render("auth/login", {
          title: "Login",
          error: "Invalid email or password",
        });
    }

    req.session.customer = {
      id: customer._id,
      name: customer.name,
      email: customer.email,
      role: customer.role,
      address: customer.address,
    };

    res.redirect("/books");
  } catch (err) {
    res
      .status(500)
      .render("auth/login", {
        title: "Login",
        error: "Server error: " + err.message,
      });
  }
});

router.get("/register", (req, res) => {
  if (req.session.customer) return res.redirect("/books");
  res.render("auth/register", { title: "Register - Bookstore", error: null });
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .render("auth/register", {
          title: "Register",
          error: "Name, email and password are required",
        });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .render("auth/register", {
          title: "Register",
          error: "Password must be at least 6 characters",
        });
    }

    const existing = await Customer.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res
        .status(409)
        .render("auth/register", {
          title: "Register",
          error: "Email already in use",
        });
    }

    await Customer.create({
      name,
      email: email.toLowerCase(),
      password,
      address,
      phone,
    });
    res.redirect("/auth/login");
  } catch (err) {
    res
      .status(500)
      .render("auth/register", {
        title: "Register",
        error: "Server error: " + err.message,
      });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/books");
  });
});

module.exports = router;
