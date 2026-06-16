import { Shield, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import villageData from '../data/villageData';
import { schemesAPI } from '../data/api';

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

export default function Schemes() {
  const [schemesList, setSchemesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const gs = villageData.governmentSchemes;

  useEffect(() => {
    const loadSchemes = async () => {
      try {
        const data = await schemesAPI.getAll();
        if (data && data.length > 0) {
          setSchemesList(data);
        } else {
          // Fallback mapping static mock data
          const mapped = Object.entries(gs.beneficiaries).map(([name, count], index) => ({
            id: index,
            name,
            category: name === 'PM-KISAN' || name === 'Rythu Bharosa' ? 'Agriculture' : name.includes('Pension') ? 'Pension' : 'Other',
            beneficiary_count: count,
            total_eligible: name === 'PM-KISAN' ? gs.coverageGaps.totalFarmerHouseholds : name === 'Pension Scheme' ? gs.coverageGaps.totalSeniors : villageData.overview.totalHouseholds,
            portal_url: schemeLinks[name] || ''
          }));
          setSchemesList(mapped);
        }
      } catch (err) {
        console.warn('API error, falling back to static:', err);
        const mapped = Object.entries(gs.beneficiaries).map(([name, count], index) => ({
          id: index,
          name,
          category: name === 'PM-KISAN' || name === 'Rythu Bharosa' ? 'Agriculture' : name.includes('Pension') ? 'Pension' : 'Other',
          beneficiary_count: count,
          total_eligible: name === 'PM-KISAN' ? gs.coverageGaps.totalFarmerHouseholds : name === 'Pension Scheme' ? gs.coverageGaps.totalSeniors : villageData.overview.totalHouseholds,
          portal_url: schemeLinks[name] || ''
        }));
        setSchemesList(mapped);
      } finally {
        setLoading(false);
      }
    };
    loadSchemes();
  }, []);

  const totalMentions = schemesList.reduce((sum, s) => sum + (s.beneficiary_count || 0), 0);

  const pmKisan = schemesList.find(s => s.name.toLowerCase().includes('kisan')) || {};
  const farmersWithoutPMKisan = pmKisan.total_eligible ? (pmKisan.total_eligible - pmKisan.beneficiary_count) : gs.coverageGaps.farmersWithoutPMKisan;
  const totalFarmerHouseholds = pmKisan.total_eligible || gs.coverageGaps.totalFarmerHouseholds;

  const pension = schemesList.find(s => s.name.toLowerCase().includes('old age') || (s.name.toLowerCase().includes('pension') && !s.name.toLowerCase().includes('widow'))) || {};
  const seniorsWithoutPension = pension.total_eligible ? (pension.total_eligible - pension.beneficiary_count) : gs.coverageGaps.seniorsWithoutPension;
  const totalSeniors = pension.total_eligible || gs.coverageGaps.totalSeniors;

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
            <div className="stat-value">{totalMentions}</div>
            <div className="stat-desc">Across all households</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><AlertCircle size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Farmers w/o PM-KISAN</div>
            <div className="stat-value">{farmersWithoutPMKisan}</div>
            <div className="stat-desc">of {totalFarmerHouseholds} farmer households</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><AlertCircle size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Seniors w/o Pension</div>
            <div className="stat-value">{seniorsWithoutPension}</div>
            <div className="stat-desc">of {totalSeniors} senior citizens</div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title"><CheckCircle2 size={22} className="icon" />Scheme Beneficiaries</h2>
        <div className="grid-3">
          {schemesList.map(scheme => {
            const count = scheme.beneficiary_count || 0;
            const eligible = scheme.total_eligible || 100;
            const pct = Math.round((count / eligible) * 100);
            const link = scheme.portal_url || schemeLinks[scheme.name];
            return (
              <div className="card" key={scheme.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div className="flex-between">
                  <h4 style={{ fontSize: '0.95rem' }}>{scheme.name}</h4>
                  <span className="badge primary">{count} HHs</span>
                </div>
                <div className="progress-bar-wrapper" style={{ marginBottom: 0 }}>
                  <div className="progress-bar-header">
                    <span className="progress-bar-label">Coverage ({count}/{eligible})</span>
                    <span className="progress-bar-value">{pct}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
                {link && (
                  <a href={link} target="_blank" rel="noopener noreferrer"
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
                <strong style={{ color: 'var(--text-primary)' }}>PM-KISAN Gap:</strong> {farmersWithoutPMKisan} farming
                households out of {totalFarmerHouseholds} are NOT receiving PM-KISAN benefits.
                These families are eligible but not enrolled.
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary" style={{ lineHeight: 1.8 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Pension Gap:</strong> {seniorsWithoutPension} senior
                citizens out of {totalSeniors} are without pension coverage.
                Immediate enrollment drive recommended.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
