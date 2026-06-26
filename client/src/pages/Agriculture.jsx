import { Wheat, Droplets, Bug, TreePine, Tractor } from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import villageData from '../data/villageData';

const COLORS = ['#14B8A6', '#F59E0B', '#6366F1', '#EF4444', '#22C55E', '#3B82F6', '#8B5CF6'];
const tooltipStyle = { contentStyle: { background: '#1A2332', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '8px', color: '#F1F5F9' } };

export default function Agriculture() {
  const ag = villageData.agriculture;

  const cropData = Object.entries(ag.crops.all).map(([name, value]) => ({ name, value }));
  const irrigData = Object.entries(ag.irrigation).map(([name, value]) => ({ name, value }));
  const livestockData = Object.entries(ag.livestock).map(([name, value]) => ({ name, value }));
  const inputData = Object.entries(ag.inputs).map(([name, value]) => ({ name: name.replace('Chemical ', ''), value }));
  const landData = Object.entries(ag.landOwnership).map(([name, value]) => ({ name, value }));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Agriculture Dashboard</h1>
        <p>Crop statistics, land ownership, irrigation, and livestock data</p>
      </div>

      {/* Image Gallery */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden', height: '280px', borderRadius: 'var(--radius-lg)' }}>
          <img src="/images/agriculture_1.webp" alt="Paddy Field" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden', height: '280px', borderRadius: 'var(--radius-lg)' }}>
          <img src="/images/agriculture_2.webp" alt="Cotton Field" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="stat-card">
          <div className="stat-icon green"><Wheat size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Farming Households</div>
            <div className="stat-value">{ag.householdsWithLand}</div>
            <div className="stat-desc">of {villageData.overview.totalHouseholds} total</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><Tractor size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Avg Land Holding</div>
            <div className="stat-value">{ag.avgLandHolding} ac</div>
            <div className="stat-desc">acres per household</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon teal"><Droplets size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Ag Dependency</div>
            <div className="stat-value">{ag.dependencyPercentage}%</div>
            <div className="stat-desc">depend on agriculture</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon indigo"><TreePine size={24} /></div>
          <div className="stat-content">
            <div className="stat-label">Livestock</div>
            <div className="stat-value">{ag.livestockHouseholds}</div>
            <div className="stat-desc">{ag.livestockPercentage}% of households</div>
          </div>
        </div>
      </div>

      {/* Crops & Irrigation */}
      <div className="section">
        <h2 className="section-title"><Wheat size={22} className="icon" />Crop Distribution</h2>
        <div className="grid-2">
          <div className="chart-card card">
            <div className="chart-card-title">All Crops Grown</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cropData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" fill="#22C55E" radius={[6, 6, 0, 0]} name="Households" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="chart-card-title">Crop Type Analysis</div>
            <div style={{ display: 'flex', gap: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
              <div>
                <p className="text-sm text-muted">Cash Crop HHs</p>
                <p className="font-bold" style={{ fontSize: '2rem', color: 'var(--success)' }}>{ag.crops.cashCropHouseholds}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Food Crop HHs</p>
                <p className="font-bold" style={{ fontSize: '2rem', color: 'var(--info)' }}>{ag.crops.foodCropHouseholds}</p>
              </div>
              <div>
                <p className="text-sm text-muted">F:C Ratio</p>
                <p className="font-bold" style={{ fontSize: '2rem', color: 'var(--warning)' }}>{ag.crops.foodToCashRatio}</p>
              </div>
            </div>
            <div className="card" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <p className="text-sm" style={{ color: 'var(--warning)' }}>
                ⚠️ <strong>Cash Crop Dominance:</strong> Cotton alone is grown by 41 households. High dependency on cash crops
                creates vulnerability to market price fluctuations and weather events.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Irrigation & Land */}
      <div className="section">
        <h2 className="section-title"><Droplets size={22} className="icon" />Irrigation & Land</h2>
        <div className="grid-2">
          <div className="chart-card card">
            <div className="chart-card-title">Irrigation Sources</div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={irrigData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {irrigData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card card">
            <div className="chart-card-title">Land Ownership</div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={landData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {landData.map((_, i) => <Cell key={i} fill={COLORS[i + 2]} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Inputs & Livestock */}
      <div className="section">
        <h2 className="section-title"><Bug size={22} className="icon" />Agricultural Inputs & Livestock</h2>
        <div className="grid-2">
          <div className="chart-card card">
            <div className="chart-card-title">Agricultural Inputs Used</div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={inputData} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94A3B8', fontSize: 11 }} width={100} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" fill="#F59E0B" radius={[0, 6, 6, 0]} name="Households" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted mt-sm">Only {ag.inputs['Organic Fertilizers']} households use organic fertilizers</p>
          </div>

          <div className="chart-card card">
            <div className="chart-card-title">Livestock Census</div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={livestockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" fill="#14B8A6" radius={[6, 6, 0, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
