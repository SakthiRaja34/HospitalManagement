import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import useResponsive from '../hooks/useResponsive';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const isMobile = useResponsive(980);
  const isCompact = useResponsive(1366);

  const sendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost/Hospital/backend/api/auth.php?action=send-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedOtp(data.otp || '');
        setIsOtpSent(true);
        setSuccess('OTP generated and displayed below.');
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error generating OTP:', error);
      setError('Network error or server unavailable');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost/Hospital/backend/api/auth.php?action=reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.message || 'Password reset successful.');
        setOtp('');
        setNewPassword('');
        setIsOtpSent(false);
        setGeneratedOtp('');
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('Network error or server unavailable');
    } finally {
      setLoading(false);
    }
  };

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
          maxWidth: isCompact ? '480px' : '520px',
          padding: isMobile ? '2rem' : '2.5rem',
          borderRadius: '28px',
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 28px 70px rgba(15, 23, 42, 0.14)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="flex-center" style={{ marginBottom: '1rem', gap: '10px' }}>
            <div style={{ padding: '8px', background: 'var(--bg-light)', borderRadius: '12px' }}>
              <Mail color="var(--primary-color)" size={32} />
            </div>
            <h2 className="text-gradient">Reset Password</h2>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {success && (
          <div style={{ backgroundColor: 'rgba(20, 184, 166, 0.12)', color: '#0F766E', padding: '12px 14px', borderRadius: '12px', marginBottom: '1rem', textAlign: 'center', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} />
            {success}
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px 14px', borderRadius: '12px', marginBottom: '1rem', textAlign: 'center', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={isOtpSent ? resetPassword : sendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '7px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>Email Address</label>
            <input
              type="email"
              className="input-glass"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          {isOtpSent && (
            <>
              <div style={{ padding: '0.88rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.22)', color: 'var(--primary-color)', fontWeight: 600 }}>
                Your OTP (display only for demo): <strong>{generatedOtp}</strong>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '7px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>Enter OTP</label>
                <input
                  type="text"
                  className="input-glass"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="1234"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '7px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>New Password</label>
                <input
                  type="password"
                  className="input-glass"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="New password"
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.75rem', width: '100%', padding: '14px 28px' }} disabled={loading}>
            {loading ? 'Please wait...' : isOtpSent ? 'Reset Password' : 'Generate OTP'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: 'var(--text-muted)' }}>
          <Link to="/patient-login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}