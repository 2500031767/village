import { Sparkles, AlertTriangle, TrendingUp, Brain, Lightbulb, BarChart3 } from 'lucide-react';
import villageData from '../data/villageData';

const insights = [
  { text: '59.2% of households are Below Poverty Line (BPL)', severity: 'danger', icon: '💰', metric: '59.2%' },
  { text: '55.9% adults are illiterate — far above national average of 22.8%', severity: 'danger', icon: '📚', metric: '55.9%' },
  { text: '59.2% households lack proper drainage system', severity: 'danger', icon: '🚰', metric: '59.2%' },
  { text: '32.4% of population have no bank account', severity: 'warning', icon: '🏦', metric: '32.4%' },
  { text: '0% solar panel adoption — entire village has zero solar energy', severity: 'warning', icon: '☀️', metric: '0%' },
  { text: '21.4% of population currently under medical treatment', severity: 'warning', icon: '🏥', metric: '21.4%' },
  { text: '17.3% open defecation risk — 15 households without private toilets', severity: 'warning', icon: '🚻', metric: '17.3%' },
  { text: '15 farming households eligible but NOT receiving PM-KISAN benefits', severity: 'info', icon: '🌾', metric: '15 HHs' },
  { text: '20 of 22 senior citizens are without pension coverage', severity: 'danger', icon: '👴', metric: '91%' },
  { text: '9 youth aged 15-18 identified as school dropout risk', severity: 'warning', icon: '🎓', metric: '9 youth' },
  { text: 'Female illiteracy (93) significantly higher than male (70)', severity: 'info', icon: '👩', metric: '93 vs 70' },
  { text: 'Only 16% MNREGA job card coverage despite 48% agriculture dependency', severity: 'info', icon: '📋', metric: '16%' },
  { text: 'Cotton monoculture risk — 41 households depend on single cash crop', severity: 'warning', icon: '🧶', metric: '41 HHs' },
  { text: 'Gini coefficient 0.393 indicates significant income inequality', severity: 'info', icon: '📊', metric: '0.393' },
  { text: '103 individuals can be onboarded under Jan Dhan financial inclusion', severity: 'info', icon: '💳', metric: '103' },
];

const recommendations = [
  { title: 'Urgent: Drainage Infrastructure', desc: 'Install proper drainage in 58 households lacking it. Partner with MNREGA for labor and Swachh Bharat Mission for funding.', priority: 'Critical' },
  { title: 'Adult Literacy Program', desc: 'Launch evening literacy classes targeting 127 illiterate adults, with focus on 93 illiterate women.', priority: 'High' },
  { title: 'PM-KISAN Enrollment Drive', desc: 'Identify and enroll 15 eligible farming households not receiving PM-KISAN benefits.', priority: 'High' },
  { title: 'Senior Citizen Pension', desc: 'Apply for pension schemes for 20 uncovered seniors out of 22 total.', priority: 'High' },
  { title: 'Solar Energy Initiative', desc: 'Leverage PM-KUSUM scheme for 100% solar panel adoption potential (currently 0%).', priority: 'Medium' },
  { title: 'Financial Inclusion', desc: 'Open Jan Dhan accounts for 103 unbanked individuals. Organize banking camp in village.', priority: 'Medium' },
  { title: 'Dropout Prevention', desc: 'Intervene for 9 at-risk youth through scholarships, counseling, and local school improvement.', priority: 'Medium' },
  { title: 'Crop Diversification', desc: 'Reduce cotton monoculture risk by promoting mixed cropping and organic farming.', priority: 'Low' },
];

export default function AIInsights() {
  const scores = villageData.swotAnalysis.scores;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">AI Insights Dashboard</h1>
        <p>Auto-generated analytics and actionable insights from {villageData.overview.totalHouseholds} household surveys</p>
      </div>

      {/* Overall Score */}
      <div className="section">
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.1), rgba(99,102,241,0.05))', border: '1px solid rgba(13,148,136,0.25)', textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <Brain size={48} style={{ color: 'var(--primary-light)', marginBottom: 'var(--space-md)' }} />
          <h2>Village Development Score</h2>
          <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary-light)', lineHeight: 1.1, margin: 'var(--space-md) 0' }}>
            {scores.overall}<span style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>/100</span>
          </div>
          <p className="text-secondary" style={{ maxWidth: 600, margin: '0 auto' }}>
            Based on weighted analysis of education ({scores.education}), infrastructure ({scores.infrastructure}),
            agriculture ({scores.agriculture}), health ({scores.health}), water ({scores.waterAccess}),
            and financial inclusion ({scores.financialInclusion}).
          </p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="section">
        <h2 className="section-title"><Sparkles size={22} className="icon" />Key Insights</h2>
        <div className="grid-3">
          {insights.map((insight, i) => (
            <div className={`card`} key={i} style={{
              borderLeft: `4px solid ${insight.severity === 'danger' ? 'var(--danger)' : insight.severity === 'warning' ? 'var(--warning)' : 'var(--info)'}`,
              display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start'
            }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{insight.icon}</span>
              <div>
                <div className="font-bold" style={{ color: insight.severity === 'danger' ? 'var(--danger)' : insight.severity === 'warning' ? 'var(--warning)' : 'var(--info)', fontSize: '1.1rem', marginBottom: '4px' }}>
                  {insight.metric}
                </div>
                <p className="text-sm text-secondary" style={{ lineHeight: 1.5 }}>{insight.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="section">
        <h2 className="section-title"><Lightbulb size={22} className="icon" />Recommended Actions</h2>
        <div className="flex-col gap-md">
          {recommendations.map((rec, i) => (
            <div className="card flex" key={i} style={{ gap: 'var(--space-lg)', alignItems: 'center' }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: 'var(--radius-md)',
                background: rec.priority === 'Critical' ? 'var(--danger-bg)' : rec.priority === 'High' ? 'var(--warning-bg)' : rec.priority === 'Medium' ? 'var(--info-bg)' : 'var(--success-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', fontWeight: 900, flexShrink: 0,
                color: rec.priority === 'Critical' ? 'var(--danger)' : rec.priority === 'High' ? 'var(--warning)' : rec.priority === 'Medium' ? 'var(--info)' : 'var(--success)'
              }}>
                #{i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex-between">
                  <h4 style={{ fontSize: '0.95rem' }}>{rec.title}</h4>
                  <span className={`badge ${rec.priority === 'Critical' ? 'danger' : rec.priority === 'High' ? 'warning' : rec.priority === 'Medium' ? 'info' : 'success'}`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-secondary mt-sm" style={{ lineHeight: 1.6 }}>{rec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
