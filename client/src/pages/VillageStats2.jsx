import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { villageStatsAPI } from '../data/api';
import { BarChart3, Plus, Edit3, Trash2, CheckCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const tooltipStyle = {
  contentStyle: { background: '#1A2332', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px', color: '#F1F5F9' }
};

function toMap(rows = []) {
  const m = {};
  for (const r of rows) m[r.stat_key] = r.stat_value;
  return m;
}
function num(v) { return isNaN(Number(v)) ? 0 : Number(v); }

const COMMON_KEYS = {
  Infrastructure: [
    'Pucca (Concrete) Houses',
    'Semi-Pucca Houses',
    'Kutcha Houses',
    'Electricity Connected (%)',
    'Solar Panels Connected (%)',
    'Private Toilet Access (%)',
    'Tap Water Access (%)',
    'Drainage Available (%)',
    'LPG Usage (%)',
    'Vehicle Ownership (%)',
    'Internet Access (%)'
  ],
  'Secondary Stats': [
    'TV Count',
    'Fridge Count',
    'Cooler Count',
    'Washing Machine Count',
    'AC Count',
    '2-Wheelers Count',
    'Cars Count',
    'Airtel Users',
    'Jio Users',
    'VI Users'
  ],
  education: [
    'Illiterate',
    '8th Pass',
    '10th Pass',
    '12th Pass',
    'Graduate',
    'Currently Studying',
    'Adult Literacy Rate (%)',
    'School Enrollment Rate (%)',
    'Male Illiterate',
    'Female Illiterate',
    'Male Graduates',
    'Female Graduates'
  ],
  problems: [
    'Water',
    'Drainage',
    'Transport',
    'Roads',
    'Education',
    'Housing',
    'Health',
    'Agriculture',
    'Employment',
    'Other',
    'Communication',
    'Electricity'
  ]
};

export default function VillageStats2() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState({ category: 'Infrastructure', stat_key: '', stat_value: '', sort_order: 0 });
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [tableFilter, setTableFilter] = useState('all');



  const showFeedback = (msg, type = 'success') => {
    setFeedbackMsg({ text: msg, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const loadData = async () => {
    try {
      const res = await villageStatsAPI.getAll();
      setData(res.filter(r => ['education', 'problems', 'Infrastructure', 'Secondary Stats'].includes(r.category)));
    } catch (e) {
      console.error(e);
      showFeedback('Failed to load stats.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setEditingId(null);
    setFormValues({ category: 'Infrastructure', stat_key: '', stat_value: '', sort_order: 0 });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setEditingId(item.id);
    setFormValues({ ...item });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this stat?')) return;
    try {
      await villageStatsAPI.delete(id);
      setData(prev => prev.filter(i => i.id !== id));
      showFeedback('Deleted');
    } catch (e) {
      console.error(e);
      showFeedback('Delete failed.', 'danger');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (modalMode === 'add') {
        const newItem = await villageStatsAPI.upsert(formValues);
        setData(prev => {
          const exists = prev.find(i => i.id === newItem.id);
          return exists ? prev.map(i => i.id === newItem.id ? newItem : i) : [newItem, ...prev];
        });
        showFeedback('Stat saved successfully');
      } else {
        const updated = await villageStatsAPI.update(editingId, formValues);
        setData(prev => prev.map(i => (i.id === editingId ? updated : i)));
        showFeedback('Stat updated successfully');
      }
      setShowModal(false);
    } catch (e) {
      console.error(e);
      showFeedback('Save failed.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const renderTable = () => {
    const tableData = data.filter(item => {
      if (tableFilter === 'all') return true;
      return item.category === tableFilter;
    });

    return (
      <table className="data-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Key</th>
            <th>Value</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map(item => (
            <tr key={item.id}>
              <td>{item.category}</td>
              <td>{item.stat_key}</td>
              <td>{item.stat_value}</td>
              <td>{item.sort_order}</td>
              <td>
                <button className="btn btn-outline" onClick={() => openEditModal(item)}><Edit3 size={14} /></button>
                <button className="btn btn-outline" onClick={() => handleDelete(item.id)}><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
          {tableData.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                No stats found. Click "Add Village Stat" to create one.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  const by = {};
  for (const row of data) {
    if (!by[row.category]) by[row.category] = [];
    by[row.category].push(row);
  }
  const educ = toMap(by['education']);
  const problems = toMap(by['problems']);

  const educExclude = ['Adult Literacy Rate (%)','School Enrollment Rate (%)','Adult Illiteracy Count',
    'School Age Population (6-18)','Enrolled Count','Male Illiterate','Female Illiterate',
    'Male Graduates','Female Graduates','Dropout Risk (15-18)'];
  const educData = Object.entries(educ)
    .filter(([k]) => !educExclude.includes(k))
    .map(([name, value]) => ({ name, value: num(value) }));

  const problemData = Object.entries(problems)
    .map(([name, value]) => ({ name, value: num(value) }))
    .sort((a,b) => b.value - a.value);

  return (
    <div className="page-container">
      <h2>Infrastructure & Secondary Stats</h2>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="chart-card card">
          <div className="chart-card-title">Education Levels Preview</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={educData} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
              <XAxis dataKey="name" tick={{ fill:'#94A3B8', fontSize:10 }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fill:'#94A3B8', fontSize:12 }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill="#6366F1" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card card">
          <div className="chart-card-title">Village Problems Preview</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={problemData} margin={{ bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
              <XAxis dataKey="name" tick={{ fill:'#94A3B8', fontSize:10 }} />
              <YAxis tick={{ fill:'#94A3B8', fontSize:10 }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill="#EF4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {feedbackMsg && (
        <div style={{ background: feedbackMsg.type === 'danger' ? 'var(--danger)' : 'var(--success)', color: '#fff', padding: '8px', borderRadius: '4px' }}>
          <CheckCircle size={14} /> {feedbackMsg.text}
        </div>
      )}
      <div className="flex gap-sm mb-sm" style={{ flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="btn btn-primary" onClick={openAddModal}><Plus size={14} /> Add Village Stat</button>
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'Infrastructure', label: 'Infrastructure' },
            { id: 'Secondary Stats', label: 'Secondary Stats' },
            { id: 'education', label: 'Education' },
            { id: 'problems', label: 'Problems' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setTableFilter(cat.id)}
              className="btn btn-xs"
              style={{
                background: tableFilter === cat.id ? 'var(--primary)' : 'transparent',
                color: tableFilter === cat.id ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: tableFilter === cat.id ? '600' : 'normal',
                transition: 'all var(--transition-fast)'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      {loading ? <p>Loading...</p> : renderTable()}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>{modalMode === 'add' ? 'Add New' : 'Edit'} Village Stat</h3>
            <form onSubmit={handleFormSubmit}>
              <label>Category
                <select name="category" value={formValues.category} onChange={e => setFormValues({ ...formValues, category: e.target.value })} required>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Secondary Stats">Secondary Stats</option>
                    <option value="education">Education</option>
                    <option value="problems">Village Problems</option>
                </select>
              </label>
              <label>Key
                <input 
                  name="stat_key" 
                  value={formValues.stat_key} 
                  onChange={e => setFormValues({ ...formValues, stat_key: e.target.value })} 
                  required 
                  list="common-keys"
                  placeholder="e.g. Electricity Connected (%)"
                />
                <datalist id="common-keys">
                  {(COMMON_KEYS[formValues.category] || []).map(k => (
                    <option key={k} value={k} />
                  ))}
                </datalist>
              </label>
              <label>Value
                <input name="stat_value" value={formValues.stat_value} onChange={e => setFormValues({ ...formValues, stat_value: e.target.value })} required />
              </label>
              <label>Order
                <input type="number" name="sort_order" value={formValues.sort_order} onChange={e => setFormValues({ ...formValues, sort_order: Number(e.target.value) })} />
              </label>
              <div className="flex gap-sm mt-sm">
                <button type="button" onClick={() => setShowModal(false)} disabled={actionLoading}>Cancel</button>
                <button type="submit" disabled={actionLoading}>{actionLoading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
