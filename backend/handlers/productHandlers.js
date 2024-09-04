// import Product from "../models/product.js";

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