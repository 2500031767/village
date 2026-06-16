import { Users, UserCheck, Baby, UserX, Briefcase, GraduationCap, BarChart3 } from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import villageData from '../data/villageData';

const COLORS = ['#14B8A6', '#6366F1', '#F59E0B', '#EF4444', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899'];

const tooltipStyle = {
  contentStyle: { background: '#1A2332', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px', color: '#F1F5F9' }
};

export default function Census() {
  const d = villageData;

  const genderData = [
    { name: 'Male', value: d.demographics.genderDistribution.Male, color: '#3B82F6' },
    { name: 'Female', value: d.demographics.genderDistribution.Female, color: '#EC4899' },
  ];

  const ageData = Object.entries(d.demographics.ageGroups).map(([name, value]) => ({ name: name.split(' ')[0], fullName: name, value }));

  const educData = Object.entries(d.education.levels).map(([name, value]) => ({ name, value }));

  const occData = Object.entries(d.occupation.distribution)
    .filter(([k]) => k !== 'Unknown')
    .map(([name, value]) => ({ name, value }));

  const casteData = Object.entries(d.demographics.casteDistribution).map(([name, value], i) => ({ name, value, color: COLORS[i] }));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Household Census Dashboard</h1>
        <p>Population demographics, education, occupations & social categories from {d.overview.totalHouseholds} surveyed households</p>
      </div>

      {/* Quick Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="stat-card">
          <div className="stat-icon teal"><Users size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Total Population</div>
            <div className="stat-value">{d.overview.totalPopulation}</div>
            <div className="stat-desc">Avg family: {d.overview.averageFamilySize}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon indigo"><UserCheck size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Working Age</div>
            <div className="stat-value">{d.demographics.workingAgePopulation}</div>
            <div className="stat-desc">Age 19-60</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><Baby size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Children</div>
            <div className="stat-value">{d.demographics.childPopulation}</div>
            <div className="stat-desc">Age 0-14</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><UserX size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Seniors</div>
            <div className="stat-value">{d.demographics.seniorPopulation}</div>
            <div className="stat-desc">Age 60+</div>
          </div>
        </div>
      </div>

      {/* Gender & Age */}
      <div className="section">
        <h2 className="section-title"><BarChart3 size={22} className="icon" />Population Analysis</h2>
        <div className="grid-2">
          <div className="chart-card card">
            <div className="chart-card-title">Gender Distribution</div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {genderData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-muted mt-sm">Gender Ratio: {d.demographics.genderRatio}</p>
          </div>

          <div className="chart-card card">
            <div className="chart-card-title">Age Group Distribution</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94A3B8', fontSize: 11 }} width={50} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" fill="#14B8A6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="section">
        <h2 className="section-title"><GraduationCap size={22} className="icon" />Education Breakdown</h2>
        <div className="grid-2">
          <div className="chart-card card">
            <div className="chart-card-title">Education Levels</div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={educData} margin={{ bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} angle={-30} textAnchor="end" />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="chart-card-title">Education Insights</div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-header">
                <span className="progress-bar-label">Adult Literacy Rate</span>
                <span className="progress-bar-value">{d.education.adultLiteracyRate}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill amber" style={{ width: `${d.education.adultLiteracyRate}%` }} />
              </div>
            </div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-header">
                <span className="progress-bar-label">School Enrollment</span>
                <span className="progress-bar-value">{d.education.schoolEnrollmentRate}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill green" style={{ width: `${d.education.schoolEnrollmentRate}%` }} />
              </div>
            </div>

            <h4 style={{ margin: 'var(--space-lg) 0 var(--space-md)', fontSize: '0.9rem' }}>Gender Education Gap</h4>
            <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
              <div>
                <p className="text-sm text-muted">Male Illiterate</p>
                <p className="font-bold" style={{ fontSize: '1.5rem' }}>{d.education.genderGap.maleIlliterate}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Female Illiterate</p>
                <p className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--danger)' }}>{d.education.genderGap.femaleIlliterate}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Male Graduates</p>
                <p className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--success)' }}>{d.education.genderGap.maleGraduates}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Female Graduates</p>
                <p className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--warning)' }}>{d.education.genderGap.femaleGraduates}</p>
              </div>
            </div>
            <p className="text-xs text-muted mt-md" style={{ fontStyle: 'italic' }}>{d.education.genderGap.note}</p>
          </div>
        </div>
      </div>

      {/* Occupation & Social Categories */}
      <div className="section">
        <h2 className="section-title"><Briefcase size={22} className="icon" />Occupations</h2>
        <div className="grid-2">
          <div className="chart-card card">
            <div className="chart-card-title">Occupation Distribution</div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={occData} cx="50%" cy="50%" outerRadius={100} paddingAngle={2} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {occData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card card">
            <div className="chart-card-title">Social Categories</div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={casteData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name}: ${(percent*100).toFixed(1)}%`}>
                  {casteData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-sm mt-sm" style={{ color: 'var(--primary-light)' }}>
              ST Dominant: {d.demographics.stPercentage}% of population
            </p>
          </div>
        </div>
      </div>

      {/* Migration */}
      <div className="section">
        <div className="card executive-summary">
          <h3 style={{ color: 'var(--primary-light)', marginBottom: 'var(--space-md)' }}>📊 Migration Data</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <strong>{d.occupation.migrationCount}</strong> individuals ({d.occupation.migrationPercentage}%) from the village have migrated
            for employment or education. This represents a significant workforce migration that impacts village economy and
            community dynamics.
          </p>
        </div>
      </div>
    </div>
  );
}
