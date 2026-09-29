/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ShopView } from './components/ShopView';
import { CartPage } from './components/CartPage';
import { CheckoutView } from './components/CheckoutView';
import { OrderHistoryView } from './components/OrderHistoryView';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminPortal } from './components/AdminPortal';
import { DjangoExportHub } from './components/DjangoExportHub';
import { AboutContactView } from './components/AboutContactView';
import { ProductModal } from './components/ProductModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeView } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && <HomeView />}
        {activeView === 'shop' && <ShopView />}
        {activeView === 'cart' && <CartPage />}
        {activeView === 'checkout' && <CheckoutView />}
        {activeView === 'orders' && <OrderHistoryView />}
        {activeView === 'profile' && <UserProfileModal />}
        {activeView === 'admin' && <AdminPortal />}
        {activeView === 'django-hub' && <DjangoExportHub />}
        {activeView === 'about' && <AboutContactView type="about" />}
        {activeView === 'contact' && <AboutContactView type="contact" />}
      </main>

      {/* Global Overlays & Modals */}
      <ProductModal />
      <AuthModal />
      <ToastContainer />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
