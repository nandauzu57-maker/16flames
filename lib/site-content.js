const KEY = "16flames:site-content";

export const DEFAULT_CONTENT = {
  home: {
    heroEyebrow: "THE NEW Y2K ERA",
    heroTitle: "ICONIC\nENERGY.",
    heroText: "The name 16FLAMES now functions purely as a brand identity — short, memorable, punchy, and modern. It represents a girl who stands out, owns her style, and expresses herself without limits.",
    heroButton: "SHOP NEW ARRIVALS",
    heroImage: "/hero.jpg",
    editorialEyebrow: "THE NEW COLLECTION",
    editorialTitle: "MADE TO\nSHINE.",
    editorialImage: "/editorial.jpg",
    customEyebrow: "MAKE IT YOURS",
    customTitle: "THE BLING\nMATCHMAKER",
    customText: "Pick a silhouette, choose your size and create your own signature look.",
    customImage: "/customizer.jpg",
    petEyebrow: "HOME & PET",
    petTitle: "CUTE THINGS\nLIVE HERE.",
    petImage: "/home-pet.jpg",
    newsletterTitle: "GET 15% OFF\nYOUR FIRST ORDER.",
    newsletterText: "Sign up for new drops, exclusive offers and all things 16FLAMES"
  },
  about: {
    eyebrow: "ABOUT 16FLAMES",
    title: "WHO WE\nARE.",
    text: "16FLAMES adalah brand fashion Y2K yang percaya bahwa pakaian adalah cara untuk merayakan keberanian jadi diri sendiri — velour, crystal, dan siluet nostalgia yang tetap terasa relevan hari ini.",
    heroImage: "/18.jpg",
    heroLabel: "OUR STUDIO / 001"
  },
  philosophy: {
    eyebrow: "THE 16FLAMES PHILOSOPHY",
    title: "WEAR YOUR\nENERGY.",
    text: "16FLAMES stands for the unapologetic confidence of modern girls — those who embrace being sexy, loud, soft, messy, powerful, chaotic, and gorgeous all at once.",
    heroImage: "/15.jpg",
    heroLabel: "ICONIC ENERGY / 001"
  },
  products: {
    "1": { name: "Velour Zip Hoodie", image: "/products/1.jpg" }, "2": { name: "Heritage Velour Pant", image: "/products/2.jpg" }, "3": { name: "Bling Baby Tee", image: "/products/3.jpg" }, "4": { name: "Butterfly Zip Jacket", image: "/products/4.jpg" }, "5": { name: "Crystal Shoulder Bag", image: "/products/5.jpg" }, "6": { name: "Glossy Mini Bag", image: "/products/6.jpg" }, "7": { name: "Charm Necklace", image: "/products/7.jpg" }, "8": { name: "Crystal Hoops", image: "/products/8.jpg" }, "9": { name: "Cloud Mini Skirt", image: "/products/9.jpg" }, "10": { name: "Soft Logo Hoodie", image: "/products/10.jpg" }, "11": { name: "Dream Velour Short", image: "/products/11.jpg" }, "12": { name: "Star Charm Bracelet", image: "/products/12.jpg" }, "13": { name: "Cloud Runner Sneakers", image: "/products/13.jpg" }, "14": { name: "Logo Slide Sandals", image: "/products/14.jpg" }, "15": { name: "T-SHIRT WHITE", image: "/products/3.jpg" }
  }
};

async function redis(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("UPSTASH_REDIS_REST_URL dan UPSTASH_REDIS_REST_TOKEN belum diatur di Vercel.");
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store"
  });
  if (!res.ok) throw new Error("Gagal mengakses penyimpanan website.");
  return res.json();
}

export async function getSiteContent() {
  try {
    const data = await redis(["GET", KEY]);
    if (!data?.result) return DEFAULT_CONTENT;
    const saved = JSON.parse(data.result);
    return {
      ...DEFAULT_CONTENT,
      ...saved,
      home: { ...DEFAULT_CONTENT.home, ...(saved.home || {}) },
      about: { ...DEFAULT_CONTENT.about, ...(saved.about || {}) },
      philosophy: { ...DEFAULT_CONTENT.philosophy, ...(saved.philosophy || {}) },
      products: { ...DEFAULT_CONTENT.products, ...(saved.products || {}) }
    };
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function setSiteContent(content) {
  const clean = {
    ...DEFAULT_CONTENT,
    ...content,
    home: { ...DEFAULT_CONTENT.home, ...(content.home || {}) },
    about: { ...DEFAULT_CONTENT.about, ...(content.about || {}) },
    philosophy: { ...DEFAULT_CONTENT.philosophy, ...(content.philosophy || {}) },
    products: content.products || {}
  };
  await redis(["SET", KEY, JSON.stringify(clean)]);
  return clean;
}
