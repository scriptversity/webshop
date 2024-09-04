import Product from "../models/product.js";

// Get all Products   =>  /api/v1/products
export const getProductsHandler = async (req, res) => {
  try {
    // const products = await Product.find();
    // res.status(200).json(products);
    res.status(200).json({
      success: true,
      message: "Get Products successfully"
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

// Create new product => /api/v1/admin/products
export const newProductHandler = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json(error);
  }
}