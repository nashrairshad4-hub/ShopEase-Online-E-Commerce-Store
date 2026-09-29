import React from 'react';
import { useShop } from '../context/ShopContext';
import { HeroBanner } from './HeroBanner';
import { CategorySection } from './CategorySection';
import { ProductCard } from './ProductCard';
import {
  ArrowRight,
  Sparkles,
  Flame,
  Clock,
  Tag,
  Star,
  Zap,
  ShieldCheck
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { products, setActiveView, setSelectedCategory } = useShop();

  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 8);
  const latestProducts = products.filter((p) => p.is_latest).slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* 1. Hero Banner with Guarantees */}
      <HeroBanner />

      {/* 2. Product Categories */}
      <CategorySection />

      {/* 3. Featured Products Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
              <Flame className="w-4 h-4 fill-rose-600" />
              <span>Handpicked Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Top customer favorites backed by unbeatable customer ratings
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory(null);
              setActiveView('shop');
            }}
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. Special Offers Promotional Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white p-8 sm:p-12 shadow-xl">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
              Flash Promotion · Limited Time
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Get 20% Off All Accessories & Shoes Today
            </h3>
            <p className="text-indigo-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Use promo code <strong className="text-amber-300 font-mono text-base">EASE20</strong> at
              checkout to redeem your special storewide discount on qualifying items.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setSelectedCategory('Accessories');
                  setActiveView('shop');
                }}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-colors"
              >
                Shop Accessories Deals
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('Shoes');
                  setActiveView('shop');
                }}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors"
              >
                Explore Footwear
              </button>
            </div>
          </div>

          <div className="md:col-span-4 hidden md:flex justify-center">
            <div className="w-48 h-48 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 flex flex-col items-center justify-center text-center rotate-3 shadow-2xl">
              <Tag className="w-12 h-12 text-amber-300 mb-2" />
              <span className="text-3xl font-black text-white">20% OFF</span>
              <span className="text-xs text-indigo-200 mt-1 font-mono">Code: EASE20</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Latest Arrivals Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Just Added to Inventory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Latest Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Fresh additions from premium designers and innovative audio brands
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory(null);
              setActiveView('shop');
            }}
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>See New Arrivals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>
    </div>
  );
};
