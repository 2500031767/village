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
                <p className="text-sm text-secondary">Mylukuru Mandal, Nellore District</p>
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

      {/* Map */}
      <div className="section mt-lg">
        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30000!2d79.88!3d14.50!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDMwJzAwLjAiTiA3OcKwNTInNDguMCJF!5e0!3m2!1sen!2sin!4v1"
            width="100%"
            height="350"
            style={{ border: 0, display: 'block' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Village Location"
          />
        </div>
      </div>
    </div>
  );
}
