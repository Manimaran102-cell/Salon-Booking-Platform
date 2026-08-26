import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Salons from './pages/Salons';
import SalonDetail from './pages/SalonDetail';
import BookAppointment from './pages/BookAppointment';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/salons" element={<Salons />} />
              <Route path="/salons/:id" element={<SalonDetail />} />
              <Route path="/book/:salonId" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
              <Route path="/my-bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}
