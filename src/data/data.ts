import type { Product, Category, Tag } from '../lib/database.types';

export const products: Omit<Product, 'created_at' | 'updated_at'>[] = [
  {
    id: "birthday-cake-0001",
    name: "Birthday Celebration",
    description: "Colorful birthday cake with sprinkles and berries from fresh fig",
    price: 145,
    image_url: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category_id: "birthday-cakes-0001",
    tags: ["birthday-0001", "fruit-0001", "celebration-0001"]
  },
  {
    id: "chocolate-cake-0001",
    name: "Chocolate Dream",
    description: "Rich chocolate cake with ganache and chocolate shavings",
    price: 179,
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category_id: "chocolate-cakes-0001",
    tags: ["chocolate-0001", "rich-0001"]
  },
  {
    id: "chocolate-raspberry-0001",
    name: "Chocolate Raspberry Dream",
    description: "Decadent chocolate cake layered with fresh raspberries and dark chocolate ganache",
    price: 189,
    image_url: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category_id: "chocolate-cakes-0001",
    tags: ["chocolate-0001", "fruit-0001", "raspberry-0001"]
  },
  {
    id: "fruit-cake-0001",
    name: "Fresh Fruit Paradise",
    description: "Light sponge cake topped with fresh seasonal fruits",
    price: 195,
    image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category_id: "fruit-cakes-0001",
    tags: ["fruit-0001", "light-0001"]
  },
  {
    id: "wedding-cake-0001",
    name: "Elegant Anniversary",
    description: "Multi-layered buttercream cake with gold accents and roses",
    price: 245,
    image_url: "https://images.unsplash.com/photo-1543157145-f78c636d023d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category_id: "wedding-cakes-0001",
    tags: ["wedding-0001", "elegant-0001"]
  },
  {
    id: "wedding-cake-0002",
    name: "Elegant Anniversary Gold",
    description: "Multi-layered buttercream cake with gold accents and roses",
    price: 245,
    image_url: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category_id: "wedding-cakes-0001",
    tags: ["wedding-0001", "elegant-0001"]
  },
  {
    id: "wedding-cake-0003",
    name: "Classic Wedding Cake",
    description: "Elegant three-tier white cake with white fondant and sugar flowers",
    price: 299,
    image_url: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category_id: "wedding-cakes-0001",
    tags: ["wedding-0001", "classic-0001"]
  }
];

export const categories: Omit<Category, 'created_at' | 'updated_at'>[] = [
  {
    id: "birthday-cakes-0001",
    name: "Birthday Cakes",
    description: "Perfect cakes for celebrating birthdays"
  },
  {
    id: "wedding-cakes-0001",
    name: "Wedding Cakes",
    description: "Elegant cakes for your special day"
  },
  {
    id: "chocolate-cakes-0001",
    name: "Chocolate Cakes",
    description: "Rich and decadent chocolate cakes"
  },
  {
    id: "fruit-cakes-0001",
    name: "Fruit Cakes",
    description: "Fresh and light fruit-based cakes"
  }
];

export const tags: Omit<Tag, 'created_at' | 'updated_at'>[] = [
  {
    id: "birthday-0001",
    name: "Birthday",
    description: "Perfect for birthday celebrations"
  },
  {
    id: "wedding-0001",
    name: "Wedding",
    description: "Ideal for wedding ceremonies"
  },
  {
    id: "chocolate-0001",
    name: "Chocolate",
    description: "Contains chocolate"
  },
  {
    id: "fruit-0001",
    name: "Fruit",
    description: "Contains fresh fruits"
  },
  {
    id: "raspberry-0001",
    name: "Raspberry",
    description: "Contains raspberries"
  },
  {
    id: "light-0001",
    name: "Light",
    description: "Light and airy texture"
  },
  {
    id: "rich-0001",
    name: "Rich",
    description: "Rich and decadent"
  },
  {
    id: "elegant-0001",
    name: "Elegant",
    description: "Elegant design"
  },
  {
    id: "classic-0001",
    name: "Classic",
    description: "Classic style"
  },
  {
    id: "celebration-0001",
    name: "Celebration",
    description: "Perfect for celebrations"
  }
];
