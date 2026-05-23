import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, CreditCard, ArrowLeft } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Address State Management Block
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: ''
  });

  // Pulling active checkout candidate lists from MongoDB session matching the specific user
  useEffect(() => {
    const loadCheckoutPayload = async () => {
      try {
        const userId = localStorage.getItem('glowbtech_user_id') || 'temp_user_node_99';
        const response = await axiosClient.get(`/carts/${userId}`);
        if (response.data && response.data.success && response.data.cart) {
          setCartItems(response.data.cart.items || []);
        }
      } catch (error) {
        console.error("Failed to hydrate checkout pipeline configuration state:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCheckoutPayload();
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Core Order Dispatch Dispatch Pipeline Engine Action
  const handleProcessDeployment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert("Your deployment manifest matrix is empty.");

    try {
      setIsSubmitting(true);
      const userId = localStorage.getItem('glowbtech_user_id') || 'temp_user_node_99';

      const orderPayload = {
        user_id: userId,
        customerName: customerDetails.name,
        email: customerDetails.email,
        shippingAddress: shippingAddress,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: totalAmount
      };

      const response = await axiosClient.post('/orders/add', orderPayload);

      if (response.data.success) {
        alert(`Transaction Success!\nOrder Reference Locked: ${response.data.order_id}`);
        navigate('/payment-success', { state: { orderId: response.data.order_id } });
      }
    } catch (error: any) {
      console.error("Order processing execution crashed:", error);
      alert("Order submission error loop captured.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <p className="animate-pulse text-sm font-semibold tracking-widest">VALIDATING CRYPTO AND LEDGER NODES...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 text-left">
      <div className="max-w-6xl mx-auto">
        
        {/* Back navigation button row */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-xs font-bold uppercase tracking-wider mb-6 cursor-pointer">
          <ArrowLeft size={14} /> Back to Catalog
        </button>

        <h1 className="text-2xl md:text-3xl font-black mb-8 tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          PROVISIONING & BLUEPRINT CHECKOUT
        </h1>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          
          {/* LEFT COLUMN: Shipping and Configuration Identity details Form panel */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-900/60 p-6 rounded-2xl shadow-2xl">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wide border-b border-slate-800 pb-3">
              <ShieldCheck size={18} className="text-blue-500" /> Operational Deployment Profile
            </h3>

            <form onSubmit={handleProcessDeployment} className="space-y-4 text-xs font-semibold text-slate-400">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-400">Customer Reference Fullname</label>
                  <input type="text" required className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-100 focus:border-blue-500 outline-none" placeholder="Amit Sharma" value={customerDetails.name} onChange={e => setCustomerDetails({...customerDetails, name: e.target.value})} />
                </div>
                <div>
                  <label className="block mb-1 text-slate-400">Notification Routing Email</label>
                  <input type="email" required className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-100 focus:border-blue-500 outline-none" placeholder="amit@glowbtech.ai" value={customerDetails.email} onChange={e => setCustomerDetails({...customerDetails, email: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-400">Deployment Site Street Address</label>
                <input type="text" required className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-100 focus:border-blue-500 outline-none" placeholder="Sector 62, Electronic City Cluster Node" value={shippingAddress.street} onChange={e => setShippingAddress({...shippingAddress, street: e.target.value})} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block mb-1 text-slate-400">City</label>
                  <input type="text" required className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-100 focus:border-blue-500 outline-none" placeholder="Noida" value={shippingAddress.city} onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} />
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 text-slate-400">State</label>
                  <input type="text" required className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-100 focus:border-blue-500 outline-none" placeholder="UP" value={shippingAddress.state} onChange={e => setShippingAddress({...shippingAddress, state: e.target.value})} />
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 text-slate-400">Zip Code</label>
                  <input type="text" required className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-100 focus:border-blue-500 outline-none" placeholder="201301" value={shippingAddress.zipCode} onChange={e => setShippingAddress({...shippingAddress, zipCode: e.target.value})} />
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-800/60">
                <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl tracking-wider text-xs uppercase shadow-lg disabled:opacity-50 transition-all cursor-pointer">
                  <CreditCard size={15} /> {isSubmitting ? "Executing Matrix Sequence..." : "Authorize Production Release Build"}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: Order Manifest / Invoice Summary Side card layout */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-900/60 p-6 rounded-2xl shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 uppercase tracking-wide border-b border-slate-800 pb-3">
              <ShoppingBag size={18} className="text-emerald-500" /> Manifest Breakdown
            </h3>

            {cartItems.length === 0 ? (
              <p className="text-slate-500 py-6 text-xs text-center">No modules configured for flight checkout assignment.</p>
            ) : (
              <>
                <div className="divide-y divide-slate-800 max-h-64 overflow-y-auto pr-1 space-y-3">
                  {cartItems.map(item => (
                    <div key={item.product_id} className="flex items-center gap-3 pt-3 text-xs first:pt-0">
                      <div className="h-10 w-10 bg-slate-950 border border-slate-800 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden p-1">
                        {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="h-full w-full object-contain" /> : <ShoppingBag size={14} className="text-slate-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-200 truncate">{item.name}</p>
                        <p className="text-slate-500 mt-0.5">₹{item.price.toLocaleString('en-IN')} × {item.quantity}</p>
                      </div>
                      <span className="font-bold text-slate-300">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Base Deployment Subtotal:</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Cluster Sync Cloud Tax (GST 0%):</span>
                    <span className="text-emerald-500">Free / Wave-off</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800/40">
                    <span>Total Operational Value:</span>
                    <span className="text-emerald-400 font-black text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}