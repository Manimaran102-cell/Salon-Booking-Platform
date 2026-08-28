import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SalonSettings from './pages/SalonSettings';
import ManageServices from './pages/ManageServices';
import ManageStaff from './pages/ManageStaff';
import ManageAppointments from './pages/ManageAppointments';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user && ['salon_owner', 'staff'].includes(user.role) ? children : <Navigate to="/login" />;
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
                  <Route path="/salon-settings" element={<SalonSettings />} />
                  <Route path="/services" element={<ManageServices />} />
                  <Route path="/staff" element={<ManageStaff />} />
                  <Route path="/appointments" element={<ManageAppointments />} />
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
