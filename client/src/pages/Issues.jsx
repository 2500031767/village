import { AlertTriangle, ArrowUp, BarChart3, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import villageData from '../data/villageData';

const tooltipStyle = { contentStyle: { background: '#1A2332', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px', color: '#F1F5F9' } };

const priorityColors = ['#EF4444', '#F59E0B', '#3B82F6', '#6366F1', '#14B8A6', '#22C55E', '#8B5CF6', '#EC4899'];

export default function Issues() {
  const p = villageData.problems;
  const catData = Object.entries(p.categoryCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Village Issues Dashboard</h1>
        <p>Problems reported by households, ranked by priority and frequency</p>
      </div>

      {/* Priority Ranking */}
      <div className="section">
        <h2 className="section-title"><ArrowUp size={22} className="icon" />Development Priority Ranking</h2>
        <div className="grid-4">
          {p.priorityRanking.map((issue, i) => (
            <div className="card" key={issue} style={{ textAlign: 'center', borderTop: `3px solid ${priorityColors[i]}` }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: priorityColors[i], marginBottom: '4px' }}>#{i + 1}</div>
              <h4 style={{ fontSize: '1rem' }}>{issue}</h4>
              <p className="text-xs text-muted mt-sm">{p.categoryCounts[issue]} reports</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Chart */}
      <div className="section">
        <h2 className="section-title"><BarChart3 size={22} className="icon" />Issue Categories</h2>
        <div className="grid-2">
          <div className="chart-card card">
            <div className="chart-card-title">Problems by Category</div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={catData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94A3B8', fontSize: 11 }} width={100} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" fill="#EF4444" radius={[0, 6, 6, 0]} name="Reports" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="chart-card-title">
              <MessageSquare size={18} />
              Household-Level Issue Flags
            </div>
            {Object.entries(p.householdFlags).map(([issue, count]) => (
              <div className="progress-bar-wrapper" key={issue}>
                <div className="progress-bar-header">
                  <span className="progress-bar-label" style={{ textTransform: 'capitalize' }}>{issue} Issues</span>
                  <span className="progress-bar-value">{count} HHs ({Math.round(count/villageData.overview.totalHouseholds*100)}%)</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill red" style={{ width: `${(count/villageData.overview.totalHouseholds*100)}%` }} />
                </div>
              </div>
            ))}

            <div style={{ marginTop: 'var(--space-xl)' }}>
              <h4 style={{ marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>Top Specific Problems</h4>
              {p.topProblems.slice(0, 6).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span className="text-sm text-secondary">{item.issue}</span>
                  <span className="badge danger">{item.count}×</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="section">
        <div className="card executive-summary">
          <h3 style={{ color: 'var(--danger)', marginBottom: 'var(--space-md)' }}>
            <AlertTriangle size={20} /> Actionable for NGOs & Government Officers
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            This data is aggregated from {villageData.overview.totalHouseholds} household surveys conducted on-ground.
            The top priorities — <strong>Water supply</strong>, <strong>Drainage</strong>, and <strong>Transport</strong> —
            are reported by significant portions of the population. These issues directly impact health outcomes,
            with 34 households flagging drainage problems and 32 households reporting health issues.
            This dashboard serves as an evidence base for development interventions.
          </p>
        </div>
      </div>
    </div>
  );
}
