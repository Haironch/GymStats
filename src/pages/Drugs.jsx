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
  Timestamp,
  updateDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Trash2, Check, AlertCircle, Clock } from 'lucide-react';

const Drugs = () => {
  // Estados para el formulario
  const [medicineName, setMedicineName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [frequency, setFrequency] = useState("1");
  const [selectedTimes, setSelectedTimes] = useState(["08:00"]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para los datos
  const [medicines, setMedicines] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  // Cargar medicamentos
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "medicines"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const medicinesList = [];
      querySnapshot.forEach((doc) => {
        medicinesList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setMedicines(medicinesList);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  // Función para agregar horarios
  const addTimeSlot = () => {
    setSelectedTimes([...selectedTimes, "08:00"]);
  };

  // Función para eliminar horarios
  const removeTimeSlot = (index) => {
    const newTimes = selectedTimes.filter((_, i) => i !== index);
    setSelectedTimes(newTimes);
  };

  // Función para manejar cambios en los horarios
  const handleTimeChange = (index, value) => {
    const newTimes = [...selectedTimes];
    newTimes[index] = value;
    setSelectedTimes(newTimes);
  };

  // Función para marcar una dosis como tomada
  const markDoseAsTaken = async (medicineId, doseIndex) => {
    try {
      const medicineRef = doc(db, "medicines", medicineId);
      const medicine = medicines.find(m => m.id === medicineId);
      
      if (!medicine) return;

      const updatedDoses = [...medicine.doses];
      updatedDoses[doseIndex] = {
        ...updatedDoses[doseIndex],
        takenAt: Timestamp.fromDate(new Date()),
        status: 'taken'
      };

      await updateDoc(medicineRef, {
        doses: updatedDoses
      });
    } catch (error) {
      console.error("Error al marcar dosis:", error);
      setError("Error al actualizar la dosis");
    }
  };

  // Función para eliminar un medicamento
  const handleDelete = async (medicineId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este medicamento?')) {
      try {
        await deleteDoc(doc(db, "medicines", medicineId));
      } catch (error) {
        console.error("Error al eliminar el medicamento:", error);
        setError("Error al eliminar el medicamento");
      }
    }
  };

  // Función para generar las dosis entre las fechas seleccionadas
  const generateDoses = (start, end, times) => {
    const doses = [];
    const current = new Date(start);
    const endDate = new Date(end);

    while (current <= endDate) {
      times.forEach(time => {
        const [hours, minutes] = time.split(':');
        const doseDate = new Date(current);
        doseDate.setHours(parseInt(hours), parseInt(minutes), 0);
        
        doses.push({
          scheduledFor: Timestamp.fromDate(doseDate),
          takenAt: null,
          status: 'pending'
        });
      });
      
      current.setDate(current.getDate() + 1);
    }

    return doses;
  };

  // Función para guardar un nuevo medicamento
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!auth.currentUser) {
        throw new Error("Debes iniciar sesión para guardar un medicamento");
      }

      if (!medicineName || selectedTimes.length === 0) {
        throw new Error("Por favor completa todos los campos requeridos");
      }

      // Validar que la fecha de fin no sea anterior a la de inicio
      if (endDate < startDate) {
        throw new Error("La fecha de fin no puede ser anterior a la fecha de inicio");
      }

      const doses = generateDoses(startDate, endDate, selectedTimes);

      const medicineData = {
        userId: auth.currentUser.uid,
        medicineName,
        startDate: Timestamp.fromDate(startDate),
        endDate: Timestamp.fromDate(endDate),
        frequency: Number(frequency),
        times: selectedTimes,
        notes,
        status: 'active',
        doses,
        createdAt: Timestamp.fromDate(new Date())
      };

      await addDoc(collection(db, "medicines"), medicineData);

      // Resetear el formulario
      setMedicineName("");
      setStartDate(new Date());
      setEndDate(new Date());
      setFrequency("1");
      setSelectedTimes(["08:00"]);
      setNotes("");
      setShowForm(false);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para obtener el estado de cumplimiento
  const getComplianceStatus = (medicine) => {
    const totalDoses = medicine.doses.length;
    const takenDoses = medicine.doses.filter(dose => dose.status === 'taken').length;
    const compliance = (takenDoses / totalDoses) * 100;
    
    return {
      compliance,
      takenDoses,
      totalDoses
    };
  };

  return (
    <div className="min-h-screen bg-[#202123] pb-12">
      <div className="flex flex-col items-center pt-10">
        <div className="bg-[#2C2C2E] p-8 rounded-lg shadow-2xl w-full max-w-4xl border border-gray-700">
          <h1 className="text-4xl font-bold text-[#FFFFFF] mb-8 text-center">
            Control de Medicamentos
          </h1>

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full px-6 py-3 bg-[#FF3B30] text-[#FFFFFF] rounded-lg font-bold hover:bg-opacity-80 transition-colors mb-8"
            >
              Agregar Nuevo Medicamento
            </button>
          ) : (
            <div className="mb-8">
              {error && (
                <div className="bg-red-500 text-white p-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Nombre del medicamento */}
                <div>
                  <label className="block text-[#FF3B30] font-bold mb-2">
                    Nombre del Medicamento
                  </label>
                  <input
                    type="text"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    className="w-full p-3 bg-[#202123] rounded-lg border border-gray-700 text-[#F0F0F0] focus:outline-none focus:border-[#FF3B30]"
                    placeholder="Ej: Paracetamol"
                  />
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#FF3B30] font-bold mb-2">
                      Fecha de Inicio
                    </label>
                    <Calendar
                      onChange={setStartDate}
                      value={startDate}
                      className="bg-[#F0F0F0] rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-[#FF3B30] font-bold mb-2">
                      Fecha de Fin
                    </label>
                    <Calendar
                      onChange={setEndDate}
                      value={endDate}
                      minDate={startDate}
                      className="bg-[#F0F0F0] rounded-lg p-2"
                    />
                  </div>
                </div>

                {/* Frecuencia y horarios */}
                <div>
                  <label className="block text-[#FF3B30] font-bold mb-2">
                    Horarios
                  </label>
                  <div className="space-y-4">
                    {selectedTimes.map((time, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => handleTimeChange(index, e.target.value)}
                          className="p-2 bg-[#202123] rounded-lg border border-gray-700 text-[#F0F0F0] focus:outline-none focus:border-[#FF3B30]"
                        />
                        {selectedTimes.length > 1 && (
                          <button
                            onClick={() => removeTimeSlot(index)}
                            className="text-[#FF3B30] hover:text-opacity-80"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addTimeSlot}
                      className="text-[#FF3B30] hover:text-opacity-80"
                    >
                      + Agregar horario
                    </button>
                  </div>
                </div>

                {/* Notas */}
                <div>
                  <label className="block text-[#FF3B30] font-bold mb-2">
                    Notas (opcional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 bg-[#202123] rounded-lg border border-gray-700 text-[#F0F0F0] focus:outline-none focus:border-[#FF3B30] h-24"
                    placeholder="Agrega notas o instrucciones especiales"
                  />
                </div>

                {/* Botones */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-[#FF3B30] text-[#FFFFFF] rounded-lg font-bold hover:bg-opacity-80 transition-colors"
                  >
                    {loading ? "Guardando..." : "Guardar Medicamento"}
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-gray-600 text-[#FFFFFF] rounded-lg font-bold hover:bg-opacity-80 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de medicamentos */}
          {medicines.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#FF3B30] mb-4">
                Medicamentos Activos
              </h2>
              {medicines.map((medicine) => {
                const status = getComplianceStatus(medicine);
                const today = new Date();
                const todayDoses = medicine.doses.filter(dose => {
                  const doseDate = dose.scheduledFor.toDate();
                  return doseDate.toDateString() === today.toDateString();
                });

                return (
                  <div
                    key={medicine.id}
                    className="bg-[#202123] p-6 rounded-lg border border-gray-700 hover:border-[#FF3B30] transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-[#F0F0F0] mb-2">
                          {medicine.medicineName}
                        </h3>
                        <p className="text-gray-400">
                          Tratamiento: {formatDate(medicine.startDate)} - {formatDate(medicine.endDate)}
                        </p>
                        <div className="mt-4">
                          <p className="text-[#F0F0F0] mb-2">Horarios:</p>
                          <div className="flex flex-wrap gap-2">
                            {medicine.times.map((time, index) => (
                              <span
                                key={index}
                                className="bg-gray-700 px-3 py-1 rounded-full text-sm text-[#F0F0F0]"
                              >
                                {time}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Dosis de hoy */}
                        <div className="mt-4">
                          <p className="text-[#F0F0F0] mb-2">Dosis de hoy:</p>
                          <div className="flex flex-wrap gap-4">
                            {todayDoses.map((dose, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                {dose.status === 'taken' ? (
                                  <Check className="text-green-500" size={20} />
                                ) : (
                                  <button
                                    onClick={() => markDoseAsTaken(medicine.id, medicine.doses.indexOf(dose))}
                                    className="flex items-center gap-2 px-3 py-1 bg-[#FF3B30] text-white rounded-full hover:bg-opacity-80 transition-colors"
                                  >
                                    <Clock size={16} />
                                    <span>{dose.scheduledFor.toDate().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Progreso del tratamiento */}
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>Progreso del tratamiento</span>
                            <span>{status.takenDoses} de {status.totalDoses} dosis</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-[#FF3B30] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${status.compliance}%` }}
                            />
                          </div>
                        </div>

                        {medicine.notes && (
                          <div className="mt-4 text-gray-400">
                            <p className="font-bold text-[#F0F0F0]">Notas:</p>
                            <p>{medicine.notes}</p>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => handleDelete(medicine.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-500/10"
                        title="Eliminar medicamento"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {medicines.length === 0 && !showForm && (
            <div className="text-center text-gray-400 py-8">
              <AlertCircle size={48} className="mx-auto mb-4 text-[#FF3B30]" />
              <p className="text-lg">No tienes medicamentos registrados</p>
              <p className="mt-2">Comienza agregando tu primer medicamento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drugs;