import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  Timestamp
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Trash2 } from 'lucide-react';

const muscleGroups = {
  upper: [
    "Pectorales",
    "Dorsales",
    "Trapecio",
    "Deltoides",
    "Bíceps",
    "Tríceps",
  ],
  lower: ["Cuádriceps", "Glúteos", "Femorales", "Gemelos", "Aductores"],
  abdominals: [
    "Abdominales superiores",
    "Abdominales centrales",
    "Abdominales inferiores",
    "Laterales (oblicuos)",
  ],
};

const WorkoutForm = ({ onWorkoutAdded }) => {
  const [date, setDate] = useState(new Date());
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [didCardio, setDidCardio] = useState(null);
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [workouts, setWorkouts] = useState([]);

  const auth = getAuth();
  const db = getFirestore();

  // Configurar límites del calendario para el año actual
  const currentYear = new Date().getFullYear();
  const minDate = new Date(currentYear, 0, 1); // 1 de enero del año actual
  const maxDate = new Date(currentYear, 11, 31); // 31 de diciembre del año actual

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "workouts"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const workoutsList = [];
        querySnapshot.forEach((doc) => {
          workoutsList.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setWorkouts(workoutsList);
      },
      (error) => {
        console.error("Error al obtener entrenamientos:", error);
        setError(error.message);
      }
    );

    return () => unsubscribe();
  }, [auth.currentUser]);

  const formatDate = (date) => {
    if (!date) return null;
    
    // Si es un Timestamp de Firestore, convertirlo a Date
    const dateObj = date instanceof Timestamp ? date.toDate() : new Date(date);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    return dateObj.toLocaleDateString("es-ES", options);
  };

  const handleDelete = async (workoutId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) {
      try {
        await deleteDoc(doc(db, "workouts", workoutId));
      } catch (error) {
        console.error("Error al eliminar el entrenamiento:", error);
        alert('Error al eliminar el entrenamiento');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!auth.currentUser) {
        throw new Error("Debes iniciar sesión para guardar un entrenamiento");
      }

      if (selectedMuscles.length === 0) {
        throw new Error("Selecciona al menos un músculo");
      }

      if (didCardio === null) {
        throw new Error("Indica si realizaste cardio");
      }

      // Validar que la fecha esté dentro del año actual
      const selectedYear = date.getFullYear();
      if (selectedYear !== currentYear) {
        throw new Error("Solo puedes registrar entrenamientos del año actual");
      }

      const workoutData = {
        userId: auth.currentUser.uid,
        muscles: selectedMuscles,
        didCardio: didCardio,
        duration: Number(duration),
        createdAt: Timestamp.fromDate(date),
        registeredAt: Timestamp.fromDate(new Date())
      };

      const docRef = await addDoc(collection(db, "workouts"), workoutData);
      console.log("Entrenamiento guardado con ID:", docRef.id);

      setSelectedMuscles([]);
      setDidCardio(null);
      setDuration(30);
      setDate(new Date());

      if (onWorkoutAdded) {
        onWorkoutAdded();
      }

    } catch (err) {
      setError("Error al guardar el entrenamiento: " + err.message);
      console.error("Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 w-full max-w-4xl">
      <div className="bg-[#2C2C2E] p-6 rounded-lg shadow-lg border border-gray-700">
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>
        )}

        <h2 className="text-[#FF3B30] text-2xl font-bold mb-6 text-center">
          Registrar Entrenamiento
        </h2>

        <div className="mb-6">
          <h3 className="text-[#FF3B30] font-bold mb-3">Fecha del Entrenamiento</h3>
          <Calendar
            onChange={setDate}
            value={date}
            minDate={minDate}
            maxDate={maxDate}
            className="mb-6 bg-[#F0F0F0] rounded-lg p-2 mx-auto"
          />
          <p className="text-[#F0F0F0] text-sm text-center mt-2">
            Solo puedes registrar entrenamientos del año {currentYear}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Músculos Superiores */}
          <div className="bg-[#2C2C2E] p-4 rounded-lg border border-gray-700">
            <h3 className="text-[#FF3B30] font-bold mb-3">
              Músculos Superiores
            </h3>
            <div className="space-y-2">
              {muscleGroups.upper.map((muscle) => (
                <label
                  key={muscle}
                  className="flex items-center text-[#F0F0F0]"
                >
                  <input
                    type="checkbox"
                    value={muscle}
                    checked={selectedMuscles.includes(muscle)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMuscles([...selectedMuscles, muscle]);
                      } else {
                        setSelectedMuscles(
                          selectedMuscles.filter((m) => m !== muscle)
                        );
                      }
                    }}
                    className="mr-2 accent-[#FF3B30]"
                  />
                  {muscle}
                </label>
              ))}
            </div>
          </div>

          {/* Músculos Inferiores y Cardio */}
          <div className="space-y-6">
            {/* Músculos Inferiores */}
            <div className="bg-[#2C2C2E] p-4 rounded-lg border border-gray-700">
              <h3 className="text-[#FF3B30] font-bold mb-3">
                Músculos Inferiores
              </h3>
              <div className="space-y-2">
                {muscleGroups.lower.map((muscle) => (
                  <label
                    key={muscle}
                    className="flex items-center text-[#F0F0F0]"
                  >
                    <input
                      type="checkbox"
                      value={muscle}
                      checked={selectedMuscles.includes(muscle)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMuscles([...selectedMuscles, muscle]);
                        } else {
                          setSelectedMuscles(
                            selectedMuscles.filter((m) => m !== muscle)
                          );
                        }
                      }}
                      className="mr-2 accent-[#FF3B30]"
                    />
                    {muscle}
                  </label>
                ))}
              </div>
            </div>

            {/* Cardio */}
            <div className="bg-[#2C2C2E] p-4 rounded-lg border border-gray-700">
              <h3 className="text-[#FF3B30] font-bold mb-3">¿Realizaste cardio?</h3>
              <div className="flex space-x-4">
                <label className="flex items-center text-[#F0F0F0]">
                  <input
                    type="radio"
                    name="cardio"
                    checked={didCardio === true}
                    onChange={() => setDidCardio(true)}
                    className="mr-2 accent-[#FF3B30]"
                  />
                  Sí
                </label>
                <label className="flex items-center text-[#F0F0F0]">
                  <input
                    type="radio"
                    name="cardio"
                    checked={didCardio === false}
                    onChange={() => setDidCardio(false)}
                    className="mr-2 accent-[#FF3B30]"
                  />
                  No
                </label>
              </div>
            </div>
          </div>

          {/* Abdominales */}
          <div className="bg-[#2C2C2E] p-4 rounded-lg border border-gray-700">
            <h3 className="text-[#FF3B30] font-bold mb-3">
              Abdominales
            </h3>
            <div className="space-y-2">
              {muscleGroups.abdominals.map((muscle) => (
                <label
                  key={muscle}
                  className="flex items-center text-[#F0F0F0]"
                >
                  <input
                    type="checkbox"
                    value={muscle}
                    checked={selectedMuscles.includes(muscle)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMuscles([...selectedMuscles, muscle]);
                      } else {
                        setSelectedMuscles(
                          selectedMuscles.filter((m) => m !== muscle)
                        );
                      }
                    }}
                    className="mr-2 accent-[#FF3B30]"
                  />
                  {muscle}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#2C2C2E] p-4 rounded-lg border border-gray-700 mb-6">
          <h3 className="text-[#FF3B30] font-bold mb-3">Duración (minutos)</h3>
          <input
            type="range"
            min="5"
            max="180"
            step="5"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full accent-[#FF3B30]"
          />
          <span className="text-[#F0F0F0]">{duration} minutos</span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full px-6 py-3 bg-[#FF3B30] text-[#FFFFFF] rounded-lg font-bold 
            ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#C0392B]"} 
            transition-colors`}
        >
          {loading ? "Guardando..." : "Guardar Entrenamiento"}
        </button>
      </div>

      {/* Lista de entrenamientos recientes */}
      {workouts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-[#FF3B30]">
            Últimos Entrenamientos
          </h2>
          <div className="space-y-4">
            {workouts.slice(0, 5).map((workout) => (
              <div
                key={workout.id}
                className="bg-[#2C2C2E] p-4 rounded-lg border border-gray-700 hover:border-[#FF3B30] transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="text-[#F0F0F0]">
                    <p className="font-bold capitalize">
                      {formatDate(workout.createdAt)}
                    </p>
                    <div className="mt-2">
                      <span className="text-gray-400">Cardio:</span>
                      <span className="ml-2">{workout.didCardio ? 'Sí' : 'No'}</span>
                      <div className="mt-2">
                        <span className="text-gray-400">Músculos trabajados:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {workout.muscles.map((muscle, index) => (
                            <span
                              key={index}
                              className="bg-gray-700 px-2 py-1 rounded-full text-sm"
                            >
                              {muscle}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-[#FF3B30] text-white px-3 py-1 rounded-full text-sm">
                      {workout.duration} min
                    </span>
                    <button 
                      onClick={() => handleDelete(workout.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-500/10"
                      title="Eliminar entrenamiento"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutForm;