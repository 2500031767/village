import { useState } from 'react';
import { otpAuthAPI } from '../data/api';
import { useNavigate } from 'react-router-dom';

export default function LoginOtp() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('request'); // 'request' or 'verify'
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const requestOtp = async () => {
    try {
      const res = await otpAuthAPI.requestOtp(phone);
      setMessage(res.message || 'OTP sent');
      setStep('verify');
    } catch (err) {
      setMessage('Failed to send OTP');
      console.error(err);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await otpAuthAPI.verifyOtp(phone, otp);
      // Store token and user info for member
      localStorage.setItem('member_token', res.token);
      localStorage.setItem('village_member', JSON.stringify(res.user));
      setMessage('Login successful');
      navigate('/user-dashboard');
    } catch (err) {
      setMessage('Invalid OTP');
      console.error(err);
    }
  };

  return (
    <div className="login-otp-page" style={{ maxWidth: '400px', margin: '2rem auto', padding: '1.5rem', borderRadius: '8px', background: 'var(--background)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Phone Number Login</h2>
      {message && <p style={{ textAlign: 'center', color: '#555' }}>{message}</p>}
      {step === 'request' && (
        <>
          <label>Phone Number</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g., +1234567890" style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
          <button onClick={requestOtp} style={{ width: '100%', padding: '0.6rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Request OTP</button>
        </>
      )}
      {step === 'verify' && (
        <>
          <label>Enter OTP</label>
          <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="6‑digit code" style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
          <button onClick={verifyOtp} style={{ width: '100%', padding: '0.6rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Verify OTP</button>
        </>
      )}
    </div>
  );
}
