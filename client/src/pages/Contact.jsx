import { Phone, MapPin, Mail, Clock, Globe } from 'lucide-react';

export default function Contact() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Contact Us</h1>
        <p>Reach out to the village administration</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ color: 'var(--primary-light)', marginBottom: 'var(--space-lg)' }}>Village Panchayat Office</h3>
          <div className="flex-col gap-lg">
            <div className="flex gap-md" style={{ alignItems: 'flex-start' }}>
              <div className="stat-icon teal" style={{ width: '44px', height: '44px', flexShrink: 0 }}>
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-sm text-muted">Address</p>
                <p style={{ fontWeight: 500 }}>Seetharampuram Thanda</p>
                <p className="text-sm text-secondary">Mylavaram Mandal, NTR District</p>
                <p className="text-sm text-secondary">Andhra Pradesh, India</p>
              </div>
            </div>
            <div className="flex gap-md" style={{ alignItems: 'flex-start' }}>
              <div className="stat-icon amber" style={{ width: '44px', height: '44px', flexShrink: 0 }}>
                <Phone size={20} />
              </div>
              <div>
                <p className="text-sm text-muted">Phone</p>
                <a href="tel:9876543200" style={{ color: 'var(--primary-light)', fontWeight: 600, fontSize: '1.1rem' }}>
                  +91 98765 43200
                </a>
                <p className="text-xs text-muted mt-sm">Village Secretary</p>
              </div>
            </div>
            <div className="flex gap-md" style={{ alignItems: 'flex-start' }}>
              <div className="stat-icon indigo" style={{ width: '44px', height: '44px', flexShrink: 0 }}>
                <Clock size={20} />
              </div>
              <div>
                <p className="text-sm text-muted">Office Hours</p>
                <p style={{ fontWeight: 500 }}>Mon - Sat: 10:00 AM - 5:00 PM</p>
                <p className="text-xs text-muted mt-sm">Closed on Sundays & Public Holidays</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ color: 'var(--primary-light)', marginBottom: 'var(--space-lg)' }}>Survey Organization</h3>
          <div className="flex-col gap-lg">
            <div className="flex gap-md" style={{ alignItems: 'flex-start' }}>
              <div className="stat-icon blue" style={{ width: '44px', height: '44px', flexShrink: 0 }}>
                <Globe size={20} />
              </div>
              <div>
                <p className="text-sm text-muted">Organization</p>
                <p style={{ fontWeight: 500 }}>KL Education Foundation (KLEF)</p>
                <p className="text-sm text-secondary">KL University, Vaddeswaram</p>
                <p className="text-sm text-secondary">Andhra Pradesh, India</p>
              </div>
            </div>
            <div className="flex gap-md" style={{ alignItems: 'flex-start' }}>
              <div className="stat-icon green" style={{ width: '44px', height: '44px', flexShrink: 0 }}>
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-muted">Program</p>
                <p style={{ fontWeight: 500 }}>Unnat Bharat Abhiyan (UBA)</p>
                <p className="text-sm text-secondary">Smart Village Revolution</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-md)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <p className="text-xs text-muted mb-sm">Important Links</p>
            <div className="flex-col gap-sm">
              <a href="https://unnatbharatabhiyan.gov.in" target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: 'var(--primary-light)' }}>
                🔗 Unnat Bharat Abhiyan Official Website
              </a>
              <a href="https://www.kluniversity.in" target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: 'var(--primary-light)' }}>
                🔗 KL University Website
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Map + Street View */}
      <div className="section mt-lg">
        <h3 style={{ marginBottom: 'var(--space-md)', fontSize: '1.1rem', fontWeight: 700 }}>
          <MapPin size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary-light)' }} />
          Village Location
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }} className="map-grid">

          {/* Google Maps — pinned to the school/village landmark */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ padding: '10px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              📍 Map View — Seetharampuram Thanda
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d980.8!2d80.6061103!3d16.8612158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35c51527592c65%3A0xa7f92195f423688b!2z4K6q4K6_4K6v4K6-4K6w4K6f4K6-4K6a4K-N4K6o4K6k4K-N4K6o4K6k!5e1!3m2!1sen!2sin!4v1"
              width="100%"
              height="340"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Village Map View"
            />
          </div>

          {/* Google Street View */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ padding: '10px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              🚶 Street View — Village Ground Level
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!4v1!6m8!1m7!1s66ZddHmuiXW8FxrZZqms6Q!2m2!1d16.86085!2d80.6077994!3f205.12!4f0!5f0.7820865974627469"
              width="100%"
              height="340"
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
            <MapPin size={14} /> Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
