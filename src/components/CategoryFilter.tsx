type ProductCategory = 'cleaning' | 'home-decor' | 'personal-care';

interface CategoryFilterProps {
  selectedCategory: ProductCategory | 'all';
  onCategoryChange: (category: ProductCategory | 'all') => void;
}

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const categories: { value: ProductCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Products' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'home-decor', label: 'Home Decor' },
    { value: 'personal-care', label: 'Personal Care' },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
            selectedCategory === category.value
              ? 'bg-sage-300 text-white shadow-md'
              : 'bg-white border border-linen-300 text-charcoal-400 hover:border-sage-300 hover:text-sage-400'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

