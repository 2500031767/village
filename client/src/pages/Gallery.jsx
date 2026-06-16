import { Image, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { galleryAPI } from '../data/api';

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

const colorMap = {
  village: '#14B8A6',
  school: '#6366F1',
  temple: '#F59E0B',
  agriculture: '#22C55E',
  infrastructure: '#8B5CF6',
  festival: '#F97316',
  other: '#06B6D4'
};

const emojiMap = {
  village: '🏘️',
  school: '🏫',
  temple: '🛕',
  agriculture: '🌾',
  infrastructure: '🛤️',
  festival: '🎊',
  other: '🖼️'
};

function getPhotoDetails(p) {
  if (p.color && p.emoji) {
    return { color: p.color, emoji: p.emoji };
  }
  const hasEmoji = p.image_url && p.image_url.length <= 4 && !p.image_url.includes('/') && !p.image_url.includes('http');
  return {
    color: colorMap[p.category] || '#94A3B8',
    emoji: hasEmoji ? p.image_url : (emojiMap[p.category] || '🖼️')
  };
}

export default function Gallery() {
  const [photosList, setPhotosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await galleryAPI.getAll();
        setPhotosList(data.length > 0 ? data : photos);
      } catch (err) {
        console.warn('Failed to load photos from API, falling back to static:', err);
        setPhotosList(photos);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  const filtered = filter === 'All' ? photosList : photosList.filter(p => p.category === filter);

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
        {filtered.map((photo, i) => {
          const { color, emoji } = getPhotoDetails(photo);
          return (
            <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                height: '200px',
                background: `linear-gradient(135deg, ${color}33, ${color}11)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                borderBottom: '1px solid var(--border)'
              }}>
                {emoji}
              </div>
              <div style={{ padding: 'var(--space-md)' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>{photo.title}</h4>
                <span className="badge primary" style={{ textTransform: 'capitalize' }}>{photo.category}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card mt-lg" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
        <Image size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }} />
        <h3 style={{ color: 'var(--text-secondary)' }}>More Photos Coming Soon</h3>
        <p className="text-sm text-muted mt-sm">Village photos will be uploaded by the admin team</p>
      </div>
    </div>
  );
}
