import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create new Order  =>  /api/v1/orders/new
export const newOrderHandler = catchAsyncErrors(async (req, res, next) => {
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
});

// Get current logged in user orders =>  /api/v1/me/orders
export const myOrdersHandler = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({
    // success: true,
    orders,
  });
});

// Get order details =>  /api/v1/orders/:id
export const getOrderDetailsHandler = catchAsyncErrors(
  async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) {
      return next(
        new ErrorHandler("Order not found with this ID" + req.params.id, 404)
      );
    }
    res.status(200).json({
      // success: true,
      order,
    });
  }
);

// Get all orders - Admin =>  /api/v1/admin/orders
export const allOrdersHandler = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();
  // const orders = await Order.find({});

  res.status(200).json({
    // success: true,
    orders,
  });
});

// Update / Process order - Admin =>  /api/v1/admin/orders/:id
export const updateOrderHandler = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ErrorHandler("Order not found with this ID" + req.params.id, 404)
    );
  }

  if (order?.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  order?.orderItems?.forEach(async (item) => {
    const product = await Product.findById(item?.product?.toString());

    if (!product) {
      return next(
        new ErrorHandler(
          "Product not found with this ID" + item?.product?.toString(),
          404
        )
      );
    }

    product.stock = product?.stock - item?.quantity;
    // await product?.save();
    await product?.save({ validateBeforeSave: false });
  });

  order.orderStatus = req.body.status;
  // if (req.body.status === "Delivered") {
  //   order.deliveredAt = Date.now();
  // }
  order.deliveredAt = Date.now();

  await order.save();
  // await order.save({ validateBeforeSave: false });
  res.status(200).json({
    // success: true,
    order,
  });
});

// Delete order - Admin  =>  /api/v1/admin/orders/:id
export const deleteOrderHandler = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ErrorHandler("Order not found with this ID" + req.params.id, 404)
    );
  }

  await order.deleteOne();
  res.status(200).json({
    success: true,
    // message: "Order deleted successfully",
  });
});