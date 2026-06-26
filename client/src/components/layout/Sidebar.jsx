import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, Info, BarChart3, Wheat, GraduationCap, Heart, Star,
  Building2, Shield, AlertTriangle, Bell, Store, Image,
  Globe, Plane, Monitor, Phone, ChevronLeft, ChevronRight,
  Menu, X, Sparkles, Users, ClipboardList, Lock, Award, User, Trophy, Camera
} from 'lucide-react';
import { authAPI } from '../../data/api';
import LanguageSwitcher from './LanguageSwitcher';
import './Sidebar.css';

const navGroups = [
  {
    title: 'Discover Seetharampuram',
    items: [
      { path: '/',              label: 'Home',               icon: Home },
      { path: '/about',         label: 'About Village',       icon: Info },
      { path: '/gallery',       label: 'Gallery & Media',     icon: Camera },
      { path: '/contact',       label: 'Contact Us',          icon: Phone },
    ]
  },
  {
    title: 'Community Life',
    items: [
      { path: '/agriculture',   label: 'Agriculture',         icon: Wheat },
      { path: '/education',     label: 'Education',           icon: GraduationCap },
      { path: '/healthcare',    label: 'Healthcare',          icon: Heart },
      { path: '/businesses',    label: 'Local Businesses',    icon: Store },
    ]
  },
  {
    title: 'Development & Data',
    items: [
      { path: '/infrastructure',label: 'Infrastructure',      icon: Building2 },
      { path: '/census',        label: 'Census Data',         icon: Users },
      { path: '/schemes',       label: 'Govt. Schemes',       icon: Shield },
      { path: '/issues',        label: 'Village Issues',      icon: AlertTriangle },
      { path: '/highlights',    label: 'Village Highlights',  icon: Award },
      { path: '/awards',        label: 'Awards & Goals',      icon: Trophy },
    ]
  },
  {
    title: 'Services & Research',
    items: [
      { path: '/services',      label: 'Digital Services',    icon: Monitor },
      { path: '/nri',           label: 'NRI Connect',         icon: Plane },
      { path: '/insights',      label: 'AI Insights',         icon: Sparkles },
      { path: '/survey',        label: 'Survey Data',         icon: ClipboardList },
    ]
  },
  {
    title: 'Personal',
    items: [
      { path: '/notifications', label: 'Notifications',       icon: Bell },
      { path: '/user-dashboard',label: 'User Dashboard',      icon: User },
    ]
  }
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuth, setIsAuth]         = useState(false);
  const location                     = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setIsAuth(authAPI.isAuthenticated());
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) setCollapsed(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setCollapsed]);

  return (
    <>
      <button className="sidebar-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">🏘️</div>
            {!collapsed && (
              <div className="logo-text">
                <span className="logo-title">Seetharampuram</span>
                <span className="logo-subtitle">Village Portal</span>
              </div>
            )}
          </div>
          <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher collapsed={collapsed} />

        <nav className="sidebar-nav" style={{ paddingBottom: 'var(--space-md)' }}>
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="sidebar-group">
              {!collapsed && <div className="sidebar-group-title" style={{ padding: '12px 16px 4px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>{group.title}</div>}
              {collapsed && groupIdx > 0 && <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 'var(--space-sm) 0' }} />}
              
              {group.items.map(({ path, label, icon: Icon }) => (
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
            </div>
          ))}

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 'var(--space-sm) 0' }} />

          <NavLink
            to={isAuth ? '/admin' : '/login'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => isActive ? {} : { color: 'var(--accent-light)' }}
            title={collapsed ? (isAuth ? 'Admin Workspace' : 'Admin Login') : undefined}
          >
            <Lock size={20} />
            {!collapsed && <span>{isAuth ? 'Admin Workspace' : 'Admin Login'}</span>}
            {collapsed && <span className="sidebar-tooltip">{isAuth ? 'Admin Workspace' : 'Admin Login'}</span>}
          </NavLink>
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
