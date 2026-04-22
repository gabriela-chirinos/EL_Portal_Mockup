export interface MenuItem {
  name: string;
  badge?: { label: string; variant?: 'default' | 'green' | 'yellow' };
  desc: string;
  price: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  featuredImage?: string;
  featuredCaption?: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    id: 'birria',
    label: 'BIRRIA',
    featuredImage: '/assets/quesabiria.png',
    featuredCaption: 'Slow-Cooked Pulled Tender Beef',
    items: [
      { name: 'QUESABIRRIA', badge: { label: 'Classic' }, desc: 'Large handmade tortilla, melted crispy cheese, cilantro & onion. Served with consomé.', price: '$6.99' },
      { name: 'BIRRIA PIZZA', badge: { label: 'Favorite', variant: 'green' }, desc: 'Melted cheese, double flour tortilla, cilantro, onions & side of beef broth.', price: '$26.00' },
      { name: 'BIRRIA BOWL', desc: 'Beef broth with tender birria, handmade tortillas, cilantro, onions & house salsas.', price: '$19.99' },
      { name: 'BIRRIA PLATE', badge: { label: 'Generous' }, desc: 'Dry birria, rice, beans, cilantro, onions, broth & handmade tortillas.', price: '$19.99' },
      { name: 'RAMEN BIRRIA', badge: { label: 'Trending', variant: 'yellow' }, desc: 'Tapatio ramen with birria meat, broth, cheese, cilantro & onion.', price: '$13.99' },
      { name: 'CONSOMÉ', desc: 'Signature red chili beef broth.', price: '$2.00' },
    ],
  },
  {
    id: 'tacos',
    label: 'TACOS',
    items: [
      { name: 'TACO DE BIRRIA', badge: { label: 'Signature' }, desc: 'Braised beef birria, cilantro, onion, handmade tortilla. Served with consomé.', price: '$4.50' },
      { name: 'TACO AL PASTOR', desc: 'Marinated pork, pineapple, cilantro & onion on handmade tortilla.', price: '$3.50' },
      { name: 'TACO DE CARNITAS', badge: { label: 'Michoacán', variant: 'green' }, desc: 'Slow-fried pulled pork, cilantro, onion & salsa.', price: '$3.50' },
      { name: 'TACO DE ASADA', desc: 'Grilled carne asada, fresh cilantro & onion.', price: '$4.00' },
      { name: 'TACO DE CHORIZO', desc: 'House chorizo, cilantro, onion & salsa verde.', price: '$3.50' },
      { name: 'TACO DE LENGUA', desc: 'Slow-braised beef tongue, cilantro & onion.', price: '$4.50' },
    ],
  },
  {
    id: 'tortas',
    label: 'TORTAS',
    items: [
      { name: 'TORTA DE BIRRIA', badge: { label: 'Best Seller' }, desc: 'Birria, melted cheese, cilantro, onion, avocado & consomé on toasted bolillo.', price: '$14.99' },
      { name: 'TORTA DE CARNITAS', desc: 'Crispy carnitas, refried beans, jalapeño, avocado & crema.', price: '$12.99' },
      { name: 'TORTA DE ASADA', desc: 'Carne asada, beans, avocado, tomato, jalapeño & salsa.', price: '$13.99' },
      { name: 'TORTA AHOGADA', badge: { label: 'Spicy', variant: 'yellow' }, desc: 'Pork torta drowned in red chili salsa. A Guadalajara classic.', price: '$13.99' },
    ],
  },
  {
    id: 'menudo',
    label: 'MENUDO',
    featuredImage: '/assets/soup_pic.jpg',
    featuredCaption: 'Menudo Rojo · Slow-Simmered',
    items: [
      { name: 'MENUDO ROJO', badge: { label: 'PNW Famous' }, desc: 'Traditional red menudo with hominy, cilantro, onion & handmade tortillas. Small or large.', price: '$12.99' },
      { name: 'MENUDO BLANCO', desc: 'White broth menudo, mild and clean. Served with tortillas.', price: '$12.99' },
      { name: 'POZOLE ROJO', badge: { label: 'Weekend', variant: 'green' }, desc: 'Slow-cooked pork in red chili broth with hominy, tostadas & garnishes.', price: '$13.99' },
    ],
  },
  {
    id: 'dulces',
    label: 'PAN DULCE',
    featuredImage: '/assets/pandulce.png',
    featuredCaption: 'La Panadería · Sweet Treats',
    items: [
      { name: 'LA CONCHA', badge: { label: 'Classic', variant: 'yellow' }, desc: "The iconic Mexican sweet bread — soft, fluffy, with a crisp sugar shell. Ask for today's flavors.", price: '$2.50' },
      { name: 'CUERNITO', desc: 'Buttery crescent-shaped pan dulce, lightly sweetened.', price: '$2.00' },
      { name: 'POLVORÓN', badge: { label: 'Crumbly' }, desc: 'Melt-in-your-mouth Mexican shortbread cookie dusted in sugar.', price: '$1.75' },
      { name: 'EMPANADA DE CAJETA', desc: "Flaky pastry filled with rich goat's milk caramel. A crowd pleaser.", price: '$3.00' },
      { name: 'SURTIDO DE DULCES', badge: { label: 'Ask Daily', variant: 'green' }, desc: "A rotating selection of pan dulce baked fresh. Ask inside what's available today.", price: 'Varies' },
    ],
  },
  {
    id: 'more',
    label: 'MÁS',
    items: [
      { name: 'BURRITO DE CARNITAS', badge: { label: 'Generoso' }, desc: 'Crispy carnitas, rice, beans, cheese, crema & salsa in a large flour tortilla.', price: '$13.99' },
      { name: 'BURRITO DE BIRRIA', desc: 'Birria, rice, beans, cheese & salsa. Comes with consomé.', price: '$14.99' },
      { name: 'FRESH CUT MEATS', badge: { label: 'Carniceria', variant: 'green' }, desc: "Premium cuts prepared daily. Ask inside for today's selection.", price: 'Market' },
      { name: 'ARROZ & FRIJOLES', desc: 'House rice and slow-cooked beans. Ask for sides.', price: '$3.00' },
    ],
  },
];
