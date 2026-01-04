import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'cleaning' | 'home-decor' | 'personal-care';
  image: string;
  inStock: boolean;
};

type CartItemType = {
  product: Product;
  quantity: number;
};

interface CartItemComponentProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemComponentProps) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-white border border-linen-300 rounded-lg">
      <Link to={`/product/${product.id}`} className="flex-shrink-0">
        <div className="w-20 h-20 bg-linen-100 rounded-lg overflow-hidden">
          <img
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display font-semibold text-charcoal-500 hover:text-sage-400 transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-charcoal-400 mb-2">${product.price.toFixed(2)} each</p>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-linen-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-3 py-1 text-charcoal-400 hover:text-charcoal-500 hover:bg-linen-100 transition-colors"
            >
              −
            </button>
            <span className="px-3 py-1 text-charcoal-500 font-medium min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-3 py-1 text-charcoal-400 hover:text-charcoal-500 hover:bg-linen-100 transition-colors"
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeFromCart(product.id)}
            className="text-sm text-charcoal-400 hover:text-charcoal-500 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="text-right">
        <p className="font-display font-semibold text-charcoal-500">
          ${(product.price * quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};
