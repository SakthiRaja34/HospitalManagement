import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, ArrowRight, CheckCircle2, UserPlus } from 'lucide-react';
import useResponsive from '../hooks/useResponsive';
import doctorsImg from '../assets/doctors.png';
import hospitalHero from '../assets/hospital_hero.png';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const isMobile = useResponsive(980);
  const isCompact = useResponsive(1366);
  const authShellWidth = isCompact ? '960px' : '1060px';
  const authHeroHeight = isMobile ? '340px' : isCompact ? '610px' : '660px';
  const authPanelPadding = isMobile ? '1.5rem' : isCompact ? '1.8rem' : '2.1rem';

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost/Hospital/backend/api/auth.php?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role: 'patient',
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.pending) {
          navigate('/login');
          return;
        }

        login(data.user);
        navigate(data.user.role === 'patient' ? '/patient' : '/');
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError('Registration failed');
    }
  };

  return (
    <div
      className="flex-center"
      style={{
        minHeight: '100vh',
        padding: '2rem',
        background:
          'radial-gradient(circle at top right, rgba(13, 148, 136, 0.12), transparent 28%), radial-gradient(circle at bottom left, rgba(37, 99, 235, 0.10), transparent 26%), linear-gradient(135deg, #ECF4FF 0%, #F8FBFF 40%, #EDF8F5 100%)',
      }}
    >
      <div
        className="clean-card fade-in"
        style={{
          width: '100%',
          maxWidth: authShellWidth,
          padding: '1rem',
          borderRadius: '34px',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.76)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 28px 70px rgba(15, 23, 42, 0.14)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) minmax(350px, 0.76fr)',
            gap: '1rem',
            alignItems: 'stretch',
          }}
        >
          <div
            style={{
              position: 'relative',
              minHeight: authHeroHeight,
              borderRadius: '28px',
              overflow: 'hidden',
              backgroundImage: `url(${hospitalHero})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(145deg, rgba(15,23,42,0.72), rgba(13,148,136,0.34))',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: authPanelPadding }}>
              <div className="float-soft">
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.55rem 0.95rem',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.14)',
                    color: 'white',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontSize: '0.78rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <UserPlus size={16} />
                  Patient Registration
                </div>
                <h1 style={{ color: 'white', fontSize: isCompact ? 'clamp(1.85rem, 3.3vw, 3.25rem)' : 'clamp(2rem, 4.8vw, 4rem)', maxWidth: '560px', marginBottom: '0.9rem', lineHeight: '1.03' }}>
                  A simpler way to begin your care journey.
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.84)', maxWidth: '500px', fontSize: isCompact ? '0.94rem' : '1rem' }}>
                  Register once and manage appointments, OP details, and care communication through a clean digital patient workflow.
                </p>
              </div>

              <div style={{ display: 'grid', gap: '0.8rem' }}>
                {[
                  'Create your patient account in minutes',
                  'Complete OP registration after first login',
                  'Book specialist consultations online',
                ].map((item, index) => (
                  <div
                    key={item}
                    className="slide-fade-in"
                    style={{
                      animationDelay: `${0.15 + index * 0.1}s`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      padding: '0.82rem 0.95rem',
                      borderRadius: '18px',
                      background: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'white',
                    }}
                  >
                    <CheckCircle2 size={18} color="#BFDBFE" />
                    <span style={{ fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: authPanelPadding,
              borderRadius: '28px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.96))',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div className="flex-center" style={{ marginBottom: '1.6rem', gap: '10px', justifyContent: 'flex-start' }}>
              <div style={{ width: '56px', height: '56px', background: 'var(--bg-light)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity color="var(--primary-color)" size={30} />
              </div>
              <div>
                <p style={{ marginBottom: '0.2rem', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)' }}>
                  New account
                </p>
                <h2 className="text-gradient">Join MediCare</h2>
              </div>
            </div>

            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-dark)', fontSize: isCompact ? '1.6rem' : '1.9rem' }}>Create Your Patient Account</h3>
            <p style={{ marginBottom: '1.25rem', color: 'var(--text-muted)', fontSize: isCompact ? '13.5px' : '14.5px' }}>
              Register here to access your patient dashboard, complete OP details, and book appointments with hospital specialists.
            </p>

            <div style={{ marginBottom: '0.9rem', padding: '0.85rem 0.95rem', borderRadius: '18px', background: 'var(--bg-alt)', border: '1px solid var(--border-light)' }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
                This page is only for patients. Doctors should use{' '}
                <Link to="/doctor-register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 700 }}>
                  Doctor Registration
                </Link>
                .
              </p>
            </div>

            {error && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px 14px', borderRadius: '12px', marginBottom: '1rem', textAlign: 'center', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Full Name</label>
                <input type="text" className="input-glass" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Email Address</label>
                <input type="email" className="input-glass" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Password</label>
                <input type="password" className="input-glass" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.55rem', width: '100%', padding: '14px 28px' }}>
                Create Account <ArrowRight size={18} />
              </button>
            </form>

            <div
              style={{
                marginTop: '1.25rem',
                borderRadius: '22px',
                overflow: 'hidden',
                position: 'relative',
                minHeight: isMobile ? '108px' : isCompact ? '104px' : '116px',
                backgroundImage: `url(${doctorsImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,23,42,0.68), rgba(15,23,42,0.2))' }} />
              <div style={{ position: 'relative', zIndex: 1, padding: '0.95rem 1rem' }}>
                <h4 style={{ color: 'white', marginBottom: '0.3rem', fontSize: '0.98rem' }}>Patient portal access comes next</h4>
                <p style={{ color: 'rgba(255,255,255,0.84)', fontSize: '13px', maxWidth: '270px' }}>
                  Register now and continue to OP details after login.
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '13.5px', color: 'var(--text-muted)' }}>
              <p>
                Already have an account? <Link to="/patient-login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600' }}>Open patient login</Link>
              </p>
              <p style={{ marginTop: '0.55rem' }}>
                Joining as a doctor? <Link to="/doctor-register" style={{ color: 'var(--secondary-color)', textDecoration: 'none', fontWeight: '600' }}>Create doctor account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
