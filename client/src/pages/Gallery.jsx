import { Image, Filter } from 'lucide-react';
import { useState } from 'react';

const photos = [
  { title: 'Village Panorama', category: 'village', color: '#14B8A6', emoji: '🏘️' },
  { title: 'Government School', category: 'school', color: '#6366F1', emoji: '🏫' },
  { title: 'Sri Seetharama Temple', category: 'temple', color: '#F59E0B', emoji: '🛕' },
  { title: 'Paddy Fields', category: 'agriculture', color: '#22C55E', emoji: '🌾' },
  { title: 'Cotton Harvest', category: 'agriculture', color: '#3B82F6', emoji: '🧶' },
  { title: 'Village Road', category: 'infrastructure', color: '#8B5CF6', emoji: '🛤️' },
  { title: 'Anganwadi Center', category: 'school', color: '#EC4899', emoji: '👶' },
  { title: 'Community Gathering', category: 'festival', color: '#F97316', emoji: '🎊' },
  { title: 'Water Tank', category: 'infrastructure', color: '#06B6D4', emoji: '💧' },
  { title: 'Livestock Grazing', category: 'agriculture', color: '#84CC16', emoji: '🐄' },
  { title: 'Village Sunset', category: 'village', color: '#D946EF', emoji: '🌅' },
  { title: 'Panchayat Office', category: 'infrastructure', color: '#14B8A6', emoji: '🏛️' },
];

const categories = ['All', 'village', 'school', 'temple', 'agriculture', 'infrastructure', 'festival'];

export default function Gallery() {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? photos : photos.filter(p => p.category === filter);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Village Gallery</h1>
        <p>Photos capturing the life and beauty of Seetharampuram Thanda</p>
      </div>

      <div className="flex gap-sm mb-lg" style={{ flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button
            key={c}
            className={`btn ${filter === c ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(c)}
            style={{ fontSize: '0.8rem', padding: '6px 14px', textTransform: 'capitalize' }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid-3">
        {filtered.map((photo, i) => (
          <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              height: '200px',
              background: `linear-gradient(135deg, ${photo.color}33, ${photo.color}11)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
              borderBottom: '1px solid var(--border)'
            }}>
              {photo.emoji}
            </div>
            <div style={{ padding: 'var(--space-md)' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>{photo.title}</h4>
              <span className="badge primary" style={{ textTransform: 'capitalize' }}>{photo.category}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-lg" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
        <Image size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }} />
        <h3 style={{ color: 'var(--text-secondary)' }}>More Photos Coming Soon</h3>
        <p className="text-sm text-muted mt-sm">Village photos will be uploaded by the admin team</p>
      </div>
    </div>
  );
}
