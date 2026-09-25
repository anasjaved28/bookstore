require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("../models/Book");

const sampleBooks = [
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    price: 399,
    stock: 15,
    description: "A magical fable about following your dream.",
    imageUrl:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    price: 850,
    stock: 8,
    description: "A handbook of agile software craftsmanship.",
    imageUrl:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    price: 499,
    stock: 25,
    description: "Tiny changes, remarkable results.",
    imageUrl:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "History",
    price: 599,
    stock: 12,
    description: "A brief history of humankind.",
    imageUrl:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Design Patterns",
    author: "Erich Gamma",
    category: "Technology",
    price: 1100,
    stock: 5,
    description: "Elements of reusable object-oriented software.",
    imageUrl:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80",
  },
];

const seedBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB for sample books seeding...");

    await Book.deleteMany({});
    await Book.insertMany(sampleBooks);
    console.log("Sample books with real cover images seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Books seeding failed:", err);
    process.exit(1);
  }
};

seedBooks();
