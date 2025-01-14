import React, { useState, useEffect, useCallback } from "react";
import { Clock, Timer } from "lucide-react";

const TimerAndSet = () => {
  // Estados para los inputs
  const [trabajo, setTrabajo] = useState({ minutos: 0, segundos: 0 });
  const [descanso, setDescanso] = useState({ minutos: 0, segundos: 0 });
  const [ejercicios, setEjercicios] = useState(0);
  const [rondas, setRondas] = useState(0);
  const [reinicioRonda, setReinicioRonda] = useState({
    minutos: 0,
    segundos: 0,
  });

  // Estados para el temporizador
  const [tiempoTotal, setTiempoTotal] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [tiempoFaseActual, setTiempoFaseActual] = useState(0);
  const [estaActivo, setEstaActivo] = useState(false);
  const [faseActual, setFaseActual] = useState("");
  const [ejerciciosRestantes, setEjerciciosRestantes] = useState(0);
  const [rondaActual, setRondaActual] = useState(1);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Componente InputTiempo reutilizable
  const InputTiempo = ({ label, icon: Icon, tiempo, onChange, disabled }) => (
    <div className="space-y-2">
      <label className="block text-[#F0F0F0] font-medium flex items-center gap-2">
        <Icon className="w-5 h-5" />
        {label}
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="number"
            value={tiempo.minutos}
            onChange={(e) => onChange("minutos", e.target.value)}
            className="w-full p-3 bg-[#202123] rounded-lg border border-gray-700 text-[#F0F0F0] focus:outline-none focus:border-[#FF3B30] pr-12"
            placeholder="00"
            max="99"
            min="0"
            disabled={disabled}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            min
          </span>
        </div>
        <div className="relative flex-1">
          <input
            type="number"
            value={tiempo.segundos}
            onChange={(e) => onChange("segundos", e.target.value)}
            className="w-full p-3 bg-[#202123] rounded-lg border border-gray-700 text-[#F0F0F0] focus:outline-none focus:border-[#FF3B30] pr-12"
            placeholder="00"
            max="59"
            min="0"
            disabled={disabled}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            seg
          </span>
        </div>
      </div>
    </div>
  );

  // Convertir tiempo a segundos
  const tiempoASegundos = (tiempo) => {
    return tiempo.minutos * 60 + tiempo.segundos;
  };

  // Función para validar y convertir tiempo
  const validarTiempo = (valor, tipo) => {
    if (tipo === "minutos" && valor > 99) return 99;
    if (tipo === "segundos" && valor > 59) return 59;
    return valor >= 0 ? valor : 0;
  };

  // Manejadores de cambio para los inputs de tiempo
  const manejarCambioTiempo = (tipo, campo, valor) => {
    const valorValidado = validarTiempo(parseInt(valor) || 0, campo);
    switch (tipo) {
      case "trabajo":
        setTrabajo((prev) => ({ ...prev, [campo]: valorValidado }));
        break;
      case "descanso":
        setDescanso((prev) => ({ ...prev, [campo]: valorValidado }));
        break;
      case "reinicio":
        setReinicioRonda((prev) => ({ ...prev, [campo]: valorValidado }));
        break;
      default:
        break;
    }
  };

  // Color según la fase
  const obtenerColorFase = () => {
    switch (faseActual) {
      case "Trabajo":
        return "bg-[#FF3B30]";
      case "Descanso":
        return "bg-green-500";
      case "Reinicio de Ronda":
        return "bg-blue-500";
      case "¡Completado!":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  // Color del texto según ejercicios restantes
  const obtenerColorEjercicios = () => {
    if (ejerciciosRestantes === 1) return "text-[#FF3B30]";
    if (ejerciciosRestantes === 2) return "text-yellow-500";
    return "text-[#F0F0F0]";
  };

  // Siguiente fase
  const siguienteFase = useCallback(() => {
    if (faseActual === "Trabajo") {
      if (ejerciciosRestantes > 1) {
        setFaseActual("Descanso");
        setTiempoFaseActual(tiempoASegundos(descanso));
      } else if (rondaActual < rondas) {
        setFaseActual("Reinicio de Ronda");
        setTiempoFaseActual(tiempoASegundos(reinicioRonda));
        setEjerciciosRestantes(ejercicios);
        setRondaActual((prev) => prev + 1);
      } else {
        setEstaActivo(false);
        setFaseActual("¡Completado!");
        return;
      }
    } else if (faseActual === "Descanso") {
      setFaseActual("Trabajo");
      setTiempoFaseActual(tiempoASegundos(trabajo));
      setEjerciciosRestantes((prev) => prev - 1);
    } else if (faseActual === "Reinicio de Ronda") {
      setFaseActual("Trabajo");
      setTiempoFaseActual(tiempoASegundos(trabajo));
    } else {
      setFaseActual("Trabajo");
      setTiempoFaseActual(tiempoASegundos(trabajo));
    }
  }, [
    faseActual,
    ejerciciosRestantes,
    ejercicios,
    rondaActual,
    rondas,
    trabajo,
    descanso,
    reinicioRonda,
  ]);

  // Calcular tiempo total
  const calcularTiempoTotal = () => {
    if (!ejercicios || !rondas) {
      alert("Por favor ingresa el número de ejercicios y rondas");
      return;
    }
    const tiempoTrabajo = tiempoASegundos(trabajo) * ejercicios;
    const tiempoDescanso = tiempoASegundos(descanso) * (ejercicios - 1);
    const tiempoReinicio = tiempoASegundos(reinicioRonda) * (rondas - 1);
    const total = (tiempoTrabajo + tiempoDescanso + tiempoReinicio) * rondas;
    setTiempoTotal(total);
    setTiempoRestante(total);
    setTiempoFaseActual(tiempoASegundos(trabajo));
    setFaseActual("");
    setEjerciciosRestantes(ejercicios);
  };

  // Reiniciar temporizador
  const reiniciarTemporizador = () => {
    setEstaActivo(false);
    setFaseActual("");
    setEjerciciosRestantes(ejercicios);
    setRondaActual(1);
    setTiempoRestante(tiempoTotal);
    setTiempoFaseActual(tiempoASegundos(trabajo));
    setMostrarConfirmacion(false);
  };

  // Formato de tiempo para mostrar
  const formatoTiempo = (segundos) => {
    const hrs = Math.floor(segundos / 3600);
    const mins = Math.floor((segundos % 3600) / 60);
    const secs = segundos % 60;
    return `${hrs > 0 ? hrs + ":" : ""}${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Efecto para el temporizador
  useEffect(() => {
    let intervalo;
    if (estaActivo && tiempoRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            clearInterval(intervalo);
            return 0;
          }
          return prev - 1;
        });

        setTiempoFaseActual((prev) => {
          if (prev <= 1) {
            siguienteFase();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [estaActivo, tiempoRestante, siguienteFase]);

  // Efecto para manejar la confirmación al salir
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (estaActivo) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [estaActivo]);

  return (
    <div className="min-h-screen bg-[#202123] pb-12">
      <div className="flex flex-col items-center pt-10">
        <div className="bg-[#2C2C2E] p-8 rounded-lg shadow-2xl w-full max-w-4xl border border-gray-700">
          <h1 className="text-4xl font-bold text-[#FFFFFF] mb-8 flex items-center gap-3">
            <Timer className="w-8 h-8" />
            Temporizador de Entrenamiento
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Trabajo */}
            <InputTiempo
              label="Tiempo de Trabajo"
              icon={Clock}
              tiempo={trabajo}
              onChange={(campo, valor) =>
                manejarCambioTiempo("trabajo", campo, valor)
              }
              disabled={estaActivo}
            />

            {/* Input Descanso */}
            <InputTiempo
              label="Tiempo de Descanso"
              icon={Clock}
              tiempo={descanso}
              onChange={(campo, valor) =>
                manejarCambioTiempo("descanso", campo, valor)
              }
              disabled={estaActivo}
            />

            {/* Input Ejercicios */}
            <div className="space-y-2">
              <label className="block text-[#F0F0F0] font-medium">
                Número de Ejercicios
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={ejercicios}
                  onChange={(e) =>
                    setEjercicios(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-full p-3 bg-[#202123] rounded-lg border border-gray-700 text-[#F0F0F0] focus:outline-none focus:border-[#FF3B30]"
                  placeholder="Ej: 5"
                  disabled={estaActivo}
                  min="0"
                />
              </div>
            </div>

            {/* Input Rondas */}
            <div className="space-y-2">
              <label className="block text-[#F0F0F0] font-medium">
                Número de Rondas
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={rondas}
                  onChange={(e) =>
                    setRondas(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-full p-3 bg-[#202123] rounded-lg border border-gray-700 text-[#F0F0F0] focus:outline-none focus:border-[#FF3B30]"
                  placeholder="Ej: 3"
                  disabled={estaActivo}
                  min="0"
                />
              </div>
            </div>

            {/* Input Reinicio de Ronda */}
            <div className="space-y-2 md:col-span-2">
              <InputTiempo
                label="Tiempo de Reinicio entre Rondas"
                icon={Clock}
                tiempo={reinicioRonda}
                onChange={(campo, valor) =>
                  manejarCambioTiempo("reinicio", campo, valor)
                }
                disabled={estaActivo}
              />
            </div>
          </div>

          {/* Botón para calcular tiempo total */}
          {!estaActivo && (
            <button
              onClick={calcularTiempoTotal}
              className="w-full bg-[#FF3B30] hover:bg-opacity-80 text-[#FFFFFF] font-bold py-3 px-6 rounded-lg transition-colors mt-6 flex items-center justify-center gap-2"
            >
              <Timer className="w-5 h-5" />
              Calcular Tiempo Total
            </button>
          )}

          {/* Sección del temporizador */}
          {tiempoTotal > 0 && (
            <div className="mt-8 p-6 bg-[#202123] rounded-lg border border-gray-700">
              <div className="text-center">
                <h2 className="text-[#F0F0F0] text-2xl mb-4">
                  Tiempo Total: {formatoTiempo(tiempoTotal)}
                </h2>
                <div
                  className={`text-6xl font-bold mb-6 ${
                    tiempoFaseActual < 4 ? "text-[#FF3B30]" : "text-[#F0F0F0]"
                  } transition-colors duration-300`}
                >
                  {formatoTiempo(tiempoFaseActual)}
                </div>

                {/* Barra de progreso */}
                <div className="w-full bg-gray-700 rounded-full h-2.5
                mb-6">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${obtenerColorFase()}`}
                    style={{
                      width: `${(tiempoRestante / tiempoTotal) * 100}%`,
                    }}
                  />
                </div>

                {faseActual && (
                  <div className="mb-6 space-y-4">
                    <div
                      className={`text-2xl font-bold ${obtenerColorFase()} rounded-lg p-2 transition-colors duration-300`}
                    >
                      {faseActual}
                    </div>

                    {/* Contador de ejercicios con animación */}
                    <div className="flex flex-col items-center transition-all duration-300">
                      <div
                        className={`text-4xl font-bold mb-2 transition-all duration-300 ${obtenerColorEjercicios()}`}
                      >
                        {ejerciciosRestantes}
                      </div>
                      <p className="text-gray-400">
                        {ejerciciosRestantes === 1
                          ? "¡Último ejercicio!"
                          : "Ejercicios restantes"}
                      </p>
                    </div>

                    <p className="text-[#F0F0F0] text-xl">
                      Ronda {rondaActual} de {rondas}
                    </p>

                    {/* Mensaje motivacional */}
                    {ejerciciosRestantes === 1 && (
                      <p className="text-[#FF3B30] font-bold animate-pulse">
                        ¡Último esfuerzo, tú puedes!
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  {/* Botón Play/Pause */}
                  <button
                    onClick={() => {
                      if (!estaActivo && !faseActual) {
                        setFaseActual("Trabajo");
                      }
                      setEstaActivo(!estaActivo);
                    }}
                    className={`px-8 py-3 rounded-full text-white font-bold text-xl transition-colors flex items-center gap-2 ${
                      estaActivo
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {estaActivo ? (
                      <>
                        <Timer className="w-5 h-5" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Timer className="w-5 h-5" />
                        Iniciar
                      </>
                    )}
                  </button>

                  {/* Botón Reiniciar */}
                  {faseActual && (
                    <button
                      onClick={() => setMostrarConfirmacion(true)}
                      className="px-8 py-3 rounded-full text-white font-bold text-xl bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-2"
                    >
                      <Timer className="w-5 h-5" />
                      Reiniciar
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Modal de confirmación */}
          {mostrarConfirmacion && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-[#2C2C2E] p-6 rounded-lg shadow-xl max-w-sm w-full">
                <h3 className="text-xl font-bold text-[#F0F0F0] mb-4">
                  ¿Estás seguro?
                </h3>
                <p className="text-[#F0F0F0] mb-6">
                  Se perderá el progreso actual del entrenamiento.
                </p>
                <div className="flex gap-4 justify-end">
                  <button
                    onClick={() => setMostrarConfirmacion(false)}
                    className="px-4 py-2 rounded-lg text-[#F0F0F0] bg-gray-600 hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={reiniciarTemporizador}
                    className="px-4 py-2 rounded-lg text-white bg-[#FF3B30] hover:bg-opacity-80 transition-colors"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerAndSet;