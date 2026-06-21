import { AlertTriangle, Plus, Send, CheckCircle, X, LogIn, Clock, FileText, CheckCircle2, User, BarChart3, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { issuesAPI, memberAPI, otpAuthAPI } from '../data/api';

const CATEGORIES = [
  'Water', 'Drainage', 'Roads', 'Transport', 'Education',
  'Healthcare', 'Housing', 'Agriculture', 'Electricity',
  'Employment', 'Sanitation', 'Other'
];

export default function UserDashboard() {
  const [member, setMember] = useState(null);

  const [myIssues, setMyIssues] = useState([]);
  // Email/password login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');

  // Issue reporting form state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const handleUserLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail || !loginPwd) { setLoginError('Email and password are required'); return; }
    setLoading(true);
    // Validate credentials from admin settings (stored in localStorage)
const storedCred = JSON.parse(localStorage.getItem('adminUserLogin') || '{"email":"bmsr@gmail.com","password":"732306"}');
if (loginEmail === storedCred.email && loginPwd === storedCred.password) {
  const memberData = { name: 'BMSR', email: loginEmail, password: loginPwd };
  memberAPI.saveMember(memberData);
  setMember(memberData);
} else {
  setLoginError('Invalid credentials');
}
    // Old hardcoded credential check removed
    setLoading(false);
  };
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    title: '', category: '', description: ''
  });



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
      setFormError('Title and category are required.');
      return;
    }
    setSubmitting(true);
    try {
      await issuesAPI.report({
        ...form,
        reporter_name: member.name,
        reporter_phone: member.phone
      });
      setSubmitted(true);
      setForm({ title: '', category: '', description: '' });
      fetchMyIssues();
      setTimeout(() => { setSubmitted(false); setActiveTab('my_issues'); }, 3000);
    } catch (err) {
      setFormError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved': return <span className="badge success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} /> Resolved</span>;
      case 'open': return <span className="badge warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={12} /> Open</span>;
      default: return <span className="badge info" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Pending</span>;
    }
  };

  if (!member) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="text-gradient">User Dashboard</h1>
          <p>Login to access your personalized village portal</p>
        </div>
        <div className="card animate-fadeInUp" style={{ maxWidth: '400px', margin: '40px auto', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <LogIn size={24} />
          </div>
          <h3 style={{ marginBottom: '8px' }}>Member Login</h3>
          <p className="text-sm text-muted" style={{ marginBottom: '24px' }}>Enter your email and password to continue.</p>
          <form onSubmit={handleUserLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Email</label>
              <input name="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="bmsr@gmail.com" required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Password</label>
              <input type="password" name="password" value={loginPwd} onChange={e => setLoginPwd(e.target.value)} placeholder="********" required />
            </div>
            {loginError && (<p style={{ color: 'var(--danger)', fontSize: '0.8rem', margin: 0 }}>{loginError}</p>)}
            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="text-gradient">User Dashboard</h1>
          <p>Welcome back, {member.name}!</p>
        </div>
        <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'var(--space-xl)' }} className="grid-layout-admin">
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--bg-card)', padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', height: 'fit-content' }}>
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'my_issues', label: 'My Issues', icon: FileText },
            { id: 'report_issue', label: 'Report Issue', icon: Plus },
            { id: 'profile', label: 'My Profile', icon: User },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#fff' : 'var(--text-secondary)', background: isActive ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : 'transparent', textAlign: 'left', transition: 'all var(--transition-fast)' }}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ background: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', minHeight: '400px' }}>
          {activeTab === 'overview' && (
            <div className="animate-fadeIn">
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)' }}>Dashboard Overview</h2>
              <div className="grid-2">
                <div className="card" style={{ background: 'var(--bg-surface)' }}>
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Reported Issues</h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '8px' }}>{myIssues.length}</div>
                </div>
                <div className="card" style={{ background: 'var(--bg-surface)' }}>
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Pending Issues</h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--warning)', marginTop: '8px' }}>
                    {myIssues.filter(i => i.status === 'pending' || i.status === 'open').length}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-xl)', padding: '16px', background: 'rgba(99,102,241,0.05)', border: '1px solid var(--primary-light)', borderRadius: '8px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '8px' }}><AlertTriangle size={16} /> Need help?</h4>
                <p className="text-sm text-secondary">You can report community issues such as broken pipes, damaged roads, or sanitation problems directly from the "Report Issue" tab. Admin will review and approve them to appear on the public dashboard.</p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="animate-fadeIn">
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)' }}>My Profile</h2>
              <div className="card" style={{ maxWidth: '400px', background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={30} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{member.name}</h3>
                    <p className="text-sm text-muted">Village Resident</p>
                  </div>
                </div>
                <hr style={{ borderTop: '1px solid var(--border)', margin: '16px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-sm text-muted">Password</span>
                  <span className="text-sm font-bold">{member.password}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'my_issues' && (
            <div className="animate-fadeIn">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>My Reported Issues</h2>
                <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('report_issue')} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                  <Plus size={14} /> New Issue
                </button>
              </div>

              {myIssues.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  <FileText size={48} style={{ opacity: 0.2, marginBottom: '16px', margin: '0 auto' }} />
                  <p>You haven't reported any issues yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {myIssues.map(issue => (
                    <div key={issue.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderLeft: `4px solid ${issue.status === 'resolved' ? 'var(--success)' : issue.status === 'open' ? 'var(--warning)' : 'var(--info)'}` }}>
                      <div>
                        <h4 style={{ marginBottom: '4px', fontSize: '1.05rem' }}>{issue.title}</h4>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>{issue.category}</span>
                          <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div>
                        {getStatusBadge(issue.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'report_issue' && (
            <div className="animate-fadeIn">
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)' }}>Report a New Issue</h2>

              {submitted ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(34,197,94,0.1)', borderRadius: '8px', color: 'var(--success)' }}>
                  <CheckCircle size={24} />
                  <div>
                    <strong>Issue submitted successfully!</strong>
                    <p className="text-sm" style={{ marginTop: '2px', opacity: 0.8 }}>It is now pending review by the village admin.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
                  <div className="flex-col gap-sm">
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Issue Title <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. No drinking water supply for 3 days"
                      required
                    />
                  </div>
                  <div className="flex-col gap-sm">
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <select name="category" value={form.category} onChange={handleChange} required>
                      <option value="">-- Select Category --</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex-col gap-sm">
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Describe the issue in detail..."
                    />
                  </div>

                  {formError && (
                    <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{formError}</p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      <Send size={15} style={{ marginRight: '8px' }} />
                      {submitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
