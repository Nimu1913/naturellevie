import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Shop } from './pages/Shop.tsx'
import { ProductDetail } from './pages/ProductDetail.tsx'
import { Cart } from './pages/Cart.tsx'
import { Checkout } from './pages/Checkout.tsx'
import { LanguageProvider } from './LanguageContext.tsx'
import { CartProvider } from './context/CartContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <CartProvider>
          <Routes>
            <Route path="/shop" element={<Shop />} />
            <Route path="/sv/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/sv/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/sv/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/sv/checkout" element={<Checkout />} />
            <Route path="/sv" element={<App />} />
            <Route path="/sv/*" element={<App />} />
            <Route path="/*" element={<App />} />
          </Routes>
        </CartProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
