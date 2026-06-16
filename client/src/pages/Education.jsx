import { GraduationCap, BookOpen, AlertTriangle, School, UserX } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import villageData from '../data/villageData';

const tooltipStyle = { contentStyle: { background: '#1A2332', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px', color: '#F1F5F9' } };

export default function Education() {
  const ed = villageData.education;
  const educData = Object.entries(ed.levels).map(([name, value]) => ({ name, value }));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Education</h1>
        <p>School statistics, literacy rates, and dropout risk analysis</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="stat-card">
          <div className="stat-icon amber"><GraduationCap size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Literacy Rate</div>
            <div className="stat-value">{ed.adultLiteracyRate}%</div>
            <div className="stat-desc">Adult population</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><School size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Enrollment Rate</div>
            <div className="stat-value">{ed.schoolEnrollmentRate}%</div>
            <div className="stat-desc">{ed.enrolledCount} of {ed.schoolAgePopulation} school-age</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><AlertTriangle size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Dropout Risk</div>
            <div className="stat-value">{ed.dropoutRisk.count}</div>
            <div className="stat-desc">Youth aged 15-18 not studying</div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title"><BookOpen size={22} className="icon" />Education Levels</h2>
        <div className="grid-2">
          <div className="chart-card card">
            <div className="chart-card-title">Distribution by Education Level</div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={educData} margin={{ bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} angle={-35} textAnchor="end" />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="chart-card-title">Key Education Metrics</div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-header">
                <span className="progress-bar-label">Adult Literacy</span>
                <span className="progress-bar-value">{ed.adultLiteracyRate}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill amber" style={{ width: `${ed.adultLiteracyRate}%` }} />
              </div>
            </div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-header">
                <span className="progress-bar-label">School Enrollment (6-18)</span>
                <span className="progress-bar-value">{ed.schoolEnrollmentRate}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill green" style={{ width: `${ed.schoolEnrollmentRate}%` }} />
              </div>
            </div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-header">
                <span className="progress-bar-label">Illiterate Adults</span>
                <span className="progress-bar-value">{ed.adultIlliteracyCount}</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill red" style={{ width: `${(1-ed.adultLiteracyRate/100)*100}%` }} />
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-lg)' }}>
              <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: '0.9rem' }}>Gender Gap</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                <div className="card" style={{ background: 'var(--bg-surface)', padding: 'var(--space-md)' }}>
                  <p className="text-xs text-muted">Male Illiterate</p>
                  <p className="font-bold" style={{ fontSize: '1.3rem' }}>{ed.genderGap.maleIlliterate}</p>
                </div>
                <div className="card" style={{ background: 'var(--bg-surface)', padding: 'var(--space-md)' }}>
                  <p className="text-xs text-muted">Female Illiterate</p>
                  <p className="font-bold" style={{ fontSize: '1.3rem', color: 'var(--danger)' }}>{ed.genderGap.femaleIlliterate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dropout Risk */}
      <div className="section">
        <h2 className="section-title"><UserX size={22} className="icon" />Dropout Risk — Youth (15-18) Not Studying</h2>
        <div className="card">
          <p className="text-sm text-secondary mb-lg">These {ed.dropoutRisk.count} individuals aged 15-18 are currently not enrolled in any educational institution. Targeted intervention is recommended.</p>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Education</th>
              </tr>
            </thead>
            <tbody>
              {ed.dropoutRisk.individuals.map((p, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.name}</td>
                  <td>{p.age}</td>
                  <td>
                    <span className={`badge ${p.gender === 'Female' ? 'danger' : 'info'}`}>{p.gender}</span>
                  </td>
                  <td>{p.education}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
