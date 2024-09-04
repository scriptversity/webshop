import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// Get all Products   =>  /api/v1/products
export const getProductsHandler = catchAsyncErrors(async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);

  res.status(500).json(error);
});

// Create new product => /api/v1/admin/products
export const newProductHandler = catchAsyncErrors(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });

  res.status(500).json(error);
});

// Get single product details   =>  /api/v1/products/:id
export const getProductDetailsHandler = catchAsyncErrors(
  async (req, res, next) => {
    const product = await Product.findById(req?.params?.id);

    // if (!product) {
    //   return res.status(404).json({
    //     // success: false,
    //     error: "Product not found",
    //   });
    // }
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      // success: true,
      product,
    });

    res.status(500).json(error);
  }
);

// Update product details   =>  /api/v1/products/:id
export const updateProductHandler = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req?.params?.id);

  // if (!product) {
  //   return res.status(404).json({
  //     // success: false,
  //     error: "Product not found",
  //   });
  // }
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
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

  res.status(500).json(error);
});

// Delete product   =>  /api/v1/admin/products/:id
export const deleteProductHandler = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req?.params?.id);

  // if (!product) {
  //   return res.status(404).json({
  //     // success: false,
  //     error: "Product not found",
  //   });
  // }

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await product.deleteOne();
  res.status(200).json({
    // success: true,
    message: "Product is deleted",
  });

  res.status(500).json(error);
});
