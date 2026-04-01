import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const bookingPath = user?.role === 'patient' ? '/patient?book=1' : !user ? '/patient-login' : `/${user.role}`;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-nav">
      <div className="container flex-between" style={{ padding: '0.9rem 2rem' }}>
        
        {/* Brand */}
        <Link to="/" className="flex-center" style={{ gap: '12px', textDecoration: 'none' }}>
          <div style={{ padding: '10px', background: 'linear-gradient(180deg, #FFFFFF, #EFF6FF)', borderRadius: '14px', boxShadow: '0 8px 18px rgba(37, 99, 235, 0.08)' }}>
            <Activity color="var(--primary-color)" size={28} />
          </div>
          <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: '800' }}>
            MediCare
          </span>
        </Link>
        
        {/* Links */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.3rem', borderRadius: '999px', background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(226, 232, 240, 0.78)' }}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/doctors" className="nav-link">Doctors</Link>
          <Link to="/about" className="nav-link">About Us</Link>
        </div>

        {/* CTA Elements */}
        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
          {!user ? (
            <>
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to={bookingPath} className="btn btn-primary">Book Appointment</Link>
            </>
          ) : (
            <>
              <Link to={`/${user.role}`} className="btn btn-outline" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)' }}>
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>
        
      </div>
    </nav>
  );
}
