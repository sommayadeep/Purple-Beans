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
    id: "single-origin-ethiopian",
    name: "Single Origin Ethiopian",
    price: 48.00,
    description: "Exquisite single-origin microlot from the high-altitude volcanic soils, infused with wild blueberry notes and jasmine aroma.",
    longDescription: "Grown at an altitude of 2,100 meters in rich volcanic soils, our Single Origin Ethiopian represents the pinnacle of craftsmanship. Hand-picked at peak ripeness, the beans undergo a proprietary 48-hour anaerobic fermentation process that brings out a complex berry acidity and floral jasmine undertone. Each batch is micro-roasted to perfection, delivering a sensory clarity that is both vibrant and velvety.",
    image: "/sigleoriginethopian.png",
    category: "Single Origin",
    rating: 4.9,
    roastLevel: "Light-Medium",
    origin: "Ethiopian Highlands",
    notes: ["Wild Blueberry", "Jasmine", "Black Tea", "Bergamot Crema"],
    reviews: [
      { author: "Evelyn K.", rating: 5, comment: "Absolutely breathtaking. The blueberry aroma hits you the moment you open the bag. Truly exquisite taste.", date: "May 24, 2026" },
      { author: "Marcus T.", rating: 4, comment: "Delightfully light and floral. Best brewed as a pour-over to capture all the subtle citrus layers.", date: "May 12, 2026" }
    ]
  },
  {
    id: "espresso-blend",
    name: "Espresso Blend",
    price: 36.00,
    description: "A creamy, full-bodied espresso blend featuring notes of rich dark chocolate, roasted hazelnut, and a sweet molasses finish.",
    longDescription: "Crafted specifically for the ultimate espresso experience, our Espresso Blend combines premium beans from Brazil and Sumatra. Slowly drum-roasted to draw out essential oils, it delivers a dense, golden crema and a heavy, syrup-like body. With zero bitterness, it flows like liquid chocolate and lingers beautifully on the palate.",
    image: "/espressoblend.png",
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
    id: "calisto-signature-blend",
    name: "Calisto Signature Blend",
    price: 52.00,
    description: "Our flagship signature blend — a balanced harmony of caramel sweetness, toasted almond warmth, and a clean citrus finish.",
    longDescription: "The Calisto Signature Blend is the pride of Purple Beans. Combining three distinct origins into one seamless cup, it delivers a layered complexity that evolves sip by sip. Opening with bright citrus acidity, it transitions into a warm caramel mid-palate and finishes with a toasted almond sweetness. Carefully calibrated roast curves ensure every batch is identical in its perfection.",
    image: "/calistosignatureblend.png",
    category: "Signature",
    rating: 4.9,
    roastLevel: "Medium",
    origin: "Colombia, Guatemala & Kenya",
    notes: ["Caramel", "Toasted Almond", "Citrus Zest", "Honey"],
    reviews: [
      { author: "Anika P.", rating: 5, comment: "This is THE coffee. Balanced, nuanced, and absolutely divine. My new daily driver.", date: "May 30, 2026" },
      { author: "James L.", rating: 5, comment: "Stunning complexity. Every cup reveals something new. Worth every penny.", date: "May 22, 2026" }
    ]
  },
  {
    id: "chocolate-mocha-blend",
    name: "Chocolate Mocha Blend",
    price: 42.00,
    description: "Sustainably sourced beans natural-processed with hints of wild cherry, dark cacao, and a velvety smooth vanilla crema.",
    longDescription: "The Chocolate Mocha Blend is a sensory delight that bridges the gap between coffee and confection. Naturally sun-dried on raised African beds with the coffee cherry intact, the bean absorbs intense dark fruit sweetness. The resulting cup carries a distinct dark cacao warmth and an intoxicating aroma of macerated cherries, making it the perfect indulgence for mocha lovers.",
    image: "/chocolatemochablend.png",
    category: "Espresso Blends",
    rating: 4.7,
    roastLevel: "Medium",
    origin: "Colombia (Andes)",
    notes: ["Wild Cherry", "Dark Cacao", "Vanilla Bean", "Cardamom"],
    reviews: [
      { author: "Isabella M.", rating: 4, comment: "Warm, rich, and slightly spicy notes in the finish. An elegant afternoon indulgence.", date: "May 18, 2026" },
      { author: "Nathan W.", rating: 5, comment: "Tastes like a premium dessert in a cup. The chocolate notes are incredibly authentic.", date: "May 25, 2026" }
    ]
  },
  {
    id: "cold-brew-blend",
    name: "Cold Brew Blend",
    price: 38.00,
    description: "Specially crafted for cold extraction — smooth, low-acid, and bursting with natural sweetness and cocoa undertones.",
    longDescription: "Our Cold Brew Blend is engineered for cold extraction. We select beans with naturally low acidity and high sugar content, then roast them to a precise medium level that maximizes sweetness during long cold steeps. The result is a silky, refreshing cold brew with notes of dark cocoa, stone fruit, and brown sugar — zero bitterness, pure refreshment.",
    image: "/coldbrewblend.png",
    category: "Cold Brew",
    rating: 4.8,
    roastLevel: "Medium",
    origin: "Brazil & Ethiopia",
    notes: ["Dark Cocoa", "Stone Fruit", "Brown Sugar", "Smooth Vanilla"],
    reviews: [
      { author: "Clara J.", rating: 5, comment: "The smoothest cold brew I've ever made at home. Steep 18 hours and you get liquid gold.", date: "June 01, 2026" },
      { author: "Ryan K.", rating: 4, comment: "Perfect summer coffee. No bitterness at all, even without any sweetener.", date: "May 28, 2026" }
    ]
  },
  {
    id: "dark-roast",
    name: "Dark Roast",
    price: 34.00,
    description: "Bold, smoky, and intensely flavored — our dark roast delivers a powerful cup with notes of charred oak and bitter chocolate.",
    longDescription: "For those who crave intensity, our Dark Roast pushes the envelope. Taken to second crack and beyond, these beans develop deep smoky character, a heavy body, and a satisfying bittersweet finish. Perfect for French press or drip, it stands up beautifully to cream and sugar while delivering an unapologetically bold coffee experience.",
    image: "/darkroast.png",
    category: "Dark Roasts",
    rating: 4.6,
    roastLevel: "Dark",
    origin: "Sumatra & Vietnam",
    notes: ["Charred Oak", "Bitter Chocolate", "Smoky Maple", "Molasses"],
    reviews: [
      { author: "George M.", rating: 5, comment: "Finally a dark roast that's bold without being burnt. Rich, deep, and satisfying.", date: "May 20, 2026" },
      { author: "Priya S.", rating: 4, comment: "Strong and smoky, exactly what I need to wake up. Pairs well with cream.", date: "May 15, 2026" }
    ]
  },
  {
    id: "decaf-blend",
    name: "Decaf Blend",
    price: 40.00,
    description: "Swiss Water Process decaf that retains full flavor integrity — smooth, sweet, and completely caffeine-free.",
    longDescription: "Our Decaf Blend proves that caffeine-free doesn't mean flavor-free. Using the Swiss Water Process — a 100% chemical-free method — we gently remove caffeine while preserving the bean's complex flavor compounds. The result is a remarkably smooth cup with notes of milk chocolate, dried fig, and toasted pecan. Enjoy the full coffee ritual, any time of day.",
    image: "/decafblend.png",
    category: "Decaf",
    rating: 4.5,
    roastLevel: "Medium",
    origin: "Mexico & Peru",
    notes: ["Milk Chocolate", "Dried Fig", "Toasted Pecan", "Toffee"],
    reviews: [
      { author: "Helen R.", rating: 5, comment: "Best decaf I've ever had, hands down. You genuinely cannot tell it's decaf.", date: "May 27, 2026" },
      { author: "David C.", rating: 4, comment: "Smooth and comforting for evening cups. Great flavor for a decaf.", date: "May 19, 2026" }
    ]
  },
  {
    id: "french-roast-intense",
    name: "French Roast Intense",
    price: 36.00,
    description: "An ultra-bold French roast with a heavy body, pronounced smokiness, and a dark caramel finish that lingers.",
    longDescription: "French Roast Intense is our most daring offering. Roasted to the edge of carbonization, these beans develop an almost wine-like depth with layers of smoke, dark caramel, and roasted grain. The oils glisten on the surface, releasing an intoxicating aroma the moment you open the bag. This is coffee for those who like it dark, intense, and unforgettable.",
    image: "/frenchroastintense.png",
    category: "Dark Roasts",
    rating: 4.7,
    roastLevel: "Extra Dark",
    origin: "Indonesia & Guatemala",
    notes: ["Roasted Grain", "Dark Caramel", "Smoke", "Black Walnut"],
    reviews: [
      { author: "Thomas B.", rating: 5, comment: "Absolute beast of a coffee. If you love French roast, this is the pinnacle.", date: "June 02, 2026" },
      { author: "Mei L.", rating: 4, comment: "Intense and smoky. A little goes a long way. Perfect for a robust morning brew.", date: "May 26, 2026" }
    ]
  },
  {
    id: "house-blend",
    name: "House Blend",
    price: 32.00,
    description: "Our everyday classic — a well-rounded, approachable blend with nutty sweetness and a clean, bright finish.",
    longDescription: "The House Blend is where many Purple Beans customers begin their journey. A carefully balanced combination of Central and South American beans, roasted to a crowd-pleasing medium level. It delivers consistent quality cup after cup — nutty sweetness, mild acidity, and a clean finish that makes it the perfect all-day coffee for any brewing method.",
    image: "/houseblend.png",
    category: "Everyday",
    rating: 4.6,
    roastLevel: "Medium",
    origin: "Costa Rica & Honduras",
    notes: ["Roasted Walnut", "Milk Chocolate", "Honey", "Clean Citrus"],
    reviews: [
      { author: "Sarah K.", rating: 5, comment: "My go-to daily coffee. Consistent, delicious, and never disappoints.", date: "May 31, 2026" },
      { author: "Alex T.", rating: 4, comment: "Great value for the quality. Works beautifully in a drip machine or pour-over.", date: "May 21, 2026" }
    ]
  },
];
