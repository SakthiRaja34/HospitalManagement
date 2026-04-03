import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Activity, User, LogOut, Settings, Users, UserCheck, XCircle, CheckCircle, FileSpreadsheet, Download, IndianRupee, CalendarDays } from 'lucide-react';
import useResponsive from '../hooks/useResponsive';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const isMobile = useResponsive(980);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0 });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointmentsOverview, setAppointmentsOverview] = useState([]);
  const [appointmentsSummary, setAppointmentsSummary] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 });
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [showApprovedDoctors, setShowApprovedDoctors] = useState(false);
  const [reportFilters, setReportFilters] = useState({
    date_from: new Date(new Date().setDate(1)).toISOString().slice(0, 10),
    date_to: new Date().toISOString().slice(0, 10),
  });
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [reportSummary, setReportSummary] = useState(null);

  const fetchStats = async () => {
    try {
      const [docs, pts, appts, apptOverview] = await Promise.all([
        fetch('http://localhost/Hospital/backend/api/users.php?action=doctors', { credentials: 'include' }).then(r => r.json()),
        fetch('http://localhost/Hospital/backend/api/users.php?action=patients', { credentials: 'include' }).then(r => r.json()),
        fetch('http://localhost/Hospital/backend/api/appointments.php', { credentials: 'include' }).then(r => r.json()),
        fetch('http://localhost/Hospital/backend/api/admin.php?action=appointments_overview', { credentials: 'include' }).then(r => r.json()),
      ]);

      setStats({
        doctors: docs.data?.length || 0,
        patients: pts.data?.length || 0,
        appointments: appts.data?.length || 0
      });
      setDoctors(docs.data || []);
      setPatients(pts.data || []);
      if (apptOverview.success) {
        setAppointmentsOverview(apptOverview.data || []);
        setAppointmentsSummary(apptOverview.summary || { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 });
      }
    } catch (err) { console.error(err); }
  };

  const fetchPendingDoctors = async () => {
    try {
      const res = await fetch('http://localhost/Hospital/backend/api/admin.php?action=pending_doctors', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setPendingDoctors(data.data);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
    fetchPendingDoctors();
  }, []);

  const handleApprove = async (id, decision) => {
    try {
      await fetch('http://localhost/Hospital/backend/api/admin.php?action=approve_doctor', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ user_id: id, decision })
      });
      fetchPendingDoctors();
      fetchStats(); // Update totals
    } catch (err) { console.error(err); }
  };

  const fetchAttendanceReport = async () => {
    try {
      const params = new URLSearchParams(reportFilters).toString();
      const res = await fetch(`http://localhost/Hospital/backend/api/admin.php?action=attendance_report&${params}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setAttendanceReport(data.data || []);
        setReportSummary(data.summary || null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportReportCsv = () => {
    if (!attendanceReport.length) return;

    const headers = [
      'Patient Name',
      'Patient Email',
      'Phone',
      'Gender',
      'Date of Birth',
      'Address',
      'Doctor Name',
      'Department',
      'Specialization',
      'Appointment Type',
      'Requested Date',
      'Confirmed Time',
      'Payment Status',
      'Doctor Fee',
      'Reason',
      'Doctor Note',
    ];

    const rows = attendanceReport.map((item) => [
      item.patient_name,
      item.patient_email,
      item.phone_number,
      item.gender,
      item.date_of_birth,
      item.address,
      item.doctor_name,
      item.department,
      item.specialization,
      item.appointment_mode,
      item.appointment_date,
      item.doctor_confirmed_time || '',
      item.payment_status,
      item.doctor_fee,
      item.reason_for_visit || '',
      item.doctor_note || '',
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `attendance-report-${reportFilters.date_from}-to-${reportFilters.date_to}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', background: 'var(--bg-light)', minHeight: '100vh', gap: isMobile ? '1rem' : '1.5rem', padding: isMobile ? '1rem' : '1.5rem' }}>
      {/* Sidebar */}
      <aside className="sidebar" style={{
        width: isMobile ? '100%' : '280px',
        flexShrink: 0,
        background: 'var(--bg-white)',
        border: '1px solid var(--border-light)',
        borderRadius: '24px',
        padding: isMobile ? '1rem' : '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        position: isMobile ? 'relative' : 'sticky',
        top: isMobile ? 'auto' : '1rem',
        alignSelf: 'flex-start',
        height: isMobile ? 'auto' : 'calc(100vh - 2rem)'
      }}>
        <h2 className="text-gradient" style={{ marginBottom: '1.8rem', fontSize: '1.5rem' }}>MediCare HOS</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', padding: '10px', background: 'var(--bg-alt)', borderRadius: '12px' }}>
          <div style={{ padding: '8px', background: 'var(--bg-white)', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
            <Settings size={24} color="var(--primary-color)"/>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-dark)', margin: 0 }}>{user?.name}</h4>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Administrator</span>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('overview')}
            style={{ 
              textDecoration: 'none', padding: '12px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center', fontWeight: '500', border: 'none', cursor: 'pointer',
              background: activeTab === 'overview' ? 'var(--bg-alt)' : 'transparent',
               color: activeTab === 'overview' ? 'var(--primary-color)' : 'var(--text-muted)'
            }}
          >
            <Activity size={18} /> Overview
          </button>
          
          <button 
            onClick={() => setActiveTab('approvals')}
            style={{ 
              textDecoration: 'none', padding: '12px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center', fontWeight: '500', border: 'none', cursor: 'pointer', justifyContent: 'space-between',
              background: activeTab === 'approvals' ? 'var(--bg-alt)' : 'transparent',
              color: activeTab === 'approvals' ? 'var(--primary-color)' : 'var(--text-muted)'
            }}
          >
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
               <UserCheck size={18} /> Doctor Approvals
            </div>
            {pendingDoctors.length > 0 && (
              <span style={{ background: 'var(--danger)', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '12px' }}>
                {pendingDoctors.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            style={{
              textDecoration: 'none', padding: '12px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center', fontWeight: '500', border: 'none', cursor: 'pointer',
              background: activeTab === 'reports' ? 'var(--bg-alt)' : 'transparent',
              color: activeTab === 'reports' ? 'var(--primary-color)' : 'var(--text-muted)'
            }}
          >
            <FileSpreadsheet size={18} /> Attendance Report
          </button>

          <button onClick={() => setActiveTab('user-management')} style={{ textDecoration: 'none', padding: '12px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center', background: activeTab === 'user-management' ? 'var(--bg-alt)' : 'transparent', color: activeTab === 'user-management' ? 'var(--primary-color)' : 'var(--text-muted)', fontWeight: '500', border: 'none', cursor: 'pointer' }}>
            <Users size={18} /> User Management
          </button>
        </nav>
        
        <button className="btn" onClick={logout} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: 'none', width: '100%' }}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{
        flex: 1,
        maxWidth: 'calc(100% - 320px)',
        width: '100%',
        background: 'transparent',
        overflowX: 'hidden'
      }}>
        <header style={{ marginBottom: '2rem', background: 'var(--bg-white)', padding: '1.8rem', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
          <h1 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
            {activeTab === 'overview'
              ? 'Hospital Overview'
              : activeTab === 'approvals'
                ? 'Pending Approvals'
                : activeTab === 'patients'
                  ? 'Patients'
                  : activeTab === 'user-management'
                    ? 'User Management'
                    : 'Attendance Report'}
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            {activeTab === 'overview'
              ? 'Real-time statistics of MediCare HOS operations.'
              : activeTab === 'approvals'
                ? 'Review and verify new doctor registrations before system access is granted.'
                : activeTab === 'patients'
                  ? 'Browse all registered patients.'
                  : activeTab === 'user-management'
                    ? 'Browse registered patients and doctors.'
                    : 'Generate a detailed report of attended patients between selected dates.'}
          </p>
        </header>

        {activeTab === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setActiveTab('patients')}
                className="clean-card fade-in"
                style={{ padding: '1.6rem', display: 'flex', alignItems: 'center', gap: '18px', textAlign: 'left', cursor: 'pointer', borderRadius: '16px', border: activeTab === 'patients' ? '1px solid var(--primary-color)' : '1px solid var(--border-strong)', background: 'var(--bg-white)' }}
              >
                <div style={{ background: 'var(--bg-alt)', padding: '20px', borderRadius: '16px' }}>
                  <Users size={32} color="var(--primary-color)" />
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontWeight: '500', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>Patients</p>
                  <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.patients}</h2>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('approvals')}
                className="clean-card fade-in"
                style={{ padding: '1.6rem', display: 'flex', alignItems: 'center', gap: '18px', textAlign: 'left', cursor: 'pointer', borderRadius: '16px', border: activeTab === 'approvals' ? '1px solid var(--primary-color)' : '1px solid var(--border-strong)', background: 'var(--bg-white)' }}
              >
                <div style={{ background: 'rgba(13, 148, 136, 0.1)', padding: '20px', borderRadius: '16px' }}>
                  <User size={32} color="var(--secondary-color)" />
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontWeight: '500', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>Doctors</p>
                  <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.doctors}</h2>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reports')}
                className="clean-card fade-in"
                style={{ padding: '1.6rem', display: 'flex', alignItems: 'center', gap: '18px', textAlign: 'left', cursor: 'pointer', borderRadius: '16px', border: activeTab === 'reports' ? '1px solid var(--primary-color)' : '1px solid var(--border-strong)', background: 'var(--bg-white)' }}
              >
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '20px', borderRadius: '16px' }}>
                  <Activity size={32} color="var(--success)" />
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontWeight: '500', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>Appointments</p>
                  <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.appointments}</h2>
                </div>
              </button>
            </div>

            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
              <div className="clean-card" style={{ padding: '1rem' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Total Appointments</p>
                <h3 style={{ margin: '0.3rem 0 0' }}>{appointmentsSummary.total}</h3>
              </div>
              <div className="clean-card" style={{ padding: '1rem' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Pending</p>
                <h3 style={{ margin: '0.3rem 0 0' }}>{appointmentsSummary.pending}</h3>
              </div>
              <div className="clean-card" style={{ padding: '1rem' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Confirmed</p>
                <h3 style={{ margin: '0.3rem 0 0' }}>{appointmentsSummary.confirmed}</h3>
              </div>
              <div className="clean-card" style={{ padding: '1rem' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Completed</p>
                <h3 style={{ margin: '0.3rem 0 0' }}>{appointmentsSummary.completed}</h3>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <div className="clean-card" style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.8rem', fontSize: '1rem' }}>Recent Appointment Activity</h3>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Mode</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointmentsOverview.slice(0, 10).map((appt) => (
                        <tr key={appt.id}>
                          <td style={{ fontWeight: '500' }}>{appt.patient_name}</td>
                          <td style={{ color: 'var(--text-muted)' }}>{appt.doctor_name}</td>
                          <td>{new Date(appt.appointment_date).toLocaleString()}</td>
                          <td><span className={`status-chip ${appt.status || 'pending'}`}>{appt.status || 'pending'}</span></td>
                          <td><span className="status-chip" style={{ background: 'rgba(37, 99, 235, 0.08)', color: '#1d4ed8' }}>{appt.appointment_mode || 'offline'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'approvals' && (
          <div className="clean-card fade-in" style={{ padding: '2rem' }}>
            {pendingDoctors.length === 0 ? (
              <>
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <UserCheck size={48} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                  <p style={{ color: 'var(--text-muted)', margin: '0.4rem 0 0.6rem' }}>No pending doctor registrations requiring approval at this time.</p>
                  <p style={{ color: 'var(--text-muted)', margin: '0 0 0.75rem' }}>Click below to view current approved doctors.</p>
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowApprovedDoctors((current) => !current)}
                    style={{ padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid var(--border-strong)' }}
                  >
                    {showApprovedDoctors ? 'Hide approved doctors' : 'Show approved doctors'}
                  </button>
                </div>

                {showApprovedDoctors && (
                  <div className="table-scroll" style={{ marginTop: '1rem' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Doctor Name</th>
                        <th>Email</th>
                        <th>Specialization</th>
                        <th>Department</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
                            No approved doctors found in the system.
                          </td>
                        </tr>
                      ) : (
                        doctors.map((doc) => (
                          <tr key={doc.doctor_id}>
                            <td style={{ fontWeight: '500' }}>{doc.name}</td>
                            <td style={{ color: 'var(--text-muted)' }}>{doc.email}</td>
                            <td>{doc.specialization || 'N/A'}</td>
                            <td>{doc.department || 'N/A'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                )}
              </>
            ) : (
              <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Doctor Name</th>
                    <th>Email Address</th>
                    <th>Specialization</th>
                    <th>Registration Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingDoctors.map(doc => (
                    <tr key={doc.id}>
                      <td style={{ fontWeight: '500' }}>{doc.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{doc.email}</td>
                      <td>{doc.specialization}</td>
                      <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => handleApprove(doc.id, 'approve')} style={{ background: 'var(--success)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', gap: '5px', alignItems: 'center' }}>
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button onClick={() => handleApprove(doc.id, 'reject')} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', gap: '5px', alignItems: 'center' }}>
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'user-management' && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div className="clean-card fade-in" style={{ padding: '1.5rem' }}>
              <h3 style={{ margin: 0, marginBottom: '0.75rem', color: 'var(--text-dark)' }}>Recent Patients</h3>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Gender</th>
                      <th>DOB</th>
                      <th>Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.slice(0, 8).map((patient) => (
                      <tr key={patient.patient_id}>
                        <td style={{ fontWeight: '500' }}>{patient.name}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{patient.email}</td>
                        <td>{patient.gender || 'N/A'}</td>
                        <td>{patient.date_of_birth || 'N/A'}</td>
                        <td>{patient.phone_number || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="clean-card fade-in" style={{ padding: '1.5rem' }}>
              <h3 style={{ margin: 0, marginBottom: '0.75rem', color: 'var(--text-dark)' }}>Doctors List</h3>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Specialization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.slice(0, 8).map((doc) => (
                      <tr key={doc.doctor_id}>
                        <td style={{ fontWeight: '500' }}>{doc.name}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{doc.email}</td>
                        <td>{doc.department || 'N/A'}</td>
                        <td>{doc.specialization || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="clean-card fade-in" style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: 0, marginBottom: '0.75rem', color: 'var(--text-dark)' }}>Patients</h3>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>DOB</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.patient_id}>
                      <td style={{ fontWeight: '500' }}>{patient.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{patient.email}</td>
                      <td>{patient.gender || 'N/A'}</td>
                      <td>{patient.date_of_birth || 'N/A'}</td>
                      <td>{patient.phone_number || 'N/A'}</td>
                    </tr>
                  ))}
                  {patients.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
                        No patients found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="clean-card fade-in" style={{ padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, minmax(0, 1fr))', gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>From Date</label>
                  <input type="date" className="input-glass" value={reportFilters.date_from} onChange={(e) => setReportFilters((current) => ({ ...current, date_from: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>To Date</label>
                  <input type="date" className="input-glass" value={reportFilters.date_to} onChange={(e) => setReportFilters((current) => ({ ...current, date_to: e.target.value }))} />
                </div>
                <button className="btn btn-primary" onClick={fetchAttendanceReport}>
                  <CalendarDays size={18} /> Generate Report
                </button>
                <button className="btn btn-outline" onClick={exportReportCsv} disabled={!attendanceReport.length}>
                  <Download size={18} /> Export CSV
                </button>
              </div>
            </div>

            {reportSummary && (
              <div className="grid-cols-3">
                <div className="clean-card" style={{ padding: '1.5rem' }}>
                  <p style={{ margin: 0, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Attended Patients</p>
                  <h2 style={{ marginTop: '0.5rem' }}>{reportSummary.total_attended_patients}</h2>
                </div>
                <div className="clean-card" style={{ padding: '1.5rem' }}>
                  <p style={{ margin: 0, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Online / Offline</p>
                  <h2 style={{ marginTop: '0.5rem' }}>{reportSummary.online_attended} / {reportSummary.offline_attended}</h2>
                </div>
                <div className="clean-card" style={{ padding: '1.5rem' }}>
                  <p style={{ margin: 0, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Fees Collected</p>
                  <h2 style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}><IndianRupee size={22} /> {Number(reportSummary.total_collected_fees || 0).toFixed(0)}</h2>
                </div>
              </div>
            )}

            <div className="clean-card fade-in" style={{ padding: '2rem' }}>
              {!attendanceReport.length ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <FileSpreadsheet size={42} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                  <p style={{ margin: 0 }}>Generate a report to view attended patient details for the selected dates.</p>
                </div>
              ) : (
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Contact</th>
                        <th>Doctor</th>
                        <th>Mode</th>
                        <th>Attended On</th>
                        <th>Payment</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceReport.map((row) => (
                        <tr key={row.id}>
                          <td>
                            <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{row.patient_name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.gender || 'N/A'} | {row.date_of_birth || 'DOB not added'}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.address || 'Address not added'}</div>
                          </td>
                          <td>
                            <div>{row.patient_email}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.phone_number || 'No phone'}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{row.doctor_name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.department || row.specialization}</div>
                          </td>
                          <td>{(row.appointment_mode || 'offline').toUpperCase()}</td>
                          <td>{new Date(row.doctor_confirmed_time || row.appointment_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                          <td>
                            {row.appointment_mode === 'online' ? (
                              <span style={{ color: row.payment_status === 'paid' ? 'var(--success)' : '#B45309', fontWeight: '600' }}>
                                {row.payment_status === 'paid' ? `Paid Rs. ${Number(row.doctor_fee || 0).toFixed(0)}` : 'Pending Payment'}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>{row.payment_status === 'paid' ? 'Paid at hospital' : 'Pay at hospital'}</span>
                            )}
                          </td>
                          <td>
                            <div>{row.reason_for_visit || 'Routine checkup'}</div>
                            {row.doctor_note && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{row.doctor_note}</div>}
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
