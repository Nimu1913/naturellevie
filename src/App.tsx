import { Link } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ProductCard } from './components/ProductCard';
import { products } from './data/products';
import { useCart } from './context/CartContext';
import logoSmall from './assets/logonaturellevie.svg';
import heroVideo from './assets/75bd3b06-6c72-422e-9c8d-32efb70cb0e6-video.mp4';

function App() {
  const { t } = useLanguage();
  const { getTotalItems } = useCart();

  // Featured products for homepage
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="relative min-h-screen bg-linen-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 bg-linen-50/35 backdrop-blur-md border-b border-linen-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <img src={logoSmall} alt="Naturellevie" className="h-12 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/shop"
              className="text-charcoal-500 hover:text-sage-400 transition-colors font-medium"
            >
              Shop
            </Link>
            <Link
              to="/cart"
              className="relative text-charcoal-500 hover:text-sage-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-sage-300 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden text-center">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-linen-50/70 z-0" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 w-full">
          <div className="flex flex-col items-center w-full">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 text-charcoal-500 w-full">
              Natural Home,
              <br />
              <span className="gradient-text">Naturally Better</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-charcoal-400 max-w-2xl mx-auto mb-12 font-light text-center leading-relaxed">
              Discover our curated collection of non-toxic, natural home products. 
              Made with care for you and the environment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/shop" className="btn-linen">
                Shop Now
              </Link>
              <Link to="/shop?category=cleaning" className="btn-linen-outline">
                Explore Cleaning
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="font-mono text-sage-400 text-sm uppercase tracking-widest">Our Products</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-charcoal-500">
              Featured <span className="gradient-text">Collection</span>
            </h2>
            <p className="text-lg text-charcoal-400 mt-4 max-w-2xl mx-auto">
              Handpicked natural products for a healthier home
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/shop" className="btn-linen-outline">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Natural Section */}
      <section className="relative py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="soft-border p-8 md:p-12">
            <div className="text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-charcoal-500">
                Why Choose Natural?
              </h2>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-sage-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2 text-charcoal-500">Non-Toxic</h3>
                  <p className="text-charcoal-400">Free from harsh chemicals and toxins</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-forest-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2 text-charcoal-500">Eco-Friendly</h3>
                  <p className="text-charcoal-400">Sustainable and environmentally conscious</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-earth-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-earth-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2 text-charcoal-500">Safe for Family</h3>
                  <p className="text-charcoal-400">Gentle and safe for everyone</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 relative text-charcoal-500">
            Ready to Transform
            <br />
            <span className="gradient-text">Your Home?</span>
          </h2>
          
          <p className="text-xl text-charcoal-400 mb-10 max-w-2xl mx-auto">
            Start your journey to a healthier, more natural home today. 
            Browse our collection and find products you'll love.
          </p>
          
          <Link to="/shop" className="btn-linen inline-flex items-center gap-3 text-lg">
            <span>Shop Now</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-linen-300 py-8 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logoSmall} alt="Naturellevie" className="h-10 w-auto" />
          </div>
          
          <p className="text-charcoal-400 text-sm font-mono">
            © {new Date().getFullYear()} Naturellevie.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
