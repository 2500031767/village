import { 
  Store, Phone, MapPin, Search, 
  ShoppingCart, Wrench, Pill, Droplet, 
  Scissors, Sprout, ChefHat, Zap, Lightbulb 
} from 'lucide-react';
import { useState } from 'react';

const businesses = [
  { name: 'Sri Lakshmi Kirana Store', owner: 'Narayana Reddy', phone: '9876543210', location: 'Main Road', type: 'Grocery Store', icon: ShoppingCart },
  { name: 'Venkatesh Auto Repairs', owner: 'Venkatesh Kumar', phone: '9876543211', location: 'Near Bus Stop', type: 'Mechanic', icon: Wrench },
  { name: 'Sai Medical Store', owner: 'Sai Prasad', phone: '9876543212', location: 'Near Panchayat Office', type: 'Medical Store', icon: Pill },
  { name: 'Balaji Dairy Center', owner: 'Balaji Naidu', phone: '9876543213', location: 'South Colony', type: 'Dairy', icon: Droplet },
  { name: 'Padma Tailoring Center', owner: 'Padma Devi', phone: '9876543214', location: 'Temple Street', type: 'Tailor', icon: Scissors },
  { name: 'Raju Fertilizer Shop', owner: 'Raju Yadav', phone: '9876543215', location: 'Main Road', type: 'Agriculture Supply', icon: Sprout },
  { name: 'Sri Krishna Hair Salon', owner: 'Krishna Babu', phone: '9876543216', location: 'Market Area', type: 'Salon', icon: Scissors },
  { name: 'Anitha Tiffin Center', owner: 'Anitha Kumari', phone: '9876543217', location: 'School Road', type: 'Food Stall', icon: ChefHat },
  { name: 'Bharath Welding Works', owner: 'Bharath Kumar', phone: '9876543218', location: 'Industrial Area', type: 'Welder', icon: Zap },
  { name: 'Hari Electricals', owner: 'Hari Prasad', phone: '9876543219', location: 'Main Road', type: 'Electrician', icon: Lightbulb },
];

export default function BusinessDirectory() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const types = ['All', ...new Set(businesses.map(b => b.type))];
  const filtered = businesses.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.type.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || b.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Business Directory</h1>
        <p>Local shops, services, and businesses in Seetharampuram Thanda</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-md mb-lg" style={{ flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search businesses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '40px' }}
          />
        </div>
        <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
          {types.map(t => (
            <button
              key={t}
              className={`btn ${filter === t ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(t)}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-3">
        {filtered.map((b, i) => {
          const Icon = b.icon;
          return (
            <div className="card" key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="flex" style={{ gap: 'var(--space-md)', alignItems: 'center' }}>
                <div style={{ padding: '12px', background: 'var(--primary-light)', color: '#fff', borderRadius: '12px', display: 'flex' }}>
                  <Icon size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', lineHeight: 1.3 }}>{b.name}</h4>
                  <span className="badge primary" style={{ marginTop: '4px' }}>{b.type}</span>
                </div>
              </div>
              <div className="flex-col gap-sm">
              <div className="flex gap-sm" style={{ alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <Store size={14} /> <span>{b.owner}</span>
              </div>
              <div className="flex gap-sm" style={{ alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <Phone size={14} /> <a href={`tel:${b.phone}`} style={{ color: 'var(--primary-light)' }}>{b.phone}</a>
              </div>
              <div className="flex gap-sm" style={{ alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <MapPin size={14} /> <span>{b.location}</span>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}
