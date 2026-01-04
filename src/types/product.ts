export type ProductCategory = 'cleaning' | 'home-decor' | 'personal-care';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  inStock: boolean;
};
