import Cart from "../models/Cart.js";

// @route   GET /api/cart/:user_id
export const getUserCart = async (req, res) => {
    try {
      const { user_id } = req.params;
      const cart = await Cart.findOne({ user_id });
  
      if (!cart) {
        return res.status(200).json({ success: true, cart: { items: [] } });
      }
  
      return res.status(200).json({ success: true, cart });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

export const addToCart = async (req, res) => {
  try {
    const { user_id, product_id, name, price, imageUrl } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({ success: false, message: "Missing required tracking nodes." });
    }

    let cart = await Cart.findOne({ user_id });

    if (!cart) {
      cart = new Cart({
        user_id,
        items: [{ product_id, name, price: Number(price), imageUrl, quantity: 1 }]
      });
    } else {
      const existingItemIndex = cart.items.findIndex(item => item.product_id === product_id);

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += 1;
      } else {
        cart.items.push({ product_id, name, price: Number(price), imageUrl, quantity: 1 });
      }
    }

    await cart.save();
    return res.status(200).json({ success: true, count: cart.items.length, cart });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Cart sync pipeline failed", error: error.message });
  }
};