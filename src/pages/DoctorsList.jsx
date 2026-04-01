import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserCircle, ShieldCheck, Mail, Building2, Clock3, Search, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    fetch('http://localhost/Hospital/backend/api/users.php?action=doctors')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDoctors(data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const specializations = [...new Set(doctors.map((doctor) => doctor.specialization).filter(Boolean))].sort();
  const departments = [...new Set(doctors.map((doctor) => doctor.department).filter(Boolean))].sort();

  const filteredDoctors = doctors.filter((doctor) => {
    const searchTerm = search.trim().toLowerCase();
    const haystack = [
      doctor.name,
      doctor.specialization,
      doctor.department,
      doctor.bio,
      doctor.availability,
      doctor.email,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesSearch = searchTerm === '' || haystack.includes(searchTerm);
    const matchesSpecialization = !selectedSpecialization || doctor.specialization === selectedSpecialization;
    const matchesDepartment = !selectedDepartment || doctor.department === selectedDepartment;

    return matchesSearch && matchesSpecialization && matchesDepartment;
  });

  return (
    <>
      <Navbar />
      <div style={{ background: 'var(--bg-light)', minHeight: 'calc(100vh - 80px)', padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: '3rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>Our <span className="text-gradient">Medical Specialists</span></h1>
            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Meet our team of board-certified, highly experienced medical professionals dedicated to providing world-class compassionate care.
            </p>
          </div>

          <div className="clean-card fade-in" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Search doctor</label>
                <div style={{ position: 'relative' }}>
                  <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="input-glass"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, need, specialization, or bio"
                    style={{ paddingLeft: '42px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Specialization</label>
                <select className="input-glass" value={selectedSpecialization} onChange={(e) => setSelectedSpecialization(e.target.value)}>
                  <option value="">All specializations</option>
                  {specializations.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Department</label>
                <select className="input-glass" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                  <option value="">All departments</option>
                  {departments.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setSearch('');
                  setSelectedSpecialization('');
                  setSelectedDepartment('');
                }}
                style={{ width: '100%' }}
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="grid-cols-3">
            {filteredDoctors.map(doctor => (
              <div key={doctor.doctor_id} className="clean-card card-hover" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '100px', height: '100px', background: 'var(--bg-alt)', borderRadius: '50%', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCircle size={56} color="var(--primary-color)" />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>Dr. {doctor.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-light)', padding: '6px 16px', borderRadius: '20px', marginBottom: '1rem', border: '1px solid var(--border-light)' }}>
                  <ShieldCheck size={16} color="var(--success)" />
                  <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>{doctor.specialization}</span>
                </div>
                <div style={{ display: 'grid', gap: '0.75rem', width: '100%', textAlign: 'left', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                    <Building2 size={16} color="var(--primary-color)" />
                    <span>{doctor.department || 'Specialty Department'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                    <Mail size={16} color="var(--primary-color)" />
                    <span>{doctor.email}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                    <Clock3 size={16} color="var(--primary-color)" />
                    <span>{doctor.availability || 'Mon - Sat, 10:00 AM - 2:00 PM'}</span>
                  </div>
                </div>
                <div style={{ marginBottom: '1rem', padding: '0.55rem 0.85rem', borderRadius: '14px', background: 'rgba(37, 99, 235, 0.08)', color: 'var(--primary-color)', fontWeight: '700', fontSize: '13px' }}>
                  {doctor.experience_years ? `${doctor.experience_years} years experience` : 'Senior consultant'}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '2rem', flexGrow: 1 }}>
                  {doctor.bio || "Dedicated specialist at MediCare HOS, committed to patient health and innovative treatments."}
                </p>
                <Link to="/register" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                  Book Consultation
                </Link>
              </div>
            ))}
            {doctors.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '3rem', background: 'var(--bg-white)', borderRadius: '16px' }}>
                <p>Loading medical staff roster...</p>
              </div>
            )}
            {doctors.length > 0 && filteredDoctors.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '3rem', background: 'var(--bg-white)', borderRadius: '16px' }}>
                <Stethoscope size={42} style={{ marginBottom: '0.8rem', opacity: 0.25 }} />
                <p>No doctors matched your search. Try another need, specialization, or department.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
