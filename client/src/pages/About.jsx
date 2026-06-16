import { MapPin, Landmark, TreePine, CloudRain, Mountain, Users, Sun } from 'lucide-react';
import villageData from '../data/villageData';

export default function About() {
  const data = villageData;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">About Seetharampuram Thanda</h1>
        <p>Discover the history, geography, and vibrant community of our village</p>
      </div>

      {/* Hero Image */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', height: '400px', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-2xl)' }}>
        <img src="/images/village_drone_view.png" alt="Seetharampuram Thanda Drone View" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* History */}
      <div className="section">
        <h2 className="section-title"><Landmark size={22} className="icon" /> Village History & Culture</h2>
        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
          <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--primary-light)' }}>Origin & Tribal Heritage</h4>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
            Seetharampuram Thanda is a vibrant tribal village community located in the picturesque landscapes of the Nellore district, Andhra Pradesh, under the Mylukuru Mandal. The village is predominantly inhabited by Scheduled Tribe (ST) communities, with the ST population comprising an overwhelming <strong style={{ color: 'var(--primary-light)' }}>84.6%</strong> of total residents. The "Thanda" designation indicates a traditional tribal hamlet, reflecting the rich Lambadi and Banjara cultural heritage of the community.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', marginTop: 'var(--space-md)' }}>
            For generations, the residents of Seetharampuram Thanda have preserved their unique customs, colorful traditional attire, and distinct dialects. Festivals such as <em>Teej</em> and <em>Seethla</em> are celebrated with great fervor, bringing the entire community together for traditional dances, songs, and feasts. These cultural practices serve not only as a link to their ancestors but also as a unifying force for the modern village.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', marginTop: 'var(--space-md)' }}>
            The village has a strong agricultural foundation, with <strong style={{ color: 'var(--primary-light)' }}>48%</strong> of households depending on farming. Key crops include Cotton, Chilli, Maize, and Paddy, supported by the fertile soils of the region. The community also maintains a diverse livestock base including goats (92), buffaloes (73), and sheep (40), reflecting the traditional pastoral roots of the Thanda community.
          </p>
        </div>
      </div>

      {/* Geography */}
      <div className="section">
        <h2 className="section-title"><Mountain size={22} className="icon" /> Geography & Environment</h2>
        <div className="grid-4">
          <div className="stat-card">
            <div className="stat-icon teal"><MapPin size={24} /></div>
            <div className="stat-content">
              <div className="stat-label">Location</div>
              <div className="stat-value" style={{ fontSize: '1.1rem' }}>Mylukuru</div>
              <div className="stat-desc">Mandal, Nellore District</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><TreePine size={24} /></div>
            <div className="stat-content">
              <div className="stat-label">State</div>
              <div className="stat-value" style={{ fontSize: '1.1rem' }}>Andhra Pradesh</div>
              <div className="stat-desc">Southern India</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber"><CloudRain size={24} /></div>
            <div className="stat-content">
              <div className="stat-label">Climate</div>
              <div className="stat-value" style={{ fontSize: '1.1rem' }}>Tropical</div>
              <div className="stat-desc">Hot and humid summers</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><Sun size={24} /></div>
            <div className="stat-content">
              <div className="stat-label">Terrain</div>
              <div className="stat-value" style={{ fontSize: '1.1rem' }}>Plains</div>
              <div className="stat-desc">Fertile agricultural lands</div>
            </div>
          </div>
        </div>
        <div className="card mt-lg">
           <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
            The geography of Seetharampuram Thanda is characterized by expansive plains and rich soils, ideal for cultivating cash crops like cotton and chillies. The village experiences a typical tropical climate, relying heavily on the seasonal monsoons and borewells for irrigation. Surrounded by natural greenery and open fields, the village enjoys a serene environment far removed from urban pollution.
          </p>
        </div>
      </div>

      {/* Community */}
      <div className="section">
        <h2 className="section-title"><Users size={22} className="icon" /> Community Profile</h2>
        <div className="grid-2">
          
          <div className="flex-col gap-lg">
            <div className="card">
              <h4 style={{ marginBottom: 'var(--space-md)' }}>Key Demographics</h4>
              <table className="data-table">
                <tbody>
                  <tr><td>Average Age</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.demographics.averageAge} years</td></tr>
                  <tr><td>Median Age</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.demographics.medianAge} years</td></tr>
                  <tr><td>Gender Ratio</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.demographics.genderRatio}</td></tr>
                  <tr><td>Dependency Ratio</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.demographics.dependencyRatio}</td></tr>
                  <tr><td>Working Age (19-60)</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.demographics.workingAgePopulation}</td></tr>
                  <tr><td>Children (0-14)</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.demographics.childPopulation}</td></tr>
                  <tr><td>Seniors (60+)</td><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.demographics.seniorPopulation}</td></tr>
                </tbody>
              </table>
            </div>

            <div className="card">
              <h4 style={{ marginBottom: 'var(--space-md)' }}>Social Categories</h4>
              {Object.entries(data.demographics.casteDistribution).map(([cat, count]) => (
                <div className="progress-bar-wrapper" key={cat}>
                  <div className="progress-bar-header">
                    <span className="progress-bar-label">{cat}</span>
                    <span className="progress-bar-value">{count} ({(count/data.overview.totalPopulation*100).toFixed(1)}%)</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${(count/data.overview.totalPopulation*100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
             <img src="/images/village_community.png" alt="Village Community Gathering" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

        </div>
      </div>

      {/* Map */}
      <div className="section">
        <h2 className="section-title"><MapPin size={22} className="icon" /> Location Map</h2>
        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30000!2d79.88!3d14.50!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDMwJzAwLjAiTiA3OcKwNTInNDguMCJF!5e0!3m2!1sen!2sin!4v1"
            width="100%"
            height="400"
            style={{ border: 0, display: 'block' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Village Map"
          />
        </div>
      </div>
    </div>
  );
}
