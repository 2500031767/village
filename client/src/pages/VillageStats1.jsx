import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { villageStatsAPI } from '../data/api';
import { BarChart3, Plus, Edit3, Trash2, CheckCircle } from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const tooltipStyle = {
  contentStyle: { background: '#1A2332', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px', color: '#F1F5F9' }
};
const COLORS = ['#14B8A6','#6366F1','#F59E0B','#22C55E','#3B82F6','#EC4899','#EF4444','#8B5CF6'];

function toMap(rows = []) {
  const m = {};
  for (const r of rows) m[r.stat_key] = r.stat_value;
  return m;
}
function num(v) { return isNaN(Number(v)) ? 0 : Number(v); }

const COMMON_KEYS = {
  overview: ['Total Households', 'Total Population', 'Average Family Size'],
  demographics: ['Working Age (15-60)', 'Children (0-14)', 'Seniors (60+)', 'Male Population', 'Female Population', 'ST Population', 'SC Population', 'BC Population', 'OC Population'],
  age_groups: ['0-14 Years', '15-30 Years', '31-50 Years', '51+ Years'],
  social: ['ST', 'SC', 'BC', 'OC']
};

export default function VillageStats1() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState({ category: 'overview', stat_key: '', stat_value: '', sort_order: 0 });
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);



  const showFeedback = (msg, type = 'success') => {
    setFeedbackMsg({ text: msg, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await villageStatsAPI.getAll();
        // Filter for primary categories
        setData(res.filter(r => ['overview', 'demographics', 'age_groups', 'social'].includes(r.category)));
      } catch (e) {
        console.error(e);
        showFeedback('Failed to load stats.', 'danger');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setEditingId(null);
    setFormValues({ category: 'overview', stat_key: '', stat_value: '', sort_order: 0 });
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
        showFeedback('Stat added');
      } else {
        const updated = await villageStatsAPI.update(editingId, formValues);
        setData(prev => prev.map(i => (i.id === editingId ? updated : i)));
        showFeedback('Stat updated');
      }
      setShowModal(false);
    } catch (e) {
      console.error(e);
      showFeedback('Save failed.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const renderTable = () => (
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
        {data.map(item => (
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
      </tbody>
    </table>
  );

  const by = {};
  for (const row of data) {
    if (!by[row.category]) by[row.category] = [];
    by[row.category].push(row);
  }
  const demo = toMap(by['demographics']);
  const ageGroups = toMap(by['age_groups']);
  const social = toMap(by['social']);
  const occ = toMap(by['occupation']);

  const genderData = [
    { name: 'Male',   value: num(demo['Male Population']),   color: '#3B82F6' },
    { name: 'Female', value: num(demo['Female Population']), color: '#EC4899' },
  ];
  const ageData = Object.entries(ageGroups).map(([name, value]) => ({ name, value: num(value) }));

  return (
    <div className="page-container">
      <h2>Demographics & Primary Stats</h2>
      
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="chart-card card">
          <div className="chart-card-title">Gender Distribution Preview</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={genderData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label>
                {genderData.map((e,i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card card">
          <div className="chart-card-title">Age Group Preview</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ageData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
              <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#94A3B8', fontSize: 10 }} width={80} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill="#14B8A6" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {feedbackMsg && (
        <div style={{ background: feedbackMsg.type === 'danger' ? 'var(--danger)' : 'var(--success)', color: '#fff', padding: '8px', borderRadius: '4px' }}>
          <CheckCircle size={14} /> {feedbackMsg.text}
        </div>
      )}
      <div className="flex gap-sm mb-sm">
        <button className="btn btn-primary" onClick={openAddModal}><Plus size={14} /> Add Primary Stat</button>
      </div>
      {loading ? <p>Loading...</p> : renderTable()}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>{modalMode === 'add' ? 'Add' : 'Edit'} Primary Stat</h3>
            <form onSubmit={handleFormSubmit}>
              <label>Category
                <select name="category" value={formValues.category} onChange={e => setFormValues({ ...formValues, category: e.target.value })} required>
                    <option value="overview">Overview</option>
                    <option value="demographics">Demographics</option>
                    <option value="age_groups">Age Groups</option>
                    <option value="social">Social / Caste</option>
                </select>
              </label>
              <label>Key
                <input 
                  name="stat_key" 
                  value={formValues.stat_key} 
                  onChange={e => setFormValues({ ...formValues, stat_key: e.target.value })} 
                  required 
                  list="common-keys"
                  placeholder="e.g. Male Population"
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
