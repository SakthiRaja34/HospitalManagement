import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.94))', borderTop: '1px solid rgba(226, 232, 240, 0.84)', padding: '4rem 0 2rem 0', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)' }}>
      <div className="container">
        <div className="grid-cols-3" style={{ marginBottom: '3rem' }}>
          
          <div>
            <div className="flex-center" style={{ gap: '12px', justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ padding: '10px', background: 'linear-gradient(180deg, #FFFFFF, #EFF6FF)', borderRadius: '14px', boxShadow: '0 8px 18px rgba(37, 99, 235, 0.08)' }}>
                <Activity color="var(--primary-color)" size={24} />
              </div>
              <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                MediCare HOS
              </span>
            </div>
            <p style={{ maxWidth: '340px' }}>Providing world-class healthcare solutions with cutting edge technology and compassionate care.</p>
          </div>

          <div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-dark)' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><Link to="/" className="nav-link" style={{ padding: 0, background: 'transparent' }}>Home</Link></li>
              <li><Link to="/services" className="nav-link" style={{ padding: 0, background: 'transparent' }}>Our Services</Link></li>
              <li><Link to="/doctors" className="nav-link" style={{ padding: 0, background: 'transparent' }}>Find a Doctor</Link></li>
              <li><Link to="/patient-login" className="nav-link" style={{ padding: 0, background: 'transparent' }}>Patient Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-dark)' }}>Contact Us</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '10px', color: 'var(--text-muted)' }}>
                <MapPin size={20} color="var(--primary-color)" /> 123 Health Avenue, Medical District
              </li>
              <li style={{ display: 'flex', gap: '10px', color: 'var(--text-muted)' }}>
                <Phone size={20} color="var(--primary-color)" /> +1 (555) 123-4567
              </li>
              <li style={{ display: 'flex', gap: '10px', color: 'var(--text-muted)' }}>
                <Mail size={20} color="var(--primary-color)" /> contact@medicarehos.com
              </li>
            </ul>
          </div>
          
        </div>
        
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>&copy; {new Date().getFullYear()} MediCare Hospital System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
