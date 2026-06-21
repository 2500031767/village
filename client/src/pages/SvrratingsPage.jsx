import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { villageStatsAPI, authAPI } from '../data/api';
import { LogOut, Users, Star, Plus, Edit3, Trash2, CheckCircle, Loader } from 'lucide-react';

export default function SvrratingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // add or edit
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // auth check
  useEffect(() => {
    const check = async () => {
      if (!authAPI.isAuthenticated()) {
        navigate('/login');
        return;
      }
      try {
        const u = await authAPI.verifyToken();
        setUser(u);
        setLoading(false);
      } catch {
        navigate('/login');
      }
    };
    check();
  }, [navigate]);

  // fetch ratings (category = 'scores')
  useEffect(() => {
    if (loading) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await villageStatsAPI.getAll();
        const filtered = res.filter(s => s.category === 'scores');
        setStats(filtered);
      } catch (e) {
        showFeedback(e?.message || 'Error loading stats', 'danger');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [loading]);

  const isAdmin = () => {
    const admin = JSON.parse(localStorage.getItem('adminUserLogin') || '{}');
    return !!admin.email && !!admin.password;
  };

  const showFeedback = (msg, type = 'success') => {
    setFeedbackMsg({ text: msg, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const openAddModal = () => {
    if (!isAdmin()) { showFeedback('Only admin can add.', 'danger'); return; }
    setModalMode('add');
    setEditingId(null);
    setFormValues({ category: 'scores', stat_key: '', stat_value: '', sort_order: 0 });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    if (!isAdmin()) { showFeedback('Only admin can edit.', 'danger'); return; }
    setModalMode('edit');
    setEditingId(item.id);
    setFormValues({ ...item });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (modalMode === 'add') {
        const newItem = await villageStatsAPI.upsert(formValues);
        setStats(prev => [newItem, ...prev]);
        showFeedback('Rating added');
      } else {
        const updated = await villageStatsAPI.update(editingId, formValues);
        setStats(prev => prev.map(it => it.id === editingId ? updated : it));
        showFeedback('Rating updated');
      }
      setShowModal(false);
    } catch (e) {
      showFeedback(e?.message || 'Operation failed', 'danger');
    } finally { setActionLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!isAdmin()) { showFeedback('Only admin can delete.', 'danger'); return; }
    if (!window.confirm('Delete this rating?')) return;
    try {
      await villageStatsAPI.delete(id);
      setStats(prev => prev.filter(it => it.id !== id));
      showFeedback('Deleted');
    } catch (e) { showFeedback(e?.message || 'Delete failed', 'danger'); }
  };

  if (loading && !user) return (
    <div className="flex-center" style={{ minHeight: '80vh' }}><Loader size={36} className="animate-spin" /></div>
  );

  return (
    <div className="page-container">
      <div className="flex-between mb-lg" style={{ alignItems: 'center' }}>
        <h3>SVR Ratings</h3>
        <button className="btn btn-primary btn-sm" onClick={openAddModal}><Plus size={16} /> Add New</button>
      </div>
      {feedbackMsg && (
        <div style={{ background: feedbackMsg.type === 'danger' ? 'var(--danger)' : 'var(--success)', color: '#fff', padding: '8px', borderRadius: '4px' }}>{feedbackMsg.text}</div>
      )}
      <table className="data-table" style={{ width: '100%' }}>
        <thead>
          <tr><th>Category</th><th>Stat Name</th><th>Value</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {stats.map(item => (
            <tr key={item.id}>
              <td>{item.category}</td>
              <td className="font-bold">{item.stat_key}</td>
              <td>{item.stat_value}</td>
              <td>
                <button onClick={() => openEditModal(item)} style={{ marginRight: '4px' }}><Edit3 size={14} /></button>
                {isAdmin() && (<button onClick={() => handleDelete(item.id)} style={{ color: 'var(--danger)' }}><Trash2 size={14} /></button>)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '8px', width: '400px' }}>
            <h4>{modalMode === 'add' ? 'Add' : 'Edit'} Rating</h4>
            <form onSubmit={handleFormSubmit} className="flex-col" style={{ gap: '8px' }}>
              <label>Stat Name</label>
              <input name="stat_key" value={formValues.stat_key || ''} onChange={handleInputChange} required />
              <label>Value</label>
              <input name="stat_value" value={formValues.stat_value || ''} onChange={handleInputChange} required />
              <div className="flex" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} disabled={actionLoading}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={actionLoading}>{actionLoading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
