// import Header from './components/Header';
import Identify from './pages/Identify';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import BreedDetail from './pages/BreedDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/identify" element={<Identify />} />
      <Route path="/breeds/:name" element={<BreedDetail />} />
    </Routes>
  );
}

export default App
