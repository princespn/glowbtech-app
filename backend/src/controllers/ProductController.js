import Product from "../models/Product.js";
//import Category from "../models/Category.js";

export const getProductsByCategory = async (req, res) => {
  try {
    const { cat_name } = req.params;
    
    const cleanCategoryName = cat_name.replace(/-/g, " ");

    const products = await Product.find({
      name: { $regex: new RegExp(`^${cleanCategoryName}$`, "i") },
      isActive: true
    });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        nocatsfound: `No active products found under category: ${cleanCategoryName}`,
      });
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("Exception handling route query pipeline:", error);
    return res.status(500).json({ success: false, message: "Server Error processing pipeline" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const categoriesWithItems = await Product.find();
    
    let flattenedProducts = [];
    
    categoriesWithItems.forEach((catDoc) => {
      if (catDoc.items && Array.isArray(catDoc.items)) {
        catDoc.items.forEach((item) => {          
          
          const cleanPrice = Number(item.price) || 0;
          const mockOriginalPrice = Math.round(cleanPrice * 2.2); 

          flattenedProducts.push({
            _id: item._id || item.product_id,
            title: item.name,                        // Mapping 'name' to frontend 'title'
            brand: catDoc.title || "GlowbTech Core", // Using parent document title as brand
            category: catDoc.name,                  
            avatar: item.imageUrl,                   
            price: cleanPrice,
            originalPrice: mockOriginalPrice,
            discount: Math.round(((mockOriginalPrice - cleanPrice) / mockOriginalPrice) * 100) || 50,
            rating: 4.7,                             
            isActive: true
          });
        });
      }
    });

    return res.status(200).json({
      success: true,
      count: flattenedProducts.length,
      products: flattenedProducts 
    });

  } catch (error) {
    console.error("Pipeline breakdown error:", error);
    return res.status(500).json({
      success: false,
      message: "Database parsing engine failed",
      error: error.message
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categoriesData = await Product.find({}, { 
      title: 1, routeName: 1 });
    
    const structuredCategories = categoriesData.map((doc) => ({
      _id: doc._id,
      name: doc.title 
    }));

    return res.status(200).json(structuredCategories);
  } catch (error) {
    console.error("Category parsing error:", error);
    return res.status(500).json({ success: false, message: "Server Error fetching categories" });
  }
};


export const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    
    return res.status(201).json({
      success: true,
      message: "Product record synchronized successfully",
      product: savedProduct
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Validation structure rejected",
      error: error.message
    });
  }
};