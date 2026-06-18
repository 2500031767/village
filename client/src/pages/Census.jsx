import {
  Users, UserCheck, Baby, UserX, Briefcase, GraduationCap,
  BarChart3, TrendingUp, Shield, Home, Droplets, Wheat,
  Heart, Wallet, AlertTriangle, Car, Tv
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { villageStatsAPI } from '../data/api';
import { useEffect, useState } from 'react';

const tooltipStyle = {
  contentStyle: {
    background: '#1A2332', border: '1px solid rgba(148,163,184,0.1)',
    borderRadius: '8px', color: '#F1F5F9'
  }
};

const COLORS = ['#14B8A6','#6366F1','#F59E0B','#22C55E','#3B82F6','#EC4899','#EF4444','#8B5CF6'];

function toMap(rows = []) {
  const m = {};
  for (const r of rows) m[r.stat_key] = r.stat_value;
  return m;
}

function num(v) { return isNaN(Number(v)) ? 0 : Number(v); }

function KVTable({ data, exclude = [] }) {
  const entries = Object.entries(data).filter(([k]) => !exclude.includes(k));
  if (!entries.length) return <p className="text-sm text-muted">No data yet.</p>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {entries.map(([k, v]) => (
        <div key={k} style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: '0.85rem', borderBottom: '1px solid var(--border)', paddingBottom: '6px'
        }}>
          <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
          <strong>{v}</strong>
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ label, value, max = 100, color = '#14B8A6', suffix = '%' }) {
  const pct = max > 0 ? Math.min((num(value) / max) * 100, 100) : 0;
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <strong>{value}{suffix}</strong>
      </div>
      <div style={{ height: '7px', background: 'var(--bg-surface)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '4px', transition: 'width 0.8s ease' }} />
      </div>
    </div>
  );
}

export default function Census() {
  const [statsRaw, setStatsRaw] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    villageStatsAPI.getAll()
      .then(data => { console.log('Loaded', data.length, 'stats'); setStatsRaw(data); })
      .catch(err  => { console.error(err); setError(err.message); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container"><p className="text-muted">Loading census data…</p></div>;
  if (error)   return (
    <div className="page-container">
      <div className="card" style={{ color: 'var(--danger)', padding: '24px' }}>
        <strong>Error loading data:</strong> {error}<br /><br />
        <button className="btn btn-outline" onClick={() => window.location.reload()}>Retry</button>
      </div>
    </div>
  );

  // Group rows by category
  const by = {};
  for (const row of statsRaw) {
    if (!by[row.category]) by[row.category] = [];
    by[row.category].push(row);
  }

  const overview   = toMap(by['overview']);
  const demo       = toMap(by['demographics']);
  const ageGroups  = toMap(by['age_groups']);
  const social     = toMap(by['social']);
  const educ       = toMap(by['education']);
  const occ        = toMap(by['occupation']);
  const housing    = toMap(by['housing']);
  const water      = toMap(by['water']);
  const agri       = toMap(by['agriculture']);
  const health     = toMap(by['health']);
  const econ       = toMap(by['economics']);
  const income     = toMap(by['income_buckets']);
  const financial  = toMap(by['financial']);
  const schemes    = toMap(by['schemes_coverage']);
  const vehicles   = toMap(by['vehicles']);
  const appliances = toMap(by['appliances']);
  const problems   = toMap(by['problems']);
  const vuln       = toMap(by['vulnerability']);
  const scores     = toMap(by['scores']);

  // ── Gender chart ──
  const genderData = [
    { name: 'Male',   value: num(demo['Male Population']),   color: '#3B82F6' },
    { name: 'Female', value: num(demo['Female Population']), color: '#EC4899' },
  ];

  // ── Age groups chart ──
  const ageData = Object.entries(ageGroups).map(([name, value]) => ({ name, value: num(value) }));

  // ── Social / Caste ──
  const casteColors = ['#14B8A6','#6366F1','#F59E0B','#22C55E'];
  const casteEntries = Object.keys(social).length
    ? Object.entries(social)
    : [['ST',demo['ST Population']||0],['OC',demo['OC Population']||0],
       ['SC',demo['SC Population']||0],['BC',demo['BC Population']||0]];
  const casteTotal = casteEntries.reduce((s,[,v]) => s + num(v), 0);
  const casteData  = casteEntries.map(([name, value], i) => ({
    name, value: num(value), color: casteColors[i % casteColors.length],
    pct: casteTotal > 0 ? ((num(value) / casteTotal) * 100).toFixed(1) : '0.0',
    shortName: name.split(' ')[0]
  }));

  // ── Education chart ──
  const educExclude = ['Adult Literacy Rate (%)','School Enrollment Rate (%)','Adult Illiteracy Count',
    'School Age Population (6-18)','Enrolled Count','Male Illiterate','Female Illiterate',
    'Male Graduates','Female Graduates','Dropout Risk (15-18)'];
  const educData = Object.entries(educ)
    .filter(([k]) => !educExclude.includes(k))
    .map(([name, value]) => ({ name, value: num(value) }));

  // ── Occupation chart ──
  const occData = Object.entries(occ)
    .filter(([k]) => !['Migration Count','Migration %','Unknown'].includes(k))
    .map(([name, value]) => ({ name, value: num(value) }));

  // ── Problems chart ──
  const problemData = Object.entries(problems)
    .map(([name, value]) => ({ name, value: num(value) }))
    .sort((a,b) => b.value - a.value);

  // ── Vulnerability chart ──
  const vulnData = [
    { name: 'High Risk',  value: num(vuln['High Risk (60-100)']),  color: '#EF4444' },
    { name: 'Vulnerable', value: num(vuln['Vulnerable (35-59)']),  color: '#F59E0B' },
    { name: 'Stable',     value: num(vuln['Stable (15-34)']),      color: '#3B82F6' },
    { name: 'Prosperous', value: num(vuln['Prosperous (0-14)']),   color: '#22C55E' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Household Census Dashboard</h1>
        <p>
          {overview['Total Households'] || 98} surveyed households &nbsp;·&nbsp;
          {overview['Total Population'] || 318} residents &nbsp;·&nbsp;
          Seetharampuram Thanda, Mylukuru Mandal
        </p>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-2xl)' }}>
        {[
          { icon: Users,     color: 'teal',   label: 'Total Population', value: overview['Total Population'] || '—', desc: `Avg family: ${overview['Average Family Size'] || '—'}` },
          { icon: UserCheck, color: 'indigo', label: 'Working Age',      value: demo['Working Age (15-60)']    || '—', desc: 'Age 15–60' },
          { icon: Baby,      color: 'amber',  label: 'Children',         value: demo['Children (0-14)']        || '—', desc: 'Age 0–14' },
          { icon: UserX,     color: 'red',    label: 'Seniors',          value: demo['Seniors (60+)']          || '—', desc: 'Age 60+' },
        ].map(({ icon: Icon, color, label, value, desc }) => (
          <div className="stat-card" key={label}>
            <div className={`stat-icon ${color}`}><Icon size={24} /></div>
            <div className="stat-content">
              <div className="stat-label">{label}</div>
              <div className="stat-value">{value}</div>
              <div className="stat-desc">{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Population Analysis ── */}
      <div className="section">
        <h2 className="section-title"><BarChart3 size={22} className="icon" />Population Analysis</h2>
        <div className="grid-2">
          <div className="chart-card card">
            <div className="chart-card-title">Gender Distribution</div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                  paddingAngle={4} dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}>
                  {genderData.map((e,i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            {genderData[0].value > 0 && (
              <p className="text-center text-sm text-muted mt-sm">
                {Math.round((genderData[1].value / genderData[0].value) * 1000)} females per 1000 males
              </p>
            )}
          </div>

          <div className="chart-card card">
            <div className="chart-card-title">Age Group Distribution</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ageData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94A3B8', fontSize: 10 }} width={130} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" fill="#14B8A6" radius={[0,6,6,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Social Categories ── */}
      <div className="section">
        <h2 className="section-title"><Shield size={22} className="icon" />Social Categories</h2>
        <div className="grid-2">
          <div className="chart-card card">
            <div className="chart-card-title">Caste Distribution</div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={casteData} cx="50%" cy="50%" innerRadius={55} outerRadius={100}
                  paddingAngle={3} dataKey="value"
                  label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent*100).toFixed(1)}%`}>
                  {casteData.map((e,i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip {...tooltipStyle} formatter={(v,n) => [`${v} people (${casteTotal>0?((v/casteTotal)*100).toFixed(1):0}%)`,n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="chart-card-title">Category Breakdown</div>
            <p className="text-xs text-muted" style={{ marginBottom: '16px' }}>
              Total: <strong>{casteTotal}</strong> people &nbsp;|&nbsp; Editable via Admin → Village Stats
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {casteData.map(c => (
                <div key={c.name}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'5px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <span style={{ width:'12px', height:'12px', borderRadius:'3px', background:c.color, display:'inline-block', flexShrink:0 }} />
                      <span style={{ fontWeight:600, fontSize:'0.9rem' }}>{c.name}</span>
                    </div>
                    <div>
                      <strong style={{ fontSize:'1.05rem' }}>{c.value}</strong>
                      <span style={{ marginLeft:'8px', background:`${c.color}22`, color:c.color,
                        padding:'2px 8px', borderRadius:'20px', fontSize:'0.78rem', fontWeight:700 }}>
                        {c.pct}%
                      </span>
                    </div>
                  </div>
                  <div style={{ height:'8px', background:'var(--bg-surface)', borderRadius:'6px', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${c.pct}%`, background:c.color, borderRadius:'6px', transition:'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
            </div>
            {casteData[0]?.value > 0 && (
              <div style={{ marginTop:'16px', padding:'10px 14px', background:`${casteData[0].color}15`,
                borderLeft:`3px solid ${casteData[0].color}`, borderRadius:'6px', fontSize:'0.85rem' }}>
                <strong style={{ color:casteData[0].color }}>{casteData[0].shortName}</strong>{' '}
                is dominant at <strong>{casteData[0].pct}%</strong> ({casteData[0].value} people).
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Education ── */}
      <div className="section">
        <h2 className="section-title"><GraduationCap size={22} className="icon" />Education</h2>
        <div className="grid-2">
          <div className="chart-card card">
            <div className="chart-card-title">Education Levels</div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={educData} margin={{ bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="name" tick={{ fill:'#94A3B8', fontSize:10 }} angle={-30} textAnchor="end" />
                <YAxis tick={{ fill:'#94A3B8', fontSize:12 }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" fill="#6366F1" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="chart-card-title">Education Insights</div>
            <ProgressBar label="Adult Literacy Rate"  value={educ['Adult Literacy Rate (%)']      || 0} color="#F59E0B" />
            <ProgressBar label="School Enrollment"    value={educ['School Enrollment Rate (%)']   || 0} color="#22C55E" />
            <h4 style={{ margin:'16px 0 12px', fontSize:'0.9rem' }}>Gender Education Gap</h4>
            <div style={{ display:'flex', gap:'var(--space-lg)', flexWrap:'wrap' }}>
              {[
                { label:'Male Illiterate',   key:'Male Illiterate',   color:'var(--text-primary)' },
                { label:'Female Illiterate', key:'Female Illiterate', color:'var(--danger)' },
                { label:'Male Graduates',    key:'Male Graduates',    color:'var(--success)' },
                { label:'Female Graduates',  key:'Female Graduates',  color:'var(--warning)' },
              ].map(({ label, key, color }) => (
                <div key={key}>
                  <p className="text-sm text-muted">{label}</p>
                  <p className="font-bold" style={{ fontSize:'1.4rem', color }}>{educ[key] || 0}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop:'16px', display:'flex', gap:'24px', flexWrap:'wrap' }}>
              <div><p className="text-sm text-muted">Adult Illiteracy</p><p className="font-bold" style={{ fontSize:'1.4rem', color:'var(--danger)' }}>{educ['Adult Illiteracy Count'] || 0}</p></div>
              <div><p className="text-sm text-muted">Dropout Risk</p><p className="font-bold" style={{ fontSize:'1.4rem', color:'var(--warning)' }}>{educ['Dropout Risk (15-18)'] || 0}</p></div>
              <div><p className="text-sm text-muted">Enrolled</p><p className="font-bold" style={{ fontSize:'1.4rem', color:'var(--success)' }}>{educ['Enrolled Count'] || 0}</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Occupation ── */}
      <div className="section">
        <h2 className="section-title"><Briefcase size={22} className="icon" />Occupations</h2>
        <div className="grid-2">
          <div className="chart-card card">
            <div className="chart-card-title">Occupation Distribution</div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={occData} cx="50%" cy="50%" outerRadius={105} paddingAngle={2} dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}>
                  {occData.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div className="chart-card-title">Occupation Stats</div>
            <KVTable data={occ} />
          </div>
        </div>
      </div>

      {/* ── Housing ── */}
      <div className="section">
        <h2 className="section-title"><Home size={22} className="icon" />Housing & Infrastructure</h2>
        <div className="grid-2">
          <div className="card">
            <div className="chart-card-title">Housing Stats</div>
            <KVTable data={housing} />
          </div>
          <div className="card">
            <div className="chart-card-title">Water Access</div>
            <KVTable data={water} />
          </div>
        </div>
      </div>

      {/* ── Agriculture ── */}
      <div className="section">
        <h2 className="section-title"><Wheat size={22} className="icon" />Agriculture</h2>
        <div className="grid-2">
          <div className="card">
            <div className="chart-card-title">Crop & Land Data</div>
            <KVTable data={agri} exclude={['Goats','Buffaloes','Sheep','Cows']} />
          </div>
          <div className="card">
            <div className="chart-card-title">Livestock</div>
            {['Goats','Buffaloes','Sheep','Cows'].map(k => (
              agri[k] ? (
                <ProgressBar key={k} label={k} value={num(agri[k])} max={100} color="#22C55E" suffix="" />
              ) : null
            ))}
            <div style={{ marginTop:'16px' }}>
              <KVTable data={{ 'Livestock Households': agri['Livestock Households'] || '—', 'Livestock %': agri['Livestock %'] || '—' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Health ── */}
      <div className="section">
        <h2 className="section-title"><Heart size={22} className="icon" />Health</h2>
        <div className="grid-2">
          <div className="card">
            <div className="chart-card-title">Health Overview</div>
            <ProgressBar label="Under Treatment %" value={health['Under Treatment %'] || 0} color="#EF4444" />
            <div style={{ marginTop:'12px' }}>
              <KVTable data={health} exclude={['Under Treatment %']} />
            </div>
          </div>
          <div className="card">
            <div className="chart-card-title">Government Schemes Coverage</div>
            <KVTable data={schemes} />
          </div>
        </div>
      </div>

      {/* ── Economics & Financial ── */}
      <div className="section">
        <h2 className="section-title"><Wallet size={22} className="icon" />Economics & Financial Inclusion</h2>
        <div className="grid-2">
          <div className="card">
            <div className="chart-card-title">Economics</div>
            <KVTable data={econ} />
            <h4 style={{ marginTop:'16px', marginBottom:'10px', fontSize:'0.88rem' }}>Income Distribution</h4>
            <KVTable data={income} />
          </div>
          <div className="card">
            <div className="chart-card-title">Financial Inclusion</div>
            <ProgressBar label="No Bank Account %" value={financial['No Bank Account %'] || 0} color="#EF4444" />
            <div style={{ marginTop:'12px' }}>
              <KVTable data={financial} exclude={['No Bank Account %']} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Problems ── */}
      <div className="section">
        <h2 className="section-title"><AlertTriangle size={22} className="icon" />Village Problems (Priority)</h2>
        <div className="chart-card card">
          <div className="chart-card-title">Problem Categories by Household Count</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={problemData} margin={{ bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
              <XAxis dataKey="name" tick={{ fill:'#94A3B8', fontSize:11 }} />
              <YAxis tick={{ fill:'#94A3B8', fontSize:11 }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill="#EF4444" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Vulnerability ── */}
      <div className="section">
        <h2 className="section-title"><TrendingUp size={22} className="icon" />Vulnerability & Development Scores</h2>
        <div className="grid-2">
          <div className="chart-card card">
            <div className="chart-card-title">Household Risk Segmentation</div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={vulnData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                  paddingAngle={3} dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}>
                  {vulnData.map((e,i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="chart-card-title">SVR Development Scores</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginTop:'8px' }}>
              {Object.entries(scores).map(([k,v]) => (
                <ProgressBar key={k} label={k} value={v} max={100} color="var(--primary-light)" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Vehicles & Appliances ── */}
      <div className="section">
        <h2 className="section-title"><Car size={22} className="icon" />Vehicles & Appliances</h2>
        <div className="grid-2">
          <div className="card">
            <div className="chart-card-title">Vehicles</div>
            <KVTable data={vehicles} />
          </div>
          <div className="card">
            <div className="chart-card-title">Household Appliances</div>
            <KVTable data={appliances} />
          </div>
        </div>
      </div>

    </div>
  );
}
