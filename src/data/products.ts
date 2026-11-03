import { Product } from '../types';

export const PRODUCTS: Product[] = [
  // ==========================================
  // MEN'S CLOTHING (8 PRODUCTS)
  // ==========================================
  {
    id: 'men-01',
    name: 'Sartorial Italian Wool Overcoat',
    brand: 'STYLENEST Atelier',
    category: 'men',
    subcategory: 'Jackets',
    price: 14999,
    originalPrice: 18499,
    rating: 4.9,
    reviewsCount: 38,
    images: [
      'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Masterfully tailored from premium virgin Italian wool blend, this single-breasted overcoat delivers uncompromised structure and exceptional warmth for the discerning gentleman.',
    features: [
      'Virgin Italian wool blend with cupro lining',
      'Hand-finished notched lapels',
      'Horn button front closure with interior ticket pocket',
      'Center back vent for effortless drape'
    ],
    details: {
      'Composition': '80% Virgin Wool, 20% Cashmere',
      'Fit': 'Tailored European Cut',
      'Care': 'Dry Clean Only',
      'Origin': 'Florence, Italy'
    },
    sizes: ['38R', '40R', '42R', '44R'],
    colors: [
      { name: 'Camel Tan', hex: '#C19A6B' },
      { name: 'Midnight Charcoal', hex: '#262626' }
    ],
    inStock: true,
    stockCount: 14,
    badges: ['Bestseller'],
    isTrending: true,
    isBestseller: true,
  },
  {
    id: 'men-02',
    name: 'Supima Cotton Relaxed Oxford Shirt',
    brand: 'STYLENEST Sartorial',
    category: 'men',
    subcategory: 'Shirts',
    price: 3499,
    originalPrice: 4299,
    rating: 4.8,
    reviewsCount: 64,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Woven from extra-long staple Supima cotton, this relaxed oxford shirt combines structured durability with silk-like softness that softens with every wash.',
    features: [
      '100% American Supima Cotton',
      'Button-down point collar',
      'Mother-of-pearl buttons',
      'Single chest patch pocket'
    ],
    details: {
      'Weave': '100% Cotton Oxford weave',
      'Fit': 'Modern Relaxed',
      'Care': 'Machine wash cold, warm iron'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Crisp Chalk', hex: '#F8F9FA' },
      { name: 'Sky Azure', hex: '#D0E3F0' },
      { name: 'Sage Tint', hex: '#B5C4B1' }
    ],
    inStock: true,
    stockCount: 28,
    badges: ['New'],
    isNewArrival: true,
  },
  {
    id: 'men-03',
    name: 'Selvedge Japanese Denim Trouser',
    brand: 'STYLENEST Denim',
    category: 'men',
    subcategory: 'Jeans',
    price: 6499,
    originalPrice: 7999,
    rating: 4.7,
    reviewsCount: 42,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Crafted on vintage shuttle looms in Okayama, Japan, this 14oz red-line selvedge jean molds organically to your silhouette over time.',
    features: [
      '14oz Kurabo Japanese Selvedge',
      'Solid copper donut button fly',
      'Chain-stitched waistband and hem',
      'Raw, unwashed finish with natural indigo'
    ],
    details: {
      'Fabric': '100% Organic Raw Indigo Cotton',
      'Rise': 'Mid-Rise Straight Cut',
      'Care': 'Soak inside out in cold water'
    },
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Raw Deep Indigo', hex: '#1C2841' }
    ],
    inStock: true,
    stockCount: 19,
    isTrending: true,
  },
  {
    id: 'men-04',
    name: 'Merino Wool Knit Mockneck',
    brand: 'STYLENEST Studio',
    category: 'men',
    subcategory: 'Formal Wear',
    price: 4999,
    originalPrice: 5999,
    rating: 4.9,
    reviewsCount: 51,
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Spun from extra-fine 19.5-micron Australian merino wool, this lightweight mockneck pullover provides breathability and natural temperature regulation.',
    features: [
      '100% Extra-fine Merino Wool',
      'Fine 14-gauge seamless knit',
      'Ribbed mockneck, cuffs, and hem'
    ],
    details: {
      'Yarn': 'Australian Merino (Non-mulesed)',
      'Fit': 'Slim European Silhouette',
      'Care': 'Hand wash cold or gentle wool cycle'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Onyx Black', hex: '#111111' },
      { name: 'Sandstone Melange', hex: '#D8CAB8' }
    ],
    inStock: true,
    stockCount: 22,
    badges: ['Bestseller'],
    isBestseller: true,
  },
  {
    id: 'men-05',
    name: 'Heavyweight Loopback Fleece Hoodie',
    brand: 'STYLENEST Studio',
    category: 'men',
    subcategory: 'Hoodies',
    price: 3999,
    originalPrice: 4799,
    rating: 4.6,
    reviewsCount: 29,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Engineered with 480 GSM organic cotton loopback French terry, offering an elevated architectural silhouette with double-layered hood.',
    features: [
      '480 GSM Brushed French Terry',
      'Clean unbranded minimal aesthetics',
      'Ribbed side panels for ease of motion'
    ],
    details: {
      'Weight': '480 GSM Heavyweight',
      'Fit': 'Boxy Dropped Shoulder',
      'Care': 'Wash cold, line dry'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal Slate', hex: '#333333' },
      { name: 'Warm Ecru', hex: '#F0EAE1' }
    ],
    inStock: true,
    stockCount: 30,
    badges: ['New'],
    isNewArrival: true,
  },
  {
    id: 'men-06',
    name: 'Pleated Linen-Cotton Trousers',
    brand: 'STYLENEST Sartorial',
    category: 'men',
    subcategory: 'Trousers',
    price: 4299,
    originalPrice: 5299,
    rating: 4.8,
    reviewsCount: 33,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Double front pleats and side waist tab adjusters give these linen-blend trousers an effortlessly refined Mediterranean drape.',
    features: [
      '55% French Linen, 45% Cotton',
      'Double forward pleats',
      'Extended waistband tab with buckle adjusters'
    ],
    details: {
      'Rise': 'High-Rise Relaxed Taper',
      'Hem': 'Unhemmed 34" inseam for tailoring'
    },
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Olive Drab', hex: '#556B2F' },
      { name: 'Natural Khaki', hex: '#C3B091' }
    ],
    inStock: true,
    stockCount: 16,
    isTrending: true,
  },
  {
    id: 'men-07',
    name: 'Mercerized Pima Crew Tee',
    brand: 'STYLENEST Basics',
    category: 'men',
    subcategory: 'T-Shirts',
    price: 1899,
    originalPrice: 2299,
    rating: 4.9,
    reviewsCount: 112,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Double-mercerized Peruvian Pima cotton delivers an iridescent luster and silky hand feel that maintains color brilliance over years.',
    features: [
      '100% Long-staple Peruvian Pima',
      'Double-mercerized silky sheen',
      'Reinforced bound crew neckline'
    ],
    details: {
      'Weight': '210 GSM mid-heavyweight',
      'Fit': 'Tailored Regular'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pristine White', hex: '#FFFFFF' },
      { name: 'Caviar Black', hex: '#1A1A1A' },
      { name: 'Espresso', hex: '#4B3621' }
    ],
    inStock: true,
    stockCount: 50,
    badges: ['Bestseller'],
    isBestseller: true,
  },
  {
    id: 'men-08',
    name: 'Suede Chore Field Jacket',
    brand: 'STYLENEST Atelier',
    category: 'men',
    subcategory: 'Casual Wear',
    price: 12999,
    originalPrice: 15999,
    rating: 4.9,
    reviewsCount: 27,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'An elevated utility silhouette crafted in buttery calfskin split suede with brass hardware and reinforced patch pockets.',
    features: [
      'Supple calfskin suede exterior',
      'Cotton chambray interior lining',
      'Three exterior utility patch pockets'
    ],
    details: {
      'Material': '100% Genuine Calf Suede',
      'Hardware': 'Antique Brass Snaps'
    },
    sizes: ['38R', '40R', '42R'],
    colors: [
      { name: 'Tobacco Brown', hex: '#714B23' }
    ],
    inStock: true,
    stockCount: 9,
    badges: ['Sale'],
    isNewArrival: true,
  },

  // ==========================================
  // WOMEN'S CLOTHING (8 PRODUCTS)
  // ==========================================
  {
    id: 'women-01',
    name: 'Silk Charmeuse Bias Cut Slip Dress',
    brand: 'STYLENEST Studio',
    category: 'women',
    subcategory: 'Dresses',
    price: 8999,
    originalPrice: 10999,
    rating: 4.9,
    reviewsCount: 78,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Cut on the true bias from 22-momme pure mulberry silk, gracefully following the natural curves of the body with fluid movement and low-scoop back.',
    features: [
      '100% Grade 6A Mulberry Silk (22 Momme)',
      'Delicate adjustable spaghetti straps',
      'Deep cowled back with invisible French seams',
      'Fluid floor-skimming hem'
    ],
    details: {
      'Fabric': 'Pure Silk Charmeuse',
      'Length': 'Maxi length (54")',
      'Care': 'Professional Dry Clean or gentle silk wash'
    },
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Champagne Gold', hex: '#F7E7CE' },
      { name: 'Emerald Noir', hex: '#004225' },
      { name: 'Midnight Jet', hex: '#0B0B0B' }
    ],
    inStock: true,
    stockCount: 18,
    badges: ['Bestseller'],
    isTrending: true,
    isBestseller: true,
  },
  {
    id: 'women-02',
    name: 'Sculpted Double-Breasted Wool Blazer',
    brand: 'STYLENEST Atelier',
    category: 'women',
    subcategory: 'Jackets',
    price: 11999,
    originalPrice: 14499,
    rating: 4.8,
    reviewsCount: 45,
    images: [
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Defined by an architectural hourglass waist and peak lapels, this blazer transforms daytime power dressing into evening sophistication.',
    features: [
      'Premium wool crepe from Biella, Italy',
      'Peak lapel with hand-pick stitching',
      'Cinched silhouette with padded structural shoulders'
    ],
    details: {
      'Lining': '100% Silk Twill',
      'Fit': 'Sculptural Tailored',
      'Care': 'Dry clean only'
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Bone Ivory', hex: '#FFFFF0' },
      { name: 'Charcoal Melange', hex: '#36454F' }
    ],
    inStock: true,
    stockCount: 15,
    badges: ['New'],
    isNewArrival: true,
  },
  {
    id: 'women-03',
    name: 'High-Waisted Wide-Leg Palazzo Trouser',
    brand: 'STYLENEST Studio',
    category: 'women',
    subcategory: 'Trousers',
    price: 4999,
    originalPrice: 6299,
    rating: 4.7,
    reviewsCount: 39,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Impeccably tailored with inverted front box pleats and a high-rise waist that cascades into sweeping, elongating wide legs.',
    features: [
      'Heavy drapey twill blend with fluid movement',
      'Discrete side seam pockets',
      'Blind-hemmed wide cuff'
    ],
    details: {
      'Composition': '72% Viscose, 26% Wool, 2% Elastane',
      'Rise': 'Super High-Rise (13")',
      'Inseam': '33"'
    },
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Oatmeal Heather', hex: '#D6CFC7' },
      { name: 'Midnight Black', hex: '#111111' }
    ],
    inStock: true,
    stockCount: 24,
    isTrending: true,
  },
  {
    id: 'women-04',
    name: 'Pure Cashmere Ribbed Turtleneck',
    brand: 'STYLENEST Maison',
    category: 'women',
    subcategory: 'Tops',
    price: 7499,
    originalPrice: 8999,
    rating: 4.9,
    reviewsCount: 56,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Knitted from Grade-A Mongolian cashmere with tactile all-over ribbing that embraces you in weightless warmth and peerless softness.',
    features: [
      '100% Mongolian Cashmere (2-ply 12-gauge)',
      'Foldover turtleneck collar',
      'Rib-knitted thumbhole cuffs'
    ],
    details: {
      'Origin': 'Inner Mongolia',
      'Weight': '280g',
      'Care': 'Gentle hand wash with cashmere shampoo'
    },
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Warm Cream', hex: '#FFFDD0' },
      { name: 'Caramel Macchiato', hex: '#8B5A2B' }
    ],
    inStock: true,
    stockCount: 12,
    badges: ['Bestseller'],
    isBestseller: true,
  },
  {
    id: 'women-05',
    name: 'Handwoven Chanderi Silk Anarkali Set',
    brand: 'STYLENEST Heritage',
    category: 'women',
    subcategory: 'Ethnic Wear',
    price: 15999,
    originalPrice: 18999,
    rating: 5.0,
    reviewsCount: 24,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A tribute to artisanal Indian craftsmanship, featuring hand-spun Chanderi silk with authentic zari booti weave, paired with silk organza dupatta.',
    features: [
      'Pure Chanderi Silk with metallic Zari work',
      'Handcrafted pearl detailing on neckline',
      'Accompanied by tailored churidar and sheer dupatta'
    ],
    details: {
      'Craft': 'Traditional Handloom Weave',
      'Set Includes': 'Kurta, Churidar, Dupatta',
      'Care': 'Dry clean only'
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Dusty Rose Gold', hex: '#DCAE96' },
      { name: 'Ivory Chandan', hex: '#FDF6E2' }
    ],
    inStock: true,
    stockCount: 8,
    badges: ['New'],
    isNewArrival: true,
  },
  {
    id: 'women-06',
    name: 'Pleated Asymmetric Satin Midi Skirt',
    brand: 'STYLENEST Studio',
    category: 'women',
    subcategory: 'Skirts',
    price: 3999,
    originalPrice: 4999,
    rating: 4.8,
    reviewsCount: 31,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Precision accordion pleating combined with a subtle asymmetrical handkerchief hem that catches the light with each step.',
    features: [
      'Lustrous liquid satin finish',
      'Concealed elasticated waistband',
      'Sunburst accordion pleating'
    ],
    details: {
      'Length': 'Midi (31" to 34" asymmetric)',
      'Care': 'Machine wash cold delicate'
    },
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Bronze Ochre', hex: '#CC7722' },
      { name: 'Silver Smoke', hex: '#A8A9AD' }
    ],
    inStock: true,
    stockCount: 20,
    isTrending: true,
  },
  {
    id: 'women-07',
    name: 'Vintage Wash Straight-Leg Organic Jeans',
    brand: 'STYLENEST Denim',
    category: 'women',
    subcategory: 'Jeans',
    price: 4599,
    originalPrice: 5499,
    rating: 4.7,
    reviewsCount: 67,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'The definitive 90s vintage straight leg cut, produced using 100% GOTS-certified organic cotton with water-saving ozone washing.',
    features: [
      'GOTS Certified Organic Denim',
      'Authentic non-stretch heavy drape',
      'High-waisted fit snug through hip and thigh'
    ],
    details: {
      'Rise': '11.5" High Rise',
      'Inseam': '30"',
      'Hardware': 'Branded STYLENEST embossed silver rivets'
    },
    sizes: ['26', '28', '30', '32'],
    colors: [
      { name: 'Washed Indigo', hex: '#4A6984' },
      { name: 'Sun-Bleached Blue', hex: '#87AFC7' }
    ],
    inStock: true,
    stockCount: 26,
    isTrending: true,
  },
  {
    id: 'women-08',
    name: 'Linen Belted Resort Shirt Dress',
    brand: 'STYLENEST Casuals',
    category: 'women',
    subcategory: 'Casual Wear',
    price: 5499,
    originalPrice: 6799,
    rating: 4.8,
    reviewsCount: 29,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'European flax linen with a relaxed safari silhouette, detachable sash belt, and natural mother-of-pearl button placket.',
    features: [
      '100% Certified Normandy Flax Linen',
      'Convertible collar with rolled sleeves',
      'Matching self-fabric tie sash'
    ],
    details: {
      'Fit': 'Easy Relaxed',
      'Length': 'Knee length (42")',
      'Care': 'Machine wash cold'
    },
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Olive Sage', hex: '#708238' },
      { name: 'Bleached Sand', hex: '#E6D7B8' }
    ],
    inStock: true,
    stockCount: 16,
    badges: ['Sale'],
    isNewArrival: true,
  },

  // ==========================================
  // SHOES COLLECTION (8 PRODUCTS)
  // ==========================================
  {
    id: 'shoe-01',
    name: 'Artisan Calfskin Minimalist Sneaker',
    brand: 'STYLENEST Footwear',
    category: 'shoes',
    subcategory: 'Sneakers',
    price: 7999,
    originalPrice: 9999,
    rating: 4.9,
    reviewsCount: 92,
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Constructed by hand in Porto using full-grain Italian calf leather and stitched Margom rubber cupsole for unparalleled comfort.',
    features: [
      'Full-grain Italian Nappa calfskin',
      'Stitched Margom vulcanized rubber outsole',
      'Waxed cotton laces with metal aglets',
      'Vegetable-tanned leather lining and insole'
    ],
    details: {
      'Construction': 'Stitched Cupsole',
      'Lining': 'Full Calf Leather',
      'Origin': 'Porto, Portugal'
    },
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: [
      { name: 'Monochrome White', hex: '#F9F9F9' },
      { name: 'Vachetta Tan', hex: '#C68B59' }
    ],
    inStock: true,
    stockCount: 25,
    badges: ['Bestseller'],
    isTrending: true,
    isBestseller: true,
  },
  {
    id: 'shoe-02',
    name: 'Goodyear Welted Leather Chelsea Boot',
    brand: 'STYLENEST Footwear',
    category: 'shoes',
    subcategory: 'Boots',
    price: 11499,
    originalPrice: 13999,
    rating: 4.9,
    reviewsCount: 54,
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A timeless silhouette featuring true 360-degree Goodyear welt construction, Dainite studded rubber sole, and hand-burnished crust leather.',
    features: [
      'Hand-burnished full-grain French calfskin',
      'Goodyear welted re-soleable construction',
      'Dainite rubber sole for wet surface grip',
      'Heavy-duty elasticated side gussets'
    ],
    details: {
      'Sole': 'Dainite Studded Rubber',
      'Welt': '360° Goodyear Storm Welt',
      'Shaft Height': '6 inches'
    },
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: [
      { name: 'Rich Espresso Brown', hex: '#3E2723' },
      { name: 'Matte Obsidian', hex: '#1C1C1C' }
    ],
    inStock: true,
    stockCount: 14,
    badges: ['New'],
    isNewArrival: true,
  },
  {
    id: 'shoe-03',
    name: 'Wholecut Hand-Patinated Oxford',
    brand: 'STYLENEST Atelier',
    category: 'shoes',
    subcategory: 'Formal Shoes',
    price: 12999,
    originalPrice: 15999,
    rating: 5.0,
    reviewsCount: 37,
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Crafted from a single flawless piece of untreated crust leather with artisanal hand-applied patina finish that yields nuanced tonal depth.',
    features: [
      'Cut from a single unblemished leather hide',
      'Artisanal hand-painted ombre patina',
      'Chiseled toe last with beveled fiddleback waist'
    ],
    details: {
      'Leather': 'French Crust Calfskin',
      'Sole': 'Oak Bark Tanned Leather Sole',
      'Closure': '5-Eyelet Closed Lacing'
    },
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: [
      { name: 'Cognac Museum Calf', hex: '#9A4A28' },
      { name: 'Black Onyx', hex: '#0F0F0F' }
    ],
    inStock: true,
    stockCount: 10,
    badges: ['Bestseller'],
    isBestseller: true,
  },
  {
    id: 'shoe-04',
    name: 'Suede Belgian Tassel Loafer',
    brand: 'STYLENEST Footwear',
    category: 'shoes',
    subcategory: 'Casual Shoes',
    price: 8499,
    originalPrice: 10499,
    rating: 4.8,
    reviewsCount: 41,
    images: [
      'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Unlined buttery reverse suede loafers with delicate mini tassels and memory-foam padded footbed, ideal for sockless summer flair.',
    features: [
      'Super-soft water-resistant reverse suede',
      'Unlined glove-like deconstructed fit',
      'Low stacked leather heel with rubber tap'
    ],
    details: {
      'Upper': 'Italian Suede',
      'Sole': 'Flexible Blake-Stitched Leather',
      'Fit': 'True to size (Snug break-in)'
    },
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: [
      { name: 'Taupe Suede', hex: '#8B8589' },
      { name: 'Navy Midnight', hex: '#1A237E' }
    ],
    inStock: true,
    stockCount: 18,
    isTrending: true,
  },
  {
    id: 'shoe-05',
    name: 'Strappy Block-Heel Nappa Sandal',
    brand: 'STYLENEST Footwear',
    category: 'shoes',
    subcategory: "Women's Footwear",
    price: 6999,
    originalPrice: 8499,
    rating: 4.8,
    reviewsCount: 49,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Slender tubular straps hand-threaded across the arch, balanced with a sculpted 65mm geometric block heel designed for all-night wear.',
    features: [
      'Plush lambskin nappa leather straps',
      'Architectural 65mm wrapped block heel',
      'Square open toe silhouette with gold hardware buckle'
    ],
    details: {
      'Heel Height': '65mm (2.5 inches)',
      'Insole': 'Cushioned Leather Footbed'
    },
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    colors: [
      { name: 'Metallic Pale Gold', hex: '#D4AF37' },
      { name: 'Praline Nude', hex: '#E3C1B4' }
    ],
    inStock: true,
    stockCount: 16,
    badges: ['New'],
    isNewArrival: true,
  },
  {
    id: 'shoe-06',
    name: 'Aero Knit Lightweight Performance Trainer',
    brand: 'STYLENEST Sport',
    category: 'shoes',
    subcategory: 'Running Shoes',
    price: 5999,
    originalPrice: 7299,
    rating: 4.7,
    reviewsCount: 68,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Engineered with seamless zoned knit and nitrogen-infused supercritical foam midsole for explosive energy return and ultra-low weight.',
    features: [
      'Seamless multi-density engineered knit upper',
      'Nitrogen-infused dynamic EVA midsole',
      'High-abrasion zoned carbon rubber pods'
    ],
    details: {
      'Weight': '210g (UK 8)',
      'Drop': '8mm offset',
      'Use': 'Tempo Runs & Lifestyle'
    },
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: [
      { name: 'Crimson Flame', hex: '#D32F2F' },
      { name: 'Triple Phantom Black', hex: '#111111' }
    ],
    inStock: true,
    stockCount: 30,
    isTrending: true,
  },
  {
    id: 'shoe-07',
    name: 'Criss-Cross Leather Slide Sandal',
    brand: 'STYLENEST Footwear',
    category: 'shoes',
    subcategory: 'Sandals',
    price: 3499,
    originalPrice: 4299,
    rating: 4.8,
    reviewsCount: 35,
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Anatomic molded footbed covered in supple split suede, equipped with wide criss-cross oiled leather bands for breezy seaside ease.',
    features: [
      'Heavy oiled pull-up leather straps',
      'Ergonomic cork-latex contoured footbed',
      'EVA shock-absorbing outsole'
    ],
    details: {
      'Sole': 'Flexible Lightweight EVA',
      'Arch Support': 'Built-in Anatomical Arch'
    },
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: [
      { name: 'Oiled Saddle Brown', hex: '#5D4037' },
      { name: 'Pitch Black', hex: '#000000' }
    ],
    inStock: true,
    stockCount: 22,
    badges: ['Sale'],
  },
  {
    id: 'shoe-08',
    name: 'Pointed Slingback Sculpted Pump',
    brand: 'STYLENEST Footwear',
    category: 'shoes',
    subcategory: "Women's Footwear",
    price: 7499,
    originalPrice: 8999,
    rating: 4.9,
    reviewsCount: 44,
    images: [
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Dramatic elongated pointed toe paired with a discreet elasticated slingback strap and 50mm kitten flare heel in glossy patent leather.',
    features: [
      'High-gloss patent calf leather',
      '50mm curved sculptural kitten heel',
      'Gel-cushioned ball-of-foot support'
    ],
    details: {
      'Heel Height': '50mm',
      'Upper': 'Glossy Patent Calf'
    },
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7'],
    colors: [
      { name: 'Scarlet Lacquer', hex: '#900C3F' },
      { name: 'Midnight Patent', hex: '#0A0A0A' }
    ],
    inStock: true,
    stockCount: 11,
    isTrending: true,
  },

  // ==========================================
  // PERFUMES COLLECTION (8 PRODUCTS)
  // ==========================================
  {
    id: 'perfume-01',
    name: 'Santal Impérial Extrait de Parfum',
    brand: 'STYLENEST Parfums',
    category: 'perfumes',
    subcategory: 'Woody Fragrances',
    price: 6499,
    originalPrice: 7999,
    rating: 5.0,
    reviewsCount: 88,
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'An enigmatic hymn to sacred Mysore sandalwood, heightened with smoked cardamom, iris butter, and velvety Australian amber.',
    features: [
      '30% Extrait de Parfum concentration for remarkable sillage',
      'Artisanal heavy flacon with magnetic brass cap',
      'Cold-pressed natural botanical extracts'
    ],
    fragranceFamily: 'Woody Oriental',
    fragranceNotes: {
      top: ['Cardamom', 'Violet Leaf', 'Papyrus'],
      heart: ['Iris Butter', 'Cypriol', 'Cedarwood'],
      base: ['Mysore Sandalwood', 'Amber Resins', 'Leather']
    },
    longevity: '14+ Hours (Extraordinary Sillage)',
    volumes: [
      { size: '30ml', priceMultiplier: 0.65 },
      { size: '50ml', priceMultiplier: 1.0 },
      { size: '100ml', priceMultiplier: 1.6 }
    ],
    details: {
      'Concentration': '30% Extrait de Parfum',
      'Gender': 'Unisex',
      'Perfumer': 'STYLENEST Master Noses, Grasse'
    },
    inStock: true,
    stockCount: 20,
    badges: ['Bestseller'],
    isTrending: true,
    isBestseller: true,
  },
  {
    id: 'perfume-02',
    name: 'Rose Éthérée Eau de Parfum',
    brand: 'STYLENEST Parfums',
    category: 'perfumes',
    subcategory: 'Floral Fragrances',
    price: 5499,
    originalPrice: 6899,
    rating: 4.9,
    reviewsCount: 62,
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Morning-dew soaked Damask roses hand-harvested at dawn, softened with crisp lychee, pink pepper berries, and white musk.',
    features: [
      'Distilled from organic Isparta Damask rose petals',
      'Crystal glass bottle with gold foil labeling',
      'Luminous floral opening that settles into powdered cashmeran'
    ],
    fragranceFamily: 'Floral Dewy',
    fragranceNotes: {
      top: ['Pink Pepper', 'Lychee', 'Bergamot'],
      heart: ['Damask Rose', 'Peony', 'Water Lily'],
      base: ['White Musk', 'Cashmeran', 'Blonde Woods']
    },
    longevity: '10 to 12 Hours',
    volumes: [
      { size: '30ml', priceMultiplier: 0.65 },
      { size: '50ml', priceMultiplier: 1.0 },
      { size: '100ml', priceMultiplier: 1.6 }
    ],
    details: {
      'Concentration': '20% Eau de Parfum',
      'Gender': "Women's Fragrances",
      'Origin': 'Grasse, France'
    },
    inStock: true,
    stockCount: 18,
    badges: ['New'],
    isNewArrival: true,
  },
  {
    id: 'perfume-03',
    name: 'Vétiver Noire Pour Homme',
    brand: 'STYLENEST Parfums',
    category: 'perfumes',
    subcategory: "Men's Fragrances",
    price: 4999,
    originalPrice: 6299,
    rating: 4.8,
    reviewsCount: 47,
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A dark, brooding composition of smoky Haitian vetiver roots entwined with bitter orange, black pepper, and earthy oakmoss.',
    features: [
      'Sustainably harvested roots from Les Cayes, Haiti',
      'Smoked flint glass bottle with brushed metal atomizer',
      'Crisp masculine opening with deep subterranean woods'
    ],
    fragranceFamily: 'Earthy Woody',
    fragranceNotes: {
      top: ['Bitter Orange', 'Grapefruit', 'Black Pepper'],
      heart: ['Nutmeg', 'Geranium Leaf', 'Flint'],
      base: ['Haitian Vetiver', 'Oakmoss', 'Cedar', 'Benzoin']
    },
    longevity: '12 Hours (Assertive Projection)',
    volumes: [
      { size: '50ml', priceMultiplier: 1.0 },
      { size: '100ml', priceMultiplier: 1.6 }
    ],
    details: {
      'Concentration': '18% Eau de Parfum',
      'Gender': "Men's Fragrances"
    },
    inStock: true,
    stockCount: 22,
    isTrending: true,
  },
  {
    id: 'perfume-04',
    name: 'Côte Sauvage Aqua Marine',
    brand: 'STYLENEST Parfums',
    category: 'perfumes',
    subcategory: 'Fresh Fragrances',
    price: 4499,
    originalPrice: 5499,
    rating: 4.7,
    reviewsCount: 53,
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'An intoxicating breeze of Mediterranean sea salt crashing against jagged cliffs, infused with Calabrian lemon and wild rosemary.',
    features: [
      'Saline marine ozone accords',
      'Infused with sun-drenched Italian citrus essences',
      'Invigorating dry-down with driftwood and musk'
    ],
    fragranceFamily: 'Aquatic Citrus',
    fragranceNotes: {
      top: ['Calabrian Lemon', 'Sea Salt', 'Green Mandarin'],
      heart: ['Wild Rosemary', 'Juniper Berries', 'Neroli'],
      base: ['Sun-bleached Driftwood', 'Ambergris', 'Mineral Musk']
    },
    longevity: '8 to 10 Hours',
    volumes: [
      { size: '30ml', priceMultiplier: 0.65 },
      { size: '50ml', priceMultiplier: 1.0 },
      { size: '100ml', priceMultiplier: 1.6 }
    ],
    details: {
      'Concentration': '16% Eau de Toilette Intense',
      'Gender': 'Unisex Fragrances'
    },
    inStock: true,
    stockCount: 26,
    isTrending: true,
  },
  {
    id: 'perfume-05',
    name: 'Ambre Mystique Pure Oud',
    brand: 'STYLENEST Parfums',
    category: 'perfumes',
    subcategory: 'Unisex Fragrances',
    price: 8999,
    originalPrice: 10999,
    rating: 4.9,
    reviewsCount: 71,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Wild agarwood from Assam married to molten golden amber, Madagascar vanilla bean, and whispers of dry frankincense smoke.',
    features: [
      'Genuine distilled Indian Agarwood (Oud)',
      'Rich amber crystalline flask with gold calligraphy',
      'Warm intoxicating aura suited for regal evenings'
    ],
    fragranceFamily: 'Amber Woody / Oriental',
    fragranceNotes: {
      top: ['Saffron', 'Cinnamon Bark', 'Dates'],
      heart: ['Taif Rose', 'Incense', 'Smoked Birch'],
      base: ['Assam Agarwood (Oud)', 'Amber', 'Madagascar Vanilla']
    },
    longevity: '16+ Hours (Monumental)',
    volumes: [
      { size: '50ml', priceMultiplier: 1.0 },
      { size: '100ml', priceMultiplier: 1.6 }
    ],
    details: {
      'Concentration': '32% Extrait de Parfum',
      'Gender': 'Unisex Fragrances'
    },
    inStock: true,
    stockCount: 14,
    badges: ['Bestseller'],
    isBestseller: true,
  },
  {
    id: 'perfume-06',
    name: 'Fleur Blanche Absolue',
    brand: 'STYLENEST Parfums',
    category: 'perfumes',
    subcategory: 'Floral Fragrances',
    price: 5299,
    originalPrice: 6499,
    rating: 4.8,
    reviewsCount: 39,
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Night-blooming Indian tuberose accompanied by indolic jasmine sambac and radiant orange blossom, wrapped in creamy sandalwood.',
    features: [
      'Absolutes of Grandiflorum Jasmine and Madurai Tuberose',
      'Ultra-fine atomization mist dispenser',
      'Romantic intoxicating white floral sillage'
    ],
    fragranceFamily: 'White Floral',
    fragranceNotes: {
      top: ['Neroli', 'Green Mandora', 'Bergamot'],
      heart: ['Tuberose Absolute', 'Jasmine Sambac', 'Gardenia'],
      base: ['Sandalwood', 'Bourbon Vanilla', 'Cashmere Musk']
    },
    longevity: '10 to 12 Hours',
    volumes: [
      { size: '30ml', priceMultiplier: 0.65 },
      { size: '50ml', priceMultiplier: 1.0 },
      { size: '100ml', priceMultiplier: 1.6 }
    ],
    details: {
      'Concentration': '22% Eau de Parfum',
      'Gender': "Women's Fragrances"
    },
    inStock: true,
    stockCount: 19,
    badges: ['New'],
    isNewArrival: true,
  },
  {
    id: 'perfume-07',
    name: 'Feu de Bois & Tabac',
    brand: 'STYLENEST Parfums',
    category: 'perfumes',
    subcategory: 'Woody Fragrances',
    price: 6199,
    originalPrice: 7499,
    rating: 4.9,
    reviewsCount: 42,
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'An opulent fireplace ambiance evoking aged leather armchairs, cured Cuban tobacco leaves, cacao pods, and burning birch embers.',
    features: [
      'Natural tobacco leaf and tonka bean absolutes',
      'Smoked glass bottle with engraved wooden stopper',
      'Cozy, seductive winter statement fragrance'
    ],
    fragranceFamily: 'Warm Spicy Woody',
    fragranceNotes: {
      top: ['Cured Tobacco Leaves', 'Spicy Notes', 'Ginger'],
      heart: ['Tonka Bean', 'Tobacco Blossom', 'Cacao'],
      base: ['Woody Sap', 'Dried Fruit Confit', 'Smoked Birch']
    },
    longevity: '14 Hours',
    volumes: [
      { size: '50ml', priceMultiplier: 1.0 },
      { size: '100ml', priceMultiplier: 1.6 }
    ],
    details: {
      'Concentration': '25% Eau de Parfum Intense',
      'Gender': 'Unisex Fragrances'
    },
    inStock: true,
    stockCount: 17,
    isTrending: true,
  },
  {
    id: 'perfume-08',
    name: 'Bergamote Sauvage Cologne Royale',
    brand: 'STYLENEST Parfums',
    category: 'perfumes',
    subcategory: 'Fresh Fragrances',
    price: 3899,
    originalPrice: 4799,
    rating: 4.7,
    reviewsCount: 36,
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Sparkling cold-pressed green bergamot from Reggio Calabria paired with crushed petitgrain leaves and clean hedione radiance.',
    features: [
      'Traditional Eau de Cologne formula bolstered with modern fixatives',
      'Ultra-refreshing morning energizer',
      'Sleek heavy-walled glass flask'
    ],
    fragranceFamily: 'Citrus Aromatic',
    fragranceNotes: {
      top: ['Reggio Bergamot', 'Bitter Orange Petitgrain', 'Lemon Peel'],
      heart: ['French Lavender', 'Rosemary', 'Neroli'],
      base: ['Clean Musks', 'Iso E Super', 'Vetiver']
    },
    longevity: '7 to 9 Hours',
    volumes: [
      { size: '30ml', priceMultiplier: 0.65 },
      { size: '50ml', priceMultiplier: 1.0 },
      { size: '100ml', priceMultiplier: 1.6 }
    ],
    details: {
      'Concentration': '15% Cologne Forte',
      'Gender': 'Unisex Fragrances'
    },
    inStock: true,
    stockCount: 23,
    badges: ['Sale'],
    isNewArrival: true,
  }
];

export const CATEGORIES_DATA = [
  {
    id: 'men',
    title: 'MEN',
    subtitle: 'Contemporary Menswear',
    description: 'Architectural silhouettes, world-class Italian wools, and tailored casualwear crafted for effortless prestige.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Hoodies', 'Jackets', 'Casual Wear', 'Formal Wear']
  },
  {
    id: 'women',
    title: 'WOMEN',
    subtitle: "Modern Women's Fashion",
    description: 'Fluid mulberry silks, sculpted tailoring, and handwoven heritage garments celebrating quiet luxury.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Tops', 'Dresses', 'Jeans', 'Trousers', 'Skirts', 'Jackets', 'Ethnic Wear', 'Casual Wear']
  },
  {
    id: 'shoes',
    title: 'SHOES',
    subtitle: 'Artisanal Footwear',
    description: 'Goodyear welted boots, minimalist Portuguese sneakers, and sculpted heels engineered for lasting poise.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Sneakers', 'Running Shoes', 'Formal Shoes', 'Casual Shoes', 'Boots', "Women's Footwear", 'Sandals']
  },
  {
    id: 'perfumes',
    title: 'PERFUMES',
    subtitle: 'Haute Parfumerie',
    description: 'High-concentration extraits and rare botanical extractions developed in Grasse for unforgettable sillage.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80',
    subcategories: ["Men's Fragrances", "Women's Fragrances", "Unisex Fragrances", "Fresh Fragrances", "Woody Fragrances", "Floral Fragrances"]
  }
];

export const DEMO_COUPONS = [
  {
    code: 'STYLENEST10',
    discountPercentage: 10,
    minOrderValue: 2000,
    description: '10% off on all luxury items above ₹2,000'
  },
  {
    code: 'NEST10',
    discountPercentage: 10,
    minOrderValue: 2000,
    description: '10% off on all luxury items above ₹2,000'
  },
  {
    code: 'LUXE20',
    discountPercentage: 20,
    minOrderValue: 5000,
    description: '20% off on premium purchases above ₹5,000'
  },
  {
    code: 'WELCOME500',
    flatDiscount: 500,
    minOrderValue: 1999,
    description: 'Flat ₹500 off on your first order above ₹1,999'
  }
];
