export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  longDescription: string;
  image: string;
  category: string;
  rating: number;
  roastLevel: string;
  origin: string;
  notes: string[];
  reviews: { author: string; rating: number; comment: string; date: string }[];
}

export const PRODUCTS: Product[] = [
  {
    id: "purple-reserve",
    name: "Purple Reserve (Single Origin)",
    price: 48.00,
    description: "Exquisite single-origin microlot from the high-altitude volcanic soils, infused with wild blueberry notes and jasmine aroma.",
    longDescription: "Grown at an altitude of 2,100 meters in rich volcanic soils, Purple Reserve represents the pinnacle of craftsmanship. Hand-picked at peak ripeness, the beans undergo a proprietary 48-hour anaerobic fermentation process that brings out a complex berry acidity and floral jasmine undertone. Each batch is micro-roasted to perfection, delivering a sensory clarity that is both vibrant and velvety.",
    image: "/coffee2.png",
    category: "Single Origin",
    rating: 4.9,
    roastLevel: "Light-Medium",
    origin: "Ethiopian Highlands",
    notes: ["Wild Blueberry", "Jasmine", "Black Tea", "Bergamot Crema"],
    reviews: [
      { author: "Evelyn K.", rating: 5, comment: "Absolutely breathtaking. The blueberry aroma hits you the moment you open the bag. Truly Awwwards-level taste.", date: "May 24, 2026" },
      { author: "Marcus T.", rating: 4, comment: "Delightfully light and floral. Best brewed as a pour-over to capture all the subtle citrus layers.", date: "May 12, 2026" }
    ]
  },
  {
    id: "espresso-velvet",
    name: "Espresso Velvet (Signature Blend)",
    price: 36.00,
    description: "A creamy, full-bodied espresso blend featuring notes of rich dark chocolate, roasted hazelnut, and a sweet molasses finish.",
    longDescription: "Crafted specifically for the ultimate espresso experience, Velvet combines premium beans from Brazil and Sumatra. Slowly drum-roasted to draw out essential oils, it delivers a dense, golden crema and a heavy, syrup-like body. With zero bitterness, it flows like liquid chocolate and lingers beautifully on the palate.",
    image: "/Designer.png",
    category: "Espresso Blends",
    rating: 4.8,
    roastLevel: "Medium-Dark",
    origin: "Brazil & Sumatra",
    notes: ["Dark Chocolate", "Hazelnut", "Molasses", "Burnt Sugar"],
    reviews: [
      { author: "Daniel G.", rating: 5, comment: "Thick crema, rich flavor, and incredibly smooth. Pairs perfectly with steamed oat milk.", date: "June 01, 2026" },
      { author: "Sophia R.", rating: 5, comment: "Finally, an espresso blend that isn't bitter. Deeply comforting and luxurious.", date: "May 29, 2026" }
    ]
  },
  {
    id: "volcanic-aura",
    name: "Volcanic Aura (Limited Release)",
    price: 62.00,
    description: "Extremely rare Geisha beans roasted under nitrogen to preserve delicate floral and citrus nectar profiles. Limited to 200 bags.",
    longDescription: "Volcanic Aura is a masterwork of rarity. Sourced from a single boutique farm in Panama, these Geisha varietal beans are highly coveted. They are roasted under a nitrogen-flushed atmosphere to stop volatile flavor evaporation, sealing in delicate notes of lavender, orange blossom, and wild honey. Packaged in a hand-sealed collectible box.",
    image: "/coffee2.png",
    category: "Reserve",
    rating: 5.0,
    roastLevel: "Light",
    origin: "Panama (Geisha)",
    notes: ["Lavender", "Orange Blossom", "Wild Honey", "Peach Nectar"],
    reviews: [
      { author: "Liam H.", rating: 5, comment: "I was skeptical of the price, but this is the cleanest, most fruit-forward coffee I have ever tasted. Incredible.", date: "June 02, 2026" }
    ]
  },
  {
    id: "mystic-mocha",
    name: "Mystic Mocha (Sensory Roast)",
    price: 42.00,
    description: "Sustainably sourced beans natural-processed with hints of wild cherry, dark cacao, and a velvety smooth vanilla crema.",
    longDescription: "Mystic Mocha is a sensory delight that bridges the gap between coffee and confection. Naturally sun-dried on raised African beds with the coffee cherry intact, the bean absorbs intense dark fruit sweetness. The resulting cup carries a distinct dark cacao warmth and an intoxicating aroma of macerated cherries.",
    image: "/Designer.png",
    category: "Espresso Blends",
    rating: 4.7,
    roastLevel: "Medium",
    origin: "Colombia (Andes)",
    notes: ["Wild Cherry", "Dark Cacao", "Vanilla Bean", "Cardamom"],
    reviews: [
      { author: "Isabella M.", rating: 4, comment: "Warm, rich, and slightly spicy notes in the finish. An elegant afternoon indulgence.", date: "May 18, 2026" }
    ]
  }
];
