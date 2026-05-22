import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true }
    },
    items: [
      {
        product_id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
      }
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    orderStatus: { type: String, enum: ["Processing", "Deployed", "Cancelled"], default: "Processing" }
  },
  { 
    timestamps: true 
  }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;