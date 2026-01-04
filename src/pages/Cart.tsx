import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/CartItem';

export const Cart = () => {
  const { cart, getTotalPrice, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-linen-50">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold mb-4 text-charcoal-500">Your Cart</h1>
            <p className="text-lg text-charcoal-400 mb-8">Your cart is empty.</p>
            <Link to="/shop" className="btn-linen">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen-50">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl font-bold text-charcoal-500">Your Cart</h1>
          <button
            onClick={clearCart}
            className="text-sm text-charcoal-400 hover:text-charcoal-500 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {cart.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>

        <div className="bg-white border border-linen-300 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium text-charcoal-500">Subtotal</span>
            <span className="font-display text-2xl font-semibold text-charcoal-500">
              ${getTotalPrice().toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-charcoal-400 mb-6">
            Shipping and taxes calculated at checkout.
          </p>
          <Link
            to="/checkout"
            className="btn-linen w-full text-center block"
          >
            Proceed to Checkout
          </Link>
        </div>

        <Link
          to="/shop"
          className="text-charcoal-400 hover:text-sage-400 transition-colors inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

