import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    // Crear query para obtener los entrenamientos ordenados por fecha
    const q = query(
      collection(db, "workouts"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    // Suscribirse a los cambios en tiempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const workoutsList = [];
      querySnapshot.forEach((doc) => {
        workoutsList.push({ id: doc.id, ...doc.data() });
      });
      setWorkouts(workoutsList);
      setLoading(false);
    }, (error) => {
      console.error("Error al obtener entrenamientos:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toDate().toLocaleDateString('es-ES', options);
  };

  if (loading) return (
    <div className="flex justify-center items-center mt-8">
      <div className="text-[#F0F0F0]">Cargando entrenamientos...</div>
    </div>
  );

  if (workouts.length === 0) {
    return (
      <div className="mt-8 w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-[#FF3B30]">Historial de Entrenamientos</h2>
        <div className="bg-[#2C2C2E] p-6 rounded-lg border border-gray-700 text-center">
          <p className="text-[#F0F0F0]">No hay entrenamientos registrados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-[#FF3B30]">Historial de Entrenamientos</h2>
      <div className="space-y-4">
        {workouts.map((workout) => (
          <div 
            key={workout.id} 
            className="bg-[#2C2C2E] p-6 rounded-lg border border-gray-700 hover:border-[#FF3B30] transition-colors"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[#F0F0F0] font-semibold capitalize">
                  {formatDate(workout.createdAt)}
                </p>
                <span className="bg-[#FF3B30] text-white px-3 py-1 rounded-full text-sm">
                  {workout.duration} min
                </span>
              </div>
              <div className="text-[#F0F0F0]">
                <p className="text-gray-400">Músculos trabajados:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {workout.muscles.map((muscle, index) => (
                    <span 
                      key={index}
                      className="bg-gray-700 text-[#F0F0F0] px-3 py-1 rounded-full text-sm"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutList;