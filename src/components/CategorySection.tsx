import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  Headphones,
  Shirt,
  Footprints,
  Sparkles,
  Coffee,
  Watch,
  ArrowRight
} from 'lucide-react';

export const CategorySection: React.FC = () => {
  const { categories, setSelectedCategory, setActiveView, products } = useShop();

  const getIcon = (name: string) => {
    switch (name) {
      case 'Electronics':
        return <Headphones className="w-5 h-5" />;
      case 'Fashion':
        return <Shirt className="w-5 h-5" />;
      case 'Shoes':
        return <Footprints className="w-5 h-5" />;
      case 'Beauty':
        return <Sparkles className="w-5 h-5" />;
      case 'Home & Kitchen':
        return <Coffee className="w-5 h-5" />;
      case 'Accessories':
        return <Watch className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Curated Collections
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse by Category
          </h2>
        </div>

        <button
          onClick={() => {
            setSelectedCategory(null);
            setActiveView('shop');
          }}
          className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
        >
          <span>Explore All</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat.name).length;

          return (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.name);
                setActiveView('shop');
              }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 bg-white flex flex-col"
            >
              {/* Image with zoom effect */}
              <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Floating Icon */}
                <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/90 backdrop-blur text-slate-900 flex items-center justify-center shadow-md">
                  {getIcon(cat.name)}
                </div>
              </div>

              {/* Text content */}
              <div className="p-3.5 flex flex-col justify-between flex-1">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {count} {count === 1 ? 'Product' : 'Products'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
