import fs from "fs";
import path from "path";
import { Metadata } from "next";
import HomeClient from "./HomeClient";

interface Product {
  name: string;
  title: string;
  price: string;
  image: string;
  url: string;
  affiliate: string;
  type?: string; // Permitir tipo opcional para segmentar
}

export const metadata: Metadata = {
  title: "Comparador de Precios",
  description: "Compara precios de productos y gana con afiliados y AdSense.",
};

async function getProducts(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), "..", "scraper", "cache.json");
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Agrupar productos/cursos por nombre para comparar precios entre plataformas
function groupByName(products: Product[]) {
  const groups: { [name: string]: Product[] } = {};
  for (const p of products) {
    const key = p.name.trim().toLowerCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  }
  return groups;
}

// UX: Hero, CTA, confianza, testimonios, categorías, ofertas, productos agrupados, AdSense, footer
export default async function Home() {
  const products = await getProducts();
  const grouped = groupByName(products);

  // Categorías ejemplo
  const categories = [
    { name: "Electrónica", icon: "💻" },
    { name: "Cursos", icon: "🎓" },
    { name: "Hogar", icon: "🏠" },
    { name: "Oficina", icon: "🖨️" },
    { name: "Gaming", icon: "🎮" },
  ];

  // Testimonios ejemplo
  const testimonials = [
    {
      name: "Ana G.",
      text: "¡Encontré el mejor precio y el envío fue rapidísimo! Repetiré sin duda.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Carlos M.",
      text: "Me ahorré más de $500 en mi último curso. Súper recomendado.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Lucía P.",
      text: "La web es fácil de usar y siempre tiene ofertas frescas.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  // Ofertas destacadas (primeros 2 productos)
  const featured = products.slice(0, 2);

  return (
    <HomeClient
      grouped={grouped}
      featured={featured}
      categories={categories}
      testimonials={testimonials}
    />
  );
}
