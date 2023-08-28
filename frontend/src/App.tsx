import LandingPage from './components/LandingPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameComponent from './components/GameComponent';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<LandingPage />}
        />
        <Route
          path='/game/:gameKey'
          element={<GameComponent />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
