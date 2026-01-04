import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { CategoryFilter } from '../components/CategoryFilter';

type ProductCategory = 'cleaning' | 'home-decor' | 'personal-care';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as ProductCategory | null;
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(
    categoryParam && ['cleaning', 'home-decor', 'personal-care'].includes(categoryParam) 
      ? categoryParam 
      : 'all'
  );

  useEffect(() => {
    if (categoryParam && ['cleaning', 'home-decor', 'personal-care'].includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryChange = (category: ProductCategory | 'all') => {
    setSelectedCategory(category);
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-linen-50">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-charcoal-500">
            Our Products
          </h1>
          <p className="text-lg text-charcoal-400 max-w-2xl">
            Discover our curated selection of natural and non-toxic home products. 
            Made with care for you and the environment.
          </p>
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-charcoal-400 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

