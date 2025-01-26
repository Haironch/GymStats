import React, { useState, useCallback } from "react";
import { Calculator, ChevronRight, Activity, Target } from "lucide-react";

const CalorieCalculator = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    weight: "",
    height: "",
    activityLevel: "",
    goal: "",
    deficit: 20,
    surplus: 10,
    bodyFat: "",
  });

  const [results, setResults] = useState(null);

  const activityLevels = {
    sedentary: { factor: 1.2, label: "Sedentario (poco o ningún ejercicio)" },
    light: { factor: 1.375, label: "Ligero (ejercicio 1-3 días/semana)" },
    moderate: { factor: 1.55, label: "Moderado (ejercicio 3-5 días/semana)" },
    intense: { factor: 1.725, label: "Intenso (ejercicio 6-7 días/semana)" },
    veryIntense: { factor: 1.9, label: "Muy intenso (ejercicio muy duro)" },
  };

  // Resto de la lógica de cálculo permanece igual...
  const calculateTMB = useCallback(() => {
    const { gender, weight, height, age } = formData;
    if (gender === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    }
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }, [formData]);

  const calculateCalories = useCallback(() => {
    const tmb = calculateTMB();
    const activityFactor =
      activityLevels[formData.activityLevel]?.factor || 1.2;
    const get = tmb * activityFactor;

    let finalCalories = get;
    if (formData.goal === "deficit") {
      finalCalories = get * (1 - formData.deficit / 100);
    } else if (formData.goal === "surplus") {
      finalCalories = get * (1 + formData.surplus / 100);
    }

    const protein = formData.weight * 2;
    const fat = formData.weight * 0.8;
    const proteinCalories = protein * 4;
    const fatCalories = fat * 9;
    const carbCalories = finalCalories - (proteinCalories + fatCalories);
    const carbs = carbCalories / 4;

    return {
      tmb: Math.round(tmb),
      get: Math.round(get),
      calories: Math.round(finalCalories),
      macros: {
        protein: Math.round(protein),
        fat: Math.round(fat),
        carbs: Math.round(carbs),
      },
    };
  }, [calculateTMB, formData]);

  const handleSubmit = () => {
    const results = calculateCalories();
    setResults(results);
    setStep(step + 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#FFFFFF]">Género</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`p-4 rounded-lg border ${
                  formData.gender === "male"
                    ? "bg-[#FF3B30] text-[#FFFFFF]"
                    : "bg-[#202123] text-[#F0F0F0] border-gray-700"
                } transition-all`}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, gender: "male" }));
                  setStep(2);
                }}
              >
                Hombre
              </button>
              <button
                className={`p-4 rounded-lg border ${
                  formData.gender === "female"
                    ? "bg-[#FF3B30] text-[#FFFFFF]"
                    : "bg-[#202123] text-[#F0F0F0] border-gray-700"
                } transition-all`}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, gender: "female" }));
                  setStep(2);
                }}
              >
                Mujer
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#FFFFFF]">Datos Básicos</h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-[#F0F0F0] mb-2">Edad (años)</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, age: e.target.value }))
                  }
                  className="w-full p-3 bg-[#202123] rounded-lg border border-gray-700 text-[#F0F0F0] focus:outline-none focus:border-[#FF3B30]"
                  placeholder="Ej: 30"
                />
              </div>
              <div>
                <label className="block text-[#F0F0F0] mb-2">Peso (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, weight: e.target.value }))
                  }
                  className="w-full p-3 bg-[#202123] rounded-lg border border-gray-700 text-[#F0F0F0] focus:outline-none focus:border-[#FF3B30]"
                  placeholder="Ej: 75"
                />
              </div>
              <div>
                <label className="block text-[#F0F0F0] mb-2">Altura (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, height: e.target.value }))
                  }
                  className="w-full p-3 bg-[#202123] rounded-lg border border-gray-700 text-[#F0F0F0] focus:outline-none focus:border-[#FF3B30]"
                  placeholder="Ej: 175"
                />
              </div>
              <button
                onClick={() => setStep(3)}
                className="w-full mt-4 bg-[#FF3B30] hover:bg-opacity-80 text-[#FFFFFF] font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                disabled={!formData.age || !formData.weight || !formData.height}
              >
                Siguiente
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#FFFFFF]">
              Nivel de Actividad
            </h2>
            <div className="grid gap-4">
              {Object.entries(activityLevels).map(([key, { label }]) => (
                <button
                  key={key}
                  className={`p-4 rounded-lg border ${
                    formData.activityLevel === key
                      ? "bg-[#FF3B30] text-[#FFFFFF]"
                      : "bg-[#202123] text-[#F0F0F0] border-gray-700"
                  } transition-all text-left`}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, activityLevel: key }));
                    setStep(4);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#FFFFFF]">Objetivo</h2>
            <div className="grid gap-4">
              <button
                className={`p-4 rounded-lg border ${
                  formData.goal === "deficit"
                    ? "bg-[#FF3B30] text-[#FFFFFF]"
                    : "bg-[#202123] text-[#F0F0F0] border-gray-700"
                } transition-all`}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, goal: "deficit" }));
                  handleSubmit();
                }}
              >
                Definición
              </button>
              <button
                className={`p-4 rounded-lg border ${
                  formData.goal === "maintain"
                    ? "bg-[#FF3B30] text-[#FFFFFF]"
                    : "bg-[#202123] text-[#F0F0F0] border-gray-700"
                } transition-all`}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, goal: "maintain" }));
                  handleSubmit();
                }}
              >
                Mantenimiento
              </button>
              <button
                className={`p-4 rounded-lg border ${
                  formData.goal === "surplus"
                    ? "bg-[#FF3B30] text-[#FFFFFF]"
                    : "bg-[#202123] text-[#F0F0F0] border-gray-700"
                } transition-all`}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, goal: "surplus" }));
                  handleSubmit();
                }}
              >
                Volumen
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#FFFFFF]">Resultados</h2>
            {results && (
              <div className="grid gap-6">
                <div className="p-6 bg-[#202123] rounded-lg border border-gray-700">
                  <h3 className="text-xl font-bold text-[#FFFFFF] mb-4">
                    Calorías Diarias
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-[#F0F0F0]">TMB</p>
                      <p className="text-2xl font-bold text-[#FFFFFF]">
                        {results.tmb}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#F0F0F0]">GET</p>
                      <p className="text-2xl font-bold text-[#FFFFFF]">
                        {results.get}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#F0F0F0]">Objetivo</p>
                      <p className="text-2xl font-bold text-[#FF3B30]">
                        {results.calories}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-[#202123] rounded-lg border border-gray-700">
                  <h3 className="text-xl font-bold text-[#FFFFFF] mb-4">
                    Macronutrientes
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-[#F0F0F0]">Proteínas</p>
                      <p className="text-2xl font-bold text-[#FFFFFF]">
                        {results.macros.protein}g
                      </p>
                    </div>
                    <div>
                      <p className="text-[#F0F0F0]">Grasas</p>
                      <p className="text-2xl font-bold text-[#FFFFFF]">
                        {results.macros.fat}g
                      </p>
                    </div>
                    <div>
                      <p className="text-[#F0F0F0]">Carbohidratos</p>
                      <p className="text-2xl font-bold text-[#FFFFFF]">
                        {results.macros.carbs}g
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setStep(1);
                    setFormData({
                      gender: "",
                      age: "",
                      weight: "",
                      height: "",
                      activityLevel: "",
                      goal: "",
                      deficit: 20,
                      surplus: 10,
                      bodyFat: "",
                    });
                    setResults(null);
                  }}
                  className="w-full bg-[#FF3B30] hover:bg-opacity-80 text-[#FFFFFF] font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Calcular Nuevo
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#202123] pb-12">
      <div className="flex flex-col items-center pt-10">
        <div className="bg-[#2C2C2E] p-8 rounded-lg shadow-2xl w-full max-w-4xl border border-gray-700">
          <h1 className="text-4xl font-bold text-[#FFFFFF] mb-8 flex items-center gap-3">
            <Calculator className="w-8 h-8" />
            Calculadora de Calorías
          </h1>
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default CalorieCalculator;
