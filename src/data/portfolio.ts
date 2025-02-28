import type { PortfolioItem, PortfolioCategory } from '../lib/portfolio.types';

export const portfolioCategories: PortfolioCategory[] = [
  {
    id: "specialty-portfolio-0001",
    name: "Specialty Cakes",
    description: "Unique signature cakes with special ingredients and flavors",
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "chocolate-portfolio-0001",
    name: "Chocolate Cakes",
    description: "Rich chocolate cakes with various fillings and decorations",
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "berry-portfolio-0001",
    name: "Berry Cakes",
    description: "Delicious cakes with fresh berry flavors and fillings",
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  ,{
  id: "bento-portfolio-0001",
    name: "Bento Cakes",
    description: "Small, beautifully decorated cakes designed for 1-2 people",
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: "meringue-roll-0001",
    name: "Meringue Roll Delight",
    description: "Delicate meringue roll with cream cheese filling",
    composition: "Egg white meringue\nCream cheese filling\nFresh berries\nPowdered sugar dusting",
    price: 35,
    images: [
      "https://i.imgur.com/oLDoOcL.jpeg",
      "https://imgur.com/viRT476.jpeg",
      "https://i.imgur.com/0X95AOD.jpeg",
      "https://i.imgur.com/3W1pJO8.mp4"
    ],
    category_id: "specialty-portfolio-0001",
    tags: ["meringue", "cream cheese", "light"],
    weight_kg: 1.2,
    completion_date: "2024-02-15",
    customer_review: {
      rating: 5,
      text: "The meringue was perfectly crispy on the outside and soft inside. The cream cheese filling was divine!",
      customer_name: "Sarah",
      review_date: "2024-02-16"
    },
    order_details: {
      special_requests: "Extra berries for decoration",
      occasion: "Birthday celebration",
      serving_size: 8
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "snickers-cake-0001",
    name: "Snickers Dream Cake",
    description: "Decadent chocolate cake with chocolate ganache and salted caramel peanut layers",
    composition: "Chocolate sponge layers\nTwo layers of chocolate ganache (chocolate with cream)\nSalted caramel with peanuts\nChocolate drip",
    price: 65,
    images: [
      "https://i.imgur.com/EUfdemX.jpeg",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=989&auto=format&fit=crop"
    ],
    category_id: "chocolate-portfolio-0001",
    tags: ["chocolate", "caramel", "peanuts", "ganache"],
    weight_kg: 2.3,
    completion_date: "2024-02-18",
    customer_review: {
      rating: 5,
      text: "This cake is absolutely incredible! The combination of chocolate, caramel, and peanuts is perfect. Everyone loved it!",
      customer_name: "Michael",
      review_date: "2024-02-19"
    },
    order_details: {
      special_requests: "Extra crunchy peanuts",
      occasion: "Family gathering",
      serving_size: 16
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "baileys-chocolate-0001",
    name: "Chocolate Baileys Fusion",
    description: "Luxurious chocolate cake with Baileys-infused ganache and cheesecake layers",
    composition: "Chocolate sponge\nBaileys chocolate ganache\nCheesecake layer\nChocolate decoration",
    price: 70,
    images: [
      "https://i.imgur.com/9jB3r3p.jpeg",
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=930&auto=format&fit=crop"
    ],
    category_id: "chocolate-portfolio-0001",
    tags: ["chocolate", "baileys", "cheesecake", "alcohol"],
    weight_kg: 2.4,
    completion_date: "2024-02-20",
    customer_review: {
      rating: 5,
      text: "The perfect adult dessert! The Baileys flavor is subtle but present, and the combination with cheesecake is genius.",
      customer_name: "Emma",
      review_date: "2024-02-21"
    },
    order_details: {
      special_requests: "Extra Baileys flavor",
      occasion: "Anniversary celebration",
      serving_size: 18
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "cherry-chocolate-0001",
    name: "Black Forest Dream",
    description: "Rich chocolate cake with cherry filling and chocolate cream cheese frosting",
    composition: "Chocolate sponge layers\nChocolate cream cheese frosting\nTwo layers of cherry filling\nChocolate shavings",
    price: 60,
    images: [
      "https://i.imgur.com/DAJ2yK3.jpeg",
      "https://images.unsplash.com/photo-1622621746668-59fb299bc4d7?q=80&w=987&auto=format&fit=crop"
    ],
    category_id: "chocolate-portfolio-0001",
    tags: ["chocolate", "cherry", "cream cheese", "fruit"],
    weight_kg: 2.3,
    completion_date: "2024-02-22",
    customer_review: {
      rating: 5,
      text: "The combination of chocolate and cherries is classic for a reason! This cake was moist, rich, and absolutely delicious.",
      customer_name: "David",
      review_date: "2024-02-23"
    },
    order_details: {
      special_requests: "Extra cherry filling",
      occasion: "Birthday party",
      serving_size: 16
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "berry-cake-0001",
    name: "Berry Delight Cake",
    description: "Delicate vanilla cake with raspberry confit and cream cheese filling",
    composition: "Vanilla sponge layers\nCream cheese frosting\nRaspberry confit filling",
    price: 45,
    images: [
      "https://i.imgur.com/Nqu1WHz.jpeg",
      "https://images.unsplash.com/photo-1586788224331-947f68671cf1?q=80&w=987&auto=format&fit=crop"
    ],
    category_id: "berry-portfolio-0001",
    tags: ["berry", "vanilla", "cheesecream", "raspberry"],
    weight_kg: 1.5,
    completion_date: "2025-02-25",
    customer_review: {
      rating: 5,
      text: "Perfect combination of vanilla sponge and raspberry confit. The cream cheese frosting just melts in your mouth!",
      customer_name: "Maria",
      review_date: "2025-02-26"
    },
    order_details: {
      occasion: "Birthday",
      serving_size: 10
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "red-velvet-0001",
    name: "Red Velvet Cake",
    description: "Classic red velvet cake with delicate cream cheese frosting",
    composition: "Moist red velvet sponge layers\nCream cheese frosting\nOptional berry layer (raspberry or strawberry)",
    price: 55,
    images: [
      "https://i.imgur.com/2jj1wVo.jpeg",
      "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=942&auto=format&fit=crop"
    ],
    category_id: "specialty-portfolio-0001",
    tags: ["red velvet", "cheesecream", "berries", "cream"],
    weight_kg: 2.3,
    completion_date: "2025-02-26",
    customer_review: {
      rating: 5,
      text: "The most delicious red velvet cake I've ever tasted! Soft sponge layers and perfect cream.",
      customer_name: "Anna",
      review_date: "2025-02-26"
    },
    order_details: {
      special_requests: "With fresh raspberry filling",
      occasion: "Anniversary",
      serving_size: 15
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
   },
  {
    id: "bento-coconut-strawberry-0001",
    name: "Coconut-Strawberry Bento Cake",
    description: "Cute heart-shaped bento cake, perfect for a romantic treat for two",
    composition: "Vanilla sponge cake with coconut flakes\nCheesecream filling\nStrawberry confit",
    price: 25,
    images: [
      "https://imgur.com/39MdG1m.jpeg",
      "https://imgur.com/s4JW810.jpeg"
    ],
    category_id: "bento-portfolio-0001",
    tags: ["bento", "heart", "coconut", "strawberry", "cheesecream", "small cake"],
    weight_kg: 0.55,
    completion_date: "2025-02-14",
    customer_review: {
      rating: 5,
      text: "This small cake was absolutely perfect for our anniversary date. Beautiful design and delicious taste!",
      customer_name: "Anna",
      review_date: "2025-02-15"
    },
    order_details: {
      special_requests: "Extra strawberry confit",
      occasion: "Anniversary",
      serving_size: 2
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "bento-snickers-0001",
    name: "Snickers Bento Cake",
    description: "Delicious mini-sized Snickers cake, perfect indulgent treat for two",
    composition: "Chocolate sponge cake\nCheesecream filling\nSalted caramel\nRoasted peanuts",
    price: 25,
    images: [
      "https://imgur.com/MuLgvm5.jpeg",
      "https://imgur.com/f2gsB1h.jpeg"
    ],
    category_id: "bento-portfolio-0001",
    tags: ["bento", "snickers", "chocolate", "caramel", "peanuts", "small cake"],
    weight_kg: 0.55,
    completion_date: "2025-02-20",
    customer_review: {
      rating: 5,
      text: "The flavor combination is amazing! Such a great cake for our date night. Looks and tastes fantastic!",
      customer_name: "Mark",
      review_date: "2025-02-22"
    },
    order_details: {
      special_requests: "Extra peanuts on top",
      occasion: "Date night",
      serving_size: 2
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "bento-chocolate-cherry-0001",
    name: "Chocolate Cherry Bento Cake",
    description: "Elegant bento cake with rich chocolate and cherry flavors, perfect for a special occasion",
    composition: "Chocolate sponge cake\nCheesecream with chocolate ganache\nCherry confit",
    price: 25,
    images: [
      "https://imgur.com/OT1uGMI.jpeg",
      "https://imgur.com/mNFZUe8.jpeg"
    ],
    category_id: "bento-portfolio-0001",
    tags: ["bento", "chocolate", "cherry", "ganache", "small cake"],
    weight_kg: 0.55,
    completion_date: "2025-02-25",
    customer_review: {
      rating: 5,
      text: "The chocolate and cherry combination is divine! Such a beautiful little cake with amazing flavor.",
      customer_name: "Elena",
      review_date: "2025-02-26"
    },
    order_details: {
      special_requests: "Extra cherry confit",
      occasion: "Birthday celebration",
      serving_size: 2
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "bento-red-velvet-0001",
    name: "Red Velvet Bento Cake",
    description: "Tender red velvet cake with cream cheese frosting and strawberry filling, perfect for special moments",
    composition: "Red velvet sponge cake\nCream cheese frosting\nStrawberry filling",
    price: 25,
    images: [
      "https://imgur.com/7IFrCUE.jpeg",
      "https://imgur.com/VMKRVGe.jpeg"
    ],
    category_id: "bento-portfolio-0001",
    tags: ["bento", "red velvet", "cream cheese", "strawberry", "small cake"],
    weight_kg: 0.55,
    completion_date: "2025-02-27",
    customer_review: {
      rating: 5,
      text: "This cake is stunning! The red velvet with strawberry is such a delightful combination. Perfect size for our anniversary.",
      customer_name: "Julia",
      review_date: "2025-02-28"
    },
    order_details: {
      special_requests: "Extra cream cheese frosting",
      occasion: "Anniversary",
      serving_size: 2
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "blueberry-cake-0001",
    name: "Blueberry Cream Cake",
    description: "Tender sponge cake with cream cheese and blueberry filling. Light vanilla layers combined with creamy frosting and rich berry layers, creating a perfect taste balance. An ideal choice for lovers of delicate and refreshing desserts.",
    composition: "Vanilla sponge cake\nCream cheese frosting\nBlueberry filling\nFresh berries decoration",
    price: 75,
    images: [
      "https://imgur.com/kKpZ0Zg.jpeg",
      "https://imgur.com/aZ7wJ4T.jpeg"
    ],
    category_id: "berry-portfolio-0001",
    tags: ["berry", "blueberry", "cream cheese", "vanilla", "fresh berries"],
    weight_kg: 2.3,
    completion_date: "2025-02-26",
    customer_review: {
      rating: 5,
      text: "This cake exceeded all my expectations! The blueberry filling was so fresh and the balance of flavors was perfect. Everyone at the party loved it!",
      customer_name: "Maria",
      review_date: "2025-02-27"
    },
    order_details: {
      special_requests: "Extra berries on top",
      occasion: "Birthday party",
      serving_size: 15
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
