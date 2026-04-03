import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorRegister from './pages/DoctorRegister';
import ForgotPassword from './pages/ForgotPassword';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DoctorsList from './pages/DoctorsList';
import Services from './pages/Services';
import About from './pages/About';
import './index.css';

const routeTitles = [
  { match: (path) => path === '/', title: 'MediCare HOS | Home' },
  { match: (path) => path === '/login', title: 'MediCare HOS | Login Portal' },
  { match: (path) => path === '/patient-login', title: 'MediCare HOS | Patient Login' },
  { match: (path) => path === '/doctor-login', title: 'MediCare HOS | Doctor Login' },
  { match: (path) => path === '/admin-login', title: 'MediCare HOS | Admin Login' },
  { match: (path) => path === '/register', title: 'MediCare HOS | Patient Register' },
  { match: (path) => path === '/doctor-register', title: 'MediCare HOS | Doctor Register' },
  { match: (path) => path === '/forgot-password', title: 'MediCare HOS | Forgot Password' },
  { match: (path) => path === '/doctors', title: 'MediCare HOS | Doctors' },
  { match: (path) => path === '/services', title: 'MediCare HOS | Services' },
  { match: (path) => path === '/about', title: 'MediCare HOS | About' },
  { match: (path) => path.startsWith('/patient'), title: 'MediCare HOS | Patient Dashboard' },
  { match: (path) => path.startsWith('/doctor'), title: 'MediCare HOS | Doctor Dashboard' },
  { match: (path) => path.startsWith('/admin'), title: 'MediCare HOS | Admin Dashboard' },
];

const RouteMeta = () => {
  const location = useLocation();

  useEffect(() => {
    const current = routeTitles.find((item) => item.match(location.pathname));
    document.title = current?.title || 'MediCare HOS';
  }, [location.pathname]);

  return null;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const loginPathByRole = {
    patient: '/patient-login',
    doctor: '/doctor-login',
    admin: '/admin-login',
  };
  
  if (loading) return <div>Loading...</div>;
  if (!user) {
    const fallbackPath = allowedRoles?.length ? loginPathByRole[allowedRoles[0]] : '/login';
    return <Navigate to={fallbackPath || '/login'} replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return children;
};

// Remove HomeRedirect, as the root will now be the Home landing page.

function App() {
  return (
    <Router>
      <RouteMeta />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient-login" element={<Login portalType="patient" />} />
        <Route path="/doctor-login" element={<Login portalType="doctor" />} />
        <Route path="/admin-login" element={<Login portalType="admin" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctor-register" element={<DoctorRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/doctors" element={<DoctorsList />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />

        {/* Protected Routes */}
        <Route 
          path="/patient/*" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/doctor/*" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
