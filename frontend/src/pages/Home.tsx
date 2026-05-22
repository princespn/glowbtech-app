import { useState, useEffect } from 'react';
import { Cpu, Shield, LayoutGrid, SlidersHorizontal, ShoppingBag, Star } from 'lucide-react';
import axiosClient from '../api/axiosClient';

interface Product {
  _id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  avatar?: string;
  category: string;
  isActive: boolean;
}

interface Category {
  _id: string;
  name: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  //const [cart, setCart] = useState<Product[]>([]);

// Replace your old handleAddToCart function in Home.tsx with this live system:
const handleAddToCart = async (product: Product) => {
  try {
    // 1. Fetching active user identity identifier token or system key fallback
    const userId = localStorage.getItem('glowbtech_user_id') || 'temp_user_node_99'; 

    const payload = {
      user_id: userId,
      product_id: product._id,
      name: product.title,
      price: product.price,
      imageUrl: product.avatar || ''
    };

    const response = await axiosClient.post('/carts/add', payload);
    
    if (response.data.success) {
      console.log('Cart state synced successfully on database instance:', response.data);
      alert(`${product.title} successfully locked into your database cart secure instance!`);
    }
  } catch (error: any) {
    console.error("Cart transaction pipeline failure error:", error);
    alert("Could not process your cart addition matrix. Backend status structural fail.");
  }
};

  useEffect(() => {
    const fetchMarketplaceMetadata = async () => {
      try {
        setLoading(true);

        const [productsRes, categoriesRes] = await Promise.all([
          axiosClient.get('/products'),
          axiosClient.get('/products/categories')
        ]);

        if (productsRes && productsRes.data) {
          const productsData = productsRes.data.products || productsRes.data;
          if (Array.isArray(productsData)) {
            setProducts(productsData);
          }
        }

        if (categoriesRes && categoriesRes.data) {
          const categoriesData = categoriesRes.data.categories || categoriesRes.data;
          if (Array.isArray(categoriesData)) {
            setCategories(categoriesData);
          }
        }

      } catch (error) {
        console.warn('Backend link offline, initializing safety sandbox backup nodes:', error);
        
        // Fail-safe fallbacks dataset
        setProducts([
          {
            _id: 'prod_agent_01',
            title: 'Self-Correcting Multi-Agent AI Swarm Core Engine V4',
            brand: 'GlowbTech AI',
            price: 8999,
            originalPrice: 19999,
            discount: 55,
            rating: 4.9,
            category: 'Autonomous Agents',
            isActive: true
          },
          {
            _id: 'prod_api_02',
            title: 'Applied Epic Secure Sync Tunnel & System Bridge API',
            brand: 'GlowbTech Core',
            price: 4999,
            originalPrice: 12499,
            discount: 60,
            rating: 4.8,
            category: 'Enterprise APIs',
            isActive: true
          },
          {
            _id: 'prod_api_03',
            title: 'Linnworks ERP Dynamic Matrix Connector Module',
            brand: 'Stack Engine',
            price: 3499,
            originalPrice: 8999,
            discount: 61,
            rating: 4.7,
            category: 'Enterprise APIs',
            isActive: true
          }
        ]);

        setCategories([
          { _id: 'cat_1', name: 'Autonomous Agents' },
          { _id: 'cat_2', name: 'Enterprise APIs' },
          { _id: 'cat_3', name: 'SaaS Tools' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketplaceMetadata();
  }, []);

  // ✨ Fix 2: Optional Chaining to prevent undefined category crashes
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="shop-container text-slate-800 dark:text-slate-100">
      
      <div className="w-full bg-white dark:bg-[#131926] border border-[#e0e0e0] dark:border-[#1f293d] rounded-sm p-4 mb-4 overflow-x-auto flex gap-3 md:justify-center shadow-xs">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-full transition-all border ${
            selectedCategory === 'All'
              ? 'bg-[#2874f0] border-[#2874f0] text-white shadow-xs'
              : 'bg-slate-50 dark:bg-slate-900 border-[#e0e0e0] dark:border-[#1f293d] text-slate-600 dark:text-slate-300 hover:border-[#2874f0]/50'
          }`}
        >
          <LayoutGrid size={14} />
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-full transition-all border ${
              selectedCategory === cat.name
                ? 'bg-[#2874f0] border-[#2874f0] text-white shadow-xs'
                : 'bg-slate-50 dark:bg-slate-900 border-[#e0e0e0] dark:border-[#1f293d] text-slate-600 dark:text-slate-300 hover:border-[#2874f0]/50'
            }`}
          >
            <LayoutGrid size={14} />
            {cat.name}
          </button>
        ))}
      </div>

      {/* 2. HERO HEADER SECTION */}
      <header className="w-full bg-linear-to-r from-slate-900 to-indigo-950 text-white p-8 rounded-sm mb-6 relative overflow-hidden border border-[#e0e0e0] dark:border-[#1f293d] text-left shadow-xs">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-blue-500/10 to-transparent blur-2xl pointer-events-none" />
        <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-sm tracking-widest">
          Enterprise Blueprint
        </span>
        <h1 className="text-white my-2 text-xl md:text-4xl font-extrabold tracking-tight">
          The 97% Logic Architecture
        </h1>
        <p className="text-slate-400 text-xs md:text-sm max-w-2xl leading-relaxed">
          Deploying autonomous agents and enterprise-grade system bridges with senior-level precision. Completely optimized for custom automated environments.
        </p>
      </header>

      {/* 3. MAIN PRODUCT GRID WORKSPACE SPLIT */}
      <div className="marketplace-layout">
        
        {/* Left Filter Control Sidebar Panel */}
        <aside className="sidebar-filter">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <SlidersHorizontal size={14} /> Filters
            </h3>
            {selectedCategory !== 'All' && (
              <button onClick={() => setSelectedCategory('All')} className="text-xs text-[#2874f0] font-semibold hover:underline">
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-5 text-left">
            <div>
              <span className="font-bold text-xs text-slate-400 uppercase tracking-wider block mb-2">Scope Target</span>
              <div className="text-sm font-semibold text-[#2874f0] bg-blue-500/5 px-2 py-1.5 rounded-sm border border-blue-500/10">
                {selectedCategory}
              </div>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <span className="font-bold text-xs text-slate-400 uppercase tracking-wider block mb-2">Platform Verification</span>
              <div className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2"><Cpu size={14} className="text-blue-500" /> Multi-Agent Engine</div>
                <div className="flex items-center gap-2"><Shield size={14} className="text-emerald-500" /> Hardened API</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Dynamic Products Matrix Render Area */}
        <main className="products-grid-wrapper">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="product-card animate-pulse h-80 bg-white dark:bg-[#131926] border border-[#e0e0e0] dark:border-[#1f293d]" />
            ))
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-[#131926] border border-[#e0e0e0] dark:border-[#1f293d] p-12 rounded-sm text-center">
              <ShoppingBag size={48} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Solutions Active</h3>
              <p className="text-xs text-slate-400 mt-1">Select another node filter scope combination.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image-box">
                  {/* ✨ Fix 3: Added Safe Fallback chaining inside dynamic layout icons */}
                  {product.category?.toLowerCase().includes('agent') ? (
                    <Cpu size={40} className="text-blue-500" />
                  ) : (
                    <Shield size={40} className="text-emerald-500" />
                  )}
                </div>

                <div className="product-details">
                  <span className="product-brand">{product.brand}</span>
                  <h2 className="product-title" title={product.title}>
                    {product.title}
                  </h2>
                  <div className="badge-rating">
                    {product.rating || 4.0} <Star size={10} fill="currentColor" />
                  </div>
                  <div className="price-wrapper">
                    <span className="current-price">₹{(product.price || 0).toLocaleString('en-IN')}</span>
                    <span className="original-price">₹{(product.originalPrice || 0).toLocaleString('en-IN')}</span>
                    <span className="discount-percentage">{product.discount || 0}% off</span>
                  </div>
                  <div className="badge-offer">F-Assured Platform Certified</div>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800/60">
      <button 
        onClick={() => handleAddToCart(product)}
        className="w-full flex items-center justify-center gap-2 bg-[#ff9f00] hover:bg-[#f39800] text-white text-xs md:text-sm font-bold py-2.5 px-4 rounded-sm shadow-xs cursor-pointer tracking-wide uppercase transition-all transform active:scale-[0.98]"
      >
        <ShoppingBag size={15} />
        Add to Cart
      </button>
    </div>
              </div>
            ))
          )}
        </main>
      </div>

      <section className="grid md:grid-cols-2 gap-4 mt-8 text-left">
        <div className="bg-white dark:bg-[#131926] p-6 rounded-sm border border-[#e0e0e0] dark:border-[#1f293d] shadow-xs">
           <Cpu className="text-blue-500 mb-3" size={28} />
           <h3 className="text-base font-bold">Autonomous Agents Workflow Engine</h3>
           <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs leading-relaxed">
             Self-correcting multi-agent AI swarms configured for advanced automated continuous workflow execution.
           </p>
        </div>
        
        <div className="bg-white dark:bg-[#131926] p-6 rounded-sm border border-[#e0e0e0] dark:border-[#1f293d] shadow-xs">
           <Shield className="text-emerald-500 mb-3" size={28} />
           <h3 className="text-base font-bold">Hardened Enterprise Infrastructure APIs</h3>
           <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs leading-relaxed">
             Highly secure and customized system bridging specialized for Applied Epic, Zoho CRM, and Linnworks engines.
           </p>
        </div>
      </section>

    </div>
  );
}