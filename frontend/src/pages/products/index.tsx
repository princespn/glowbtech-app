import { useState } from 'react';
import { Filter, SlidersHorizontal, ShoppingCart, Eye } from 'lucide-react';

const CategoryPage = () => {
  const [view, setView] = useState('grid');

  return (
    <div className="bg-slate-950 min-h-screen text-white p-6 md:p-12">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Enterprise AI Solutions</h1>
          <p className="text-slate-400">Showing 1–12 of 48 systems</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 hover:border-blue-500 transition-all">
            <SlidersHorizontal size={18} /> Sort by: Featured
          </button>
          <button className="md:hidden flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg">
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block space-y-8">
          <div>
            <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-blue-500">Categories</h3>
            <div className="space-y-2 text-slate-300">
              {['Autonomous Agents', 'LLM Integration', 'Custom ERP', 'SaaS Tools'].map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors">
                  <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0" />
                  {cat}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-blue-500">Price Range</h3>
            <input type="range" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>$500</span>
              <span>$50,000+</span>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3 grid md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group bg-slate-900/50 border border-slate-800 rounded-2xl p-4 hover:border-blue-500 transition-all duration-300">
              <div className="relative aspect-square bg-slate-800 rounded-xl mb-4 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40 backdrop-blur-sm">
                   <button className="p-3 bg-white text-black rounded-full mx-2 hover:scale-110 transition-transform"><Eye size={20}/></button>
                   <button className="p-3 bg-blue-600 text-white rounded-full mx-2 hover:scale-110 transition-transform"><ShoppingCart size={20}/></button>
                </div>
                <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center text-slate-500">Product Image</div>
              </div>
              <h3 className="font-bold text-lg mb-1">Glowb-Agent v{i}.0</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">Autonomous task execution engine with Claude 3.5 Sonnet logic.</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-blue-400">$1,299</span>
                <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">Digital License</span>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};