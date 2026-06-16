import { Shield, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import villageData from '../data/villageData';

const schemeLinks = {
  'PM-KISAN': 'https://pmkisan.gov.in',
  'Pension Scheme': 'https://nsap.nic.in',
  'MNREGA': 'https://nrega.nic.in',
  'Ration Card': 'https://nfsa.gov.in',
  'Rythu Bharosa': 'https://ysrrythubharosa.ap.gov.in',
  'Amma Vodi': 'https://jaganannaammavodi.ap.gov.in',
  'PM Awas Yojana': 'https://pmaymis.gov.in',
  'Thalli ki Vandanam': 'https://gramawardsachivalayam.ap.gov.in',
  'Widow Pension': 'https://nsap.nic.in',
};

const categoryColors = {
  'PM-KISAN': 'teal', 'Pension Scheme': 'amber', 'MNREGA': 'green',
  'Ration Card': 'blue', 'Rythu Bharosa': 'teal', 'Amma Vodi': 'indigo',
  'PM Awas Yojana': 'amber', 'Thalli ki Vandanam': 'red', 'Widow Pension': 'red'
};

export default function Schemes() {
  const gs = villageData.governmentSchemes;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Government Schemes</h1>
        <p>Scheme coverage, beneficiary data, and application portals</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="stat-card">
          <div className="stat-icon teal"><Shield size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Total Scheme Mentions</div>
            <div className="stat-value">{gs.totalMentions}</div>
            <div className="stat-desc">Across all households</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><AlertCircle size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Farmers w/o PM-KISAN</div>
            <div className="stat-value">{gs.coverageGaps.farmersWithoutPMKisan}</div>
            <div className="stat-desc">of {gs.coverageGaps.totalFarmerHouseholds} farmer households</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><AlertCircle size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Seniors w/o Pension</div>
            <div className="stat-value">{gs.coverageGaps.seniorsWithoutPension}</div>
            <div className="stat-desc">of {gs.coverageGaps.totalSeniors} senior citizens</div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title"><CheckCircle2 size={22} className="icon" />Scheme Beneficiaries</h2>
        <div className="grid-3">
          {Object.entries(gs.beneficiaries).map(([scheme, count]) => {
            const pct = Math.round((count / villageData.overview.totalHouseholds) * 100);
            return (
              <div className="card" key={scheme} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div className="flex-between">
                  <h4 style={{ fontSize: '0.95rem' }}>{scheme}</h4>
                  <span className="badge primary">{count} HHs</span>
                </div>
                <div className="progress-bar-wrapper" style={{ marginBottom: 0 }}>
                  <div className="progress-bar-header">
                    <span className="progress-bar-label">Coverage</span>
                    <span className="progress-bar-value">{pct}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                {schemeLinks[scheme] && (
                  <a href={schemeLinks[scheme]} target="_blank" rel="noopener noreferrer"
                    className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px', alignSelf: 'flex-start' }}>
                    Apply Online <ExternalLink size={14} />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Coverage Gaps Alert */}
      <div className="section">
        <div className="card" style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h3 style={{ color: 'var(--danger)', marginBottom: 'var(--space-md)' }}>⚠️ Coverage Gaps Identified</h3>
          <div className="grid-2">
            <div>
              <p className="text-sm text-secondary" style={{ lineHeight: 1.8 }}>
                <strong style={{ color: 'var(--text-primary)' }}>PM-KISAN Gap:</strong> {gs.coverageGaps.farmersWithoutPMKisan} farming
                households out of {gs.coverageGaps.totalFarmerHouseholds} are NOT receiving PM-KISAN benefits.
                These families are eligible but not enrolled.
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary" style={{ lineHeight: 1.8 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Pension Gap:</strong> {gs.coverageGaps.seniorsWithoutPension} senior
                citizens out of {gs.coverageGaps.totalSeniors} are without pension coverage.
                Immediate enrollment drive recommended.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
