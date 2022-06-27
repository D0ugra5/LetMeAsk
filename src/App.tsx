import { Routes, BrowserRouter, Route } from 'react-router-dom'

import { Home } from "./pages/Home";
import { NewRoom } from './pages/NewRoom';
import { Room } from './pages/Room';

import { AuthContentProvider } from "./hooks/AuthContext";
import { firebaseCommands } from './service/firebase';
function App() {
  firebaseCommands.firebaseInit();
  return (
    <BrowserRouter>
      <AuthContentProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/new" element={<NewRoom />} />
          <Route path="/rooms/:id"  element={<Room />} />

        </Routes>

      </AuthContentProvider>
    </BrowserRouter>
  );
}

export default App;
