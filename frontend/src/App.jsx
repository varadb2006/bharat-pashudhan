// import Header from './components/Header';
import Identify from './pages/Identify';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/identify" element={<Identify />} />
    </Routes>
  );
}

export default App
