// models/Cart.js
import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  items: [
    {
      product_id: { type: String, required: true },
      name: { type: String, default: "" },
      price: { type: Number, default: 0 },
      imageUrl: { type: String, default: "" },
      quantity: { type: Number, default: 1 }
    }
  ]
});

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
