import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { MobileBottomBar } from './components/common/MobileBottomBar';
import { CollaborationLoadingScreen } from './components/common/CollaborationLoadingScreen';

// Pages
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { WomensComingSoon } from './pages/WomensComingSoon';
import { ProductDetails } from './pages/ProductDetails';
import { SearchResults } from './pages/SearchResults';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { Account } from './pages/Account';
import { Admin } from './pages/Admin';
import { AdminLogin } from './pages/AdminLogin';
import { AdminUnauthorized } from './pages/AdminUnauthorized';
import { AdminRoute } from './components/auth/AdminRoute';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="flex flex-col min-h-screen bg-[#F8F0E2] selection:bg-[#4A0E1C] selection:text-[#F8F0E2] font-sans">
                <CollaborationLoadingScreen />
                <Navbar />
                <CartDrawer />

                <main className="flex-1 pb-16 lg:pb-0">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/men" element={<CategoryPage forcedCategory="men" />} />
                    <Route path="/women" element={<WomensComingSoon />} />
                    <Route path="/shoes" element={<CategoryPage forcedCategory="shoes" />} />
                    <Route path="/perfumes" element={<CategoryPage forcedCategory="perfumes" />} />
                    <Route path="/new-arrivals" element={<CategoryPage forcedCategory="new-arrivals" />} />
                    <Route path="/sale" element={<CategoryPage forcedCategory="sale" />} />
                    <Route path="/category/:categoryName" element={<CategoryPage />} />
                    <Route path="/product/:productId" element={<ProductDetails />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/unauthorized" element={<AdminUnauthorized />} />
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <Admin />
                        </AdminRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>

                <Footer />
                <MobileBottomBar />
              </div>
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
