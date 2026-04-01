import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ClipboardPlus, Stethoscope } from 'lucide-react';
import useResponsive from '../hooks/useResponsive';
import surgeryImg from '../assets/surgery.png';
import doctorsImg from '../assets/doctors.png';
import { specializationDepartmentMap, specializationOptions } from '../data/doctorOptions';

export default function DoctorRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [department, setDepartment] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isMobile = useResponsive(980);
  const isCompact = useResponsive(1366);
  const authShellWidth = isCompact ? '960px' : '1060px';
  const authHeroHeight = isMobile ? '320px' : isCompact ? '520px' : '590px';
  const authPanelPadding = isMobile ? '1.35rem' : isCompact ? '1.45rem' : '1.8rem';

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost/Hospital/backend/api/auth.php?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'doctor',
          specialization,
          department,
          bio,
        })
      });
      const data = await res.json();

      if (data.success) {
        navigate('/doctor-login', {
          state: {
            registrationMessage: 'Doctor account created. Please wait for admin approval before logging in.'
          }
        });
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div
      className="flex-center"
      style={{
        minHeight: '100vh',
        padding: isMobile ? '1rem' : '0.85rem 1.25rem',
        background:
          'radial-gradient(circle at top left, rgba(13, 148, 136, 0.12), transparent 28%), radial-gradient(circle at bottom right, rgba(8, 145, 178, 0.10), transparent 28%), linear-gradient(135deg, #ECFDFC 0%, #F8FBFF 46%, #EEF7FF 100%)',
      }}
    >
      <div
        className="clean-card fade-in"
        style={{
          width: '100%',
          maxWidth: authShellWidth,
          padding: '0.8rem',
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
              backgroundImage: `url(${surgeryImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(150deg, rgba(8,47,73,0.78), rgba(13,148,136,0.36))',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: authPanelPadding }}>
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.48rem 0.85rem',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.14)',
                    color: 'white',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontSize: '0.72rem',
                    marginBottom: '1rem',
                  }}
                >
                  <Stethoscope size={16} />
                  Doctor registration
                </div>
                <h1 style={{ color: 'white', fontSize: isCompact ? 'clamp(1.6rem, 2.9vw, 2.7rem)' : 'clamp(1.85rem, 4vw, 3.4rem)', maxWidth: '520px', marginBottom: '0.65rem', lineHeight: '1.02' }}>
                  Everything your care profile needs before the next round.
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.84)', maxWidth: '470px', fontSize: isCompact ? '0.86rem' : '0.94rem' }}>
                  Create your doctor account, submit your specialty details, and move into admin approval before first login.
                </p>
              </div>

              <div style={{ display: 'grid', gap: '0.6rem', maxWidth: '410px' }}>
                {[
                  'Submit specialization and department details',
                  'Wait for admin verification and approval',
                  'Start managing consultations from the doctor dashboard',
                ].map((item, index) => (
                  <div
                    key={item}
                    className="slide-fade-in"
                    style={{
                      animationDelay: `${0.15 + index * 0.1}s`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      padding: '0.68rem 0.85rem',
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'white',
                    }}
                  >
                    <CheckCircle2 size={18} color="#A7F3D0" />
                    <span style={{ fontWeight: 500, fontSize: '0.88rem' }}>{item}</span>
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
            <div className="flex-center" style={{ marginBottom: '1rem', gap: '10px', justifyContent: 'flex-start' }}>
              <div style={{ width: '50px', height: '50px', background: 'rgba(20, 184, 166, 0.10)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClipboardPlus color="var(--secondary-color)" size={26} />
              </div>
              <div>
                <p style={{ marginBottom: '0.2rem', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)' }}>
                  Clinical onboarding
                </p>
                <h2 style={{ margin: 0, color: 'var(--secondary-color)', fontSize: '1.7rem' }}>Doctor Application</h2>
              </div>
            </div>

            <h3 style={{ marginBottom: '0.35rem', color: 'var(--text-dark)', fontSize: isCompact ? '1.4rem' : '1.7rem', lineHeight: 1.08 }}>Create Your Doctor Account</h3>
            <p style={{ marginBottom: '0.9rem', color: 'var(--text-muted)', fontSize: isCompact ? '12.5px' : '13.5px' }}>
              This page is for doctors only. Your registration will stay pending until an admin reviews and approves your account.
            </p>

            {error && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px 14px', borderRadius: '12px', marginBottom: '1rem', textAlign: 'center', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Doctor Name</label>
                <input type="text" className="input-glass" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Email Address</label>
                <input type="email" className="input-glass" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Specialization</label>
                  <select
                    className="input-glass"
                    value={specialization}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setSpecialization(selected);
                      setDepartment(specializationDepartmentMap[selected] || '');
                    }}
                    required
                  >
                    <option value="">Choose specialization</option>
                    {specializationOptions.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Department</label>
                  <input
                    type="text"
                    className="input-glass"
                    value={department}
                    readOnly
                    placeholder="Department will be selected automatically"
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Password</label>
                <input type="password" className="input-glass" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Professional Bio</label>
                <textarea className="input-glass" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Add a short doctor profile for the hospital directory." />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.4rem', width: '100%', padding: '13px 24px', background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)' }}>
                Submit for Approval <ArrowRight size={18} />
              </button>
            </form>

            <div
              style={{
                marginTop: '0.9rem',
                borderRadius: '22px',
                overflow: 'hidden',
                position: 'relative',
                minHeight: isMobile ? '84px' : isCompact ? '84px' : '96px',
                backgroundImage: `url(${doctorsImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(8,47,73,0.7), rgba(8,47,73,0.22))' }} />
              <div style={{ position: 'relative', zIndex: 1, padding: '0.8rem 0.95rem' }}>
                <h4 style={{ color: 'white', marginBottom: '0.2rem', fontSize: '0.92rem' }}>Admin approval comes next</h4>
                <p style={{ color: 'rgba(255,255,255,0.84)', fontSize: '12.5px', maxWidth: '260px' }}>
                  The admin can review and approve your account before first doctor login.
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '13px', color: 'var(--text-muted)' }}>
              <p>
                Already approved? <Link to="/doctor-login" style={{ color: 'var(--secondary-color)', textDecoration: 'none', fontWeight: 600 }}>Open doctor login</Link>
              </p>
              <p style={{ marginTop: '0.55rem' }}>
                Registering as a patient? <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>Open patient registration</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
