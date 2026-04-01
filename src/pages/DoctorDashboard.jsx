import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, User, LogOut, CheckCircle, FileText, Phone, UserCircle2, Video, Building2, IndianRupee, BadgeCheck, Activity, ClipboardPlus, House } from 'lucide-react';
import useResponsive from '../hooks/useResponsive';
import { specializationDepartmentMap, specializationOptions } from '../data/doctorOptions';

const availabilityOptions = [
  'Mon - Fri, 9:00 AM - 1:00 PM',
  'Mon - Fri, 2:00 PM - 6:00 PM',
  'Mon - Sat, 9:00 AM - 1:00 PM',
  'Mon - Sat, 10:00 AM - 4:00 PM',
  'Tue - Sun, 10:00 AM - 2:00 PM',
  'Wed - Mon, 1:00 PM - 6:00 PM',
];

const formatDateTimeLocalValue = (value) => {
  if (!value) return '';
  const normalized = String(value).trim().replace(' ', 'T');
  return normalized.length >= 16 ? normalized.slice(0, 16) : normalized;
};

const formatDateTimeForApi = (value) => {
  if (!value) return '';
  const normalized = formatDateTimeLocalValue(value);
  return normalized ? `${normalized.replace('T', ' ')}:00` : '';
};

const resolveConfirmationTime = (confirmedValue, fallbackValue) => {
  return formatDateTimeForApi(confirmedValue) || formatDateTimeForApi(fallbackValue);
};

export default function DoctorDashboard() {
  const { user, logout } = useContext(AuthContext);
  const isMobile = useResponsive(1100);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [confirmedTime, setConfirmedTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [doctorNote, setDoctorNote] = useState('');
  const [scheduleError, setScheduleError] = useState('');
  const [scheduleMessage, setScheduleMessage] = useState('');
  const [activeView, setActiveView] = useState('schedule');
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    specialization: '',
    department: '',
    bio: '',
    experience_years: '',
    availability: '',
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctorProfile();
  }, []);

  const fetchAppointments = () => {
    fetch('http://localhost/Hospital/backend/api/appointments.php', { method: 'GET', credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) setAppointments(data.data);
      });
  };

  const fetchDoctorProfile = () => {
    setProfileLoading(true);
    fetch('http://localhost/Hospital/backend/api/users.php?action=doctor_profile', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProfile(data.data);
          setProfileForm({
            specialization: data.data.specialization || '',
            department: data.data.department || '',
            bio: data.data.bio || '',
            experience_years: data.data.experience_years || '',
            availability: data.data.availability || '',
          });
          setProfileError('');
          if (!data.data.profile_complete) {
            setActiveView('profile');
          }
        } else {
          setProfileError(data.error || 'Unable to load doctor profile.');
        }
      })
      .catch(() => setProfileError('Unable to load doctor profile.'))
      .finally(() => setProfileLoading(false));
  };

  const handleUpdateStatus = (id, newStatus) => {
    fetch('http://localhost/Hospital/backend/api/appointments.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id, status: newStatus })
    }).then(res => res.json())
      .then(() => {
        setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
        if (selectedAppt && selectedAppt.id === id) {
          setSelectedAppt({ ...selectedAppt, status: newStatus });
        }
      });
  };

  const handleSelectAppointment = (appt) => {
    setSelectedAppt(appt);
    setConfirmedTime(formatDateTimeLocalValue(appt.doctor_confirmed_time || appt.appointment_date));
    setMeetingLink(appt.meeting_link || '');
    setDoctorNote(appt.doctor_note || '');
    setScheduleError('');
    setScheduleMessage('');
  };

  const handleConfirmSchedule = async () => {
    if (!selectedAppt) return;
    const formattedConfirmedTime = resolveConfirmationTime(
      confirmedTime,
      selectedAppt.doctor_confirmed_time || selectedAppt.appointment_date
    );

    if (!formattedConfirmedTime) {
      setScheduleError('Unable to determine the appointment time. Please choose a time and try again.');
      setScheduleMessage('');
      return;
    }

    try {
      const res = await fetch('http://localhost/Hospital/backend/api/appointments.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: selectedAppt.id,
          action: 'confirm_schedule',
          doctor_confirmed_time: formattedConfirmedTime,
          meeting_link: meetingLink,
          doctor_note: doctorNote,
        })
      });

      const data = await res.json();
      if (!data.success) {
        setScheduleError(data.error || 'Unable to confirm the appointment right now.');
        setScheduleMessage('');
        return;
      }

      const updated = {
        ...selectedAppt,
        status: 'confirmed',
        doctor_confirmed_time: formattedConfirmedTime,
        meeting_link: meetingLink,
        doctor_note: doctorNote,
      };
      setSelectedAppt(updated);
      setAppointments(appointments.map((appt) => (appt.id === updated.id ? updated : appt)));
      setScheduleError('');
      setScheduleMessage('Appointment confirmed successfully. The patient can now pay the fee and follow the confirmed schedule.');
      fetchAppointments();
    } catch (err) {
      setScheduleError('Unable to confirm the appointment right now.');
      setScheduleMessage('');
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError('');
    setProfileMessage('');

    try {
      const res = await fetch('http://localhost/Hospital/backend/api/users.php?action=doctor_profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();

      if (!data.success) {
        setProfileError(data.error || 'Unable to save doctor profile.');
        return;
      }

      setProfileMessage('Doctor profile saved successfully. Patients can now find you more easily by specialty and department.');
      fetchDoctorProfile();
    } catch (err) {
      setProfileError('Unable to save doctor profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const profileComplete = Boolean(profile?.profile_complete);

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
            <h4 style={{ color: 'var(--text-dark)', margin: 0 }}>Dr. {user?.name}</h4>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Doctor Portal</span>
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
          <button
            onClick={() => setActiveView('schedule')}
            style={{ textDecoration: 'none', padding: '12px', background: activeView === 'schedule' ? 'var(--bg-alt)' : 'transparent', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center', fontWeight: '500', color: activeView === 'schedule' ? 'var(--primary-color)' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
          >
            <Calendar size={18} /> My Schedule
          </button>
          <button
            onClick={() => setActiveView('profile')}
            style={{ textDecoration: 'none', padding: '12px', background: activeView === 'profile' ? 'rgba(13, 148, 136, 0.12)' : 'transparent', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center', fontWeight: '500', color: activeView === 'profile' ? 'var(--secondary-color)' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
          >
            <ClipboardPlus size={18} /> Doctor Profile
          </button>
          {!profileComplete && !profileLoading && (
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', color: '#B45309', fontSize: '13px', fontWeight: '600', lineHeight: '1.5' }}>
              Complete your doctor profile so patients can search and find you easily.
            </div>
          )}
        </nav>
        <button className="btn" onClick={logout} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: 'none', width: '100%' }}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      <main className="main-content" style={{ marginLeft: isMobile ? 0 : '320px', maxWidth: '1400px', width: '100%' }}>
        {activeView === 'profile' ? (
          <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '1040px' }}>
            <header className="clean-card fade-in" style={{ padding: '2rem' }}>
              <h1 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Doctor Profile</h1>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                Add your specialization, department, availability, experience, and a short professional bio for the patient directory.
              </p>
            </header>

            <div className="clean-card fade-in" style={{ padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 0.85fr) minmax(0, 1.15fr)', gap: '2rem', alignItems: 'start' }}>
                <div style={{ padding: '2rem', borderRadius: '22px', background: 'linear-gradient(160deg, #0F172A 0%, #0F766E 100%)', color: 'white' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <ClipboardPlus size={30} />
                  </div>
                  <h2 style={{ color: 'white', marginBottom: '0.8rem' }}>Profile Visibility</h2>
                  <p style={{ color: 'rgba(255,255,255,0.82)', marginBottom: '1.2rem' }}>
                    Patients can choose the right doctor more easily when your details are complete and clearly described.
                  </p>
                  <div style={{ display: 'grid', gap: '0.85rem' }}>
                    {[
                      { label: 'Doctor Name', value: `Dr. ${user?.name || '-'}` },
                      { label: 'Email Address', value: user?.email || '-' },
                      { label: 'Profile Status', value: profileComplete ? 'Complete' : 'Needs details' },
                    ].map((item) => (
                      <div key={item.label} style={{ padding: '0.9rem 1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.10)' }}>
                        <strong style={{ display: 'block', marginBottom: '0.2rem' }}>{item.label}</strong>
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} style={{ display: 'grid', gap: '1rem' }}>
                  {profileMessage && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', padding: '0.9rem 1rem', borderRadius: '12px', fontWeight: 600 }}>
                      {profileMessage}
                    </div>
                  )}
                  {profileError && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.10)', color: 'var(--danger)', padding: '0.9rem 1rem', borderRadius: '12px', fontWeight: 500 }}>
                      {profileError}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '7px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Specialization</label>
                      <select
                        name="specialization"
                        className="input-glass"
                        value={profileForm.specialization}
                        onChange={(e) => {
                          const selected = e.target.value;
                          setProfileForm((current) => ({
                            ...current,
                            specialization: selected,
                            department: specializationDepartmentMap[selected] || '',
                          }));
                        }}
                        required
                      >
                        <option value="">Select specialization</option>
                        {specializationOptions.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '7px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Department</label>
                      <input
                        type="text"
                        name="department"
                        className="input-glass"
                        value={profileForm.department}
                        readOnly
                        placeholder="Department will be selected automatically"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '7px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Experience (Years)</label>
                      <input type="number" min="0" max="50" name="experience_years" className="input-glass" value={profileForm.experience_years} onChange={handleProfileInputChange} placeholder="e.g. 8" />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '7px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Availability</label>
                      <select name="availability" className="input-glass" value={profileForm.availability} onChange={handleProfileInputChange}>
                        <option value="">Select availability</option>
                        {availabilityOptions.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '7px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Professional Bio</label>
                    <textarea
                      name="bio"
                      className="input-glass"
                      rows={5}
                      value={profileForm.bio}
                      onChange={handleProfileInputChange}
                      placeholder="Describe your expertise, consultation focus, and patient-care approach."
                      style={{ resize: 'vertical' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                      {savingProfile ? 'Saving...' : 'Save Doctor Profile'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '2rem', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <header style={{ marginBottom: '2rem', background: 'var(--bg-white)', padding: '2rem', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
                <h1 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Schedule Overview</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Select an appointment to view deep patient details.</p>
              </header>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {appointments.map(appt => (
                  <div 
                    key={appt.id} 
                    onClick={() => handleSelectAppointment(appt)}
                    className="clean-card fade-in" 
                    style={{ 
                      padding: '1.5rem', 
                      cursor: 'pointer',
                      border: selectedAppt?.id === appt.id ? '2px solid var(--primary-color)' : '1px solid var(--border-light)',
                      transform: selectedAppt?.id === appt.id ? 'translateX(5px)' : 'none'
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>{appt.patient_name}</h3>
                      <span style={{ fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px', background: appt.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-light)', color: appt.status === 'confirmed' ? 'var(--success)' : 'var(--text-muted)' }}>
                        {appt.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: appt.appointment_mode === 'online' ? 'var(--secondary-color)' : 'var(--primary-color)', background: 'var(--bg-light)', padding: '4px 10px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        {appt.appointment_mode === 'online' ? <Video size={13} /> : <Building2 size={13} />}
                        {(appt.appointment_mode || 'offline').toUpperCase()}
                      </span>
                      {appt.appointment_mode === 'online' && (
                        <span style={{ fontSize: '12px', fontWeight: '700', color: appt.payment_status === 'paid' ? 'var(--success)' : '#B45309', background: appt.payment_status === 'paid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.12)', padding: '4px 10px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <IndianRupee size={12} /> {appt.payment_status === 'paid' ? 'Fee paid' : 'Fee pending'}
                        </span>
                      )}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} color="var(--primary-color)" />
                      {new Date(appt.appointment_date).toLocaleString()}
                    </p>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 0', background: 'var(--bg-white)', borderRadius: '16px' }}>
                    <p>You have no upcoming appointments.</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ width: isMobile ? '100%' : '400px' }}>
              {selectedAppt ? (
                <div className="clean-card fade-in" style={{ padding: '2rem', position: 'sticky', top: '20px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '80px', height: '80px', background: 'var(--bg-alt)', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserCircle2 size={48} color="var(--primary-color)" />
                    </div>
                    <h2 style={{ marginBottom: '5px' }}>{selectedAppt.patient_name}</h2>
                    <div style={{ display: 'inline-block', background: 'var(--bg-light)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>
                       Patient ID: #{selectedAppt.patient_id}
                    </div>
                    <div style={{ marginTop: '0.8rem', display: 'flex', justifyContent: 'center', gap: '0.7rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: selectedAppt.appointment_mode === 'online' ? 'var(--secondary-color)' : 'var(--primary-color)', background: 'var(--bg-light)', padding: '5px 12px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        {selectedAppt.appointment_mode === 'online' ? <Video size={13} /> : <Building2 size={13} />}
                        {(selectedAppt.appointment_mode || 'offline').toUpperCase()}
                      </span>
                      {selectedAppt.appointment_mode === 'online' && (
                        <span style={{ fontSize: '12px', fontWeight: '700', color: selectedAppt.payment_status === 'paid' ? 'var(--success)' : '#B45309', background: selectedAppt.payment_status === 'paid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.12)', padding: '5px 12px', borderRadius: '999px' }}>
                          {selectedAppt.payment_status === 'paid' ? 'Patient paid Rs. 500' : 'Waiting for Rs. 500 fee'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} /> Demographic Data
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <li><strong>DOB:</strong> <span style={{ color: 'var(--text-muted)' }}>{selectedAppt.date_of_birth || 'Not specified'}</span></li>
                      <li><strong>Gender:</strong> <span style={{ color: 'var(--text-muted)' }}>{selectedAppt.gender ? selectedAppt.gender.charAt(0).toUpperCase() + selectedAppt.gender.slice(1) : 'Not specified'}</span></li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                         <Phone size={14} color="var(--text-muted)" />
                         <a href={`tel:${selectedAppt.phone_number}`}>{selectedAppt.phone_number || 'No phone'}</a>
                      </li>
                    </ul>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={16} /> Medical History
                    </h4>
                    <p style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: '8px', fontSize: '14px', lineHeight: '1.6' }}>
                      {selectedAppt.medical_history || "No prior medical history submitted by the patient."}
                    </p>
                    
                    <h4 style={{ color: 'var(--text-muted)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Reason for Visit:</h4>
                    <p style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--text-muted)', margin: 0 }}>
                      "{selectedAppt.reason_for_visit || "Routine checkup"}"
                    </p>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', marginBottom: '1rem' }}>
                      Doctor Scheduling
                    </h4>
                    <div style={{ display: 'grid', gap: '0.9rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Confirmed Meeting / Visit Time</label>
                        <input
                          type="datetime-local"
                          className="input-glass"
                          value={confirmedTime}
                          onChange={(e) => setConfirmedTime(formatDateTimeLocalValue(e.target.value))}
                        />
                        {confirmedTime && (
                          <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                            Selected: {new Date(formatDateTimeForApi(confirmedTime)).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </div>
                        )}
                      </div>
                      {selectedAppt.appointment_mode === 'online' && (
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Meeting Link</label>
                          <input
                            type="url"
                            className="input-glass"
                            value={meetingLink}
                            onChange={(e) => setMeetingLink(e.target.value)}
                            placeholder="https://meet.example.com/..."
                          />
                        </div>
                      )}
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Doctor Note</label>
                    <textarea
                      className="input-glass"
                          rows={3}
                          value={doctorNote}
                          onChange={(e) => setDoctorNote(e.target.value)}
                      placeholder="Add meeting instructions or arrival guidance"
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  {scheduleError && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.10)', color: 'var(--danger)', padding: '0.85rem 1rem', borderRadius: '12px', fontWeight: 600, fontSize: '13px' }}>
                      {scheduleError}
                    </div>
                  )}
                  {scheduleMessage && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', padding: '0.85rem 1rem', borderRadius: '12px', fontWeight: 600, fontSize: '13px' }}>
                      {scheduleMessage}
                    </div>
                  )}
                  <button
                    onClick={handleConfirmSchedule}
                    style={{ background: 'var(--primary-color)', border: 'none', color: 'white', fontWeight: '600', padding: '12px', borderRadius: '8px', cursor: 'pointer', width: '100%' }}
                  >
                        Confirm Appointment Time
                      </button>
                      {selectedAppt.status === 'confirmed' && (
                        <div style={{ fontSize: '12px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <BadgeCheck size={13} /> Patient can now follow the confirmed schedule
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedAppt.status !== 'completed' && selectedAppt.status !== 'cancelled' && (
                      <button 
                        onClick={() => handleUpdateStatus(selectedAppt.id, 'completed')}
                        style={{ background: 'var(--success)', border: 'none', color: 'white', fontWeight: '600', padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <CheckCircle size={18} /> Mark Session Completed
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="clean-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <FileText size={48} style={{ opacity: 0.2 }} />
                  <p>Select an appointment to view the patient's full medical portfolio and demographics.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
