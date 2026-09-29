import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, Order, OrderStatus, User, CustomerInfo, PaymentMethod } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/initialData';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface ShopContextType {
  // Navigation & Views
  activeView: 'home' | 'shop' | 'cart' | 'checkout' | 'orders' | 'profile' | 'admin' | 'django-hub' | 'about' | 'contact';
  setActiveView: (view: 'home' | 'shop' | 'cart' | 'checkout' | 'orders' | 'profile' | 'admin' | 'django-hub' | 'about' | 'contact') => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  // Catalog
  products: Product[];
  categories: Category[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  sortBy: 'featured' | 'price_low' | 'price_high' | 'newest' | 'rating';
  setSortBy: (sort: 'featured' | 'price_low' | 'price_high' | 'newest' | 'rating') => void;
  resetFilters: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTax: number;
  cartTotal: number;
  cartCount: number;
  couponCode: string;
  couponDiscountPercent: number;
  applyCoupon: (code: string) => boolean;

  // Wishlist
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;

  // Orders
  orders: Order[];
  createOrder: (customer: CustomerInfo, paymentMethod: PaymentMethod) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (order: Order | null) => void;

  // Authentication
  currentUser: User | null;
  login: (email: string, role?: 'customer' | 'admin') => boolean;
  register: (user: Partial<User>) => boolean;
  logout: () => void;
  updateUserProfile: (user: Partial<User>) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;

  // Admin features
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'review_count' | 'rating'>) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  deleteProduct: (id: number) => void;

  // Notifications
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  notify: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeView, setActiveView] = useState<'home' | 'shop' | 'cart' | 'checkout' | 'orders' | 'profile' | 'admin' | 'django-hub' | 'about' | 'contact'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Products & Categories
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('shopease_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 350]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'newest' | 'rating'>('featured');

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setPriceRange([0, 350]);
    setInStockOnly(false);
    setSortBy('featured');
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('shopease_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);

  // Wishlist
  const [wishlist, setWishlist] = useState<number[]>(() => {
    const saved = localStorage.getItem('shopease_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('shopease_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // User Auth
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('shopease_user');
    return saved ? JSON.parse(saved) : {
      id: 1,
      username: 'alex_demo',
      email: 'alex@example.com',
      first_name: 'Alex',
      last_name: 'Johnson',
      phone: '+1 (555) 349-2018',
      address: '450 Lexington Ave, Suite 14',
      city: 'New York',
      postal_code: '10017',
      role: 'customer'
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('shopease_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('shopease_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shopease_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('shopease_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('shopease_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('shopease_user');
    }
  }, [currentUser]);

  const notify = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock < 1) {
      notify('error', `${product.name} is currently out of stock.`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          notify('warning', `Only ${product.stock} units available in stock.`);
          return prevCart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: product.stock } : item
          );
        }
        notify('success', `Updated ${product.name} quantity to ${newQty}`);
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      notify('success', `Added ${product.name} to cart!`);
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (item) notify('info', `Removed ${item.product.name} from cart.`);
      return prev.filter((i) => i.product.id !== productId);
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          if (quantity > item.product.stock) {
            notify('warning', `Only ${item.product.stock} items available in stock.`);
            return { ...item, quantity: item.product.stock };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Coupon handling
  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WELCOME10') {
      setCouponCode('WELCOME10');
      setCouponDiscountPercent(10);
      notify('success', 'Coupon WELCOME10 applied! 10% discount added.');
      return true;
    } else if (clean === 'EASE20') {
      setCouponCode('EASE20');
      setCouponDiscountPercent(20);
      notify('success', 'Coupon EASE20 applied! 20% discount added.');
      return true;
    } else {
      notify('error', 'Invalid promo code. Try WELCOME10 or EASE20');
      return false;
    }
  };

  // Wishlist actions
  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        notify('info', 'Removed from wishlist.');
        return prev.filter((id) => id !== productId);
      } else {
        notify('success', 'Added to wishlist!');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: number) => wishlist.includes(productId);

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    const itemPrice = item.product.discount_price ?? item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const cartDiscount = (cartSubtotal * couponDiscountPercent) / 100;
  const cartShipping = cartSubtotal >= 50 || cartSubtotal === 0 ? 0 : 9.99;
  const cartTax = (cartSubtotal - cartDiscount) * 0.08;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping + cartTax);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Order Creation
  const createOrder = (customer: CustomerInfo, paymentMethod: PaymentMethod): Order => {
    const newOrderNumber = `SE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: newOrderNumber,
      customer,
      items: cart.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        price: item.product.discount_price ?? item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        subtotal: (item.product.discount_price ?? item.product.price) * item.quantity,
      })),
      subtotal: parseFloat(cartSubtotal.toFixed(2)),
      discount: parseFloat(cartDiscount.toFixed(2)),
      shipping: parseFloat(cartShipping.toFixed(2)),
      tax: parseFloat(cartTax.toFixed(2)),
      total_amount: parseFloat(cartTotal.toFixed(2)),
      payment_method: paymentMethod,
      status: 'Pending',
      created_at: new Date().toISOString(),
      estimated_delivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    // Deduct stock from products
    setProducts((prev) =>
      prev.map((prod) => {
        const boughtItem = cart.find((i) => i.product.id === prod.id);
        if (boughtItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - boughtItem.quantity),
          };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setLastCreatedOrder(newOrder);
    clearCart();
    notify('success', `Order #${newOrder.order_number} confirmed!`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    notify('info', `Order status updated to ${status}`);
  };

  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'Cancelled');
  };

  // Authentication
  const login = (email: string, role: 'customer' | 'admin' = 'customer'): boolean => {
    const isAlex = email.toLowerCase().includes('alex') || role === 'customer';
    const user: User = isAlex
      ? {
          id: 1,
          username: 'alex_demo',
          email: email || 'alex@example.com',
          first_name: 'Alex',
          last_name: 'Johnson',
          phone: '+1 (555) 349-2018',
          address: '450 Lexington Ave, Suite 14',
          city: 'New York',
          postal_code: '10017',
          role: 'customer',
        }
      : {
          id: 2,
          username: 'admin',
          email: email || 'admin@shopease.com',
          first_name: 'Site',
          last_name: 'Administrator',
          role: 'admin',
        };

    setCurrentUser(user);
    notify('success', `Welcome back, ${user.first_name}!`);
    return true;
  };

  const register = (data: Partial<User>): boolean => {
    const newUser: User = {
      id: Date.now(),
      username: data.username || 'newuser',
      email: data.email || 'user@example.com',
      first_name: data.first_name || 'Valued',
      last_name: data.last_name || 'Customer',
      phone: data.phone || '',
      address: data.address || '',
      city: data.city || '',
      postal_code: data.postal_code || '',
      role: 'customer',
    };
    setCurrentUser(newUser);
    notify('success', `Welcome to ShopEase, ${newUser.first_name}! Account created.`);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    notify('info', 'You have been logged out.');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    notify('success', 'Profile updated successfully.');
  };

  // Admin Actions
  const addProduct = (data: Omit<Product, 'id' | 'created_at' | 'review_count' | 'rating'>) => {
    const newProd: Product = {
      ...data,
      id: Date.now(),
      created_at: new Date().toISOString().split('T')[0],
      rating: 5.0,
      review_count: 0,
      gallery: data.gallery && data.gallery.length > 0 ? data.gallery : [data.image],
    };
    setProducts((prev) => [newProd, ...prev]);
    notify('success', `Product "${newProd.name}" added to inventory.`);
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    notify('success', 'Product inventory updated.');
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    notify('info', 'Product removed from catalog.');
  };

  return (
    <ShopContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedProduct,
        setSelectedProduct,
        products,
        categories,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        inStockOnly,
        setInStockOnly,
        sortBy,
        setSortBy,
        resetFilters,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTax,
        cartTotal,
        cartCount,
        couponCode,
        couponDiscountPercent,
        applyCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        lastCreatedOrder,
        setLastCreatedOrder,
        currentUser,
        login,
        register,
        logout,
        updateUserProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        addProduct,
        updateProduct,
        deleteProduct,
        toasts,
        dismissToast,
        notify,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
