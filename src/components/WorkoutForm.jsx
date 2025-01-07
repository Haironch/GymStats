import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const muscleGroups = {
  upper: [
    'Pectorales', 'Dorsales', 'Trapecio', 'Deltoides',
    'Bíceps', 'Tríceps', 'Abdominales'
  ],
  lower: [
    'Cuádriceps', 'Glúteos', 'Femorales', 'Gemelos', 'Aductores'
  ]
};

const WorkoutForm = () => {
  const [date, setDate] = useState(new Date());
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [duration, setDuration] = useState(30);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ date, selectedMuscles, duration });
  };

  return (
    <div className="bg-[#2C2C2E] p-6 rounded-lg max-w-2xl mx-auto mt-8 border border-gray-700">
      <h2 className="text-[#FF3B30] text-2xl font-bold mb-6">Registrar Entrenamiento</h2>
      
      <Calendar 
        onChange={setDate} 
        value={date}
        className="mb-6 bg-[#F0F0F0] rounded-lg p-2"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#2C2C2E] p-4 rounded-lg border border-gray-700">
          <h3 className="text-[#FF3B30] font-bold mb-3">Músculos Superiores</h3>
          <div className="space-y-2">
            {muscleGroups.upper.map(muscle => (
              <label key={muscle} className="flex items-center text-[#F0F0F0]">
                <input
                  type="checkbox"
                  value={muscle}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMuscles([...selectedMuscles, muscle]);
                    } else {
                      setSelectedMuscles(selectedMuscles.filter(m => m !== muscle));
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
          <h3 className="text-[#FF3B30] font-bold mb-3">Músculos Inferiores</h3>
          <div className="space-y-2">
            {muscleGroups.lower.map(muscle => (
              <label key={muscle} className="flex items-center text-[#F0F0F0]">
                <input
                  type="checkbox"
                  value={muscle}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMuscles([...selectedMuscles, muscle]);
                    } else {
                      setSelectedMuscles(selectedMuscles.filter(m => m !== muscle));
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
        className="w-full px-6 py-3 bg-[#FF3B30] text-[#FFFFFF] rounded-lg font-bold hover:bg-[#C0392B] transition-colors"
      >
        Guardar Entrenamiento
      </button>
    </div>
  );
};

export default WorkoutForm;