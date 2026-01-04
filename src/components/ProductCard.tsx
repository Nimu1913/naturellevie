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

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="linen-card h-full flex flex-col group">
        <div className="product-image aspect-square mb-4 bg-linen-100 rounded-lg overflow-hidden">
          <img
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          <span className="category-badge mb-2 self-start">
            {product.category.replace('-', ' ')}
          </span>
          
          <h3 className="font-display text-lg font-semibold mb-2 text-charcoal-500 group-hover:text-sage-400 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-charcoal-400 mb-4 line-clamp-2 flex-1">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-linen-300">
            <span className="font-display text-xl font-semibold text-charcoal-500">
              ${product.price.toFixed(2)}
            </span>
            
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="btn-linen text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

