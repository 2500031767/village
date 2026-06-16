import {
  Store, Phone, MapPin, Search, Loader,
  ShoppingCart, Wrench, Pill, Droplet,
  Scissors, Sprout, ChefHat, Zap, Lightbulb
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { businessesAPI } from '../data/api';

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

const iconMap = {
  'Grocery Store': ShoppingCart,
  'Mechanic': Wrench,
  'Medical Store': Pill,
  'Dairy Center': Droplet,
  'Dairy': Droplet,
  'Tailor': Scissors,
  'Agriculture Supply': Sprout,
  'Salon': Scissors,
  'Food Stall': ChefHat,
  'Welder': Zap,
  'Electrician': Lightbulb
};

function getIcon(type) {
  return iconMap[type] || Store;
}

export default function BusinessDirectory() {
  const [businessesList, setBusinessesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await businessesAPI.getAll();
        setBusinessesList(data.length > 0 ? data : businesses);
      } catch (err) {
        console.warn('Failed to load businesses from API, falling back to static:', err);
        setBusinessesList(businesses);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const types = ['All', ...new Set(businessesList.map(b => b.type || b.business_type))];
  const filtered = businessesList.filter(b => {
    const name = b.name || '';
    const type = b.type || b.business_type || '';
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || type.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || type === filter;
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
          const Icon = b.icon || getIcon(b.business_type);
          const owner = b.owner || b.owner_name || 'N/A';
          const type = b.type || b.business_type || 'N/A';
          return (
            <div className="card" key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="flex" style={{ gap: 'var(--space-md)', alignItems: 'center' }}>
                <div style={{ padding: '12px', background: 'var(--primary-light)', color: '#fff', borderRadius: '12px', display: 'flex' }}>
                  <Icon size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', lineHeight: 1.3 }}>{b.name}</h4>
                  <span className="badge primary" style={{ marginTop: '4px' }}>{type}</span>
                </div>
              </div>
              <div className="flex-col gap-sm">
                <div className="flex gap-sm" style={{ alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <Store size={14} /> <span>{owner}</span>
                </div>
                <div className="flex gap-sm" style={{ alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <Phone size={14} /> {b.phone ? <a href={`tel:${b.phone}`} style={{ color: 'var(--primary-light)' }}>{b.phone}</a> : <span>N/A</span>}
                </div>
                <div className="flex gap-sm" style={{ alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <MapPin size={14} /> <span>{b.location || 'N/A'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
