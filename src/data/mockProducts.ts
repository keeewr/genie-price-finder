import { Product } from "@/components/ProductCard";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "Electronics",
    prices: [
      { platform: "amazon", price: 29990, url: "https://amazon.in", inStock: true },
      { platform: "flipkart", price: 28999, url: "https://flipkart.com", inStock: true },
      { platform: "tira", price: 31500, url: "https://tira.com", inStock: false },
    ],
  },
  {
    id: "2",
    name: "Apple MacBook Air M2 Chip 13.6-inch Laptop",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
    category: "Electronics",
    prices: [
      { platform: "amazon", price: 114990, url: "https://amazon.in", inStock: true },
      { platform: "flipkart", price: 112900, url: "https://flipkart.com", inStock: true },
      { platform: "myntra", price: 119990, url: "https://myntra.com", inStock: true },
    ],
  },
  {
    id: "3",
    name: "Nike Air Max 270 Running Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    category: "Fashion",
    prices: [
      { platform: "amazon", price: 12995, url: "https://amazon.in", inStock: true },
      { platform: "myntra", price: 11499, url: "https://myntra.com", inStock: true },
      { platform: "flipkart", price: 13499, url: "https://flipkart.com", inStock: true },
    ],
  },
  {
    id: "4",
    name: "Samsung Galaxy S24 Ultra 5G (256GB)",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop",
    category: "Electronics",
    prices: [
      { platform: "amazon", price: 124999, url: "https://amazon.in", inStock: true },
      { platform: "flipkart", price: 119999, url: "https://flipkart.com", inStock: true },
      { platform: "tira", price: 129999, url: "https://tira.com", inStock: false },
    ],
  },
  {
    id: "5",
    name: "L'Oreal Paris Revitalift Hyaluronic Acid Serum",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop",
    category: "Beauty",
    prices: [
      { platform: "amazon", price: 899, url: "https://amazon.in", inStock: true },
      { platform: "tira", price: 799, url: "https://tira.com", inStock: true },
      { platform: "myntra", price: 850, url: "https://myntra.com", inStock: true },
    ],
  },
  {
    id: "6",
    name: "Levi's Men's Slim Fit Jeans",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop",
    category: "Fashion",
    prices: [
      { platform: "amazon", price: 2199, url: "https://amazon.in", inStock: true },
      { platform: "flipkart", price: 1999, url: "https://flipkart.com", inStock: true },
      { platform: "myntra", price: 2099, url: "https://myntra.com", inStock: true },
    ],
  },
  {
    id: "7",
    name: "boAt Airdopes 141 True Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop",
    category: "Electronics",
    prices: [
      { platform: "amazon", price: 1299, url: "https://amazon.in", inStock: true },
      { platform: "flipkart", price: 1199, url: "https://flipkart.com", inStock: true },
      { platform: "myntra", price: 1399, url: "https://myntra.com", inStock: false },
    ],
  },
  {
    id: "8",
    name: "Maybelline Fit Me Matte + Poreless Foundation",
    image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=500&h=500&fit=crop",
    category: "Beauty",
    prices: [
      { platform: "amazon", price: 529, url: "https://amazon.in", inStock: true },
      { platform: "tira", price: 499, url: "https://tira.com", inStock: true },
      { platform: "flipkart", price: 549, url: "https://flipkart.com", inStock: true },
    ],
  },
];
