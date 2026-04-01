import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Activity, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
      <Navbar />
      <div style={{ background: 'var(--bg-light)', minHeight: 'calc(100vh - 80px)', padding: '4rem 0' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: '3rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>About <span className="text-gradient">MediCare HOS</span></h1>
            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              We've been redefining what comprehensive healthcare means since 2010. Our goal is to blend bleeding-edge tech with unmatched compassion.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            
            <div className="clean-card fade-in" style={{ padding: '3rem', borderLeft: '4px solid var(--primary-color)' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Our Mission</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', lineHeight: '1.8' }}>
                At MediCare HOS, our mission is simple yet pivotal: provide accessible, ethical, and superior medical care to patients regardless of origin. We believe the hospital experience shouldn't be terrifying or mired in bureaucratic waiting games. Through our integrated digital patient portal, your medical records, test results, and primary doctors are instantly accessible.
              </p>
            </div>

            <div className="grid-cols-3">
              <div className="clean-card fade-in" style={{ padding: '2rem', textAlign: 'center', animationDelay: '0.1s' }}>
                <Activity size={48} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem' }} />
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>Innovation</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>We continuously invest in next-generation diagnostic robotics and digital EHR systems.</p>
              </div>
              <div className="clean-card fade-in" style={{ padding: '2rem', textAlign: 'center', animationDelay: '0.2s' }}>
                <ShieldCheck size={48} color="var(--success)" style={{ margin: '0 auto 1.5rem' }} />
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>Integrity</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Complete transparency in our billing processes and ethical standards of treatment.</p>
              </div>
              <div className="clean-card fade-in" style={{ padding: '2rem', textAlign: 'center', animationDelay: '0.3s' }}>
                <Clock size={48} color="var(--warning)" style={{ margin: '0 auto 1.5rem' }} />
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>Efficiency</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Minimizing wait times via predictive analytics and an automated portal booking system.</p>
              </div>
            </div>

            <div className="clean-card fade-in" style={{ padding: '4rem', background: 'var(--bg-alt)', textAlign: 'center', animationDelay: '0.4s' }}>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--text-dark)', marginBottom: '2rem' }}>Ready to experience true care?</h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                 <Link to="/register" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>Join the Patient Portal</Link>
                 <Link to="/doctors" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '1.1rem', background: 'white' }}>Find a Specialist</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
