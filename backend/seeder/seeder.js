import mongoose from "mongoose";
import products from "./data.js";
import Product from "../models/product.js";
import "dotenv/config";

const seedProducts = async () => {
  let DB_URI = "";

  if (process.env.NODE_ENV === "DEVELOPMENT") DB_URI = process.env.DB_LOCAL_URI;
  if (process.env.NODE_ENV === "PRODUCTION") DB_URI = process.env.DB_URI;

  if (!DB_URI) {
    console.error(
      "Database URI is not defined. Please check your environment variables."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(DB_URI);

    await Product.deleteMany();
    console.log("Products are deleted");

    await Product.insertMany(products);
    console.log("Products are added");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

seedProducts();
