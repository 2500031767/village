import { useEffect, useState, useRef } from 'react';
import {
  Users, Home as HomeIcon, MapPin, Wheat, GraduationCap,
  Zap, Flame, Heart, Building2, TrendingUp, BarChart3,
  ArrowRight, Sparkles, Shield, AlertTriangle, TreePine
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import villageData from '../data/villageData';
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

function ScoreGauge({ score, label, color = 'var(--primary-light)', size = 90 }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 300);
  }, []);

  const offset = circumference - (animated ? (score / 100) * circumference : 0);
  const scoreColor = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--primary-light)' : score >= 40 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="score-gauge">
      <div className="score-gauge-circle" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle className="gauge-bg" cx={size/2} cy={size/2} r={radius} />
          <circle
            className="gauge-fill"
            cx={size/2} cy={size/2} r={radius}
            stroke={color || scoreColor}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="score-gauge-value" style={{ color: color || scoreColor }}>{score}%</span>
      </div>
      <span className="score-gauge-label">{label}</span>
    </div>
  );
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
  '/images/village_drone_view.png',
  '/images/village_community.png',
  '/images/village_temple.png',
  '/images/village_school.png',
  '/images/village_market.png',
  '/images/paddy_field.png',
  '/images/cotton_field.png',
];

export default function Home() {
  const data = villageData;
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const [popCount, popRef] = useCounter(data.overview.totalPopulation);
  const [hhCount, hhRef] = useCounter(data.overview.totalHouseholds);

  const vulnData = [
    { name: 'High Risk', value: data.vulnerability.segmentation['High Risk (60-100)'], color: '#EF4444' },
    { name: 'Vulnerable', value: data.vulnerability.segmentation['Vulnerable (35-59)'], color: '#F59E0B' },
    { name: 'Stable', value: data.vulnerability.segmentation['Stable (15-34)'], color: '#3B82F6' },
    { name: 'Prosperous', value: data.vulnerability.segmentation['Prosperous (0-14)'], color: '#22C55E' },
  ];

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
            <span>Digital Village Initiative</span>
          </div>

          <h1 className="hero-title animate-fadeInUp stagger-1">
            <span className="village-name">Seetharampuram</span>
            <span className="village-thanda">Thanda</span>
          </h1>

          <p className="hero-subtitle animate-fadeInUp stagger-2">
            A comprehensive digital platform showcasing the life, data, and development of our village
          </p>

          <div className="hero-meta animate-fadeInUp stagger-3">
            <div className="meta-item">
              <MapPin size={16} />
              <span>Mylukuru Mandal, Nellore District, Andhra Pradesh</span>
            </div>
          </div>

          <div className="hero-stats animate-fadeInUp stagger-4">
            <div className="hero-stat" ref={popRef}>
              <span className="hero-stat-value">{popCount}</span>
              <span className="hero-stat-label">Population</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat" ref={hhRef}>
              <span className="hero-stat-value">{hhCount}</span>
              <span className="hero-stat-label">Households Surveyed</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">{data.overview.averageFamilySize}</span>
              <span className="hero-stat-label">Avg. Family Size</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">84.6%</span>
              <span className="hero-stat-label">ST Population</span>
            </div>
          </div>
        </div>
      </section>
      {/* ═══ QUICK STATISTICS ═══ */}
      <section className="page-container">
        <div className="section">
          <h2 className="section-title">
            <BarChart3 size={22} className="icon" />
            Quick Statistics
          </h2>
          <div className="grid-4">
            <StatCard icon={HomeIcon} label="Households" value={data.overview.totalHouseholds} desc="Surveyed families" color="teal" delay={0} />
            <StatCard icon={Users} label="Population" value={data.overview.totalPopulation} desc={`${data.demographics.genderDistribution.Male} Male, ${data.demographics.genderDistribution.Female} Female`} color="indigo" delay={100} />
            <StatCard icon={GraduationCap} label="Literacy Rate" value={`${data.education.adultLiteracyRate}%`} desc={`${data.education.enrolledCount} students enrolled`} color="amber" delay={200} />
            <StatCard icon={Wheat} label="Farmers" value={data.occupation.distribution.Farmer} desc={`${data.agriculture.dependencyPercentage}% agriculture dependent`} color="green" delay={300} />
            <StatCard icon={Zap} label="Electricity" value={`${data.housing.electricity.percentage}%`} desc={`${data.housing.electricity.avgHours}hrs avg availability`} color="amber" delay={400} />
            <StatCard icon={Flame} label="LPG Usage" value={`${data.housing.lpgPercentage}%`} desc="Clean cooking fuel adoption" color="red" delay={500} />
            <StatCard icon={Building2} label="Pucca Houses" value="86%" desc={`${data.housing.types['Pucca (Concrete)']} concrete houses`} color="blue" delay={600} />
            <StatCard icon={Heart} label="Under Treatment" value={`${data.health.underTreatmentPercentage}%`} desc={`${data.health.membersWithIssues} members with health issues`} color="red" delay={700} />
          </div>
        </div>

        {/* ═══ VILLAGE DEVELOPMENT INDEX ═══ */}
        <div className="section">
          <h2 className="section-title">
            <TrendingUp size={22} className="icon" />
            Village Development Index
          </h2>

          <div className="development-grid">
            <div className="card overall-score-card">
              <div className="overall-score-inner">
                <ScoreGauge score={data.swotAnalysis.scores.overall} label="Overall Score" size={140} color="var(--primary-light)" />
                <div className="overall-score-text">
                  <h3>Village Development Score</h3>
                  <p>Based on SVR Green Village Rating System by KLEF. Covering education, infrastructure, agriculture, health, water access, and financial inclusion indicators.</p>
                  <span className="badge primary">KLEF • UBA Survey Data</span>
                </div>
              </div>
            </div>

            <div className="card scores-grid">
              <div className="scores-items">
                <ScoreGauge score={data.swotAnalysis.scores.agriculture} label="Agriculture" color="#22C55E" />
                <ScoreGauge score={data.swotAnalysis.scores.infrastructure} label="Infrastructure" color="#3B82F6" />
                <ScoreGauge score={data.swotAnalysis.scores.waterAccess} label="Water Access" color="#06B6D4" />
                <ScoreGauge score={data.swotAnalysis.scores.health} label="Health" color="#EF4444" />
                <ScoreGauge score={data.swotAnalysis.scores.financialInclusion} label="Financial" color="#F59E0B" />
                <ScoreGauge score={data.swotAnalysis.scores.education} label="Education" color="#8B5CF6" />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ VULNERABILITY OVERVIEW ═══ */}
        <div className="section">
          <h2 className="section-title">
            <Shield size={22} className="icon" />
            Household Vulnerability Assessment
          </h2>

          <div className="grid-2">
            <div className="card">
              <div className="chart-card-title">Risk Distribution</div>
              <div className="vuln-chart-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={vulnData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {vulnData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="vuln-legend">
                  {vulnData.map((d, i) => (
                    <div key={i} className="vuln-legend-item">
                      <span className="vuln-dot" style={{ background: d.color }} />
                      <span>{d.name}</span>
                      <span className="vuln-count">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="chart-card-title">
                <AlertTriangle size={18} />
                Key Alerts
              </div>
              <div className="alerts-list">
                <div className="alert-item danger">
                  <span className="alert-pct">55.9%</span>
                  <span>Adult illiteracy — far above national average</span>
                </div>
                <div className="alert-item danger">
                  <span className="alert-pct">59.2%</span>
                  <span>Households without proper drainage</span>
                </div>
                <div className="alert-item warning">
                  <span className="alert-pct">32.4%</span>
                  <span>Individuals without bank accounts</span>
                </div>
                <div className="alert-item warning">
                  <span className="alert-pct">59.2%</span>
                  <span>Below Poverty Line (BPL) households</span>
                </div>
                <div className="alert-item info">
                  <span className="alert-pct">0%</span>
                  <span>Solar panel adoption — zero across village</span>
                </div>
                <div className="alert-item info">
                  <span className="alert-pct">21.4%</span>
                  <span>Population currently under medical treatment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SWOT HIGHLIGHTS ═══ */}
        <div className="section">
          <h2 className="section-title">
            <Sparkles size={22} className="icon" />
            SWOT Highlights
          </h2>
          <div className="grid-2">
            <div className="card swot-card strength">
              <h4>💪 Strengths</h4>
              <ul>
                {data.swotAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="card swot-card weakness">
              <h4>⚠️ Weaknesses</h4>
              <ul>
                {data.swotAnalysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
            <div className="card swot-card opportunity">
              <h4>🚀 Opportunities</h4>
              <ul>
                {data.swotAnalysis.opportunities.map((o, i) => <li key={i}>{o}</li>)}
              </ul>
            </div>
            <div className="card swot-card threat">
              <h4>🔴 Threats</h4>
              <ul>
                {data.swotAnalysis.threats.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* ═══ EXECUTIVE SUMMARY ═══ */}
        <div className="section">
          <div className="card executive-summary">
            <h3><Sparkles size={20} /> Executive Summary</h3>
            <p>{data.swotAnalysis.executiveSummary}</p>
            <div className="exec-tags">
              <span className="badge primary">98 Households Surveyed</span>
              <span className="badge info">UBA Program</span>
              <span className="badge warning">SVR Rating System</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
