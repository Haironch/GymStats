import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleLogin from './components/auth/GoogleLogin';
import Home from './pages/Home';
import Navbar from './components/Navbar';

const App = () => {
  const [user, setUser] = useState(null);

  if (!user) {
    return <GoogleLogin setUser={setUser} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#202123]">
        <Navbar user={user} />
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