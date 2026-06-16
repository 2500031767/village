import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, Info, BarChart3, Wheat, GraduationCap, Heart,
  Building2, Shield, AlertTriangle, Bell, Store, Image,
  Globe, Plane, Monitor, Phone, ChevronLeft, ChevronRight,
  Menu, X, Sparkles, Users, ClipboardList
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/about', label: 'About Village', icon: Info },
  { path: '/census', label: 'Census Dashboard', icon: Users },
  { path: '/agriculture', label: 'Agriculture', icon: Wheat },
  { path: '/education', label: 'Education', icon: GraduationCap },
  { path: '/healthcare', label: 'Healthcare', icon: Heart },
  { path: '/infrastructure', label: 'Infrastructure', icon: Building2 },
  { path: '/schemes', label: 'Govt. Schemes', icon: Shield },
  { path: '/issues', label: 'Village Issues', icon: AlertTriangle },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/businesses', label: 'Business Directory', icon: Store },
  { path: '/gallery', label: 'Gallery', icon: Image },
  { path: '/nri', label: 'NRI & Migrants', icon: Plane },
  { path: '/services', label: 'Digital Services', icon: Monitor },
  { path: '/insights', label: 'AI Insights', icon: Sparkles },
  { path: '/survey', label: 'Survey & Credits', icon: ClipboardList },
  { path: '/contact', label: 'Contact', icon: Phone },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setCollapsed]);

  return (
    <>
      {/* Mobile hamburger */}
      <button className="sidebar-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">🏘️</div>
            {!collapsed && (
              <div className="logo-text">
                <span className="logo-title">Seetharampuram</span>
                <span className="logo-subtitle">Digital Village</span>
              </div>
            )}
          </div>
          <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={20} />
              {!collapsed && <span>{label}</span>}
              {collapsed && <span className="sidebar-tooltip">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!collapsed && (
            <div className="sidebar-footer-text">
              <span>Powered by</span>
              <span className="footer-brand">KLEF • UBA</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
