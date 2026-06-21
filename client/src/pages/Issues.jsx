import { AlertTriangle, ArrowUp, BarChart3, MessageSquare, ThumbsUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import villageData from '../data/villageData';
import { issuesAPI } from '../data/api';
import { useNavigate } from 'react-router-dom';

const tooltipStyle = {
  contentStyle: { background: '#1A2332', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px', color: '#F1F5F9' }
};

const priorityColors = ['#EF4444', '#F59E0B', '#3B82F6', '#6366F1', '#14B8A6', '#22C55E', '#8B5CF6', '#EC4899'];

export default function Issues() {
  const navigate = useNavigate();
  const [issuesList, setIssuesList]   = useState([]);
  const [catTotals, setCatTotals]     = useState([]); 
  const [loading, setLoading]         = useState(true);
  
  const [upvoted, setUpvoted]         = useState(() => {
    try { return JSON.parse(localStorage.getItem('upvoted_issues') || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    issuesAPI.getAll()
      .then(data => {
        setIssuesList(data);
        const totals = {};
        data.forEach(i => {
          const cat = i.category || 'Other';
          totals[cat] = (totals[cat] || 0) + (i.reported_count || 1);
        });
        const sorted = Object.entries(totals)
          .sort((a, b) => b[1] - a[1])
          .map(([category, total]) => ({ category, total }));
        setCatTotals(sorted);
      })
      .catch(err => console.warn('Failed to load issues:', err))
      .finally(() => setLoading(false));
  }, []);

  let p = villageData.problems;
  if (issuesList.length > 0) {
    const categoryCounts = {};
    issuesList.forEach(issue => {
      const cat = issue.category || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + (issue.reported_count || 1);
    });
    const sorted = [...issuesList].sort((a, b) => (a.priority || 99) - (b.priority || 99));
    const uniqueCats = [...new Set(sorted.map(i => i.category || 'Other'))];
    p = {
      priorityRanking: uniqueCats.length ? uniqueCats : ['No Active Priorities'],
      categoryCounts,
      topProblems: sorted.map(i => ({ issue: i.title, count: i.reported_count || 1 })),
      householdFlags: villageData.problems.householdFlags
    };
  }

  const catData = Object.entries(p.categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  const handleUpvote = async (issue) => {
    if (upvoted.includes(issue.id)) return;
    try {
      const res = await issuesAPI.upvote(issue.id);
      const updated = res.updated;
      const newCatTotals = res.categoryTotals; 
      setIssuesList(prev => prev.map(i => i.id === updated.id ? updated : i).sort((a, b) => (a.priority || 99) - (b.priority || 99)));
      if (newCatTotals) setCatTotals(newCatTotals.map(r => ({ category: r.category, total: r.total })));
      const newUpvoted = [...upvoted, issue.id];
      setUpvoted(newUpvoted);
      localStorage.setItem('upvoted_issues', JSON.stringify(newUpvoted));
    } catch (err) {
      console.error('Upvote failed', err);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="text-gradient">Village Issues Dashboard</h1>
          <p>Public overview of reported village problems and domain priorities</p>
        </div>
      </div>

      <div className="animate-fadeInUp">
        <div className="section">
          <h2 className="section-title"><ArrowUp size={22} className="icon" />Domain Priority Ranking</h2>
          <p className="text-sm text-muted" style={{ marginBottom: '16px' }}>
            Ranked by total reports per category. Click "I have this too" to add your voice — priorities update automatically.
          </p>
          {loading ? (
            <p className="text-muted">Loading issues...</p>
          ) : catTotals.length === 0 ? (
            <p className="text-muted">No issues published yet.</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '12px'
            }}>
              {catTotals.map(({ category, total }, i) => {
                const topIssue = [...issuesList]
                  .filter(iss => (iss.category || 'Other') === category)
                  .sort((a, b) => (b.reported_count || 1) - (a.reported_count || 1))[0];
                const hasUpvoted = topIssue && upvoted.includes(topIssue.id);
                const color = priorityColors[i % priorityColors.length];

                return (
                  <div key={category} className="card" style={{
                    padding: '14px 12px',
                    borderTop: `3px solid ${color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    textAlign: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute', top: '-1px', left: '10px',
                      background: color, color: '#fff',
                      fontSize: '0.65rem', fontWeight: 800,
                      padding: '2px 7px', borderRadius: '0 0 6px 6px'
                    }}>
                      #{i + 1}
                    </div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '8px', color: 'var(--text-primary)' }}>
                      {category}
                    </h4>
                    <div style={{
                      fontSize: '1.8rem', fontWeight: 900, color,
                      lineHeight: 1
                    }}>
                      {total}
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>total reports</span>

                    {topIssue && (
                      <button
                        onClick={() => handleUpvote(topIssue)}
                        disabled={hasUpvoted}
                        style={{
                          marginTop: '4px',
                          display: 'flex', alignItems: 'center', gap: '4px',
                          padding: '5px 10px', borderRadius: '6px',
                          fontSize: '0.72rem', fontWeight: 600,
                          border: hasUpvoted ? `1.5px solid ${color}` : '1.5px solid var(--border)',
                          background: hasUpvoted ? `${color}20` : 'transparent',
                          color: hasUpvoted ? color : 'var(--text-muted)',
                          cursor: hasUpvoted ? 'default' : 'pointer',
                          transition: 'all 0.15s',
                          width: '100%', justifyContent: 'center'
                        }}
                        title={hasUpvoted ? 'Already reported' : 'I have this issue too'}
                      >
                        <ThumbsUp size={11} />
                        {hasUpvoted ? 'Reported ✓' : '+1 Me too'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

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
                <MessageSquare size={18} /> Household-Level Issue Flags
              </div>
              {Object.entries(p.householdFlags).map(([issue, count]) => (
                <div className="progress-bar-wrapper" key={issue}>
                  <div className="progress-bar-header">
                    <span className="progress-bar-label" style={{ textTransform: 'capitalize' }}>{issue} Issues</span>
                    <span className="progress-bar-value">
                      {count} HHs ({Math.round(count / villageData.overview.totalHouseholds * 100)}%)
                    </span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill red" style={{ width: `${(count / villageData.overview.totalHouseholds * 100)}%` }} />
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

        <div className="section">
          <div className="card executive-summary">
            <h3 style={{ color: 'var(--danger)', marginBottom: 'var(--space-md)' }}>
              <AlertTriangle size={20} /> Actionable for NGOs & Government Officers
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              This data is aggregated from {villageData.overview.totalHouseholds} household surveys.
              The top priorities are reported by significant portions of the population.
            </p>
            <div style={{ marginTop: '16px' }}>
              <button className="btn btn-primary" onClick={() => navigate('/user-dashboard')}>
                Go to User Dashboard to Report Issues
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
