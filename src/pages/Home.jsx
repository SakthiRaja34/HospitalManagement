import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { HeartPulse, Stethoscope, Microscope, Brain, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import useResponsive from '../hooks/useResponsive';

// Hero Images
import heroImg from '../assets/hospital_hero.png';
import surgeryImg from '../assets/surgery.png';
import patientCareImg from '../assets/patient_care.png';

// Service Images
import cardCardio from '../assets/service_cardio.png';
import cardNeuro from '../assets/service_neuro.png';
import cardLab from '../assets/service_lab.png';
import cardGeneral from '../assets/service_general.png';

import doctorsImg from '../assets/doctors.png';

const carouselImages = [heroImg, surgeryImg, patientCareImg];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useResponsive(980);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Navbar />
      
      {/* 100vh Full Screen Hero Section */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        
        {/* Background Rotating Images */}
        {carouselImages.map((img, idx) => (
          <div 
            key={idx}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw', 
              height: '100%',
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: currentSlide === idx ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              zIndex: -2
            }} 
          />
        ))}

        {/* Gradient Overlay for Text Readability */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to right, rgba(2, 6, 23, 0.9) 0%, rgba(2, 6, 23, 0.4) 100%)',
          zIndex: -1
        }} />

        {/* Hero Content */}
        <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '80px' }}>
          <div style={{ maxWidth: '800px' }}>
            <span className="animate-fade-in-up" style={{ display: 'inline-block', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '1.5rem', textTransform: 'uppercase', color: 'var(--primary-color)', background: 'rgba(255,255,255,0.9)', padding: '6px 16px', borderRadius: '20px', fontSize: '12px' }}>
              Welcome to Next Generation Healthcare
            </span>
            <h1 className="animate-fade-in-up animate-delay-1" style={{ fontSize: 'clamp(3.5rem, 6vw, 5.5rem)', marginBottom: '1.5rem', color: 'white', lineHeight: '1.1' }}>
              Compassionate Care,<br/>
              <span style={{ color: '#60A5FA' }}>Advanced Tech.</span>
            </h1>
            <p className="animate-fade-in-up animate-delay-2" style={{ fontSize: '1.3rem', marginBottom: '3rem', maxWidth: '600px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6' }}>
              Experience the future of medical treatment. MediCare HOS integrates expert doctors with cutting-edge facility management to prioritize your health and well-being.
            </p>
            <div className="animate-fade-in-up animate-delay-3" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary" style={{ padding: '18px 40px', fontSize: '1.15rem' }}>
                Book Appointment <ArrowRight size={20} />
              </Link>
              <Link to="/doctors" className="btn" style={{ padding: '18px 40px', fontSize: '1.15rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                Find a Doctor
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div style={{ position: 'absolute', bottom: '40px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '12px', zIndex: 10 }}>
          {carouselImages.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                width: currentSlide === idx ? '32px' : '12px', 
                height: '12px', 
                borderRadius: '12px', 
                border: 'none', 
                cursor: 'pointer',
                background: currentSlide === idx ? 'var(--primary-color)' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.4s ease'
              }}
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="section"
        style={{
          background:
            'radial-gradient(circle at top right, rgba(13, 148, 136, 0.08), transparent 24%), linear-gradient(180deg, #F8FBFF 0%, #EEF5FF 100%)',
          position: 'relative',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) minmax(0, 1.25fr)',
              gap: '2rem',
              alignItems: 'stretch',
            }}
          >
            <div
              className="clean-card fade-in"
              style={{
                padding: '2.5rem',
                borderRadius: '30px',
                background: 'linear-gradient(160deg, #0F172A 0%, #1E3A8A 100%)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '100%',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.5rem 0.9rem',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.12)',
                    marginBottom: '1.25rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  Clinical Excellence
                </div>
                <h2 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', color: 'white', marginBottom: '1rem' }}>
                  Our <span style={{ color: '#93C5FD' }}>Specialties</span>
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                  We bring advanced diagnostics, specialist-led treatment, and coordinated digital workflows together so every patient receives faster and more organized care.
                </p>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  'Fast specialist referrals',
                  'Integrated diagnostics and reports',
                  'Modern treatment spaces and recovery support',
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: '0.95rem 1rem',
                      borderRadius: '18px',
                      background: 'rgba(255,255,255,0.10)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'white',
                      fontWeight: 500,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              <Link
                to="/services"
                className="btn"
                style={{
                  marginTop: '2rem',
                  background: 'white',
                  color: 'var(--primary-color)',
                  alignSelf: 'flex-start',
                }}
              >
                Explore All Services <ArrowRight size={18} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: '1.25rem' }}>
              {[
                {
                  img: cardCardio,
                  icon: <HeartPulse color="var(--danger)" size={22} />,
                  title: 'Cardiology',
                  desc: 'Heart diagnostics, preventive care, and minimally invasive procedures.',
                },
                {
                  img: cardNeuro,
                  icon: <Brain color="var(--primary-color)" size={22} />,
                  title: 'Neurology',
                  desc: 'Advanced imaging and specialist-led care for complex neurological cases.',
                },
                {
                  img: cardLab,
                  icon: <Microscope color="var(--secondary-color)" size={22} />,
                  title: 'Laboratory',
                  desc: 'Rapid, precise testing with digitally connected reporting workflows.',
                },
                {
                  img: cardGeneral,
                  icon: <Stethoscope color="var(--success)" size={22} />,
                  title: 'General Practice',
                  desc: 'Routine checkups, early diagnosis, and long-term primary care support.',
                },
              ].map((service, i) => (
                <article
                  key={service.title}
                  className="clean-card card-hover fade-in"
                  style={{
                    padding: '1rem',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.9)',
                    animationDelay: `${i * 0.08}s`,
                  }}
                >
                  <div style={{ height: '180px', borderRadius: '18px', overflow: 'hidden', marginBottom: '1rem' }}>
                    <img src={service.img} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '0.35rem 0.2rem 0.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '14px',
                          background: 'var(--bg-alt)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {service.icon}
                      </div>
                      <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{service.title}</h3>
                    </div>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '0.9rem' }}>{service.desc}</p>
                    <Link
                      to="/services"
                      style={{
                        fontWeight: 700,
                        color: 'var(--primary-color)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      Learn more <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="section" style={{ background: 'var(--bg-white)' }}>
        <div className="container flex-between" style={{ gap: '4rem', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1 1 500px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--text-dark)' }}>Why Choose <span className="text-gradient-alt">MediCare?</span></h2>
            <p style={{ marginBottom: '2.5rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
              We're redefining hospital management. Instead of waiting in lines and dealing with chaotic paper trails, our digital-first infrastructure ensures your data is instantly available exactly when and where the doctors need it.
            </p>
            
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <li style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '50%' }}>
                  <ShieldCheck color="var(--success)" size={28} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Secure Health Records</h4>
                  <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)' }}>Your data is completely encrypted, ensuring your private medical history stays safe while remaining instantly accessible by your approved practitioners.</p>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '16px', borderRadius: '50%' }}>
                  <Clock color="var(--warning)" size={28} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>24/7 Rapid Emergency Care</h4>
                  <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)' }}>Round the clock staff ready to assist with urgent medical situations, supported by real-time notification systems to prepare surgical suites in advance.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <img 
              src={doctorsImg} 
              alt="Medical Team Collaborating" 
              style={{ 
                width: '100%', 
                borderRadius: '24px', 
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-light)'
              }} 
            />
            
            <div className="clean-card" style={{ padding: '2rem', width: '100%', background: 'var(--bg-light)', border: '1px solid var(--border-light)' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-dark)' }}>Ready to speed up your visits?</h3>
                <p style={{ color: 'var(--text-muted)' }}>Join thousands of patients saving hours on paperwork.</p>
              </div>
              <Link to="/register" className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
                Create Patient Account
              </Link>
            </div>
          </div>
          
        </div>
      </section>
      
      <Footer />
    </>
  );
}
