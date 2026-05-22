import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { user_id, customerName, email, shippingAddress, items, totalAmount } = req.body;

    if (!user_id || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order cannot be processed with an empty matrix payload." });
    }

    const newOrder = new Order({
      user_id,
      customerName,
      email,
      shippingAddress,
      items,
      totalAmount
    });

    const savedOrder = await newOrder.save();

    await Cart.findOneAndDelete({ user_id });

    return res.status(201).json({
      success: true,
      message: "Deployment order registered and locked into database ledger!",
      order_id: savedOrder._id,
      order: savedOrder
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Order engine operation failure.",
      error: error.message
    });
  }
};