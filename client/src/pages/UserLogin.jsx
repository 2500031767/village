import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, LogOut, AlertTriangle } from 'lucide-react';
import { memberAPI, issuesAPI } from '../data/api';

const CATEGORIES = ['Water','Drainage','Roads','Transport','Education','Healthcare','Housing','Agriculture','Electricity','Other'];

export default function UserLogin() {
  const navigate = useNavigate();
  const [member, setMember] = useState(() => memberAPI.getMember());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [myIssues, setMyIssues] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', category: '', description: '' });
  const [formError, setFormError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Load member's issues once logged in
  useEffect(() => {
    if (member?.username) fetchMyIssues();
  }, [member]);

  const fetchMyIssues = () => {
    issuesAPI.getAll(true)
      .then(all => {
        const mine = all.filter(i => i.description && i.description.includes(`Username: ${member.username}`));
        setMyIssues(mine);
      })
      .catch(console.error);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }
    const members = memberAPI.getAllMembers();
    const match = members.find(m => m.username === username.trim() && m.password === password.trim());
    if (!match) {
      setError('Invalid credentials');
      return;
    }
    memberAPI.saveMember(match);
    setMember(match);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    memberAPI.logout();
    setMember(null);
    setMyIssues([]);
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.title.trim() || !form.category) {
      setFormError('Title and category are required');
      return;
    }
    setSubmitting(true);
    try {
      await issuesAPI.report({
        ...form,
        reporter_name: member?.username,
        reporter_phone: ''
      });
      setSubmitted(true);
      setForm({ title: '', category: '', description: '' });
      const all = await issuesAPI.getAll(true);
      setMyIssues(all.filter(i => i.description && i.description.includes(`Username: ${member?.username}`)));
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setFormError('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
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
      {!member && (
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
            <LogOut size={32} />
          </div>
          <h2 className="text-gradient" style={{ fontSize: '1.75rem', fontWeight: 800 }}>User Portal</h2>
          <p className="text-sm text-secondary mt-xs">Sign in to access your account</p>
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
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex-col gap-lg">
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <LogOut size={18} style={{
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
                onChange={e => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '44px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)'
                }}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <LogOut size={18} style={{
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
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '44px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)'
                }}
                disabled={loading}
                required
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
                <Loader size={18} className="animate-spin" style={{ marginRight: '8px' }} /> Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
      )}
      {member && (
        <div>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '1.5rem' }}>Welcome, {member.username}</h1>
            <p className="text-sm text-muted">Member Portal</p>
          </div>
          <button
            className="btn btn-outline"
            onClick={handleLogout}
            style={{ color: 'var(--danger)', borderColor: 'rgba(211,47,47,0.3)', display: 'flex', gap: '6px', alignItems: 'center' }}
          >
            <LogOut size={15} /> Logout
          </button>
          {/* Issues list */}
          {myIssues.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
              <AlertTriangle size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p className="text-sm">You haven't raised any issues yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {myIssues.map(issue => (
                <div key={issue.id} className="card" style={{ borderLeft: `3px solid ${statusColor(issue.status)}` }}>
                  {/* Issue details could be rendered here */}
                </div>
              ))}
            </div>
          )}
          {/* Issue reporting form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 max-w-lg">
            <h2 className="text-xl font-semibold">Report a New Issue</h2>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Issue title" className="input input-bordered" required />
            <select name="category" value={form.category} onChange={handleChange} className="select select-bordered" required>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Issue description" className="textarea textarea-bordered" rows={4} />
            {formError && <p className="text-danger">{formError}</p>}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <Loader size={16} /> : 'Submit Issue'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
