import { useEffect, useState, useRef } from 'react';
import {
  Users, Home as HomeIcon, MapPin, Wheat, GraduationCap,
  Zap, Flame, Heart, Building2, TrendingUp, BarChart3,
  ArrowRight, Sparkles, Shield, AlertTriangle, TreePine, Image,
  Star, MessageSquare, CheckCircle, Send, PlayCircle, Landmark
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import villageData from '../data/villageData';
import { galleryAPI, ratingsAPI } from '../data/api';
import './Home.css';

// Animated counter hook
function useCounter(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return [count, ref];
}

function StatCard({ icon: Icon, label, value, desc, color = 'teal', delay = 0 }) {
  return (
    <div className="stat-card animate-fadeInUp" style={{ animationDelay: `${delay}ms` }}>
      <div className={`stat-icon ${color}`}>
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {desc && <div className="stat-desc">{desc}</div>}
      </div>
    </div>
  );
}

const heroImages = [
  '/images/sunset_1.webp',
  '/images/dance_1.webp',
  '/images/community_meeting_1.webp',
  '/images/agriculture_1.webp',
  '/images/school_1.webp',
  '/images/tractor_1.webp',
  '/images/traditional_dress.webp',
  '/images/buffalo_1.webp',
];

export default function Home() {
  const data = villageData;
  const navigate = useNavigate();
  const [currentBg, setCurrentBg] = useState(0);
  const [galleryPhotos, setGalleryPhotos] = useState([]);

  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingError, setRatingError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch latest gallery photos for the preview strip
  useEffect(() => {
    galleryAPI.getAll()
      .then(photos => {
        const real = photos.filter(p => p.image_url && (p.image_url.startsWith('/') || p.image_url.startsWith('http')));
        setGalleryPhotos(real.slice(0, 6));
      })
      .catch(() => { });
  }, []);

  const [ratingForm, setRatingForm] = useState({ rating: 5, comment: '', reviewer_name: '', reviewer_type: 'visitor' });
  
  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setRatingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setRatingError('');
    if (!ratingForm.rating || ratingForm.rating < 1 || ratingForm.rating > 5) {
      setRatingError('Please provide a valid rating (1-5).');
      return;
    }
    setRatingSubmitting(true);
    try {
      await ratingsAPI.submit(ratingForm);
      setRatingSubmitted(true);
      setRatingForm({ rating: 5, comment: '', reviewer_name: '', reviewer_type: 'visitor' });
      setTimeout(() => setRatingSubmitted(false), 5000);
    } catch {
      setRatingError('Submission failed. Please try again.');
    } finally {
      setRatingSubmitting(false);
    }
  };

  const [popCount, popRef] = useCounter(data.overview.totalPopulation);
  const [hhCount, hhRef] = useCounter(data.overview.totalHouseholds);

  return (
    <div className="home-page">
      {/* ═══ HERO SECTION ═══ */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-slideshow">
            {heroImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt="Village Background"
                className={`hero-slideshow-img ${idx === currentBg ? 'active' : ''}`}
                loading="lazy"
              />
            ))}
          </div>
          <div className="hero-gradient" />
          <div className="hero-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }} />
            ))}
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-badge animate-fadeInUp">
            <TreePine size={14} />
            <span>Discover the Heart of Andhra Pradesh</span>
          </div>

          <h1 className="hero-title animate-fadeInUp stagger-1">
            <span style={{ fontSize: '1.2rem', display: 'block', fontWeight: 400, color: '#e2e8f0', marginBottom: '10px' }}>Welcome to</span>
            <span className="village-name">Seetharampuram</span>
            <span className="village-thanda">Thanda</span>
          </h1>

          <p className="hero-subtitle animate-fadeInUp stagger-2" style={{ maxWidth: '700px', fontSize: '1.15rem' }}>
            A vibrant Lambadi community with over 80 years of rich heritage, culture, and enduring spirit. Whether you are a tourist, researcher, or NGO partner, we welcome you to explore our story.
          </p>

          <div className="hero-meta animate-fadeInUp stagger-3">
            <div className="meta-item">
              <MapPin size={16} />
              <span style={{
                background: 'rgba(0,0,0,0.55)',
                color: '#fff',
                padding: '4px 14px',
                borderRadius: '20px',
                fontWeight: 600,
                fontSize: '0.85rem',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.15)',
                letterSpacing: '0.02em'
              }}>
                Mylavaram Mandal, NTR District, AP (50 km from Vijayawada)
              </span>
            </div>
          </div>

          <div className="hero-stats animate-fadeInUp stagger-4">
            <div className="hero-stat" ref={popRef}>
              <span className="hero-stat-value">{popCount}</span>
              <span className="hero-stat-label">Residents</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat" ref={hhRef}>
              <span className="hero-stat-value">{hhCount}</span>
              <span className="hero-stat-label">Families</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">80+</span>
              <span className="hero-stat-label">Years of History</span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container">
        
        {/* ═══ CULTURE & HERITAGE (NEW) ═══ */}
        <div className="section" style={{ marginTop: 'var(--space-xl)' }}>
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div className="card" style={{ padding: '0', overflow: 'hidden', borderRadius: 'var(--radius-lg)', position: 'relative', height: '350px' }}>
               {/* This is the placeholder for the video */}
               <img src="/images/dance_1.webp" alt="Lambadi Traditional Dance" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                   <PlayCircle size={64} color="#fff" strokeWidth={1.5} style={{ opacity: 0.9 }} />
                   <p style={{ color: '#fff', fontWeight: 600, marginTop: '8px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Watch Traditional Dance</p>
                 </div>
               </div>
            </div>
            <div className="card" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: 'var(--space-md)' }}>
                <Landmark size={28} className="icon" style={{ verticalAlign: 'middle', marginRight: '10px', color: 'var(--primary-light)' }} />
                Living Traditions
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: 'var(--space-md)' }}>
                Our village is proudly anchored by the vibrant Lambadi (Banjara) community. Deeply rooted in ancestral traditions, we preserve our unique cultural identity through colorful traditional dresses, rhythmic folk dances, and sacred festivals.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: 'var(--space-lg)' }}>
                Every year, the entire village comes alive during the grand <strong>Teez Festival</strong> in the Ashada month, where we seek blessings from Shivalal Maharaj with music, mud idols, and communal harmony.
              </p>
              <button className="btn btn-primary" onClick={() => navigate('/about')}>
                Read Our Full Story
              </button>
            </div>
          </div>
        </div>

        {/* ═══ VILLAGE AT A GLANCE ═══ */}
        <div className="section">
          <h2 className="section-title">
            <Sparkles size={22} className="icon" />
            Village at a Glance
          </h2>
          <div className="grid-4">
            <StatCard icon={HomeIcon} label="Households" value={data.overview.totalHouseholds} desc="Close-knit families" color="teal" delay={0} />
            <StatCard icon={Users} label="Population" value={data.overview.totalPopulation} desc={`${data.demographics.genderDistribution.Male} Male, ${data.demographics.genderDistribution.Female} Female`} color="indigo" delay={100} />
            <StatCard icon={GraduationCap} label="Literacy" value={`${data.education.adultLiteracyRate}%`} desc="Adult literacy rate" color="amber" delay={200} />
            <StatCard icon={Wheat} label="Farming Roots" value="48%" desc="Families dependent on agriculture" color="green" delay={300} />
          </div>
        </div>

        {/* ═══ VILLAGE PHOTO GALLERY ═══ */}
        {galleryPhotos.length > 0 && (
          <div className="section">
            <h2 className="section-title">
              <Image size={22} className="icon" />
              Glimpses of the Village
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '12px',
              marginBottom: 'var(--space-md)'
            }}>
              {galleryPhotos.map((photo, i) => (
                <div
                  key={photo.id || i}
                  className="card"
                  style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => navigate('/gallery')}
                >
                  <div style={{ height: '150px', overflow: 'hidden', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={photo.image_url}
                      alt={photo.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                      onError={e => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '2rem' }}>🖼️</div>
                  </div>
                  <div style={{ padding: '8px 12px' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {photo.title || 'Untitled'}
                    </p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{photo.category}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                className="btn btn-outline"
                onClick={() => navigate('/gallery')}
                style={{ fontSize: '0.85rem' }}
              >
                View Full Gallery <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ═══ RATE VILLAGE / GUESTBOOK ═══ */}
        <div className="section">
          <h2 className="section-title">
            <MessageSquare size={22} className="icon" />
            Visitor Guestbook
          </h2>

          <div style={{ gap: 'var(--space-xl)', maxWidth: '600px', margin: '0 auto' }}>
            <div className="card" style={{ border: '1px solid var(--primary)' }}>
              <h4 style={{ color: 'var(--primary-light)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={18} /> Sign Our Guestbook
              </h4>
              <p className="text-xs text-muted" style={{ marginBottom: '16px' }}>
                Whether you are a local resident, a passing tourist, or a visiting researcher, we would love to hear your thoughts on our village!
              </p>

              {ratingSubmitted ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: 'rgba(34,197,94,0.1)', borderRadius: '8px', color: 'var(--success)' }}>
                  <CheckCircle size={22} />
                  <div>
                    <strong>Message submitted successfully!</strong>
                    <p className="text-xs" style={{ marginTop: '2px', opacity: 0.8 }}>Thank you for signing our guestbook.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRatingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <select
                      name="reviewer_type"
                      value={ratingForm.reviewer_type}
                      onChange={handleRatingChange}
                      required
                      style={{ fontSize: '0.85rem' }}
                    >
                      <option value="visitor">Tourist / Visitor</option>
                      <option value="resident">Local Resident</option>
                      <option value="official">Govt Official</option>
                      <option value="ngo">NGO Member</option>
                      <option value="researcher">Researcher / Student</option>
                    </select>
                    <select
                      name="rating"
                      value={ratingForm.rating}
                      onChange={handleRatingChange}
                      required
                      style={{ fontSize: '0.85rem' }}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                      <option value="4">⭐⭐⭐⭐ (Good)</option>
                      <option value="3">⭐⭐⭐ (Average)</option>
                      <option value="2">⭐⭐ (Fair)</option>
                      <option value="1">⭐ (Poor)</option>
                    </select>
                  </div>
                  <input
                    name="reviewer_name"
                    value={ratingForm.reviewer_name}
                    onChange={handleRatingChange}
                    placeholder="Your name (optional)"
                    style={{ fontSize: '0.85rem' }}
                  />
                  <textarea
                    name="comment"
                    value={ratingForm.comment}
                    onChange={handleRatingChange}
                    rows={3}
                    placeholder="Leave a comment about your experience..."
                    style={{ fontSize: '0.85rem', resize: 'vertical' }}
                  />
                  {ratingError && <p style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{ratingError}</p>}
                  <button type="submit" className="btn btn-primary" disabled={ratingSubmitting}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                    <Send size={14} />
                    {ratingSubmitting ? 'Submitting...' : 'Sign Guestbook'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
