import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create new Order  =>  /api/v1/orders/new
export const newOrderHandler  = catchAsyncErrors(async (req, res, next) => {

  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    // paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(200).json({
    // success: true,
    order,
  });
})

// Get current logged in user orders =>  /api/v1/me/orders
export const myOrdersHandler = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({
    // success: true,
    orders,
  });
})

// Get order details =>  /api/v1/orders/:id
export const getOrderDetailsHandler = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("Order not found with this ID" + req.params.id, 404));
  }
  res.status(200).json({
    // success: true,
    order,
  });
})
