import mongoose from "mongoose";
const { Schema } = mongoose;

const ProductSchema = new Schema({
  title: { type: String, required: true },
  routeName: { type: String, required: true, max: 40 },
  items: [
    {
      product_id: { type: Schema.Types.ObjectId },
      name: { type: String, required: true },
      imageUrl: { type: String, required: true },
      price: { type: String },
    },
  ],
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
