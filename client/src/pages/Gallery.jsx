import { Image, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { galleryAPI } from '../data/api';

// Fallback static photos shown when API returns nothing
const staticPhotos = [
  { id: 's1', title: 'Village Panorama', category: 'village', image_url: '🏘️', description: '' },
  { id: 's2', title: 'Government School', category: 'school', image_url: '🏫', description: '' },
  { id: 's3', title: 'Sri Seetharama Temple', category: 'temple', image_url: '🛕', description: '' },
  { id: 's4', title: 'Paddy Fields', category: 'agriculture', image_url: '🌾', description: '' },
  { id: 's5', title: 'Cotton Harvest', category: 'agriculture', image_url: '🧶', description: '' },
  { id: 's6', title: 'Village Road', category: 'infrastructure', image_url: '🛤️', description: '' },
  { id: 's7', title: 'Anganwadi Center', category: 'school', image_url: '👶', description: '' },
  { id: 's8', title: 'Community Gathering', category: 'festival', image_url: '🎊', description: '' },
];

const categories = ['All', 'village', 'school', 'temple', 'agriculture', 'infrastructure', 'festival', 'other'];

const colorMap = {
  village: '#14B8A6',
  school: '#6366F1',
  temple: '#F59E0B',
  agriculture: '#22C55E',
  infrastructure: '#8B5CF6',
  festival: '#F97316',
  other: '#06B6D4'
};

// Returns true if image_url is a real image path (not an emoji)
function isRealImage(url) {
  if (!url) return false;
  return url.startsWith('/') || url.startsWith('http');
}

export default function Gallery() {
  const [photosList, setPhotosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null); // holds the photo object for the lightbox

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await galleryAPI.getAll();
        setPhotosList(data.length > 0 ? data : staticPhotos);
      } catch (err) {
        console.warn('Failed to load photos from API, falling back to static:', err);
        setPhotosList(staticPhotos);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  const filtered = filter === 'All'
    ? photosList
    : photosList.filter(p => p.category === filter);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Village Gallery</h1>
        <p>Photos capturing the life and beauty of Seetharampuram Thanda</p>
      </div>

      {/* Category Filter */}
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

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading gallery...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <Image size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p>No photos in this category yet.</p>
          {filter !== 'All' && (
            <button className="btn btn-outline" onClick={() => setFilter('All')} style={{ marginTop: '12px', fontSize: '0.85rem' }}>
              Show All
            </button>
          )}
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map((photo, i) => {
            const bgColor = colorMap[photo.category] || '#94A3B8';
            const hasRealImage = isRealImage(photo.image_url);

            return (
              <div
                key={photo.id || i}
                className="card"
                style={{ padding: 0, overflow: 'hidden', cursor: hasRealImage ? 'pointer' : 'default' }}
                onClick={() => hasRealImage && setLightbox(photo)}
              >
                {/* Photo display area */}
                <div style={{
                  height: '200px',
                  background: `linear-gradient(135deg, ${bgColor}33, ${bgColor}11)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '1px solid var(--border)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {hasRealImage ? (
                    <>
                      <img
                        src={photo.image_url}
                        alt={photo.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      {/* Shown only if img fails */}
                      <div style={{
                        display: 'none',
                        width: '100%', height: '100%',
                        alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column', gap: '8px',
                        color: 'var(--text-muted)', fontSize: '0.8rem',
                        position: 'absolute', top: 0, left: 0
                      }}>
                        <Image size={32} style={{ opacity: 0.4 }} />
                        <span>Image unavailable</span>
                      </div>
                    </>
                  ) : (
                    <div style={{
                      display: 'flex',
                      fontSize: '4rem',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                    }}>
                      {photo.image_url && !isRealImage(photo.image_url) ? photo.image_url : '🖼️'}
                    </div>
                  )}
                </div>

                <div style={{ padding: 'var(--space-md)' }}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>{photo.title || 'Untitled'}</h4>
                  {photo.description && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      {photo.description}
                    </p>
                  )}
                  <span className="badge primary" style={{ textTransform: 'capitalize' }}>
                    {photo.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="card mt-lg" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
        <Image size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }} />
        <h3 style={{ color: 'var(--text-secondary)' }}>More Photos Coming Soon</h3>
        <p className="text-sm text-muted mt-sm">Village photos will be uploaded by the admin team</p>
      </div>

      {/* Lightbox overlay for uploaded images */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '24px',
            cursor: 'zoom-out'
          }}
        >
          <img
            src={lightbox.image_url}
            alt={lightbox.title}
            style={{
              maxWidth: '90vw',
              maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <div style={{ marginTop: '16px', textAlign: 'center', color: '#fff' }}>
            <h3 style={{ fontWeight: 700 }}>{lightbox.title}</h3>
            {lightbox.description && (
              <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '4px' }}>{lightbox.description}</p>
            )}
            <span style={{
              display: 'inline-block',
              marginTop: '8px',
              padding: '4px 12px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '20px',
              fontSize: '0.8rem',
              textTransform: 'capitalize'
            }}>
              {lightbox.category}
            </span>
          </div>
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed',
              top: '20px',
              right: '24px',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
