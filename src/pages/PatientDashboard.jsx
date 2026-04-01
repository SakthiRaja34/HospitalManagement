import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, User, LogOut, Clock, ClipboardPlus, Phone, MapPin, House, IndianRupee, Video, Building2, BadgeCheck } from 'lucide-react';
import useResponsive from '../hooks/useResponsive';

export default function PatientDashboard() {
  const { user, logout } = useContext(AuthContext);
  const isMobile = useResponsive(980);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  // Booking Form State
  const [bookingMode, setBookingMode] = useState(false);
  const [doctorId, setDoctorId] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [reason, setReason] = useState('');
  const [appointmentMode, setAppointmentMode] = useState('offline');
  const [opForm, setOpForm] = useState({
    date_of_birth: '',
    gender: '',
    phone_number: '',
    address: '',
    medical_history: '',
  });

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchProfile = () => {
    setLoadingProfile(true);
    fetch('http://localhost/Hospital/backend/api/users.php?action=patient_profile', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProfile(data.data);
          setOpForm({
            date_of_birth: data.data.date_of_birth || '',
            gender: data.data.gender || '',
            phone_number: data.data.phone_number || '',
            address: data.data.address || '',
            medical_history: data.data.medical_history || '',
          });
          setProfileError('');
          if (!data.data.profile_complete) {
            setEditingProfile(true);
          }
        } else {
          setProfileError(data.error || 'Unable to load OP details.');
        }
      })
      .catch(() => setProfileError('Unable to load OP details.'))
      .finally(() => setLoadingProfile(false));
  };

  const fetchAppointments = () => {
    fetch('http://localhost/Hospital/backend/api/appointments.php', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setAppointments(data.data);
      });
  };

  const fetchDoctors = () => {
    fetch('http://localhost/Hospital/backend/api/users.php?action=doctors', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setDoctors(data.data);
      });
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost/Hospital/backend/api/appointments.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ doctor_id: doctorId, appointment_date: apptDate, reason, appointment_mode: appointmentMode })
      });
      const data = await res.json();
      if (data.success) {
        setBookingMode(false);
        setDoctorId('');
        setApptDate('');
        setReason('');
        setAppointmentMode('offline');
        fetchAppointments(); // Refresh list
      }
    } catch (err) { console.error('Error booking', err); }
  };

  const handleCancel = async (id) => {
    try {
      await fetch('http://localhost/Hospital/backend/api/appointments.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, status: 'cancelled' })
      });
      fetchAppointments();
    } catch(err) { console.error(err); }
  };

  const handlePayFee = async (id) => {
    try {
      await fetch('http://localhost/Hospital/backend/api/appointments.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, action: 'pay_fee' })
      });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpInputChange = (e) => {
    const { name, value } = e.target;
    setOpForm((current) => ({ ...current, [name]: value }));
  };

  const handleSaveOpDetails = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError('');
    setProfileMessage('');

    try {
      const res = await fetch('http://localhost/Hospital/backend/api/users.php?action=patient_profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(opForm),
      });
      const data = await res.json();

      if (!data.success) {
        setProfileError(data.error || 'Unable to save OP details.');
        return;
      }

      setProfileMessage('OP details saved successfully. Your information will now auto-load whenever you log back in.');
      setEditingProfile(false);
      fetchProfile();
    } catch (err) {
      setProfileError('Unable to save OP details.');
    } finally {
      setSavingProfile(false);
    }
  };

  const profileComplete = Boolean(profile?.profile_complete);
  const showProfileEditor = !profileComplete || editingProfile;

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', background: 'var(--bg-light)', minHeight: '100vh' }}>
      <aside className="sidebar">
        <Link to="/" className="text-gradient" style={{ marginBottom: '2rem', textDecoration: 'none', display: 'inline-block', fontSize: '1.8rem', fontWeight: '800' }}>
          MediCare HOS
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', padding: '10px', background: 'var(--bg-alt)', borderRadius: '12px' }}>
          <div style={{ padding: '8px', background: 'var(--bg-white)', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
            <User size={24} color="var(--primary-color)"/>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-dark)', margin: 0 }}>{user?.name}</h4>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Patient Portal</span>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              padding: '12px',
              borderRadius: '8px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              fontWeight: '500',
              color: 'var(--text-muted)',
            }}
          >
            <House size={18} /> Home Page
          </Link>
          <button onClick={() => setBookingMode(false)} style={{ textDecoration: 'none', padding: '12px', background: !bookingMode ? 'var(--bg-alt)' : 'transparent', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center', fontWeight: '500', color: !bookingMode ? 'var(--primary-color)' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>
            <Calendar size={18} /> My Appointments
          </button>
          {!profileComplete && (
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', color: '#B45309', fontSize: '13px', fontWeight: '600', lineHeight: '1.5' }}>
              Complete your OP details before booking an appointment.
            </div>
          )}
          {profileComplete && (
            <button
              onClick={() => {
                setEditingProfile(true);
                setBookingMode(false);
                setProfileMessage('');
              }}
              style={{
                textDecoration: 'none',
                padding: '12px',
                background: editingProfile ? 'rgba(13, 148, 136, 0.12)' : 'transparent',
                borderRadius: '8px',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                fontWeight: '500',
                color: editingProfile ? 'var(--secondary-color)' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <ClipboardPlus size={18} /> OP Details
            </button>
          )}
        </nav>
        
        <button className="btn" onClick={logout} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: 'none', width: '100%' }}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      <main className="main-content" style={{ marginLeft: 0, maxWidth: 'calc(100vw - 60px)', width: '100%', flex: 1, minWidth: 0 }}>
        <header style={{ marginBottom: '2rem', background: 'var(--bg-white)', padding: isMobile ? '1.5rem' : '2rem', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: '1rem' }}>
          <div>
            <h1 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
              {loadingProfile ? 'Loading...' : !profileComplete ? 'Complete OP Registration' : bookingMode ? 'Book Consultation' : 'My Appointments'}
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              {loadingProfile
                ? 'Preparing your patient workspace.'
                : !profileComplete
                  ? 'Please enter your outpatient details before continuing to appointments.'
                  : editingProfile
                    ? 'Review and update your saved OP details.'
                    : bookingMode
                      ? 'Select a specialist and time.'
                      : 'View and manage your scheduled hospital visits.'}
            </p>
          </div>
          {profileComplete && !bookingMode && !editingProfile && (
            <button className="btn btn-primary" onClick={() => setBookingMode(true)}>+ Book Appointment</button>
          )}
        </header>

        {loadingProfile ? (
          <div className="clean-card fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ margin: 0 }}>Loading your OP details...</p>
          </div>
        ) : showProfileEditor ? (
          <div className="clean-card fade-in" style={{ padding: '2rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 0.9fr) minmax(0, 1.1fr)',
                gap: '2rem',
                alignItems: 'start',
              }}
            >
              <div
                style={{
                  padding: '2rem',
                  borderRadius: '20px',
                  background: 'linear-gradient(160deg, #0F172A 0%, #1E3A8A 100%)',
                  color: 'white',
                }}
              >
                <div style={{ width: '58px', height: '58px', borderRadius: '18px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <ClipboardPlus size={28} />
                </div>
                <h2 style={{ color: 'white', marginBottom: '0.8rem' }}>Outpatient Details</h2>
                <p style={{ color: 'rgba(255,255,255,0.82)', marginBottom: '1.5rem' }}>
                  Before you book your first appointment, please complete your OP registration details so the hospital can identify and contact you quickly.
                </p>
                <div style={{ display: 'grid', gap: '0.9rem' }}>
                  <div style={{ padding: '0.9rem 1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.10)' }}>
                    <strong style={{ display: 'block', marginBottom: '0.2rem' }}>OP Number</strong>
                    <span>{profile?.op_number || 'Will be generated automatically'}</span>
                  </div>
                  <div style={{ padding: '0.9rem 1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.10)' }}>
                    <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Patient Name</strong>
                    <span>{user?.name}</span>
                  </div>
                  <div style={{ padding: '0.9rem 1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.10)' }}>
                    <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Email Address</strong>
                    <span>{user?.email}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveOpDetails} style={{ display: 'grid', gap: '1.2rem' }}>
                {profileMessage && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', padding: '0.9rem 1rem', borderRadius: '12px', fontWeight: '600' }}>
                    {profileMessage}
                  </div>
                )}
                {profileError && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.10)', color: 'var(--danger)', padding: '0.9rem 1rem', borderRadius: '12px', fontWeight: '500' }}>
                    {profileError}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Date of Birth</label>
                    <input type="date" name="date_of_birth" className="input-glass" value={opForm.date_of_birth} onChange={handleOpInputChange} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Gender</label>
                    <select name="gender" className="input-glass" value={opForm.gender} onChange={handleOpInputChange} required>
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                    <Phone size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Phone Number
                  </label>
                  <input type="text" name="phone_number" className="input-glass" value={opForm.phone_number} onChange={handleOpInputChange} placeholder="Enter patient contact number" required />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                    <MapPin size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Address
                  </label>
                  <textarea name="address" className="input-glass" value={opForm.address} onChange={handleOpInputChange} rows={3} placeholder="Enter full patient address" required style={{ resize: 'vertical' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Medical History / OP Notes</label>
                  <textarea name="medical_history" className="input-glass" value={opForm.medical_history} onChange={handleOpInputChange} rows={5} placeholder="Add allergies, previous conditions, or important OP notes" style={{ resize: 'vertical' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', flexDirection: isMobile ? 'column' : 'row' }}>
                  {profileComplete && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        setEditingProfile(false);
                        setProfileError('');
                        setProfileMessage('');
                        setOpForm({
                          date_of_birth: profile?.date_of_birth || '',
                          gender: profile?.gender || '',
                          phone_number: profile?.phone_number || '',
                          address: profile?.address || '',
                          medical_history: profile?.medical_history || '',
                        });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                    {savingProfile ? 'Saving...' : 'Save OP Details'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : bookingMode ? (
          <div className="clean-card fade-in" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto' }}>
            <form onSubmit={handleBookAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dark)', fontWeight: '600' }}>Select Specialist</label>
                <select 
                  className="input-glass" 
                  value={doctorId} 
                  onChange={e => setDoctorId(e.target.value)} 
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                >
                  <option value="" disabled>-- Choose a Doctor --</option>
                  {doctors.map(d => (
                    <option key={d.doctor_id} value={d.doctor_id}>Dr. {d.name} ({d.specialization})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dark)', fontWeight: '600' }}>Appointment Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setAppointmentMode('offline')}
                    className="btn"
                    style={{
                      background: appointmentMode === 'offline' ? 'var(--bg-alt)' : 'var(--bg-white)',
                      color: appointmentMode === 'offline' ? 'var(--primary-color)' : 'var(--text-muted)',
                      border: '1px solid var(--border-light)',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <Building2 size={18} /> Offline Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setAppointmentMode('online')}
                    className="btn"
                    style={{
                      background: appointmentMode === 'online' ? 'rgba(13, 148, 136, 0.12)' : 'var(--bg-white)',
                      color: appointmentMode === 'online' ? 'var(--secondary-color)' : 'var(--text-muted)',
                      border: '1px solid var(--border-light)',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <Video size={18} /> Online Meeting
                  </button>
                </div>
                <div style={{ marginTop: '0.9rem', padding: '0.9rem 1rem', borderRadius: '12px', background: appointmentMode === 'online' ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-light)', color: appointmentMode === 'online' ? '#B45309' : 'var(--text-muted)', fontSize: '14px' }}>
                  {appointmentMode === 'online'
                    ? 'Online appointments require a doctor fee of Rs. 500. The doctor will confirm the final meeting time first, and then you can pay before attending.'
                    : 'Offline appointments do not need online payment. The doctor will confirm your visit time.'}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dark)', fontWeight: '600' }}>Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="input-glass" 
                  value={apptDate}
                  onChange={e => setApptDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dark)', fontWeight: '600' }}>Reason for Visit (Optional)</label>
                <textarea 
                  className="input-glass" 
                  placeholder="Describe your symptoms briefly..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={4}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Confirm Booking</button>
                <button type="button" className="btn btn-outline" onClick={() => setBookingMode(false)}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="clean-card fade-in" style={{ padding: '2rem' }}>
              {profileMessage && (
                <div style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', padding: '0.9rem 1rem', borderRadius: '12px', fontWeight: '600', marginBottom: '1rem' }}>
                  {profileMessage}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ marginBottom: '0.4rem' }}>Saved OP Details</h2>
                  <p style={{ margin: 0 }}>Your outpatient registration is stored and will load automatically after each login.</p>
                </div>
                <button className="btn btn-outline" onClick={() => setEditingProfile(true)}>
                  Edit OP Details
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'OP Number', value: profile?.op_number || '-' },
                  { label: 'Patient Name', value: profile?.name || user?.name || '-' },
                  { label: 'Email Address', value: profile?.email || user?.email || '-' },
                  { label: 'Date of Birth', value: profile?.date_of_birth || '-' },
                  { label: 'Gender', value: profile?.gender || '-' },
                  { label: 'Phone Number', value: profile?.phone_number || '-' },
                ].map((item) => (
                  <div key={item.label} style={{ padding: '1rem 1.1rem', borderRadius: '16px', background: 'var(--bg-white)', border: '1px solid var(--border-light)' }}>
                    <strong style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-dark)' }}>{item.label}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1rem', padding: '1rem 1.1rem', borderRadius: '16px', background: 'var(--bg-white)', border: '1px solid var(--border-light)' }}>
                <strong style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-dark)' }}>Address</strong>
                <span style={{ color: 'var(--text-muted)' }}>{profile?.address || '-'}</span>
              </div>
              <div style={{ marginTop: '1rem', padding: '1rem 1.1rem', borderRadius: '16px', background: 'var(--bg-white)', border: '1px solid var(--border-light)' }}>
                <strong style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-dark)' }}>Medical History / OP Notes</strong>
                <span style={{ color: 'var(--text-muted)' }}>{profile?.medical_history || 'No medical history added yet.'}</span>
              </div>
            </div>

            <div className="clean-card fade-in" style={{ padding: '2rem' }}>
              {appointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', background: 'var(--bg-alt)', borderRadius: '12px' }}>
                  <Calendar size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>No appointments scheduled yet.</p>
                </div>
              ) : (
                <div className="table-scroll" style={{ borderRadius: '20px', border: '1px solid var(--border-light)', background: 'var(--bg-white)', overflow: 'hidden' }}>
                <table style={{ minWidth: '1120px' }}>
                <thead>
                  <tr>
                    <th style={{ whiteSpace: 'nowrap' }}>Requested Date</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Type</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Doctor</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Department</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Doctor Time</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Fee</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Status</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appt => (
                    <tr key={appt.id}>
                      <td style={{ minWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dark)', fontWeight: '500' }}>
                          <Clock size={16} color="var(--primary-color)" />
                          <span>{new Date(appt.appointment_date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                        </div>
                      </td>
                      <td style={{ minWidth: '120px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: appt.appointment_mode === 'online' ? 'var(--secondary-color)' : 'var(--primary-color)', background: appt.appointment_mode === 'online' ? 'rgba(13, 148, 136, 0.10)' : 'rgba(37, 99, 235, 0.08)', padding: '7px 12px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                          {appt.appointment_mode === 'online' ? <Video size={14} /> : <Building2 size={14} />}
                          {(appt.appointment_mode || 'offline').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ minWidth: '160px', fontWeight: '600', color: 'var(--text-dark)', lineHeight: '1.45' }}>Dr. {appt.doctor_name}</td>
                      <td style={{ minWidth: '170px', color: 'var(--text-dark)', fontWeight: '500' }}>{appt.department || appt.specialization}</td>
                      <td style={{ minWidth: '190px' }}>
                        {appt.doctor_confirmed_time ? (
                          <div style={{ color: 'var(--text-dark)', fontWeight: '500', lineHeight: '1.45' }}>
                            {new Date(appt.doctor_confirmed_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Waiting for doctor</span>
                        )}
                      </td>
                      <td style={{ minWidth: '140px' }}>
                        {appt.appointment_mode === 'online' ? (
                          <div style={{ display: 'grid', gap: '4px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '800', color: 'var(--text-dark)', fontSize: '1rem' }}>
                              <IndianRupee size={14} /> {Number(appt.doctor_fee || 500).toFixed(0)}
                            </div>
                            <div style={{ fontSize: '12px', color: appt.payment_status === 'paid' ? 'var(--success)' : '#B45309', fontWeight: '600' }}>
                              {appt.payment_status === 'paid' ? 'Paid' : 'Pending payment'}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Not required</span>
                        )}
                      </td>
                      <td style={{ minWidth: '140px' }}>
                        <span style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '7px 14px', 
                          borderRadius: '999px', 
                          fontSize: '12px',
                          fontWeight: '600',
                          background: appt.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : 
                                      appt.status === 'completed' ? 'var(--primary-color)' :
                                      appt.status === 'cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: appt.status === 'confirmed' ? 'var(--success)' : 
                                 appt.status === 'completed' ? 'white' :
                                 appt.status === 'cancelled' ? 'var(--danger)' : 'var(--warning)'
                        }}>
                          {appt.status.toUpperCase()}
                        </span>
                        {appt.status === 'confirmed' && appt.appointment_mode === 'online' && appt.payment_status === 'paid' && (
                          <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <BadgeCheck size={13} /> Ready to attend
                          </div>
                        )}
                      </td>
                      <td style={{ minWidth: '160px' }}>
                        <div style={{ display: 'grid', gap: '8px', justifyItems: 'start' }}>
                          {appt.appointment_mode === 'online' && appt.payment_status !== 'paid' && appt.status !== 'confirmed' && (
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.45', maxWidth: '150px' }}>
                              Payment will open after the doctor confirms the appointment time.
                            </div>
                          )}
                          {appt.appointment_mode === 'online' && appt.status === 'confirmed' && appt.payment_status !== 'paid' && (
                            <button onClick={() => handlePayFee(appt.id)} style={{ border: 'none', background: 'rgba(245, 158, 11, 0.14)', color: '#B45309', cursor: 'pointer', fontSize: '13px', fontWeight: '700', padding: '10px 14px', borderRadius: '12px', minWidth: '104px' }}>
                              Pay Rs. 500
                            </button>
                          )}
                          {appt.appointment_mode === 'online' && appt.meeting_link && appt.payment_status === 'paid' && (
                            <a href={appt.meeting_link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'var(--secondary-color)', fontSize: '13px', fontWeight: '700', padding: '8px 0' }}>
                              Join Meeting
                            </a>
                          )}
                          {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                            <button onClick={() => handleCancel(appt.id)} style={{ border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontSize: '13px', fontWeight: '600', padding: '4px 0' }}>Cancel</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
          </div>
        )}
      </main>
    </div>
  );
}
