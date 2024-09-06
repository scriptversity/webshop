import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";
import APIFilters from "../utils/apiFilters.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// Get all Products   =>  /api/v1/products
export const getProductsHandler = catchAsyncErrors(async (req, res) => {
  // const apiFilters = new APIFilters(Product.find(), req.query)

  const resPerPage = process.env.RESPERPAGE;
  // with filtering
  const apiFilters = new APIFilters(Product, req.query).search().filters();

  let products = await apiFilters.query;

  let filteredProductsCount = products.length;

  apiFilters.pagination(resPerPage);
  // products = await apiFilters.query;
  products = await apiFilters.query.clone();

  // filteredProductsCount = products.length;

  res.status(200).json({ resPerPage, filteredProductsCount, products });

  // without filtering
  // const products = await Product.find();
  // res.status(200).json({ products });
});

// Create new product => /api/v1/admin/products
export const newProductHandler = catchAsyncErrors(async (req, res) => {
  req.body.user = req.user._id;
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

// Create/Update product review   =>  /api/v1/reviews
export const createProductReviewHandler = catchAsyncErrors(
  async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req?.user?._id,
      // name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    const isReviewed = product?.reviews?.find(
      (rev) => rev?.user?.toString() === req?.user?._id?.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev?.user?.toString() === req?.user?._id?.toString()) {
          (rev.rating = rating), (rev.comment = comment);
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    // // another approach
    // let avg = 0;
    // product.reviews.forEach((rev) => {
    //   avg += rev.rating;
    // });
    // product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  }
);

// Get product reviews   =>  /api/v1/reviews
export const getProductReviewsHandler = catchAsyncErrors(
  async (req, res, next) => {
    const product = await Product.findById(req.query.id).populate({
      path: "reviews.user",
    });
    // another approach
    // const product = await Product.findById(req.query.id).populate("reviews.user");
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
      // success: true,
      reviews: product.reviews,
    });
  }
);

// Delete product review - Admin   =>  /api/v1/admin/reviews
export const deleteProductReviewHandler = catchAsyncErrors(
  async (req, res, next) => {
    let product = await Product.findById(req.query.productId);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    // const reviews = product?.reviews?.filter(
    //   (rev) => rev._id.toString() !== req.query.id.toString()
    // );

    // const numOfReviews = reviews.length;

    // const ratings =
    //   numOfReviews === 0
    //     ? 0
    //     : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    //       numOfReviews;

    // // another approach(less cool)
    // // const ratings =
    // //   product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    // //   reviews.length;

    // product = await Product.findByIdAndUpdate(
    //   req.query.productId,
    //   {
    //     reviews,
    //     ratings,
    //     numOfReviews,
    //   },
    //   {
    //     new: true,
    //     runValidators: true,
    //     useFindAndModify: false,
    //   }
    // );

    // another approach ?
    product.reviews = product?.reviews?.filter(
      (rev) => rev._id.toString() !== req?.query?.id.toString()
    );

    product.numOfReviews = product.reviews.length;

    product.ratings =
      product.reviews.length === 0
        ? 0
        : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      // message: "Review is deleted",
      product,
    });
  }
);
