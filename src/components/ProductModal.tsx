import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Star,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  Check,
  RotateCcw,
  Zap
} from 'lucide-react';

export const ProductModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    products,
    setActiveView,
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!selectedProduct) return null;

  const isFavorited = isInWishlist(selectedProduct.id);
  const currentPrice = selectedProduct.discount_price ?? selectedProduct.price;
  const discountSavings = selectedProduct.discount_price
    ? (selectedProduct.price - selectedProduct.discount_price).toFixed(2)
    : null;

  const galleryImages =
    selectedProduct.gallery && selectedProduct.gallery.length > 0
      ? selectedProduct.gallery
      : [selectedProduct.image];

  const relatedProducts = products
    .filter((p) => p.category === selectedProduct.category && p.id !== selectedProduct.id)
    .slice(0, 4);

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setActiveView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Shop</span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">{selectedProduct.category}</span>
            <span>/</span>
            <span className="truncate max-w-[200px]">{selectedProduct.name}</span>
          </div>

          <button
            onClick={() => setSelectedProduct(null)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Gallery Left */}
            <div className="md:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={galleryImages[activeImageIndex] || selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover object-center"
                />

                {selectedProduct.discount_price && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-md">
                    SAVE ${discountSavings}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx
                          ? 'border-indigo-600 scale-95 shadow-md'
                          : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Right */}
            <div className="md:col-span-6 space-y-5">
              <div>
                <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                  {selectedProduct.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 leading-tight">
                  {selectedProduct.name}
                </h2>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="ml-1 font-bold text-slate-800">{selectedProduct.rating.toFixed(1)}</span>
                  </div>
                  <span>•</span>
                  <span>{selectedProduct.review_count} customer reviews</span>
                  <span>•</span>
                  <span className="font-mono text-slate-400">SKU: {selectedProduct.sku}</span>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-3xl font-extrabold text-indigo-600">
                  ${currentPrice.toFixed(2)}
                </span>
                {selectedProduct.discount_price && (
                  <>
                    <span className="text-base text-slate-400 line-through">
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      Save ${discountSavings}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Features List */}
              {selectedProduct.features && selectedProduct.features.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Key Highlights
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedProduct.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-700">Availability:</span>
                {selectedProduct.stock > 5 ? (
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    In Stock ({selectedProduct.stock} units available)
                  </span>
                ) : selectedProduct.stock > 0 ? (
                  <span className="text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    Low Stock: Only {selectedProduct.stock} left
                  </span>
                ) : (
                  <span className="text-rose-700 font-semibold bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Quantity Picker & Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-sm font-bold text-slate-800 font-mono">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(selectedProduct.stock, q + 1))}
                      disabled={quantity >= selectedProduct.stock}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={() => {
                      addToCart(selectedProduct, quantity);
                      setSelectedProduct(null);
                    }}
                    disabled={selectedProduct.stock <= 0}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  {/* Wishlist toggle */}
                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`p-3 rounded-xl border transition-colors ${
                      isFavorited
                        ? 'bg-rose-50 border-rose-200 text-rose-500'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Instant Buy Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={selectedProduct.stock <= 0}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Buy Now with 1-Click Checkout</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-[11px] text-slate-500">
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span>Free delivery over $50</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>2-Year Warranty</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50">
                  <RotateCcw className="w-4 h-4 text-sky-600" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Carousel/Grid */}
          {relatedProducts.length > 0 && (
            <div className="pt-8 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Related in {selectedProduct.category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      setSelectedProduct(rel);
                      setQuantity(1);
                      setActiveImageIndex(0);
                    }}
                    className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer bg-white group"
                  >
                    <div className="aspect-square rounded-lg bg-slate-100 overflow-hidden mb-2">
                      <img
                        src={rel.image}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h5 className="text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-indigo-600">
                      {rel.name}
                    </h5>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-extrabold text-indigo-600">
                        ${(rel.discount_price ?? rel.price).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-amber-500 font-bold">★ {rel.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
