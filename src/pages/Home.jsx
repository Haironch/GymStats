import React, { useEffect, useState } from "react";
import WorkoutForm from "../components/WorkoutForm";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Home = ({ user }) => {
  const [stats, setStats] = useState({
    lastWorkout: null,
    weeklyWorkouts: 0,
    monthlyProgress: 0,
    uniqueDaysThisMonth: 0,
    totalDaysInMonth: 0,
    currentMonth: ''
  });

  const fetchStats = () => {
    const auth = getAuth();
    const db = getFirestore();

    if (!auth.currentUser) return;

    const q = query(
      collection(db, "workouts"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const workouts = [];
        querySnapshot.forEach((doc) => {
          workouts.push({ id: doc.id, ...doc.data() });
        });

        // Obtener fecha actual
        const today = new Date();
        
        // Calcular entrenamientos de esta semana (Lunes a Domingo)
        const currentDay = today.getDay();
        const monday = new Date(today);
        monday.setDate(
          today.getDate() - (currentDay === 0 ? 6 : currentDay - 1)
        );
        monday.setHours(0, 0, 0, 0);
        
        const weeklyWorkouts = workouts.filter((workout) => {
          const workoutDate = workout.createdAt instanceof Timestamp 
            ? workout.createdAt.toDate() 
            : new Date(workout.createdAt);
          return workoutDate >= monday;
        }).length;

        // Cálculo para el progreso mensual por días únicos
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const totalDaysInMonth = endOfMonth.getDate();

        // Filtrar entrenamientos del mes actual y obtener días únicos
        const uniqueDays = new Set();
        workouts.forEach((workout) => {
          const workoutDate = workout.createdAt instanceof Timestamp 
            ? workout.createdAt.toDate() 
            : new Date(workout.createdAt);
          if (workoutDate >= startOfMonth && workoutDate <= endOfMonth) {
            uniqueDays.add(workoutDate.toDateString());
          }
        });

        const uniqueDaysCount = uniqueDays.size;
        const monthlyProgress = Math.min((uniqueDaysCount / totalDaysInMonth) * 100, 100);

        // Formatear la fecha del último entrenamiento
        const formatLastWorkoutDate = (workout) => {
          if (!workout) return null;
          
          const date = workout.createdAt instanceof Timestamp 
            ? workout.createdAt.toDate() 
            : new Date(workout.createdAt);
            
          const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          };
          return date.toLocaleDateString("es-ES", options);
        };

        // Obtener nombre del mes actual
        const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(today);

        setStats({
          lastWorkout: workouts[0]
            ? {
                ...workouts[0],
                formattedDate: formatLastWorkoutDate(workouts[0]),
              }
            : null,
          weeklyWorkouts,
          monthlyProgress: monthlyProgress.toFixed(0),
          uniqueDaysThisMonth: uniqueDaysCount,
          totalDaysInMonth: totalDaysInMonth,
          currentMonth: monthName
        });
      },
      (error) => {
        console.error("Error al obtener estadísticas:", error);
      }
    );

    return () => unsubscribe();
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#202123] pb-12">
      <div className="flex flex-col items-center pt-10">
        <div className="bg-[#2C2C2E] p-8 rounded-lg shadow-2xl w-full max-w-4xl border border-gray-700">
          <div className="flex items-center space-x-6">
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-[#FF3B30]"
            />
            <div>
              <h1 className="text-4xl font-bold text-[#FFFFFF]">
                Bienvenido, {user.displayName.split(" ")[0]}!
              </h1>
              <p className="text-[#F0F0F0] mt-2">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full max-w-4xl">
          <div className="bg-[#2C2C2E] p-6 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-[#FF3B30] font-bold text-xl mb-2">
              Último entreno
            </h3>
            <p className="text-[#F0F0F0]">
              {stats.lastWorkout ? (
                <>
                  <div className="capitalize">
                    {stats.lastWorkout.formattedDate}
                  </div>
                  <div className="text-sm mt-1">
                    Músculos: {stats.lastWorkout.muscles.join(", ")}
                  </div>
                </>
              ) : (
                "Sin registros"
              )}
            </p>
          </div>

          <div className="bg-[#2C2C2E] p-6 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-[#FF3B30] font-bold text-xl mb-2">
              Esta semana
            </h3>
            <p className="text-[#F0F0F0]">
              {stats.weeklyWorkouts} de 7 entrenamientos
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                <div
                  className="bg-[#FF3B30] h-2.5 rounded-full"
                  style={{ width: `${(stats.weeklyWorkouts / 7) * 100}%` }}
                ></div>
              </div>
            </p>
          </div>

          <div className="bg-[#2C2C2E] p-6 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-[#FF3B30] font-bold text-xl mb-2">
              Progreso de {stats.currentMonth}
            </h3>
            <p className="text-[#F0F0F0]">
              {stats.monthlyProgress}% del mes ({stats.uniqueDaysThisMonth} días de {stats.totalDaysInMonth})
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
              <div
                className="bg-[#FF3B30] h-2.5 rounded-full"
                style={{ width: `${stats.monthlyProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Meta: Entrenar todos los días del mes
            </p>
          </div>
        </div>

        <WorkoutForm onWorkoutAdded={fetchStats} />
      </div>
    </div>
  );
};

export default Home;