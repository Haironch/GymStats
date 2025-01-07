import { useState } from 'react';
import GoogleLogin from './components/auth/GoogleLogin';
import Home from './pages/Home';

const App = () => {
  const [user, setUser] = useState(null);

  return user ? <Home user={user} /> : <GoogleLogin setUser={setUser} />;
};

export default App;