import { Building2, Zap, Droplets, Home, Wifi, Flame, Sun, Smartphone, Car } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import villageData from '../data/villageData';

const COLORS = ['#14B8A6', '#6366F1', '#F59E0B', '#EF4444', '#22C55E', '#3B82F6', '#8B5CF6'];
const tooltipStyle = { contentStyle: { background: '#1A2332', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px', color: '#F1F5F9' } };

export default function Infrastructure() {
  const h = villageData.housing;
  const v = villageData.vehicles;
  const ap = villageData.appliances;

  const houseTypeData = Object.entries(h.types).map(([name, value]) => ({ name, value }));
  const waterData = Object.entries(h.drinkingWater).map(([name, value]) => ({ name, value }));
  const drainData = Object.entries(h.drainage).map(([name, value]) => ({ name, value }));
  const fuelData = Object.entries(h.cookingFuel).map(([name, value]) => ({ name, value }));
  const toiletData = Object.entries(h.toilet).map(([name, value]) => ({ name, value }));
  const applianceData = Object.entries(ap.counts).map(([name, value]) => ({ name, value }));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Infrastructure Dashboard</h1>
        <p>Housing, utilities, water, drainage, and mobility data</p>
      </div>

      <div className="grid-5" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="stat-card">
          <div className="stat-icon teal"><Zap size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Electricity</div>
            <div className="stat-value">{h.electricity.percentage}%</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><Flame size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">LPG</div>
            <div className="stat-value">{h.lpgPercentage}%</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><Sun size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Solar</div>
            <div className="stat-value">{h.solarPanels.percentage}%</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon indigo"><Car size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Vehicle</div>
            <div className="stat-value">{v.ownershipPercentage}%</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><Home size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Own House</div>
            <div className="stat-value">91%</div>
          </div>
        </div>
      </div>

      {/* Housing & Toilet */}
      <div className="section">
        <h2 className="section-title"><Building2 size={22} className="icon" />Housing & Sanitation</h2>
        <div className="grid-2">
          <div className="chart-card card">
            <div className="chart-card-title">House Types</div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={houseTypeData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {houseTypeData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card card">
            <div className="chart-card-title">Toilet Facilities</div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={toiletData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {toiletData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Water & Drainage */}
      <div className="section">
        <h2 className="section-title"><Droplets size={22} className="icon" />Water & Drainage</h2>
        <div className="grid-2">
          <div className="chart-card card">
            <div className="chart-card-title">Drinking Water Sources</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={waterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card card">
            <div className="chart-card-title">Drainage Status</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={drainData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted mt-sm">⚠️ {h.drainageGapPercentage}% households lack proper drainage</p>
          </div>
        </div>
      </div>

      {/* Appliances & Vehicles */}
      <div className="section">
        <h2 className="section-title"><Smartphone size={22} className="icon" />Appliances & Mobility</h2>
        <div className="grid-2">
          <div className="chart-card card">
            <div className="chart-card-title">Household Appliances</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={applianceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted mt-sm">{ap.householdsWithout} households have no electronic appliances</p>
          </div>

          <div className="card">
            <div className="chart-card-title">Vehicle Ownership</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
              {[
                { label: '2-Wheelers (Petrol)', val: v.petrol2Wheelers, icon: '🏍️' },
                { label: '2-Wheelers (EV)', val: v.electric2Wheelers, icon: '⚡' },
                { label: 'Cycles', val: v.cycles, icon: '🚲' },
                { label: 'Cars', val: v.petrolCars + v.dieselCars, icon: '🚗' },
                { label: 'Other Vehicles', val: v.other, icon: '🚜' },
                { label: 'EV Adoption', val: `${v.evAdoptionRate}%`, icon: '🔋' },
              ].map((item, i) => (
                <div key={i} className="card" style={{ background: 'var(--bg-surface)', padding: 'var(--space-md)' }}>
                  <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                  <p className="text-xs text-muted mt-sm">{item.label}</p>
                  <p className="font-bold" style={{ fontSize: '1.25rem' }}>{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cooking Fuel & Network */}
      <div className="section">
        <h2 className="section-title"><Wifi size={22} className="icon" />Connectivity & Fuel</h2>
        <div className="grid-2">
          <div className="chart-card card">
            <div className="chart-card-title">Cooking Fuel</div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={fuelData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {fuelData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div className="chart-card-title">Mobile Network Providers</div>
            {Object.entries(h.mobileNetwork).map(([provider, count]) => (
              <div className="progress-bar-wrapper" key={provider}>
                <div className="progress-bar-header">
                  <span className="progress-bar-label">{provider}</span>
                  <span className="progress-bar-value">{count}</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${(count / 98) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
