import { Monitor, ExternalLink, CreditCard, Wheat, Heart, Briefcase, Home, Users } from 'lucide-react';

const services = [
  {
    category: 'Identity & Documents',
    icon: '🪪',
    items: [
      { name: 'Aadhaar Card', url: 'https://uidai.gov.in', desc: 'Update, download, link Aadhaar' },
      { name: 'PAN Card', url: 'https://www.incometax.gov.in/iec/foportal/', desc: 'Apply or check PAN status' },
      { name: 'Voter ID', url: 'https://voters.eci.gov.in', desc: 'Register as voter or check status' },
      { name: 'Ration Card', url: 'https://nfsa.gov.in/public/frmauthalistreport.aspx', desc: 'Check ration card status' },
      { name: 'Income Certificate', url: 'https://meeseva.ap.gov.in', desc: 'Apply via MeeSeva portal' },
      { name: 'Caste Certificate', url: 'https://meeseva.ap.gov.in', desc: 'Apply via MeeSeva portal' },
      { name: 'MeeSeva Portal', url: 'https://meeseva.ap.gov.in', desc: 'All AP government services' },
    ]
  },
  {
    category: 'Agriculture Services',
    icon: '🌾',
    items: [
      { name: 'PM-KISAN', url: 'https://pmkisan.gov.in', desc: 'Check beneficiary status' },
      { name: 'Crop Insurance (PMFBY)', url: 'https://pmfby.gov.in', desc: 'Pradhan Mantri Fasal Bima' },
      { name: 'Weather Forecast', url: 'https://mausam.imd.gov.in', desc: 'IMD weather updates' },
      { name: 'Market Prices (eNAM)', url: 'https://enam.gov.in', desc: 'Agricultural market prices' },
      { name: 'Rythu Bharosa', url: 'https://ysrrythubharosa.ap.gov.in', desc: 'AP farmer support scheme' },
      { name: 'Soil Health Card', url: 'https://soilhealth.dac.gov.in', desc: 'Soil testing and reports' },
    ]
  },
  {
    category: 'Health Services',
    icon: '🏥',
    items: [
      { name: 'Arogyasri', url: 'https://www.ysrarogyasri.ap.gov.in', desc: 'AP health insurance' },
      { name: 'Ayushman Bharat', url: 'https://pmjay.gov.in', desc: 'Health insurance scheme' },
      { name: 'CoWIN Vaccination', url: 'https://www.cowin.gov.in', desc: 'Vaccination certificates' },
      { name: 'ABHA Health ID', url: 'https://abha.abdm.gov.in', desc: 'Create digital health ID' },
    ]
  },
  {
    category: 'Education & Employment',
    icon: '🎓',
    items: [
      { name: 'Jnanabhumi', url: 'https://jnanabhumi.ap.gov.in', desc: 'Scholarships & fee reimbursement' },
      { name: 'Amma Vodi', url: 'https://jaganannaammavodi.ap.gov.in', desc: 'Education financial support' },
      { name: 'MNREGA Job Card', url: 'https://nrega.nic.in', desc: 'Check employment guarantee status' },
      { name: 'Skill India', url: 'https://www.skillindia.gov.in', desc: 'Skill development programs' },
    ]
  },
  {
    category: 'Housing & Welfare',
    icon: '🏠',
    items: [
      { name: 'PM Awas Yojana', url: 'https://pmaymis.gov.in', desc: 'Housing scheme for all' },
      { name: 'Ujjwala Yojana', url: 'https://www.pmujjwalayojana.com', desc: 'Free LPG connection' },
      { name: 'Jan Dhan Yojana', url: 'https://pmjdy.gov.in', desc: 'Bank account for all' },
      { name: 'NSAP Pension', url: 'https://nsap.nic.in', desc: 'Social security pension' },
    ]
  }
];

export default function DigitalServices() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Digital Services</h1>
        <p>Quick access to government portals and digital services</p>
      </div>

      {services.map((section, si) => (
        <div className="section" key={si}>
          <h2 className="section-title">
            <span style={{ fontSize: '1.3rem' }}>{section.icon}</span>
            {section.category}
          </h2>
          <div className="grid-3">
            {section.items.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }}
              >
                <div className="flex-between">
                  <h4 style={{ fontSize: '0.9rem' }}>{item.name}</h4>
                  <ExternalLink size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
                <p className="text-xs text-secondary">{item.desc}</p>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
