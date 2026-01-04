import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-linen-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold mb-4 text-charcoal-500">Product Not Found</h1>
          <Link to="/shop" className="btn-linen">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-linen-50">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <button
          onClick={() => navigate(-1)}
          className="text-charcoal-400 hover:text-sage-400 mb-8 flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="product-image aspect-square bg-linen-100 rounded-lg overflow-hidden">
            <img
              src={product.image || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div>
            <span className="category-badge mb-4">
              {product.category.replace('-', ' ')}
            </span>

            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-charcoal-500">
              {product.name}
            </h1>

            <p className="text-2xl font-semibold text-charcoal-500 mb-6">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-lg text-charcoal-400 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className={`text-sm font-medium ${product.inStock ? 'text-sage-400' : 'text-charcoal-300'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                {quantityInCart > 0 && (
                  <span className="text-sm text-charcoal-400">
                    ({quantityInCart} in cart)
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="btn-linen w-full md:w-auto px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            <div className="border-t border-linen-300 pt-6">
              <h2 className="font-display text-xl font-semibold mb-3 text-charcoal-500">
                Why Choose Natural?
              </h2>
              <ul className="space-y-2 text-charcoal-400">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-sage-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free from harsh chemicals and toxins</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-sage-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Safe for your family and pets</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-sage-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Eco-friendly and sustainable</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-sage-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Made with natural, plant-based ingredients</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

