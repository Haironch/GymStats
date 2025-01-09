import React, { useState } from 'react';

const CalcularPeso = () => {
  const [genero, setGenero] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [resultado, setResultado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const calcularIMC = () => {
    if (!altura || !peso) {
      setMensaje('Por favor complete todos los campos');
      return;
    }

    const alturaMetros = altura / 100;
    const imc = peso / (alturaMetros * alturaMetros);
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
                {/* Solo dos géneros existen */}
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
              <label className="block mb-2 text-[#F0F0F0]">Peso (kg)</label>
              <input
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="w-full p-3 bg-[#202123] rounded-lg border border-gray-700 text-[#F0F0F0] focus:outline-none focus:border-[#FF3B30]"
                placeholder="Ej: 70"
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
                    className="bg-[#FF3B30] h-2.5 rounded-full"
                    style={{ width: `${(resultado / 40) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  Nota: Esta medición depende de tu estructura física y no es 100% exacta.
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