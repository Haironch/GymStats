import React from 'react';
import WorkoutForm from '../components/WorkoutForm';

const Home = ({ user }) => {
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
               Bienvenido, {user.displayName.split(' ')[0]}!
             </h1>
             <p className="text-[#F0F0F0] mt-2">{user.email}</p>
           </div>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full max-w-4xl">
         <div className="bg-[#2C2C2E] p-6 rounded-lg shadow-lg border border-gray-700">
           <h3 className="text-[#FF3B30] font-bold text-xl mb-2">Último entreno</h3>
           <p className="text-[#F0F0F0]">Sin registros</p>
         </div>
         <div className="bg-[#2C2C2E] p-6 rounded-lg shadow-lg border border-gray-700">
           <h3 className="text-[#FF3B30] font-bold text-xl mb-2">Esta semana</h3>
           <p className="text-[#F0F0F0]">0 entrenamientos</p>
         </div>
         <div className="bg-[#2C2C2E] p-6 rounded-lg shadow-lg border border-gray-700">
           <h3 className="text-[#FF3B30] font-bold text-xl mb-2">Progreso</h3>
           <p className="text-[#F0F0F0]">0%</p>
         </div>
       </div>

       <WorkoutForm />
     </div>
   </div>
 );
};

export default Home;