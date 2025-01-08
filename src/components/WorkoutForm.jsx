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
  doc
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
    "Abdominales",
  ],
  lower: ["Cuádriceps", "Glúteos", "Femorales", "Gemelos", "Aductores"],
};

const WorkoutForm = ({ onWorkoutAdded }) => {
  const [date, setDate] = useState(new Date());
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [workouts, setWorkouts] = useState([]);

  const auth = getAuth();
  const db = getFirestore();

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
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toDate().toLocaleDateString("es-ES", options);
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

      const workoutData = {
        userId: auth.currentUser.uid,
        muscles: selectedMuscles,
        duration: Number(duration),
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "workouts"), workoutData);
      console.log("Entrenamiento guardado con ID:", docRef.id);

      setSelectedMuscles([]);
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

        <h2 className="text-[#FF3B30] text-2xl font-bold mb-6">
          Registrar Entrenamiento
        </h2>

        <Calendar
          onChange={setDate}
          value={date}
          className="mb-6 bg-[#F0F0F0] rounded-lg p-2 mx-auto"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
    </div>
  );
};

export default WorkoutForm;