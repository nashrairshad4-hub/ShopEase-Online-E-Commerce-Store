import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Truck,
  Headphones,
  Shirt,
  Sparkles,
  Coffee,
  Watch,
  Footprints,
  LogOut,
  Sliders,
  PackageCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartCount,
    wishlist,
    currentUser,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    products,
    setSelectedProduct,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchSuggestions = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Electronics':
        return <Headphones className="w-4 h-4 text-blue-500" />;
      case 'Fashion':
        return <Shirt className="w-4 h-4 text-rose-500" />;
      case 'Shoes':
        return <Footprints className="w-4 h-4 text-emerald-500" />;
      case 'Beauty':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'Home & Kitchen':
        return <Coffee className="w-4 h-4 text-orange-500" />;
      case 'Accessories':
        return <Watch className="w-4 h-4 text-purple-500" />;
      default:
        return <ShoppingBag className="w-4 h-4" />;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveView('shop');
    setSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Truck className="w-3.5 h-3.5" />
              Free shipping on orders over $50
            </span>
            <span className="hidden sm:inline-block text-slate-500">|</span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Secure & Encrypted Checkout
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeView === 'admin'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => {
                setActiveView('home');
                setSelectedCategory(null);
              }}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center">
                  Shop<span className="text-indigo-600">Ease</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block leading-none">
                  Online Store
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => {
                setActiveView('home');
                setSelectedCategory(null);
              }}
              className={`text-sm font-semibold transition-colors ${
                activeView === 'home' && !selectedCategory ? 'text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => {
                setActiveView('shop');
                setSelectedCategory(null);
              }}
              className={`text-sm font-semibold transition-colors ${
                activeView === 'shop' && !selectedCategory ? 'text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
              }`}
            >
              Shop
            </button>

            {/* Categories Dropdown */}
            <div className="relative" ref={catRef}>
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                  selectedCategory ? 'text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
                }`}
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Browse Catalog
                  </div>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setActiveView('shop');
                        setCategoriesDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        {getCategoryIcon(cat.name)}
                        {cat.name}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {products.filter((p) => p.category === cat.name).length}
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setActiveView('shop');
                        setCategoriesDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-1.5 text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      View All Categories &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveView('about')}
              className={`text-sm font-semibold transition-colors ${
                activeView === 'about' ? 'text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
              }`}
            >
              About
            </button>

            <button
              onClick={() => setActiveView('contact')}
              className={`text-sm font-semibold transition-colors ${
                activeView === 'contact' ? 'text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative hidden md:block" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search products, shoes, tech, fashion..."
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-100 border border-transparent focus:border-indigo-400 focus:bg-white focus:outline-none text-sm text-slate-800 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Autocomplete Dropdown */}
            {searchFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                {searchSuggestions.length > 0 ? (
                  <div>
                    <div className="px-3.5 py-1 text-xs font-semibold text-slate-400 uppercase">
                      Matching Products
                    </div>
                    {searchSuggestions.map((prod) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => {
                          setSelectedProduct(prod);
                          setSearchFocused(false);
                        }}
                        className="w-full flex items-center gap-3 px-3.5 py-2 hover:bg-slate-50 text-left transition-colors"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-9 h-9 rounded object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{prod.name}</p>
                          <span className="text-xs text-slate-400">{prod.category}</span>
                        </div>
                        <span className="text-sm font-bold text-indigo-600 shrink-0">
                          ${prod.discount_price ?? prod.price}
                        </span>
                      </button>
                    ))}
                    <div className="border-t border-slate-100 mt-1 pt-1 px-3.5">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveView('shop');
                          setSearchFocused(false);
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:underline py-1 block w-full text-center"
                      >
                        View all results for &quot;{searchQuery}&quot; &rarr;
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-3 text-center text-sm text-slate-500">
                    No products found matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons & Authentication */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist */}
            <button
              onClick={() => {
                setActiveView('shop');
              }}
              title="Saved items"
              className="relative p-2 rounded-xl text-slate-600 hover:text-rose-500 hover:bg-slate-100 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart */}
            <button
              onClick={() => setActiveView('cart')}
              title="Shopping Cart"
              className="relative p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={userRef}>
              {currentUser ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {currentUser.first_name[0]}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 max-w-[90px] truncate">
                    {currentUser.first_name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalMode('register');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-800 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                      {currentUser.role}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveView('profile');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('orders');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <PackageCheck className="w-4 h-4 text-slate-400" />
                    Order History
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('admin');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Sliders className="w-4 h-4 text-indigo-500" />
                    Admin Panel
                  </button>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 text-sm focus:outline-none focus:bg-white border border-transparent focus:border-indigo-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          <button
            onClick={() => {
              setActiveView('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-50"
          >
            Home
          </button>
          <button
            onClick={() => {
              setActiveView('shop');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-50"
          >
            Shop All Products
          </button>
          <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase">Categories</div>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCategory(c.name);
                setActiveView('shop');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              {getCategoryIcon(c.name)}
              {c.name}
            </button>
          ))}
          <div className="border-t border-slate-100 pt-2 space-y-1">
            <button
              onClick={() => {
                setActiveView('about');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-sm font-semibold text-slate-600"
            >
              About ShopEase
            </button>
            <button
              onClick={() => {
                setActiveView('contact');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-sm font-semibold text-slate-600"
            >
              Contact Support
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
