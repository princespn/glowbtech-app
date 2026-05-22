import { Star, Shield, RefreshCcw, Truck, Plus, Minus } from 'lucide-react';

const ProductPage = () => {
  return (
    <div className="bg-slate-950 min-h-screen text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-center text-slate-600 overflow-hidden">
             <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-blue-900/20 to-slate-900 flex items-center justify-center">Main Image</div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(t => (
              <div key={t} className="aspect-square bg-slate-900 rounded-xl border border-slate-800 hover:border-blue-500 cursor-pointer transition-all"></div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-center">
          <nav className="text-sm text-slate-500 mb-4">Shop / AI Systems / Autonomous Agents</nav>
          <h1 className="text-4xl font-bold mb-4">Glowb-Agent Enterprise Swarm</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-yellow-500"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
            <span className="text-slate-400 text-sm">(48 Customer Reviews)</span>
          </div>

          <div className="text-3xl font-bold text-blue-400 mb-6">$4,999.00</div>
          
          <p className="text-slate-400 leading-relaxed mb-8">
            Deploy a multi-agent swarm capable of handling complex research, coding, and customer support tasks. Built on the 97% Logic Model for zero-error execution.
          </p>

          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800">
                <button className="p-3 hover:text-blue-500"><Minus size={16}/></button>
                <span className="px-4 font-bold text-lg">1</span>
                <button className="p-3 hover:text-blue-500"><Plus size={16}/></button>
              </div>
              <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20">
                Add to Cloud Workspace
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-900">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Shield size={20} className="text-blue-500" /> Lifetime Updates
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <RefreshCcw size={20} className="text-blue-500" /> 14-Day Logic Guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};