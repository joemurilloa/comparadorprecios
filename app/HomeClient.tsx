"use client";
import { useRef, useState, useMemo } from "react";
import HeroSection from "./HeroSection";
import Image from "next/image";

interface Product {
  name: string;
  title: string;
  price: string;
  image: string;
  url: string;
  affiliate: string;
  type?: string;
}

interface FilterState {
  priceRange: string;
  platform: string;
  sort: string;
}

interface HomeClientProps {
  grouped: Record<string, Product[]>;
  featured: Product[];
  categories: Array<{
    name: string;
    icon: string;
  }>;
  testimonials: Array<{
    name: string;
    text: string;
    avatar: string;
  }>;
}

const ITEMS_PER_PAGE = 12;

export default function HomeClient({ grouped, featured, categories, testimonials }: HomeClientProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'cursos' | 'productos'>('cursos');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: 'all',
    platform: 'all',
    sort: 'recommended'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const handleCTAClick = () => {
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Separar productos y cursos
  const allProducts = Object.values(grouped).flat();
  const cursos = allProducts.filter(p => p.type === 'udemy' || p.type === 'coursera');
  const productos = allProducts.filter(p => p.type === 'producto');

  const filteredItems = useMemo(() => {
    let items = activeTab === 'cursos' ? cursos : productos;
    
    // Aplicar búsqueda
    if (searchQuery) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Aplicar filtros
    if (filters.platform !== 'all') {
      items = items.filter(item => item.type === filters.platform);
    }

    if (filters.priceRange !== 'all') {
      const price = parseFloat(filters.priceRange);
      items = items.filter(item => {
        const itemPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
        return itemPrice <= price;
      });
    }

    // Aplicar ordenamiento
    if (filters.sort === 'price-asc') {
      items.sort((a, b) => parseFloat(a.price.replace(/[^0-9.-]+/g, "")) - parseFloat(b.price.replace(/[^0-9.-]+/g, "")));
    } else if (filters.sort === 'price-desc') {
      items.sort((a, b) => parseFloat(b.price.replace(/[^0-9.-]+/g, "")) - parseFloat(a.price.replace(/[^0-9.-]+/g, "")));
    }

    return items;
  }, [activeTab, filters, searchQuery, cursos, productos]);

  // Calcular paginación
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 text-gray-900">
      {/* Barra superior fija con buscador */}
      <nav className="fixed top-0 left-0 w-full bg-white/90 shadow z-50 flex items-center px-4 py-2 justify-between backdrop-blur">
        <span className="font-extrabold text-indigo-700 text-2xl tracking-tight">
          Comparador<span className="text-blue-500">Inteligente</span>
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Busca tu producto…"
          className="rounded-lg border px-3 py-1 w-56 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Buscar producto"
        />
      </nav>

      <main className="pt-20">
        <HeroSection onCTAClick={handleCTAClick} />

        {/* Productos Destacados */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-indigo-900 mb-6">Ofertas Destacadas</h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {featured.map((p, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 flex gap-4">
                <div className="relative w-40 h-40">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover rounded-lg"
                    unoptimized
                    priority
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-indigo-900">{p.title}</h3>
                  <p className="text-3xl font-extrabold text-green-600 mb-4">{p.price}</p>
                  <a
                    href={p.affiliate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all duration-300"
                  >
                    Ver Oferta
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Productos Populares de Amazon */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-indigo-900">Lo Más Popular en Amazon</h2>
              <a
                href="#productos"
                onClick={() => {
                  setActiveTab('productos');
                  listRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2"
              >
                Ver todos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {productos.slice(0, 5).map((p, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-4 flex flex-col hover:shadow-xl transition-all duration-300">
                  <div className="relative w-full pt-[100%] mb-3 overflow-hidden rounded-lg group">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover absolute top-0 left-0 group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                      priority
                    />
                    {parseFloat(p.price.replace(/[^0-9.-]+/g, "")) < 50 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ¡Oferta!
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold mb-1 text-indigo-900 line-clamp-2">{p.title}</h3>
                  <p className="text-xl font-extrabold text-green-600 mb-3">{p.price}</p>
                  <a
                    href={p.affiliate.replace("TUAFILIADO", process.env.NEXT_PUBLIC_AFFILIATE_ID || "TUAFILIADO")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold py-2 px-3 rounded-lg text-center text-sm shadow-lg transition-all duration-300"
                  >
                    Ver en Amazon
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cursos Más Solicitados */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-indigo-900">Cursos Más Solicitados</h2>
              <a
                href="#cursos"
                onClick={() => {
                  setActiveTab('cursos');
                  listRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2"
              >
                Ver todos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {cursos.slice(0, 5).map((p, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-4 flex flex-col hover:shadow-xl transition-all duration-300">
                  <div className="relative w-full pt-[56.25%] mb-3 overflow-hidden rounded-lg group">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover absolute top-0 left-0 group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                      priority
                    />
                    <div className="absolute top-2 right-2 bg-indigo-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {p.type === 'udemy' ? 'Udemy' : 'Coursera'}
                    </div>
                    {parseFloat(p.price.replace(/[^0-9.-]+/g, "")) < 20 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ¡Oferta!
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold mb-1 text-indigo-900 line-clamp-2">{p.title}</h3>
                  <p className="text-xl font-extrabold text-green-600 mb-3">{p.price}</p>
                  <a
                    href={p.affiliate.replace("TUAFILIADO", process.env.NEXT_PUBLIC_AFFILIATE_ID || "TUAFILIADO")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold py-2 px-3 rounded-lg text-center text-sm shadow-lg transition-all duration-300"
                  >
                    Ver en {p.type === 'udemy' ? 'Udemy' : 'Coursera'}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categorías */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-indigo-900 mb-8">Explora por Categoría</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  className="p-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors flex flex-col items-center gap-2"
                >
                  <span className="text-4xl">{cat.icon}</span>
                  <span className="font-medium text-indigo-900">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Lo que dicen nuestros usuarios</h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                      unoptimized
                    />
                    <h3 className="font-semibold text-lg">{t.name}</h3>
                  </div>
                  <p className="text-gray-600 italic">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pestañas y Listado de productos */}
        <section ref={listRef} className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-4 mb-6 items-center">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setActiveTab('cursos');
                  setCurrentPage(1);
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'cursos'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                Cursos Online ({cursos.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab('productos');
                  setCurrentPage(1);
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'productos'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                Productos ({productos.length})
              </button>
            </div>

            {/* Filtros */}
            <div className="flex gap-4 ml-auto">
              <select
                value={filters.platform}
                onChange={(e) => setFilters({...filters, platform: e.target.value})}
                className="rounded-lg border px-3 py-2 bg-white"
              >
                <option value="all">Todas las plataformas</option>
                {activeTab === 'cursos' ? (
                  <>
                    <option value="udemy">Udemy</option>
                    <option value="coursera">Coursera</option>
                  </>
                ) : (
                  <option value="producto">Amazon</option>
                )}
              </select>

              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                className="rounded-lg border px-3 py-2 bg-white"
              >
                <option value="all">Cualquier precio</option>
                <option value="20">Hasta $20</option>
                <option value="50">Hasta $50</option>
                <option value="100">Hasta $100</option>
                <option value="200">Hasta $200</option>
              </select>

              <select
                value={filters.sort}
                onChange={(e) => setFilters({...filters, sort: e.target.value})}
                className="rounded-lg border px-3 py-2 bg-white"
              >
                <option value="recommended">Recomendados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>

          {/* Grid de productos/cursos */}
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {paginatedItems.map((p, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-3 flex flex-col hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full pt-[100%] mb-3 overflow-hidden rounded-lg">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover absolute top-0 left-0 hover:scale-105 transition-transform duration-300"
                    unoptimized
                    priority
                  />
                </div>
                <h3 className="text-sm font-bold mb-1 text-indigo-900 line-clamp-2">{p.title}</h3>
                <p className="text-xl font-extrabold text-green-600 mb-3">{p.price}</p>
                <a
                  href={p.affiliate.replace("TUAFILIADO", process.env.NEXT_PUBLIC_AFFILIATE_ID || "TUAFILIADO")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold py-2 px-3 rounded-lg text-center text-sm shadow-lg transition-all duration-300"
                >
                  Ver en {p.type === 'udemy' ? 'Udemy' : p.type === 'coursera' ? 'Coursera' : 'Amazon'}
                </a>
                <span className="text-[10px] text-center text-gray-400 mt-1">Enlace de afiliado</span>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white text-indigo-600 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-4 py-2 rounded-lg bg-white">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white text-indigo-600 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
