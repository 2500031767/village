import { ClipboardList, Users, Award, FileText, Star } from 'lucide-react';
import villageData from '../data/villageData';

export default function Survey() {
  const credits = villageData.surveyCredits;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Survey & Credits</h1>
        <p>About the survey methodology, rating system, and the team behind the data</p>
      </div>

      {/* Survey Overview */}
      <div className="section">
        <h2 className="section-title"><ClipboardList size={22} className="icon" />Survey Overview</h2>
        <div className="grid-2">
          <div className="card">
            <h4 style={{ color: 'var(--primary-light)', marginBottom: 'var(--space-md)' }}>About the Survey</h4>
            <table className="data-table">
              <tbody>
                <tr><td>Organization</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{credits.organization}</td></tr>
                <tr><td>Program</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{credits.program}</td></tr>
                <tr><td>Rating System</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{credits.ratingSystem}</td></tr>
                <tr><td>Total Points</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{credits.totalPoints} points</td></tr>
                <tr><td>Households Surveyed</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{villageData.overview.totalSurveyFiles}</td></tr>
                <tr><td>Survey Days</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Day 1: {villageData.overview.surveyDays.day1}, Day 2: {villageData.overview.surveyDays.day2}</td></tr>
                <tr><td>Total Surveyors</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{credits.totalSurveyors}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="card">
            <h4 style={{ color: 'var(--primary-light)', marginBottom: 'var(--space-md)' }}>Data Quality</h4>
            <div className="flex-col gap-md">
              <div className="card" style={{ background: 'var(--bg-surface)', padding: 'var(--space-md)' }}>
                <p className="text-xs text-muted">Households Missing Income Data</p>
                <p className="font-bold" style={{ fontSize: '1.25rem', color: 'var(--warning)' }}>{credits.dataQuality.householdsMissingIncome}</p>
              </div>
              <div className="card" style={{ background: 'var(--bg-surface)', padding: 'var(--space-md)' }}>
                <p className="text-xs text-muted">Members Missing Age Data</p>
                <p className="font-bold" style={{ fontSize: '1.25rem', color: 'var(--warning)' }}>{credits.dataQuality.membersMissingAge}</p>
              </div>
              <div className="card" style={{ background: 'var(--bg-surface)', padding: 'var(--space-md)' }}>
                <p className="text-xs text-muted">Surveyor Name Normalization</p>
                <p className="text-sm text-secondary">{credits.dataQuality.note}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SVR Rating Modules */}
      <div className="section">
        <h2 className="section-title"><Award size={22} className="icon" />SVR Green Village Rating Modules</h2>
        <div className="grid-3">
          {credits.modules.map((mod, i) => (
            <div className="card" key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: 700, marginBottom: '4px' }}>{mod.code}</div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-sm)' }}>{mod.name}</h4>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-lg)' }}>
                <div>
                  <p className="text-xs text-muted">Max Points</p>
                  <p className="font-bold" style={{ color: 'var(--primary-light)', fontSize: '1.25rem' }}>{mod.maxPoints}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Credits</p>
                  <p className="font-bold" style={{ fontSize: '1.25rem' }}>{mod.credits}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Surveyor Credits */}
      <div className="section">
        <h2 className="section-title"><Users size={22} className="icon" />Survey Team Credits</h2>
        <div className="card">
          <p className="text-sm text-secondary mb-lg">
            Special thanks to all the KLEF students who conducted door-to-door surveys across Seetharampuram Thanda.
          </p>
          <div className="grid-3">
            {credits.surveyors.map((s, i) => (
              <div key={i} className="flex-between" style={{
                padding: '12px 16px',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                alignItems: 'center'
              }}>
                <div className="flex gap-sm" style={{ alignItems: 'center' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: `hsl(${(i * 25) % 360}, 60%, 40%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: 'white'
                  }}>
                    {s.name.charAt(0)}
                  </div>
                  <span className="text-sm" style={{ fontWeight: 500 }}>{s.name}</span>
                </div>
                <span className="badge primary">{s.surveys} surveys</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Credit */}
      <div className="section">
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.1), rgba(99,102,241,0.05))', border: '1px solid rgba(13,148,136,0.2)', textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <Star size={48} style={{ color: 'var(--secondary)', marginBottom: 'var(--space-md)' }} />
          <h3>This platform is powered by real data</h3>
          <p className="text-secondary mt-sm" style={{ maxWidth: '600px', margin: '8px auto 0' }}>
            All statistics and insights on this website are derived from the door-to-door household survey
            conducted under the <strong style={{ color: 'var(--primary-light)' }}>Unnat Bharat Abhiyan (UBA)</strong> program
            by <strong style={{ color: 'var(--primary-light)' }}>{credits.organization}</strong> students,
            using the <strong style={{ color: 'var(--primary-light)' }}>{credits.ratingSystem}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
