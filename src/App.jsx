import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import GoogleLogin from './components/auth/GoogleLogin';
import Home from './pages/Home';
import Navbar from './components/Navbar';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Usuario está autenticado
        setUser(currentUser);
        localStorage.setItem('user', JSON.stringify(currentUser));
      } else {
        // Usuario no está autenticado
        setUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    // Verificar localStorage al inicio
    const storedUser = localStorage.getItem('user');
    if (storedUser && !user) {
      setUser(JSON.parse(storedUser));
    }

    // Limpiar suscripción al desmontar
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#202123] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF3B30]"></div>
      </div>
    );
  }

  if (!user) {
    return <GoogleLogin setUser={setUser} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#202123]">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/peso" element={<div>Calculadora de Peso (Próximamente)</div>} />
          <Route path="/calorias" element={<div>Requerimientos Calóricos (Próximamente)</div>} />
          <Route path="/cronometro" element={<div>Cronómetro (Próximamente)</div>} />
          <Route path="/suplementos" element={<div>Registro de Suplementos (Próximamente)</div>} />
          <Route path="/medicamentos" element={<div>Registro de Medicamentos (Próximamente)</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;