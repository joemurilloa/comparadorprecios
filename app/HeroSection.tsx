"use client";
export default function HeroSection({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gradient-to-br from-indigo-100 to-blue-200">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-800 mb-4 drop-shadow-lg">Encuentra hoy la mejor oferta y ahorra hasta un <span className="text-blue-600">50%</span></h1>
      <p className="text-lg sm:text-xl text-indigo-600 font-medium mb-6 max-w-2xl mx-auto">Compara precios en segundos, compra seguro y gana recompensas. Miles de usuarios ya ahorran con nosotros.</p>
      <button
        onClick={onCTAClick}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300"
      >
        ¡Ver Ofertas Ahora!
      </button>
      {/* Sellos de confianza */}
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <span className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow text-sm font-semibold text-green-700 border border-green-200">✅ 100% seguro</span>
        <span className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow text-sm font-semibold text-blue-700 border border-blue-200">🔄 Actualización diaria de precios</span>
        <span className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow text-sm font-semibold text-yellow-700 border border-yellow-200">⭐ Miles de usuarios satisfechos</span>
      </div>
    </section>
  );
}
