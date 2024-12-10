// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Importar React Router
import './App.css';
import Login from './pages/Login';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';


function App() {
  const [count, setCount] = useState(0);

  return (
    <Router> {/* Este componente envuelve todo el enrutamiento */}

        {/* Rutas */}
        <Routes>
          <Route path="/login" element={<Login />} /> {/* Ruta a la página Home */}
        </Routes>
        
    </Router>
  );
}

export default App;
