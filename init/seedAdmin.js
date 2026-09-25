require("dotenv").config();
const mongoose = require("mongoose");
const Customer = require("../models/Customer");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB for admin seeding...");

    const existingAdmin = await Customer.findOne({
      email: "admin@bookstore.com",
    });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      process.exit(0);
    }

    const admin = new Customer({
      name: "System Admin",
      email: "admin@bookstore.com",
      password: "adminpassword123",
      role: "admin",
      address: "Bookstore Headquarters",
      phone: "9999999999",
    });

    await admin.save();
    console.log(
      "Admin seeded successfully! Login: admin@bookstore.com / adminpassword123",
    );
    process.exit(0);
  } catch (err) {
    console.error("Admin seeding failed:", err);
    process.exit(1);
  }
};

seedAdmin();
