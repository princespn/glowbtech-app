import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

// Standard connection configuration string override
const mongoURI = process.env.MONGODB_TEST_URI || "mongodb://127.0.0.1:27017/multivendor";

const seedProducts = [
  {
    title: "Self-Correcting Multi-Agent AI Swarm Core Engine V4",
    brand: "GlowbTech AI",
    category: "Autonomous Agents",
    avatar: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png", // Dynamic icon placeholder
    price: 8999,
    originalPrice: 19999,
    rating: 4.9,
    isActive: true
  },
  {
    title: "Applied Epic Secure Sync Tunnel & System Bridge API",
    brand: "GlowbTech Core",
    category: "Enterprise APIs",
    avatar: "https://cdn-icons-png.flaticon.com/512/2092/2092663.png",
    price: 4999,
    originalPrice: 12499,
    rating: 4.8,
    isActive: true
  },
  {
    title: "Linnworks ERP Dynamic Matrix Connector Module",
    brand: "Stack Engine",
    category: "Enterprise APIs",
    avatar: "https://cdn-icons-png.flaticon.com/512/1006/1006363.png",
    price: 3499,
    originalPrice: 8999,
    rating: 4.7,
    isActive: true
  },
  {
    title: "Cloud Infrastructure Kubernetes Monitoring Deck",
    brand: "SaaS Tools",
    category: "SaaS Tools",
    avatar: "https://cdn-icons-png.flaticon.com/512/1118/1118764.png",
    price: 1500,
    originalPrice: 3000,
    rating: 4.4,
    isActive: true
  }
];

const importInventoryData = async () => {
  try {
    await mongoose.connect(mongoURI);
    
    // Purane test datasets flush clear triggers execution
    await Product.deleteMany();
    console.log("Database cleared successfully...");

    // Insert seeds tracking pipeline pre-save calculation hooks
    await Product.insertMany(seedProducts);
    console.log("Flipkart-style enterprise inventory seed data imported seamlessly!");
    
    process.exit(0);
  } catch (error) {
    console.error("Critical exception executing seeder script:", error);
    process.exit(1);
  }
};

importInventoryData();