import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { HeartPulse, Microscope, Brain, Activity, Droplets, Bone, ArrowRight, ShieldCheck, Clock3, Building2 } from 'lucide-react';
import useResponsive from '../hooks/useResponsive';

const services = [
  {
    icon: HeartPulse,
    title: 'Cardiology',
    desc: 'Comprehensive cardiovascular care with imaging, interventional procedures, and post-operative monitoring.',
    tone: 'rgba(239, 68, 68, 0.12)',
    accent: '#DC2626',
  },
  {
    icon: Brain,
    title: 'Neurology',
    desc: 'Stroke care, neuro-diagnostics, and advanced treatment planning for complex nervous system disorders.',
    tone: 'rgba(37, 99, 235, 0.12)',
    accent: '#2563EB',
  },
  {
    icon: Microscope,
    title: 'Advanced Laboratory',
    desc: 'Round-the-clock diagnostics with rapid pathology support and precise reporting for critical cases.',
    tone: 'rgba(13, 148, 136, 0.12)',
    accent: '#0D9488',
  },
  {
    icon: Bone,
    title: 'Orthopedics',
    desc: 'Joint care, trauma recovery, sports injury management, and rehabilitation guided by specialists.',
    tone: 'rgba(245, 158, 11, 0.16)',
    accent: '#D97706',
  },
  {
    icon: Droplets,
    title: 'Pediatrics & Maternity',
    desc: 'Family-centered maternal care, neonatal support, and child wellness programs in a protected environment.',
    tone: 'rgba(236, 72, 153, 0.14)',
    accent: '#DB2777',
  },
  {
    icon: Activity,
    title: 'Emergency Trauma',
    desc: 'Urgent response pathways, critical stabilization, and immediate specialist coordination 24 hours a day.',
    tone: 'rgba(15, 23, 42, 0.08)',
    accent: '#0F172A',
  },
];

export default function Services() {
  const isMobile = useResponsive(980);

  return (
    <>
      <Navbar />
      <div
        style={{
          background:
            'radial-gradient(circle at top left, rgba(37, 99, 235, 0.10), transparent 30%), linear-gradient(180deg, #F8FBFF 0%, #EEF5FF 45%, #F8FAFC 100%)',
          minHeight: 'calc(100vh - 80px)',
          padding: '3.5rem 0 5rem',
        }}
      >
        <div className="container">
          <section
            className="fade-in"
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.45fr) minmax(320px, 0.85fr)',
              gap: '2rem',
              alignItems: 'stretch',
              marginBottom: '3rem',
            }}
          >
            <div
              className="clean-card"
              style={{
                padding: '3rem',
                borderRadius: '32px',
                background:
                  'linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.88))',
                boxShadow: '0 30px 60px rgba(15, 23, 42, 0.08)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '999px',
                  background: 'rgba(37, 99, 235, 0.08)',
                  color: 'var(--primary-color)',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  fontSize: '0.78rem',
                  marginBottom: '1.25rem',
                }}
              >
                <Building2 size={16} />
                Hospital Services
              </div>
              <h1 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.6rem)', marginBottom: '1rem' }}>
                Care that feels
                <span className="text-gradient"> organized, modern, and trusted</span>
              </h1>
              <p style={{ maxWidth: '760px', fontSize: '1.1rem', marginBottom: '2rem' }}>
                Explore the major specialties, diagnostics, and rapid-response facilities available at MediCare. The entire experience is designed to reduce delays and connect patients with the right team faster.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                  gap: '1rem',
                }}
              >
                {[
                  { icon: ShieldCheck, label: 'Certified care teams', value: '98%' },
                  { icon: Clock3, label: 'Emergency readiness', value: '24/7' },
                  { icon: Activity, label: 'Specialty units', value: '12+' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      style={{
                        padding: '1.1rem 1.2rem',
                        borderRadius: '20px',
                        background: 'linear-gradient(180deg, #FFFFFF, #F5F9FF)',
                        border: '1px solid rgba(148, 163, 184, 0.18)',
                      }}
                    >
                      <Icon size={20} color="var(--primary-color)" style={{ marginBottom: '0.8rem' }} />
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)' }}>{item.value}</div>
                      <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>{item.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className="clean-card"
              style={{
                padding: '2rem',
                borderRadius: '32px',
                background: 'linear-gradient(160deg, #0F172A 0%, #1E3A8A 100%)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 30px 60px rgba(30, 58, 138, 0.24)',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    padding: '0.45rem 0.8rem',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.14)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    marginBottom: '1rem',
                  }}
                >
                  Patient First
                </div>
                <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.85rem' }}>
                  Faster access to the right department
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.82)', marginBottom: '1.5rem' }}>
                  From diagnostics to recovery planning, each service is connected through one hospital workflow so consultations, tests, and treatment stay coordinated.
                </p>
              </div>
              <div style={{ display: 'grid', gap: '0.85rem' }}>
                {['Priority triage desk', 'Integrated diagnostics support', 'Digital appointment coordination'].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      padding: '0.95rem 1rem',
                      borderRadius: '18px',
                      background: 'rgba(255,255,255,0.10)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    <ShieldCheck size={18} color="#93C5FD" />
                    <span style={{ color: 'white', fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.4rem',
              marginBottom: '3rem',
            }}
          >
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.title}
                  className="clean-card card-hover fade-in"
                  style={{
                    padding: '1.6rem',
                    borderRadius: '24px',
                    animationDelay: `${i * 0.08}s`,
                    background: 'rgba(255,255,255,0.88)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div
                    style={{
                      width: '58px',
                      height: '58px',
                      borderRadius: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.15rem',
                      background: service.tone,
                    }}
                  >
                    <Icon size={28} color={service.accent} />
                  </div>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.8rem' }}>{service.title}</h3>
                  <p style={{ marginBottom: '1.2rem', minHeight: '78px' }}>{service.desc}</p>
                  <a
                    href="/register"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: service.accent,
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Book consultation
                    <ArrowRight size={16} />
                  </a>
                </article>
              );
            })}
          </section>

          <section
            className="fade-in"
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.1fr) minmax(280px, 0.9fr)',
              gap: '1.5rem',
            }}
          >
            <div
              className="clean-card"
              style={{
                padding: '2rem 2.2rem',
                borderRadius: '28px',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F3F8FF 100%)',
              }}
            >
              <p
                style={{
                  marginBottom: '0.7rem',
                  color: 'var(--primary-color)',
                  fontSize: '0.82rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                }}
              >
                Why patients choose us
              </p>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>
                Built for shorter waits and better coordination
              </h2>
              <p style={{ maxWidth: '760px' }}>
                The service experience is designed around quick navigation, visible specialties, and smooth booking paths so patients can move from inquiry to consultation with less friction.
              </p>
            </div>

            <div
              className="clean-card"
              style={{
                padding: '2rem',
                borderRadius: '28px',
                background: 'var(--primary-color)',
                color: 'white',
                textAlign: 'left',
              }}
            >
              <h3 style={{ color: 'white', marginBottom: '0.8rem', fontSize: '1.6rem' }}>
                Need a specialized consultation?
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.86)', marginBottom: '1.4rem' }}>
                Create your account and book directly through the patient portal.
              </p>
              <a
                href="/register"
                className="btn"
                style={{ background: 'white', color: 'var(--primary-color)', width: '100%' }}
              >
                Create Account
              </a>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
