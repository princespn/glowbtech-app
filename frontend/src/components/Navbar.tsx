import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 🔑 Added useNavigate for auth guarding
import { ShoppingCart, LogIn, UserPlus, Trash2, X } from 'lucide-react';
import axiosClient from '../api/axiosClient';

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export default function Navbar() {
  const navigate = useNavigate(); // 🚀 Navigation core motor initialized
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUserCartInstance = async () => {
    try {
      const userId = localStorage.getItem('glowbtech_user_id') || 'temp_user_node_99';
      setLoading(true);
      
      const response = await axiosClient.get(`/carts/${userId}`);
      
      if (response.data && response.data.success && response.data.cart) {
        setCartItems(response.data.cart.items || []);
      }
    } catch (error) {
      console.warn("Cart stream fetching error or user session uninitialized:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCartInstance();
  }, [isCartOpen]); 

  const handleRemoveItem = async (productId: string) => {
    try {
      const userId = localStorage.getItem('glowbtech_user_id') || 'temp_user_node_99';
      
      const response = await axiosClient.post('/cart/remove', {
        user_id: userId,
        product_id: productId
      });

      if (response.data.success) {
        setCartItems((prev) => prev.filter(item => item.product_id !== productId));
      }
    } catch (error) {
      console.error("Could not execute delete pipeline inside array collection:", error);
    }
  };

  // 🛡️ Authentication Router Guard Block
  const handleCheckoutRedirectionGuard = (e: React.MouseEvent) => {
    e.preventDefault(); // Default routing layer bubble drop
    setIsCartOpen(false); // Close dropdown slate

    const actualUserId = localStorage.getItem('glowbtech_user_id');

    // Mismatch Validation: If token is dead, missing, or stuck on guest-fallback matrix
    if (!actualUserId || actualUserId === 'temp_user_node_99') {
      alert("🔒 Access Denied! Authorization token missing. Please log in to process checkout manifest.");
      // Redirecting with track query so login sequence can redirect user back to checkout post auth
      navigate('/login?redirect=/checkout');
    } else {
      // Secure pipeline cleared, dispatch user directly to checkout deployment
      navigate('/checkout');
    }
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <nav className="bg-slate-950/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-50 text-left">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between relative">
        
        <Link to="/" className="text-2xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          GLOWBTECH
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link to="/category/all" className="hover:text-blue-400 transition-colors">Solutions</Link>
          <Link to="/category/agents" className="hover:text-blue-400 transition-colors">AI Agents</Link>
          <Link to="/category/integrations" className="hover:text-blue-400 transition-colors">Integrations</Link>
        </div>

        {/* Right CTA / Auth / Cart Actions */}
        <div className="flex items-center gap-4 relative">
          
          {/* Login Button */}
          <Link to="/login" className="flex items-center gap-1 text-slate-400 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors">
            <LogIn size={16} /> Login
          </Link>

          {/* Signup Button */}
          <Link to="/signup" className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 hover:border-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-all">
            <UserPlus size={16} /> Sign Up
          </Link>

          {/* Cart Trigger Button */}
          <button 
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-blue-400 relative transition-all cursor-pointer"
          >
            <ShoppingCart size={20} />
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>

          {isCartOpen && (
            <div className="absolute right-0 top-14 w-85 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <ShoppingCart size={16} className="text-blue-400" /> Your Workspace Cart
                </h4>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-500 hover:text-white cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              {loading && cartItems.length === 0 ? (
                <p className="text-slate-500 text-center py-6 text-xs animate-pulse">Syncing cart nodes...</p>
              ) : cartItems.length === 0 ? (
                <p className="text-slate-500 text-center py-6 text-sm">Your deployment matrix is empty.</p>
              ) : (
                <>
                  <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
                    {cartItems.map((item) => (
                      <div key={item.product_id} className="flex justify-between items-center text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800/50 gap-3">
                        
                        <div className="h-9 w-9 bg-slate-900 border border-slate-800/60 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-contain p-0.5" />
                          ) : (
                            <ShoppingCart size={12} className="text-slate-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-200 truncate">{item.name}</p>
                          <p className="text-slate-500 mt-0.5">₹{item.price.toLocaleString('en-IN')} × {item.quantity}</p>
                        </div>
                        
                        <button 
                          onClick={() => handleRemoveItem(item.product_id)}
                          className="text-slate-600 hover:text-red-400 p-1 transition-colors cursor-pointer"
                          title="Purge solution item node"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-800 mt-3 space-y-3">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-slate-400">Total Pipeline Value:</span>
                      <span className="text-emerald-400 font-black">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    {/* ⚙️ Converted from Link to a clean event handler button to maintain look and layout integrity */}
                    <button 
                      onClick={handleCheckoutRedirectionGuard}
                      className="w-full text-center bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3 rounded-xl transition-all tracking-wide uppercase shadow-sm cursor-pointer block"
                    >
                      Proceed to checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}