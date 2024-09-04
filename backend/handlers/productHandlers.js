import Product from "../models/product.js";

// Get all Products   =>  /api/v1/products
export const getProductsHandler = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Create new product => /api/v1/admin/products
export const newProductHandler = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get single product details   =>  /api/v1/products/:id
export const getProductDetailsHandler = async (req, res) => {
  try {
    const product = await Product.findById(req?.params?.id);

    if (!product) {
      return res.status(404).json({
        // success: false,
        error: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update product details   =>  /api/v1/products/:id
export const updateProductHandler = async (req, res) => {
  try {
    const product = await Product.findById(req?.params?.id);

    if (!product) {
      return res.status(404).json({
        // success: false,
        error: "Product not found",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
