import { useEffect, useState } from 'react';
import { TrendingUp, Shield, Sparkles, Award, BarChart3, Star, RefreshCw } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Cell
} from 'recharts';
import { villageStatsAPI, ratingsAPI } from '../data/api';

const tooltipStyle = {
  contentStyle: { background: '#1A2332', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px', color: '#F1F5F9' }
};

const scoreColors = {
  'Overall Score':       '#14B8A6',
  'Agriculture':         '#22C55E',
  'Infrastructure':      '#3B82F6',
  'Water Access':        '#06B6D4',
  'Health':              '#EF4444',
  'Financial Inclusion': '#F59E0B',
  'Education':           '#8B5CF6',
};

function getRatingLabel(score) {
  const s = Number(score);
  if (s >= 90) return { label: 'Excellent',  color: '#22C55E', stars: 5 };
  if (s >= 75) return { label: 'Good',        color: '#14B8A6', stars: 4 };
  if (s >= 60) return { label: 'Moderate',    color: '#F59E0B', stars: 3 };
  if (s >= 40) return { label: 'Fair',        color: '#F97316', stars: 2 };
  return          { label: 'Needs Work',  color: '#EF4444', stars: 1 };
}

function Stars({ count }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={14}
          fill={i <= count ? '#F59E0B' : 'none'}
          stroke={i <= count ? '#F59E0B' : '#475569'}
          style={{ display: 'inline' }}
        />
      ))}
    </span>
  );
}

export default function VillageHighlights() {
  const [scores, setScores]     = useState({});
  const [updatedAt, setUpdatedAt] = useState(null);
  const [viewerRating, setViewerRating] = useState({ average: 0, total: 0 });
  const [loading, setLoading]   = useState(true);

  const fetchScores = () => {
    setLoading(true);
    Promise.all([
      villageStatsAPI.getAll(),
      ratingsAPI.getAll().catch(() => ({ average: 0, total: 0 }))
    ]).then(([rows, ratingsData]) => {
        const scoreRows = rows.filter(r => r.category === 'scores');
        const map = {};
        let latest = null;
        scoreRows.forEach(r => {
          map[r.stat_key] = r.stat_value;
          if (!latest || r.updated_at > latest) latest = r.updated_at;
        });
        setScores(map);
        setUpdatedAt(latest);
        setViewerRating({ average: ratingsData.average || 0, total: ratingsData.total || 0 });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchScores(); }, []);

  const overall = Number(scores['Overall Score'] || 0);
  const { label: overallLabel, color: overallColor, stars: overallStars } = getRatingLabel(overall);

  // Build chart data — exclude Overall for the individual bar chart
  const scoreEntries = Object.entries(scores).filter(([k]) => k !== 'Overall Score');
  const barData = scoreEntries.map(([name, value]) => ({
    name, value: Number(value), color: scoreColors[name] || '#94A3B8'
  }));

  // Radar data
  const radarData = scoreEntries.map(([name, value]) => ({
    subject: name.replace(' Access', '').replace(' Inclusion', ''),
    value: Number(value), fullMark: 100
  }));

  const modules = [
    { code: 'HH', name: 'Health & Hygiene',               maxPoints: 27 },
    { code: 'VI', name: 'Village Infrastructure',          maxPoints: 30 },
    { code: 'WC', name: 'Water Conservation',              maxPoints: 9  },
    { code: 'EA', name: 'Energy Availability & Efficiency',maxPoints: 16 },
    { code: 'MR', name: 'Materials & Resources',           maxPoints: 5  },
    { code: 'SC', name: 'Social & Community Actions',      maxPoints: 8  },
    { code: 'GI', name: 'Green Innovation',                maxPoints: 5  },
  ];

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="text-gradient">Village Highlights</h1>
          <p>SVR Smart Village Rating — live scores updated by the admin team</p>
          {updatedAt && (
            <p className="text-xs text-muted" style={{ marginTop: '4px' }}>
              Last updated: {new Date(updatedAt).toLocaleString()}
            </p>
          )}
        </div>
        <button className="btn btn-outline" onClick={fetchScores} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>Loading scores...</div>
      ) : (
        <>
          {/* ── Overall Score & Viewer Rating Hero ── */}
          <div className="section grid-2">
            <div className="card" style={{
              background: `linear-gradient(135deg, ${overallColor}18, ${overallColor}06)`,
              border: `1px solid ${overallColor}40`,
              textAlign: 'center', padding: 'var(--space-2xl)'
            }}>
              <Award size={48} style={{ color: overallColor, marginBottom: '12px' }} />
              <h2 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                SVR Green Village Rating — Overall Score
              </h2>
              <div style={{ fontSize: '5rem', fontWeight: 900, color: overallColor, lineHeight: 1 }}>
                {overall}
                <span style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>/100</span>
              </div>
              <div style={{ margin: '12px 0 6px', display: 'flex', justifyContent: 'center', gap: '4px' }}>
                <Stars count={overallStars} />
              </div>
              <span style={{
                display: 'inline-block', padding: '4px 20px', borderRadius: '20px',
                background: `${overallColor}25`, color: overallColor,
                fontWeight: 700, fontSize: '1rem', marginTop: '4px'
              }}>
                {overallLabel}
              </span>
              <p className="text-sm text-muted" style={{ marginTop: '16px' }}>
                Assessed by the Admin under SVR framework
              </p>
            </div>

            <div className="card" style={{
              background: `linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.02))`,
              border: `1px solid rgba(245, 158, 11, 0.25)`,
              textAlign: 'center', padding: 'var(--space-2xl)'
            }}>
              <Star size={48} style={{ color: '#F59E0B', marginBottom: '12px' }} />
              <h2 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Community Viewer Rating
              </h2>
              <div style={{ fontSize: '5rem', fontWeight: 900, color: '#F59E0B', lineHeight: 1 }}>
                {Number(viewerRating.average).toFixed(1)}
                <span style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>/5.0</span>
              </div>
              <div style={{ margin: '12px 0 6px', display: 'flex', justifyContent: 'center', gap: '4px' }}>
                <Stars count={Math.round(viewerRating.average)} />
              </div>
              <span style={{
                display: 'inline-block', padding: '4px 20px', borderRadius: '20px',
                background: `rgba(245, 158, 11, 0.15)`, color: '#D97706',
                fontWeight: 700, fontSize: '1rem', marginTop: '4px'
              }}>
                Community Voice
              </span>
              <p className="text-sm text-muted" style={{ marginTop: '16px' }}>
                Based on {viewerRating.total} public ratings submitted via Home Page
              </p>
            </div>
          </div>

          {/* ── Individual Score Cards ── */}
          <div className="section">
            <h2 className="section-title"><BarChart3 size={22} className="icon" />Category Scores</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '12px' }}>
              {barData.map(({ name, value, color }) => {
                const { label, stars } = getRatingLabel(value);
                return (
                  <div key={name} className="card" style={{
                    textAlign: 'center', padding: '20px 12px',
                    borderTop: `3px solid ${color}`
                  }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>{name}</p>
                    <div style={{ fontSize: '2.4rem', fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px' }}>/100</div>

                    {/* Mini progress bar */}
                    <div style={{ height: '6px', background: 'var(--bg-surface)', borderRadius: '4px', overflow: 'hidden', margin: '8px 0' }}>
                      <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '4px', transition: 'width 0.8s ease' }} />
                    </div>

                    <Stars count={stars} />
                    <p style={{ fontSize: '0.7rem', color, fontWeight: 700, marginTop: '4px' }}>{label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Charts ── */}
          <div className="section">
            <h2 className="section-title"><TrendingUp size={22} className="icon" />Score Analysis</h2>
            <div className="grid-2">

              {/* Bar chart */}
              <div className="chart-card card">
                <div className="chart-card-title">Score Comparison</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData} margin={{ bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                    <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 9 }} angle={-30} textAnchor="end" interval={0} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {barData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radar chart */}
              <div className="chart-card card">
                <div className="chart-card-title">Radar — Development Coverage</div>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(148,163,184,0.15)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 9 }} />
                    <Radar name="Score" dataKey="value" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.25} />
                    <Tooltip {...tooltipStyle} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── SVR Modules Breakdown ── */}
          <div className="section">
            <h2 className="section-title"><Shield size={22} className="icon" />SVR Rating Modules</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {modules.map(m => (
                <div key={m.code} className="card" style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    background: 'var(--primary-glow)', color: 'var(--primary-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.85rem', flexShrink: 0
                  }}>{m.code}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '2px' }}>{m.name}</p>
                    <p className="text-xs text-muted">Max: {m.maxPoints} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── What These Scores Mean ── */}
          <div className="section">
            <div className="card executive-summary">
              <h3 style={{ color: 'var(--primary-light)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} /> About the SVR Rating
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                The <strong>Smart Village Revolution (SVR) Green Village Rating System</strong> by KL Education Foundation
                evaluates villages across 7 modules covering health, infrastructure, water, energy, materials,
                social actions, and green innovation. Scores are updated by the admin team based on new survey data
                and development milestones. A higher score reflects better living conditions and development progress
                for Seetharampuram Thanda.
              </p>
              <div className="exec-tags" style={{ marginTop: '16px' }}>
                <span className="badge primary">KLEF • KL University</span>
                <span className="badge info">Unnat Bharat Abhiyan</span>
                <span className="badge warning">SVR Green Rating</span>
                <span className="badge success">98 HH Surveyed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
