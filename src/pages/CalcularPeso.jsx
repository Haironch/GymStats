import React, { useState } from 'react';

const CalcularPeso = () => {
  const [genero, setGenero] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [unidad, setUnidad] = useState('kg');
  const [resultado, setResultado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const convertirLibrasAKg = (libras) => {
    return libras * 0.453592;
  };

  const calcularIMC = () => {
    if (!altura || !peso) {
      setMensaje('Por favor complete todos los campos');
      return;
    }

    const alturaMetros = altura / 100;
    // Convertir a kg si está en libras
    const pesoEnKg = unidad === 'lb' ? convertirLibrasAKg(Number(peso)) : Number(peso);
    const imc = pesoEnKg / (alturaMetros * alturaMetros);
    setResultado(imc);

    if (imc < 18.5) {
      setMensaje('Bajo peso');
    } else if (imc >= 18.5 && imc < 24.9) {
      setMensaje('Peso normal');
    } else if (imc >= 25 && imc < 29.9) {
      setMensaje('Sobrepeso');
    } else if (imc >= 30 && imc < 34.9) {
      setMensaje('Obesidad grado I');
    } else if (imc >= 35 && imc < 39.9) {
      setMensaje('Obesidad grado II');
    } else {
      setMensaje('Obesidad grado III (mórbida)');
    }
  };

  const calcularAnchoBarra = (imc) => {
    const porcentaje = (imc / 40) * 100;
    return Math.min(porcentaje, 100);
  };

  return (
    <div className="min-h-screen bg-[#202123] pb-12">
      <div className="flex flex-col items-center pt-10">
        <div className="bg-[#2C2C2E] p-8 rounded-lg shadow-2xl w-full max-w-4xl border border-gray-700">
          <h1 className="text-4xl font-bold text-[#FFFFFF] mb-8">
            Calculadora de IMC
          </h1>
          
          <div className="space-y-6">
            {/* Género */}
            <div>
              <label className="block mb-2 text-[#F0F0F0]">
                Género
              </label>
              <select
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                className="w-full p-3 bg-[#202123] rounded-lg border border-gray-700 text-[#F0F0F0] focus:outline-none focus:border-[#FF3B30]"
              >
                <option value="">Seleccionar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            {/* Selector de Unidad de Peso */}
            <div>
              <label className="block mb-2 text-[#F0F0F0]">
                Unidad de Peso
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setUnidad('kg')}
                  className={`flex-1 py-2 px-4 rounded-lg ${
                    unidad === 'kg'
                      ? 'bg-[#FF3B30] text-[#FFFFFF]'
                      : 'bg-[#202123] text-[#F0F0F0] border border-gray-700'
                  }`}
                >
                  Kilogramos (kg)
                </button>
                <button
                  onClick={() => setUnidad('lb')}
                  className={`flex-1 py-2 px-4 rounded-lg ${
                    unidad === 'lb'
                      ? 'bg-[#FF3B30] text-[#FFFFFF]'
                      : 'bg-[#202123] text-[#F0F0F0] border border-gray-700'
                  }`}
                >
                  Libras (lb)
                </button>
              </div>
            </div>

            {/* Altura */}
            <div>
              <label className="block mb-2 text-[#F0F0F0]">Altura (cm)</label>
              <input
                type="number"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                className="w-full p-3 bg-[#202123] rounded-lg border border-gray-700 text-[#F0F0F0] focus:outline-none focus:border-[#FF3B30]"
                placeholder="Ej: 170"
              />
            </div>

            {/* Peso */}
            <div>
              <label className="block mb-2 text-[#F0F0F0]">
                Peso ({unidad})
              </label>
              <input
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="w-full p-3 bg-[#202123] rounded-lg border border-gray-700 text-[#F0F0F0] focus:outline-none focus:border-[#FF3B30]"
                placeholder={`Ej: ${unidad === 'kg' ? '70' : '154'}`}
              />
            </div>

            {/* Botón Calcular */}
            <button
              onClick={calcularIMC}
              className="w-full bg-[#FF3B30] hover:bg-opacity-80 text-[#FFFFFF] font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Calcular IMC
            </button>

            {/* Resultados */}
            {resultado && (
              <div className="mt-6 p-6 bg-[#202123] rounded-lg border border-gray-700">
                <p className="text-xl text-[#F0F0F0]">
                  Tu IMC: <span className="font-bold">{resultado.toFixed(1)}</span>
                </p>
                <p className="text-xl text-[#F0F0F0] mt-2">
                  Categoría: <span className="font-bold text-[#FF3B30]">{mensaje}</span>
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
                  <div
                    className="bg-[#FF3B30] h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${calcularAnchoBarra(resultado)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  Nota: Esta medición depende de tu estructura física y no es 100% exacta.
                  {unidad === 'lb' && (
                    <span className="block mt-2">
                      * El cálculo se realiza convirtiendo las libras a kilogramos para mayor precisión.
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalcularPeso;