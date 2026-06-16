import { Heart, Activity, Stethoscope, Users } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import villageData from '../data/villageData';

const COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#14B8A6', '#8B5CF6', '#22C55E', '#EC4899', '#06B6D4', '#D946EF', '#F97316'];
const tooltipStyle = { contentStyle: { background: '#1A2332', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px', color: '#F1F5F9' } };

export default function Healthcare() {
  const h = villageData.health;
  const healthData = Object.entries(h.healthProblems).map(([name, value]) => ({ name, value }));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Healthcare</h1>
        <p>Health statistics, prevalent conditions, and medical treatment data</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="stat-card">
          <div className="stat-icon red"><Heart size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Members with Health Issues</div>
            <div className="stat-value">{h.membersWithIssues}</div>
            <div className="stat-desc">of {villageData.overview.totalPopulation} total population</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><Activity size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Under Treatment</div>
            <div className="stat-value">{h.underTreatment}</div>
            <div className="stat-desc">{h.underTreatmentPercentage}% of population</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><Users size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Senior Citizens</div>
            <div className="stat-value">{villageData.demographics.seniorPopulation}</div>
            <div className="stat-desc">Age 60+ requiring care</div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title"><Stethoscope size={22} className="icon" />Health Problems Distribution</h2>
        <div className="grid-2">
          <div className="chart-card card">
            <div className="chart-card-title">Common Health Issues</div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={healthData} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94A3B8', fontSize: 11 }} width={120} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" fill="#EF4444" radius={[0, 6, 6, 0]} name="Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="chart-card-title">Health Metrics</div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-header">
                <span className="progress-bar-label">Population Under Treatment</span>
                <span className="progress-bar-value">{h.underTreatmentPercentage}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill red" style={{ width: `${h.underTreatmentPercentage}%` }} />
              </div>
            </div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-header">
                <span className="progress-bar-label">Open Defecation Risk</span>
                <span className="progress-bar-value">{villageData.housing.openDefecationRisk}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill amber" style={{ width: `${villageData.housing.openDefecationRisk}%` }} />
              </div>
            </div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-header">
                <span className="progress-bar-label">LPG (Clean Fuel)</span>
                <span className="progress-bar-value">{villageData.housing.lpgPercentage}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill green" style={{ width: `${villageData.housing.lpgPercentage}%` }} />
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-xl)' }}>
              <h4 style={{ marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>Top Health Concerns</h4>
              {healthData.slice(0, 6).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span className="text-sm text-secondary">{item.name}</span>
                  <span className="font-bold text-sm">{item.value} cases</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="card executive-summary">
          <h3 style={{ color: 'var(--danger)', marginBottom: 'var(--space-md)' }}>🏥 Healthcare Alert</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            {h.underTreatmentPercentage}% of the village population is currently undergoing medical treatment.
            Orthopedic/Joint problems ({h.healthProblems['Orthopedic/Joint']} cases), Diabetes ({h.healthProblems.Diabetes} cases),
            and Blood Pressure ({h.healthProblems['Blood Pressure']} cases) are the most prevalent conditions.
            The village needs regular health camps and better access to primary healthcare facilities.
          </p>
        </div>
      </div>
    </div>
  );
}
