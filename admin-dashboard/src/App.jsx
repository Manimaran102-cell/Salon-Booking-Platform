import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Salons from './pages/Salons';
import Appointments from './pages/Appointments';
import Reviews from './pages/Reviews';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.role === 'admin' ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/salons" element={<Salons />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/reviews" element={<Reviews />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
        <ToastContainer position="bottom-right" />
      </Router>
    </AuthProvider>
  );
}
