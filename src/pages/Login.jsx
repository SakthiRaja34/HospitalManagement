import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, ArrowRight, ShieldCheck, Stethoscope, UserRound, CheckCircle2 } from 'lucide-react';
import useResponsive from '../hooks/useResponsive';
import hospitalHero from '../assets/hospital_hero.png';
import surgeryImg from '../assets/surgery.png';
import patientCareImg from '../assets/patient_care.png';

const portalConfig = {
  patient: {
    title: 'Patient Login',
    subtitle: 'Access appointments, OP registration, and patient services.',
    icon: UserRound,
    color: 'var(--primary-color)',
    redirect: '/patient',
    image: patientCareImg,
    eyebrow: 'Patient access',
    headline: 'A calmer way to manage visits and records.',
    points: ['Book consultations quickly', 'Complete OP details online', 'Track appointments in one place'],
  },
  doctor: {
    title: 'Doctor Login',
    subtitle: 'Access schedules, patient records, and doctor workflow tools.',
    icon: Stethoscope,
    color: 'var(--secondary-color)',
    redirect: '/doctor',
    image: surgeryImg,
    eyebrow: 'Clinical portal',
    headline: 'Everything your care team needs before the next round.',
    points: ['Review scheduled consultations', 'Open patient summaries fast', 'Manage doctor workflow smoothly'],
  },
  admin: {
    title: 'Admin Login',
    subtitle: 'Manage approvals, hospital operations, and platform oversight.',
    icon: ShieldCheck,
    color: 'var(--warning)',
    redirect: '/admin',
    image: hospitalHero,
    eyebrow: 'Operations center',
    headline: 'Control approvals, users, and hospital activity with clarity.',
    points: ['Approve doctors efficiently', 'Monitor hospital activity', 'Keep operations coordinated'],
  },
};

export default function Login({ portalType = '' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const config = portalType ? portalConfig[portalType] : null;
  const isMobile = useResponsive(980);
  const isCompact = useResponsive(1366);
  const registrationMessage = location.state?.registrationMessage || '';
  const bookingSearch = location.search || '';
  const authShellWidth = isCompact ? '960px' : '1060px';
  const authHeroHeight = isMobile ? '340px' : isCompact ? '610px' : '660px';
  const authPanelPadding = isMobile ? '1.5rem' : isCompact ? '1.8rem' : '2.1rem';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost/Hospital/backend/api/auth.php?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          expected_role: portalType || undefined,
        })
      });
      const data = await res.json();
      if (data.success) {
        login(data.user);
        const targetPath =
          data.user.role === 'patient' && bookingSearch
            ? `/patient${bookingSearch}`
            : config?.redirect || (data.user.role === 'patient' ? '/patient' : data.user.role === 'doctor' ? '/doctor' : '/admin');

        navigate(targetPath);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error or server unavailable');
    }
  };

  if (!config) {
    return (
      <div
        className="flex-center"
        style={{
          minHeight: '100vh',
          padding: '2rem',
          background:
            'radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 30%), linear-gradient(180deg, #F8FBFF 0%, #EEF5FF 100%)',
        }}
      >
        <div
          className="clean-card fade-in"
          style={{
            padding: isCompact ? '2rem' : '2.5rem',
            width: '100%',
            maxWidth: isCompact ? '930px' : '1020px',
            borderRadius: '32px',
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(14px)',
            boxShadow: '0 30px 60px rgba(15, 23, 42, 0.10)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="flex-center" style={{ marginBottom: '1rem', gap: '10px' }}>
              <div style={{ padding: '8px', background: 'var(--bg-light)', borderRadius: '12px' }}>
                <Activity color="var(--primary-color)" size={32} />
              </div>
              <h2 className="text-gradient">MediCare HOS</h2>
            </div>
            <h3 style={{ marginBottom: '0.8rem', color: 'var(--text-dark)', fontSize: '2rem' }}>Choose Your Login Portal</h3>
            <p style={{ maxWidth: '620px', margin: '0 auto', color: 'var(--text-muted)' }}>
              Select the correct portal below. Each login page is now separate for patients, doctors, and administrators.
            </p>
          </div>

          <div className="grid-cols-3">
            {Object.entries(portalConfig).map(([key, item]) => {
              const Icon = item.icon;
              return (
                <Link
                  key={key}
                  to={`/${key}-login`}
                  className="clean-card card-hover"
                  style={{
                    padding: '1rem',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.92)',
                  }}
                >
                  <div style={{ height: '190px', borderRadius: '18px', overflow: 'hidden', marginBottom: '1rem', position: 'relative' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.1), rgba(15,23,42,0.55))' }} />
                    <div style={{ position: 'absolute', left: '1rem', bottom: '1rem', width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255,255,255,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={26} color={item.color} />
                    </div>
                  </div>
                  <div style={{ padding: '0.5rem 0.5rem 0.75rem' }}>
                    <h4 style={{ fontSize: '1.4rem', marginBottom: '0.7rem' }}>{item.title}</h4>
                    <p style={{ marginBottom: '1rem', minHeight: '52px' }}>{item.subtitle}</p>
                  </div>
                  <span style={{ color: 'var(--primary-color)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0 0.5rem 0.5rem' }}>
                    Open portal <ArrowRight size={16} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const PortalIcon = config.icon;

  return (
    <div
      className="flex-center"
      style={{
        minHeight: '100vh',
        padding: '2rem',
        background:
          'radial-gradient(circle at top left, rgba(37, 99, 235, 0.10), transparent 24%), linear-gradient(135deg, #EAF2FF 0%, #F8FBFF 45%, #EDF7F6 100%)',
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
          background: 'rgba(255,255,255,0.74)',
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
              backgroundImage: `url(${config.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  portalType === 'doctor'
                    ? 'linear-gradient(150deg, rgba(8,47,73,0.72), rgba(13,148,136,0.42))'
                    : portalType === 'admin'
                      ? 'linear-gradient(150deg, rgba(15,23,42,0.78), rgba(217,119,6,0.28))'
                      : 'linear-gradient(150deg, rgba(15,23,42,0.72), rgba(37,99,235,0.30))',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: authPanelPadding }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.9rem', borderRadius: '999px', background: 'rgba(255,255,255,0.14)', color: 'white', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.78rem', marginBottom: '1.5rem' }}>
                  <PortalIcon size={16} />
                  {config.eyebrow}
                </div>
                <h1 style={{ color: 'white', fontSize: isCompact ? 'clamp(1.85rem, 3.3vw, 3.25rem)' : 'clamp(2rem, 4.8vw, 4rem)', maxWidth: '560px', marginBottom: '0.9rem', lineHeight: '1.03' }}>
                  {config.headline}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.84)', maxWidth: '500px', fontSize: isCompact ? '0.94rem' : '1rem' }}>
                  MediCare HOS combines digital access, organized workflows, and clinical support so each portal feels clear and efficient from the moment you sign in.
                </p>
              </div>

              <div style={{ display: 'grid', gap: '0.8rem', maxWidth: '430px' }}>
                {config.points.map((point) => (
                  <div
                    key={point}
                    style={{
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
                    <span style={{ fontWeight: 500 }}>{point}</span>
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
            <div className="flex-center" style={{ marginBottom: '1.7rem', gap: '10px', justifyContent: 'flex-start' }}>
              <div style={{ width: '56px', height: '56px', background: 'var(--bg-light)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PortalIcon color={config.color} size={30} />
              </div>
              <div>
                <p style={{ marginBottom: '0.2rem', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)' }}>
                  Secure access
                </p>
                <h2 className="text-gradient">{config.title}</h2>
              </div>
            </div>

            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-dark)', fontSize: isCompact ? '1.6rem' : '1.9rem' }}>Welcome Back</h3>
            <p style={{ marginBottom: '1.25rem', color: 'var(--text-muted)', fontSize: isCompact ? '13.5px' : '14.5px' }}>{config.subtitle}</p>

            {registrationMessage && (
              <div style={{ backgroundColor: 'rgba(20, 184, 166, 0.12)', color: '#0F766E', padding: '12px 14px', borderRadius: '12px', marginBottom: '1rem', textAlign: 'center', fontWeight: 600 }}>
                {registrationMessage}
              </div>
            )}

            {error && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px 14px', borderRadius: '12px', marginBottom: '1rem', textAlign: 'center', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '7px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>Email Address</label>
                <input
                  type="email"
                  className="input-glass"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '7px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>Password</label>
                <input
                  type="password"
                  className="input-glass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {portalType === 'patient' && (
                <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                  <Link to="/forgot-password" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '14px' }}>Forgot Password?</Link>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.75rem', width: '100%', padding: '14px 28px' }}>
                Sign In
              </button>
            </form>

            <div style={{ marginTop: '1.45rem', padding: '0.95rem 1rem', borderRadius: '18px', background: 'var(--bg-alt)', border: '1px solid var(--border-light)' }}>
              <p style={{ fontSize: '13px', margin: 0 }}>
                {portalType === 'patient'
                  ? 'New patients can create an account first and then continue with OP registration.'
                  : 'Use only the dedicated portal assigned for this account type.'}
              </p>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '14px', color: 'var(--text-muted)' }}>
              {portalType === 'patient' ? (
                <p>
                  Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500' }}>Register here</Link>
                </p>
              ) : portalType === 'doctor' ? (
                <p>
                  New doctor? <Link to="/doctor-register" style={{ color: 'var(--secondary-color)', textDecoration: 'none', fontWeight: '500' }}>Register here</Link>
                </p>
              ) : (
                <p>
                  Need a different portal? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500' }}>Choose login type</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
