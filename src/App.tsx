import { Home } from "./pages/Home";
import { NewRoom } from './pages/NewRoom';
import { Routes, BrowserRouter, Route } from 'react-router-dom'
import { AuthContentProvider } from "./hooks/AuthContext";
function App() {
  return (
    <BrowserRouter>
      <AuthContentProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/new" element={<NewRoom />} />
        </Routes>

      </AuthContentProvider>
    </BrowserRouter>
  );
}

export default App;
