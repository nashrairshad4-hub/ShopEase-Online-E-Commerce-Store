import React from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct, toggleWishlist, isInWishlist } = useShop();

  const isFavorited = isInWishlist(product.id);
  const discountPercent =
    product.discount_price && product.price > product.discount_price
      ? Math.round(((product.price - product.discount_price) / product.price) * 100)
      : 0;

  const currentPrice = product.discount_price ?? product.price;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent > 0 && (
          <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white text-[11px] font-bold tracking-wide shadow-sm">
            -{discountPercent}% OFF
          </span>
        )}
        {product.is_featured && (
          <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-semibold uppercase tracking-wider shadow-sm">
            Featured
          </span>
        )}
        {product.is_latest && !product.is_featured && (
          <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-semibold uppercase tracking-wider shadow-sm">
            New
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        aria-label="Add to wishlist"
        className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md transition-all duration-200 ${
          isFavorited
            ? 'bg-rose-50 text-rose-500 shadow-sm'
            : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm'
        }`}
      >
        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
      </button>

      {/* Image Container with hover zoom */}
      <div
        onClick={() => setSelectedProduct(product)}
        className="relative aspect-square w-full bg-slate-50 cursor-pointer overflow-hidden group-hover:bg-slate-100/70 transition-colors"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Hover Quick Actions Bar */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Category & Stock Indicator */}
        <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
          <span className="font-semibold text-indigo-600 uppercase tracking-wider text-[11px]">
            {product.category}
          </span>

          {product.stock <= 0 ? (
            <span className="text-rose-600 font-medium">Out of stock</span>
          ) : product.stock <= 5 ? (
            <span className="text-amber-600 font-medium">Only {product.stock} left!</span>
          ) : (
            <span className="text-emerald-600 font-medium">In stock</span>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => setSelectedProduct(product)}
          className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors mb-1.5"
        >
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Ratings */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
          </div>
          <span className="text-xs font-bold text-slate-800">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-slate-400">({product.review_count})</span>
        </div>

        {/* Footer: Price & Add to Cart */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-slate-900">
                ${currentPrice.toFixed(2)}
              </span>
              {product.discount_price && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">
              SKU: {product.sku}
            </span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl font-medium transition-all flex items-center justify-center ${
              product.stock <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 active:scale-95'
            }`}
            title={product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
