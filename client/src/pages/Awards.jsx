import { useState, useEffect } from 'react';
import { Trophy, Globe, Heart, Sprout, BookOpen, Activity, Users, Droplets, Sun, Zap, ShieldCheck, Award, Star, CheckCircle, Loader, Medal, Crown, BadgeCheck } from 'lucide-react';
import { awardsAPI } from '../data/api';
import './Awards.css';

const IconMap = {
  Award, Heart, Sprout, Globe, ShieldCheck, Star, CheckCircle, Users, Trophy, BookOpen, Activity, Droplets, Sun, Zap, Medal, Crown, BadgeCheck
};

export default function Awards() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const data = await awardsAPI.getAll();
        setAwards(data);
      } catch (error) {
        console.error("Failed to fetch awards", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAwards();
  }, []);

  const sdgAwards = awards.filter(a => a.category === 'sdg');
  const hldgAwards = awards.filter(a => a.category === 'hldg');

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '80vh', flexDirection: 'column', gap: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader size={36} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <p className="text-secondary">Loading awards...</p>
      </div>
    );
  }

  return (
    <div className="page-container awards-page">
      <header className="page-header awards-header animate-fadeInUp">
        <div className="header-content">
          <Trophy className="header-icon" size={56} />
          <h1>Awards & Recognitions</h1>
          <p>Celebrating our milestones in Sustainable Development and Human Life Progress.</p>
        </div>
      </header>

      <section className="section awards-section animate-fadeInUp stagger-1">
        <div className="section-title">
          <Globe className="icon" size={28} />
          Sustainable Development Goals (SDGs)
        </div>
        <p className="text-secondary mb-lg">
          Our commitment to the UN's Sustainable Development Goals has been recognized across multiple domains, reflecting our dedication to a sustainable and prosperous future.
        </p>
        <div className="grid-3">
          {sdgAwards.length === 0 ? (
            <p className="text-secondary">No SDG awards have been added yet.</p>
          ) : sdgAwards.map((award, index) => {
            const IconComponent = IconMap[award.icon_name] || Award;
            return (
              <div className="card award-card" key={index}>
                <div className="award-icon-wrapper" style={{ backgroundColor: `${award.color}15`, color: award.color }}>
                  <IconComponent size={32} />
                </div>
                <div className="award-content">
                  <span className="badge" style={{ backgroundColor: `${award.color}20`, color: award.color, alignSelf: 'flex-start' }}>{award.year}</span>
                  <h3 className="mt-sm">{award.title}</h3>
                  <p className="text-secondary text-sm">{award.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section awards-section animate-fadeInUp stagger-2">
        <div className="section-title">
          <Heart className="icon" size={28} />
          Human Life Development Goals
        </div>
        <p className="text-secondary mb-lg">
          Focused on the core metrics of human well-being, our initiatives have led to prestigious accolades in elevating the quality of life for all residents.
        </p>
        <div className="grid-3">
          {hldgAwards.length === 0 ? (
            <p className="text-secondary">No HLDG awards have been added yet.</p>
          ) : hldgAwards.map((award, index) => {
            const IconComponent = IconMap[award.icon_name] || Award;
            return (
              <div className="card award-card" key={index}>
                <div className="award-icon-wrapper" style={{ backgroundColor: `${award.color}15`, color: award.color }}>
                  <IconComponent size={32} />
                </div>
                <div className="award-content">
                  <span className="badge" style={{ backgroundColor: `${award.color}20`, color: award.color, alignSelf: 'flex-start' }}>{award.year}</span>
                  <h3 className="mt-sm">{award.title}</h3>
                  <p className="text-secondary text-sm">{award.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
