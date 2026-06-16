import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, AlertCircle, Loader } from 'lucide-react';
import { authAPI } from '../data/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to admin dashboard
    if (authAPI.isAuthenticated()) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authAPI.login(username, password);
      navigate('/admin');
      // Trigger navigation refresh
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
        'Failed to connect to the server. Please ensure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-md)',
      position: 'relative'
    }}>
      <div className="card animate-fadeInUp" style={{
        maxWidth: '450px',
        width: '100%',
        padding: 'var(--space-2xl)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-xl)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--primary-glow)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-md) auto'
          }}>
            <Shield size={32} />
          </div>
          <h2 className="text-gradient" style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin Portal</h2>
          <p className="text-sm text-secondary mt-xs">Sign in to manage village website content</p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            padding: '12px 16px',
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-lg)',
            fontSize: '0.85rem',
            lineHeight: 1.4
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-col gap-lg">
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '44px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)'
                }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '44px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)'
                }}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary flex-center"
            style={{ width: '100%', padding: '12px', marginTop: 'var(--space-sm)' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" style={{ marginRight: '8px' }} />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <p>Default credentials: <code>admin</code> / <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
}
