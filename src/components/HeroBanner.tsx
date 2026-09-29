import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setActiveView, setSelectedCategory, categories } = useShop();

  return (
    <div className="space-y-10">
      {/* Main Hero Container */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl">
        {/* Ambient Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-indigo-950/80 to-slate-900 z-10" />
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=80"
          alt="Modern store showcase"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-overlay"
        />

        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Spring 2026 Collection · Up to 40% Off</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Elevate Your Lifestyle with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-amber-200">
                ShopEase
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Curated audio tech, timeless wardrobe staples, luxury footwear, and home artisanal essentials.
              Shop the newest arrivals with express doorstep delivery.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setActiveView('shop');
                }}
                className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:translate-y-[-1px] transition-all flex items-center gap-2"
              >
                <span>Shop Featured Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Micro Category Pills */}
            <div className="pt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Quick Jump:</span>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCategory(c.name);
                    setActiveView('shop');
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-600/80 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/60 transition-colors"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Featured Card Right */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl shadow-2xl">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-4 bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                  alt="SonicPro ANC Headphones"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-rose-500 text-white text-xs font-bold shadow-md">
                  HOT DEAL · SAVE $50
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    Electronics · Best Seller
                  </span>
                  <div className="flex items-center text-amber-400 text-xs font-bold gap-1">
                    ★ 4.8 <span className="text-slate-400 font-normal">(142)</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white">SonicPro Wireless ANC Headphones</h3>
                <p className="text-xs text-slate-300 line-clamp-2">
                  Studio acoustics, 45-hour battery, hybrid 40dB noise cancellation, and plush memory-foam earcups.
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div>
                    <span className="text-xl font-extrabold text-white">$149.99</span>
                    <span className="text-xs text-slate-400 line-through ml-2">$199.99</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('Electronics');
                      setActiveView('shop');
                    }}
                    className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1"
                  >
                    View Details &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Guarantees Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3.5 p-2">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">Free Fast Delivery</h4>
            <p className="text-xs text-slate-500 mt-0.5">Orders over $50 delivered free</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-2">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">Secure Payment</h4>
            <p className="text-xs text-slate-500 mt-0.5">Encrypted Stripe & PayPal</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-2">
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">30-Day Easy Returns</h4>
            <p className="text-xs text-slate-500 mt-0.5">Hassle-free refunds or swaps</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-2">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">24/7 Dedicated Care</h4>
            <p className="text-xs text-slate-500 mt-0.5">Instant online live support</p>
          </div>
        </div>
      </div>
    </div>
  );
};
