import { Plane, Heart, Users, HandHeart, TrendingUp, Phone, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { nriProjectsAPI, volunteerAPI } from '../data/api';

const projects = [
  { title: 'School Renovation', desc: 'Renovation of Government Primary School including new classrooms, furniture, and computer lab.', target: 500000, collected: 210000 },
  { title: 'Village Library', desc: 'Community library with books, newspapers, and digital reading facility.', target: 200000, collected: 85000 },
  { title: 'Street Light Installation', desc: 'Solar-powered street lights in all colonies.', target: 300000, collected: 120000 },
  { title: 'Water Purification Plant', desc: 'RO water purification for clean drinking water.', target: 800000, collected: 150000 },
  { title: 'Digital Classroom', desc: 'Projector, computers, and internet connectivity for school.', target: 400000, collected: 95000 },
];

const volunteers = [
  { title: 'Career Guidance', desc: 'Help village students with career counseling and exam preparation.', category: 'Education', icon: '🎓' },
  { title: 'Weekend Teaching', desc: 'Teach English, Mathematics, or Science on weekends.', category: 'Education', icon: '📚' },
  { title: 'Health Camp Organization', desc: 'Organize monthly health camps with doctor consultations.', category: 'Health', icon: '🏥' },
  { title: 'Skill Development', desc: 'Computer literacy, tailoring, or vocational skill workshops.', category: 'Employment', icon: '💼' },
  { title: 'Agricultural Advisory', desc: 'Guide farmers on modern techniques and organic farming.', category: 'Agriculture', icon: '🌾' },
];

const defaultVolIcons = {
  Education: '🎓',
  Health: '🏥',
  Employment: '💼',
  Agriculture: '🌾',
  Other: '🤝'
};

function getVolIcon(v) {
  if (v.icon) return v.icon;
  return defaultVolIcons[v.category] || '🤝';
}

function formatCurrency(num) {
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num}`;
}

export default function NRI() {
  const [projectsList, setProjectsList] = useState([]);
  const [volunteersList, setVolunteersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNRI = async () => {
      try {
        const [projectsData, volunteersData] = await Promise.all([
          nriProjectsAPI.getAll(),
          volunteerAPI.getAll()
        ]);
        setProjectsList(projectsData.length > 0 ? projectsData : projects);
        setVolunteersList(volunteersData.length > 0 ? volunteersData : volunteers);
      } catch (err) {
        console.warn('Failed to load NRI data from API, falling back to static:', err);
        setProjectsList(projects);
        setVolunteersList(volunteers);
      } finally {
        setLoading(false);
      }
    };
    fetchNRI();
  }, []);
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">NRI & Migrants Section</h1>
        <p>Stay connected with your village. Contribute to development projects and volunteer opportunities.</p>
      </div>

      {/* Village Development Fund */}
      <div className="section">
        <h2 className="section-title"><Heart size={22} className="icon" />Village Development Fund</h2>
        <p className="text-sm text-secondary mb-lg">
          People living outside the village can contribute to these development projects.
          Contact the Village Office to record your contribution.
        </p>
        <div className="grid-2">
          {projectsList.map((proj, i) => {
            const collected = proj.collected !== undefined ? proj.collected : (proj.collected_amount || 0);
            const target = proj.target !== undefined ? proj.target : (proj.target_amount || 0);
            const desc = proj.desc || proj.description || '';
            const pct = Math.round((collected / (target || 1)) * 100);
            return (
              <div className="card" key={i}>
                <h4 style={{ marginBottom: 'var(--space-sm)' }}>{proj.title}</h4>
                <p className="text-sm text-secondary mb-md">{desc}</p>
                <div className="progress-bar-wrapper" style={{ marginBottom: 'var(--space-sm)' }}>
                  <div className="progress-bar-header">
                    <span className="progress-bar-label">{formatCurrency(collected)} / {formatCurrency(target)}</span>
                    <span className="progress-bar-value">{pct}%</span>
                  </div>
                  <div className="progress-bar-track" style={{ height: '12px' }}>
                    <div className="progress-bar-fill green" style={{ width: `${Math.min(pct, 100)}%`, height: '12px' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contribute */}
      <div className="section">
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.08), rgba(99,102,241,0.05))', border: '1px solid rgba(13,148,136,0.2)', textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <TrendingUp size={48} style={{ color: 'var(--primary-light)', marginBottom: 'var(--space-md)' }} />
          <h3>Want to Contribute?</h3>
          <p className="text-secondary mt-sm mb-lg" style={{ maxWidth: '500px', margin: '8px auto 24px' }}>
            Contact the Village Panchayat Office to make a contribution. All donations are tracked and progress is updated on this platform.
          </p>
          <div className="flex-center gap-md" style={{ flexWrap: 'wrap' }}>
            <div className="card" style={{ background: 'var(--bg-surface)', padding: 'var(--space-md)', textAlign: 'left' }}>
              <p className="text-xs text-muted">Village Secretary</p>
              <p className="font-bold">Panchayat Office, Seetharampuram</p>
              <a href="tel:9876543200" className="flex gap-sm mt-sm" style={{ color: 'var(--primary-light)', fontSize: '0.9rem', alignItems: 'center' }}>
                <Phone size={14} /> 98765 43200
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Volunteer */}
      <div className="section">
        <h2 className="section-title"><HandHeart size={22} className="icon" />Volunteer Opportunities</h2>
        <div className="grid-3">
          {volunteersList.map((vol, i) => {
            const icon = getVolIcon(vol);
            const desc = vol.desc || vol.description || '';
            return (
              <div className="card" key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)', display: 'block' }}>{icon}</span>
                <h4 style={{ marginBottom: '4px', fontSize: '0.95rem' }}>{vol.title}</h4>
                <span className="badge primary" style={{ alignSelf: 'flex-start' }}>{vol.category}</span>
                <p className="text-sm text-secondary" style={{ lineHeight: 1.6, marginTop: 'var(--space-sm)', flex: 1 }}>{desc}</p>
                {vol.contact_info && (
                  <p className="text-xs text-muted" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '8px', marginTop: '8px' }}>
                    {vol.contact_info}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Migration Stats */}
      <div className="section">
        <h2 className="section-title"><Users size={22} className="icon" />Migration Statistics</h2>
        <div className="card executive-summary">
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--primary-light)', fontSize: '1.5rem' }}>17</strong> individuals
            ({17.3}%) from the village have migrated for employment or education. Maintaining connections
            with these community members is vital for village development and knowledge transfer.
          </p>
        </div>
      </div>
    </div>
  );
}
