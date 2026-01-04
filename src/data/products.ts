type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'cleaning' | 'home-decor' | 'personal-care';
  image: string;
  inStock: boolean;
};

export const products: Product[] = [
  // Cleaning Products
  {
    id: '1',
    name: 'Natural All-Purpose Cleaner',
    description: 'Gentle yet effective cleaning solution made with plant-based ingredients. Safe for all surfaces.',
    price: 24.99,
    category: 'cleaning',
    image: '/placeholder-product.jpg',
    inStock: true,
  },
  {
    id: '2',
    name: 'Lavender Laundry Detergent',
    description: 'Eco-friendly laundry detergent with soothing lavender scent. Free from harsh chemicals.',
    price: 32.99,
    category: 'cleaning',
    image: '/placeholder-product.jpg',
    inStock: true,
  },
  {
    id: '3',
    name: 'Bamboo Dish Soap',
    description: 'Biodegradable dish soap with natural bamboo extract. Cuts through grease without toxins.',
    price: 18.99,
    category: 'cleaning',
    image: '/placeholder-product.jpg',
    inStock: true,
  },
  {
    id: '4',
    name: 'Glass Cleaner Spray',
    description: 'Streak-free glass cleaner made with vinegar and essential oils. Perfect for windows and mirrors.',
    price: 16.99,
    category: 'cleaning',
    image: '/placeholder-product.jpg',
    inStock: true,
  },
  // Home Decor
  {
    id: '5',
    name: 'Linen Throw Pillow',
    description: 'Soft, organic linen throw pillow. Handcrafted with natural dyes. Perfect for any room.',
    price: 45.99,
    category: 'home-decor',
    image: '/placeholder-product.jpg',
    inStock: true,
  },
  {
    id: '6',
    name: 'Cedar Wood Candle',
    description: 'Natural soy wax candle with cedarwood essential oil. Burns clean for 40+ hours.',
    price: 28.99,
    category: 'home-decor',
    image: '/placeholder-product.jpg',
    inStock: true,
  },
  {
    id: '7',
    name: 'Jute Storage Basket',
    description: 'Handwoven jute basket for storage. Natural, sustainable, and beautifully crafted.',
    price: 39.99,
    category: 'home-decor',
    image: '/placeholder-product.jpg',
    inStock: true,
  },
  {
    id: '8',
    name: 'Organic Cotton Table Runner',
    description: 'Elegant table runner made from 100% organic cotton. Available in natural and soft pastel colors.',
    price: 34.99,
    category: 'home-decor',
    image: '/placeholder-product.jpg',
    inStock: true,
  },
  // Personal Care
  {
    id: '9',
    name: 'Sage & Eucalyptus Body Wash',
    description: 'Nourishing body wash with sage and eucalyptus. Gentle on skin, refreshing for the senses.',
    price: 22.99,
    category: 'personal-care',
    image: '/placeholder-product.jpg',
    inStock: true,
  },
  {
    id: '10',
    name: 'Lavender Hand Cream',
    description: 'Rich, moisturizing hand cream with lavender and shea butter. Soothes dry, cracked hands.',
    price: 19.99,
    category: 'personal-care',
    image: '/placeholder-product.jpg',
    inStock: true,
  },
  {
    id: '11',
    name: 'Natural Deodorant',
    description: 'Aluminum-free deodorant with baking soda and essential oils. Effective and gentle.',
    price: 15.99,
    category: 'personal-care',
    image: '/placeholder-product.jpg',
    inStock: true,
  },
  {
    id: '12',
    name: 'Rosehip Face Oil',
    description: 'Pure rosehip oil for face and body. Rich in antioxidants, promotes healthy, glowing skin.',
    price: 29.99,
    category: 'personal-care',
    image: '/placeholder-product.jpg',
    inStock: true,
  },
];

