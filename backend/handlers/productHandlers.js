import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";
import APIFilters from "../utils/apiFilters.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// Get all Products   =>  /api/v1/products
export const getProductsHandler = catchAsyncErrors(async (req, res) => {
  // const apiFilters = new APIFilters(Product.find(), req.query)

  // with filtering
  const apiFilters = new APIFilters(Product, req.query).search();

  const products = await apiFilters.query;

  const filteredProductsCount = products.length;

  res.status(200).json({ filteredProductsCount, products });

  // without filtering
  // const products = await Product.find();
  // res.status(200).json({ products });
});

// Create new product => /api/v1/admin/products
export const newProductHandler = catchAsyncErrors(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    // success: true,
    product,
  });
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
});
