import mongoose from "mongoose";


const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is strictly required"], 
      unique: true, 
      trim: true,  
    }
  },
  {
    timestamps: true   }
);


const Category = mongoose.model("Category", CategorySchema);
  

export default Category;