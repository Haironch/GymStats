import React, { useState } from "react";
import { ChevronDown, ChevronUp, Activity, Flame, Heart } from "lucide-react";

const Suplementos = () => {
  const [expandedCategory, setExpandedCategory] = useState("muscle");

  const categories = {
    muscle: {
      title: "Para ganar músculo y mejorar el rendimiento",
      icon: <Activity className="w-6 h-6 text-blue-500" />,
      supplements: [
        {
          name: "Proteína en polvo (Whey, Caseína o Vegetal)",
          description:
            "Aporta proteínas de alta calidad para la recuperación y crecimiento muscular.",
        },
        {
          name: "Creatina Monohidratada",
          description:
            "Mejora la fuerza, el rendimiento y la recuperación muscular.",
        },
        {
          name: "Aminoácidos de Cadena Ramificada (BCAAs)",
          description:
            "Ayudan a reducir la fatiga y preservar la masa muscular.",
        },
        {
          name: "Beta-Alanina",
          description:
            "Retrasa la fatiga muscular y mejora el rendimiento en entrenamientos intensos.",
        },
        {
          name: "Óxido Nítrico (L-Arginina, Citrulina Malato)",
          description:
            "Aumenta la vasodilatación, mejorando el flujo sanguíneo y la congestión muscular.",
        },
      ],
    },
    fat: {
      title: "Para quemar grasa y mejorar la definición",
      icon: <Flame className="w-6 h-6 text-red-500" />,
      supplements: [
        {
          name: "Cafeína",
          description:
            "Potente termogénico que aumenta la energía y la quema de grasa.",
        },
        {
          name: "L-Carnitina",
          description:
            "Ayuda en el transporte de ácidos grasos para usarlos como fuente de energía.",
        },
      ],
    },
    health: {
      title: "Para la salud y el bienestar general",
      icon: <Heart className="w-6 h-6 text-green-500" />,
      supplements: [
        {
          name: "Multivitamínico",
          description:
            "Asegura un buen equilibrio de vitaminas y minerales esenciales.",
        },
        {
          name: "Omega-3 (Ácidos grasos esenciales)",
          description:
            "Mejora la salud cardiovascular y reduce la inflamación.",
        },
        {
          name: "Glutamina",
          description:
            "Favorece la recuperación muscular y fortalece el sistema inmune.",
        },
      ],
    },
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="min-h-screen bg-[#202123] pb-12">
      <div className="flex flex-col items-center pt-10">
        <div className="bg-[#2C2C2E] p-8 rounded-lg shadow-2xl w-full max-w-4xl border border-gray-700">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Guía de Suplementos
          </h1>

          <p className="text-gray-300 text-lg mb-8 text-center">
            Una guía completa de suplementos deportivos clasificados por sus
            beneficios principales
          </p>

          {/* Lista de categorías */}
          {Object.entries(categories).map(([categoryKey, categoryData]) => (
            <div key={categoryKey} className="mb-6">
              <button
                onClick={() => toggleCategory(categoryKey)}
                className="w-full flex items-center justify-between p-4 bg-[#202123] rounded-lg border border-gray-700 hover:bg-[#2C2C2E] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {categoryData.icon}
                  <h2 className="text-xl font-bold text-white">
                    {categoryData.title}
                  </h2>
                </div>
                {expandedCategory === categoryKey ? (
                  <ChevronUp className="w-6 h-6 text-white" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-white" />
                )}
              </button>

              {expandedCategory === categoryKey && (
                <div className="mt-4 space-y-4">
                  {categoryData.supplements.map((supplement, index) => (
                    <div
                      key={index}
                      className="bg-[#202123] p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                      <h3 className="text-xl font-bold text-white mb-2">
                        {supplement.name}
                      </h3>
                      <p className="text-gray-300">{supplement.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="mt-8 p-4 bg-[#202123] rounded-lg border border-gray-700">
            <p className="text-gray-300 text-sm">
              <span className="text-white font-bold">Nota:</span> Esta guía es
              solo informativa. Consulta con un profesional de la salud antes de
              comenzar cualquier régimen de suplementación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suplementos;
