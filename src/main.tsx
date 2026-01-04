import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Pricing } from './pages/Pricing.tsx'
import { Booking } from './pages/Booking.tsx'
import { LanguageProvider } from './LanguageContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <Routes>
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/sv/pricing" element={<Pricing />} />
          <Route path="/booking/:packageName" element={<Booking />} />
          <Route path="/sv/booking/:packageName" element={<Booking />} />
          <Route path="/sv" element={<App />} />
          <Route path="/sv/*" element={<App />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
