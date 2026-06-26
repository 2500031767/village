import { MapPin, Landmark, TreePine, CloudRain, Mountain, Users, Sun, Network, Shield, PartyPopper, UserCheck, Building, Sprout, BookOpen, Heart, Info } from 'lucide-react';
import villageData from '../data/villageData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function About() {
  const data = villageData;

  const ageChartData = Object.entries(data.demographics.ageGroups).map(([key, val]) => ({
    name: key.split(' ')[0],
    fullName: key,
    Population: val
  }));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Seetharampuram Thanda Village Biodata</h1>
        <p>A comprehensive profile covering the history, culture, administration, and present landscape of our community.</p>
      </div>

      {/* Hero Image */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', height: '400px', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-2xl)' }}>
        <img src="/images/sunset_1.webp" alt="Seetharampuram Thanda Village View" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Quick Biodata Facts */}
      <div className="section">
        <h2 className="section-title"><Info size={22} className="icon" /> Quick Profile</h2>
        <div className="grid-4">
          <div className="stat-card">
            <div className="stat-icon teal"><MapPin size={24} /></div>
            <div className="stat-content">
              <div className="stat-label">Location</div>
              <div className="stat-value" style={{ fontSize: '1.1rem' }}>Mylavaram</div>
              <div className="stat-desc">NTR District, AP</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><Users size={24} /></div>
            <div className="stat-content">
              <div className="stat-label">Population</div>
              <div className="stat-value" style={{ fontSize: '1.1rem' }}>{data.overview.totalPopulation}</div>
              <div className="stat-desc">Across {data.overview.totalHouseholds} households</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber"><Landmark size={24} /></div>
            <div className="stat-content">
              <div className="stat-label">Established</div>
              <div className="stat-value" style={{ fontSize: '1.1rem' }}>~80 Years Ago</div>
              <div className="stat-desc">Lambadi Community</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><Mountain size={24} /></div>
            <div className="stat-content">
              <div className="stat-label">Distance</div>
              <div className="stat-value" style={{ fontSize: '1.1rem' }}>50 km</div>
              <div className="stat-desc">From Vijayawada</div>
            </div>
          </div>
        </div>
      </div>

      {/* History & Religion */}
      <div className="section">
        <h2 className="section-title"><Landmark size={22} className="icon" /> History & Religion</h2>
        <div className="card">
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
            Established around <strong>80 years ago</strong>, Seetharampuram Thanda is a vibrant tribal hamlet located in Mylavaram Mandal, deeply rooted in the <strong>Lambadi (Banjara)</strong> cultural heritage. The overwhelming majority of the population (approximately 84.6%) belongs to the Scheduled Tribe (ST) community.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', marginTop: 'var(--space-md)' }}>
            The village is a harmonious blend of faiths, home to people from both <strong>Hindu</strong> and <strong>Christian</strong> religions, with Hinduism being the predominant faith. The villagers are deeply spiritual, revering their ancestors and local deities that have protected the Thanda since its inception.
          </p>
        </div>
      </div>

      {/* Demographics & Community */}
      <div className="section">
        <h2 className="section-title"><Users size={22} className="icon" /> Demographics & Community Profile</h2>
        <div className="grid-2">
          <div className="flex-col gap-lg">
            <div className="card">
              <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--primary-light)' }}>Key Demographics</h4>
              <table className="data-table">
                <tbody>
                  <tr><td>Average Age</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.demographics.averageAge} years</td></tr>
                  <tr><td>Gender Ratio</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.demographics.genderRatio}</td></tr>
                  <tr><td>Working Age (19-60)</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.demographics.workingAgePopulation}</td></tr>
                  <tr><td>Children (0-14)</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.demographics.childPopulation}</td></tr>
                  <tr><td>Average Family Size</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.overview.averageFamilySize} members</td></tr>
                </tbody>
              </table>
            </div>

            <div className="card">
              <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--primary-light)' }}>Age Distribution</h4>
              <div style={{ height: '220px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                    <Tooltip 
                      cursor={{ fill: 'var(--bg-surface)' }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}
                      labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                    />
                    <Bar dataKey="Population" fill="var(--primary-light)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
             <img src="/images/traditional_dress.webp" alt="Lambadi Traditional Dress" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>

      {/* Festivals & Cultural Practices */}
      <div className="section">
        <h2 className="section-title"><PartyPopper size={22} className="icon" /> Culture, Festivals & Religious Practices</h2>
        <div className="grid-2">
          <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
             <img src="/images/dance_1.webp" alt="Traditional Dance and Culture" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="card">
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
              The villagers actively celebrate common Hindu festivals such as Diwali, Sankranti, Ugadi, and other regional events. However, their unique tribal identity shines through their distinct cultural practices.
            </p>
            <h4 style={{ margin: 'var(--space-md) 0', color: 'var(--primary-light)' }}>The TEEZ Festival & Deity Worship</h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
              The principal deity worshipped by the community is <strong>Shivalal Maharaj</strong>, regarded as their spiritual guide and ultimate protector.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', marginTop: 'var(--space-sm)' }}>
              The most significant cultural event is <strong>Teez</strong>, celebrated once every year during the Telugu month of Ashada (Aashada Masam). The key practices include:
            </p>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', paddingLeft: '1.5rem', marginTop: '8px' }}>
              <li>Preparation of traditional foods like <strong>Jonna Rottelu (sorghum flatbread)</strong> and <strong>Aakura Pappu (leafy vegetable dal)</strong> as <em>prasadam</em>.</li>
              <li>Villagers prepare <strong>mud idols (clay statues)</strong>, which are later immersed in a nearby river or water body.</li>
              <li>A grand festival procession begins directly from the house of the village <strong>Pedhanaayakudu</strong>.</li>
              <li>A traditional <strong>Bali (ritual offering/sacrifice)</strong> is performed in front of the Pedhanaayakudu's house to seek blessings.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Agriculture & Livelihood */}
      <div className="section">
        <h2 className="section-title"><Sprout size={22} className="icon" /> Agriculture & Livelihood</h2>
        <div className="card">
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
            Farming forms the backbone of the village economy, with nearly <strong>48% of households depending directly on agriculture</strong>. The village primarily relies on <strong>Bore Wells</strong> for irrigation, although a significant portion of land remains unirrigated, making seasonal rains critical.
          </p>
          <div className="grid-3" style={{ marginTop: 'var(--space-lg)' }}>
            <div style={{ padding: 'var(--space-md)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ marginBottom: '8px', color: 'var(--primary-light)' }}>Primary Crops</h4>
              <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', paddingLeft: '1rem' }}>
                <li><strong>Cotton</strong> (Cash Crop)</li>
                <li><strong>Chilli</strong> (Cash Crop)</li>
                <li><strong>Maize</strong> (Food Crop)</li>
                <li><strong>Paddy</strong> (Food Crop)</li>
              </ul>
            </div>
            <div style={{ padding: 'var(--space-md)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ marginBottom: '8px', color: 'var(--primary-light)' }}>Livestock Dependency</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Pastoral roots remain strong, with nearly 38% of households maintaining livestock. The village houses <strong>92 goats</strong>, <strong>73 buffaloes</strong>, and <strong>40 sheep</strong>.
              </p>
            </div>
            <div style={{ padding: 'var(--space-md)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ marginBottom: '8px', color: 'var(--primary-light)' }}>Other Occupations</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Apart from farming, many residents work as daily wage laborers. A growing number of youth are pursuing higher education and venturing into IT/private sector employment in nearby cities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Local Justice System & Governance */}
      <div className="section">
        <h2 className="section-title"><Shield size={22} className="icon" /> Local Justice System & Governance</h2>
        <div className="grid-2">
          <div className="card">
            <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--primary-light)' }}>Traditional Community Leadership</h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
              Seetharampuram Thanda operates heavily on its traditional community-based governance rather than formal legal processes. The village has <strong>no permanent government officials stationed</strong> within it. 
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', marginTop: 'var(--space-sm)' }}>
              Leadership is divided into two distinct roles:
            </p>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', paddingLeft: '1.5rem', marginBottom: 'var(--space-md)' }}>
              <li><strong>Justice Pedhanaayakudu</strong>: Resolves disputes and maintains peace.</li>
              <li><strong>Treasury Pedhanaayakudu</strong>: Manages community funds.</li>
            </ul>

            <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--primary-light)' }}>Selection Process</h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
              The Pedhanaayakudu is <strong>not elected through voting</strong>. Community elders identify a suitable candidate based on reputation and leadership. A <strong>red towel</strong> is ceremonially placed on their head, symbolizing their appointment. This emphasizes pure community consensus.
            </p>
          </div>
          <div className="card">
             <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--primary-light)' }}>The Justice Process</h4>
             <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
              This system is widely accepted due to its speed and accessibility. When a dispute arises:
            </p>
            <ol style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', paddingLeft: '1.5rem', marginTop: '8px' }}>
              <li>A community meeting is organized.</li>
              <li>Both parties present their arguments openly.</li>
              <li>The leaders and elders carefully listen and make an immediate decision.</li>
            </ol>
            <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #e74c3c' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Guilty Verdict & Fines:</strong>
              <ul style={{ marginTop: '8px', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                <li>A monetary penalty is imposed immediately.</li>
                <li>Approximately <strong>half of the fine</strong> goes to the affected party as compensation.</li>
                <li>The remaining amount is distributed among the jury/elders, often used for communal gatherings or refreshments.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure & Present Status */}
      <div className="section">
        <h2 className="section-title"><Building size={22} className="icon" /> Infrastructure & Present Status</h2>
        <div className="grid-2">
          <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
             <img src="/images/small_hut.webp" alt="Village Infrastructure" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="card">
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
              The village has made progress with basic infrastructure, boasting a <strong>98% electricity connectivity</strong> and substantial adoption of clean cooking fuel (LPG). However, development is still ongoing with several major hurdles.
            </p>
            <h4 style={{ margin: 'var(--space-md) 0', color: 'var(--primary-light)' }}>Major Challenges</h4>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', paddingLeft: '1.5rem' }}>
              <li><strong>Connectivity:</strong> Lack of reliable 5G mobile network coverage and generally limited internet speeds.</li>
              <li><strong>Roads:</strong> Most internal roads are either mud or basic cement, with only a few properly developed arteries.</li>
              <li><strong>Sanitation:</strong> Almost 60% of households lack proper drainage facilities, which remains the highest reported problem among residents.</li>
              <li><strong>Water:</strong> While government pipe water exists, inadequate water supply remains a significant grievance, forcing many to buy mineral water.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="section">
        <h2 className="section-title"><MapPin size={22} className="icon" /> Location Map</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }} className="map-grid">
          {/* Satellite map pinned to village school landmark */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ padding: '10px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              📍 Map View — Seetharampuram Thanda
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d980.8!2d80.6061103!3d16.8612158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35c51527592c65%3A0xa7f92195f423688b!2z4K6q4K6_4K6v4K6-4K6w4K6f4K6-4K6a4K-N4K6o4K6k4K-N4K6o4K6k!5e1!3m2!1sen!2sin!4v1"
              width="100%"
              height="380"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Village Map View"
            />
          </div>

          {/* Street View */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ padding: '10px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              🚶 Street View — Village Ground Level
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!4v1!6m8!1m7!1s66ZddHmuiXW8FxrZZqms6Q!2m2!1d16.86085!2d80.6077994!3f205.12!4f0!5f0.7820865974627469"
              width="100%"
              height="380"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Village Street View"
            />
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-md)', textAlign: 'center' }}>
          <a
            href="https://www.google.com/maps/place/?q=place_id:ChIJZSxZJxXFNTkRi2gjpJUh-ac"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ fontSize: '0.85rem' }}
          >
            <MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
