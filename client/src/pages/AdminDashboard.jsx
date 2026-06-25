import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  authAPI, businessesAPI, notificationsAPI,
  galleryAPI, schemesAPI, issuesAPI,
  nriProjectsAPI, volunteerAPI, censusAPI, villageStatsAPI, awardsAPI
} from '../data/api';
import {
  Store, Bell, Image, Shield, AlertTriangle,
  Heart, HandHeart, Plus, Trash2, Edit3,
  LogOut, LogIn, User, Loader, CheckCircle, HelpCircle, Users, BarChart3, Award, Star
} from 'lucide-react';
import VillageStats1 from './VillageStats1';
import VillageStats2 from './VillageStats2';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('notifications');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    notifications: [],
    businesses: [],
    gallery: [],
    schemes: [],
    issues: [],
    projects: [],
    volunteers: [],
    census: [],
    villagestats: [],
    svrratings: [],
    awards: []
  });

  // State for admin credential form
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPwd, setAdminPwd] = useState('');
  // Load stored admin credentials when tab is active
  useEffect(() => {
    if (activeTab === 'admin_user') {
      const stored = JSON.parse(localStorage.getItem('adminUserLogin') || '{}');
      setAdminEmail(stored.email || '');
      setAdminPwd(stored.password || '');
    }
  }, [activeTab]);

  const handleAdminSave = (e) => {
    e.preventDefault();
    if (!adminEmail || !adminPwd) {
      showFeedback('Both email and password are required.', 'danger');
      return;
    }
    const creds = { email: adminEmail, password: adminPwd };
    localStorage.setItem('adminUserLogin', JSON.stringify(creds));
    showFeedback('Admin credentials saved successfully!');
  };

  // Modal & form states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      if (!authAPI.isAuthenticated()) {
        navigate('/login');
        return;
      }
      try {
        const u = await authAPI.verifyToken();
        setUser(u);
        setLoading(false);
      } catch (err) {
        console.error(err);
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  // Fetch data for the active tab
  useEffect(() => {
    if (loading || !user) return;

    const fetchData = async () => {
      setLoading(true);
      console.log('Fetching data for tab:', activeTab);
      try {
        if (activeTab === 'notifications') {
          const res = await notificationsAPI.getAll();
          setData(prev => ({ ...prev, notifications: res }));
        } else if (activeTab === 'businesses') {
          const res = await businessesAPI.getAll();
          setData(prev => ({ ...prev, businesses: res }));
        } else if (activeTab === 'gallery') {
          const res = await galleryAPI.getAll();
          setData(prev => ({ ...prev, gallery: res }));
        } else if (activeTab === 'schemes') {
          const res = await schemesAPI.getAll();
          setData(prev => ({ ...prev, schemes: res }));
        } else if (activeTab === 'issues') {
          const res = await issuesAPI.getAll(true); // include pending
          setData(prev => ({ ...prev, issues: res }));
        } else if (activeTab === 'projects') {
          const res = await nriProjectsAPI.getAll();
          setData(prev => ({ ...prev, projects: res }));
        } else if (activeTab === 'volunteers') {
          const res = await volunteerAPI.getAll();
          setData(prev => ({ ...prev, volunteers: res }));
        } else if (activeTab === 'census') {
          const res = await censusAPI.getAll();
          setData(prev => ({ ...prev, census: res }));
        } else if (activeTab === 'villagestats') {
          const res = await villageStatsAPI.getAll();
          setData(prev => ({ ...prev, villagestats: res }));
        } else if (activeTab === 'svrratings') {
          const res = await villageStatsAPI.getAll();
          setData(prev => ({ ...prev, svrratings: res.filter(r => r.category === 'scores') }));
        } else if (activeTab === 'awards') {
          const res = await awardsAPI.getAll();
          setData(prev => ({ ...prev, awards: res }));
        }
      } catch (err) {
        console.error('Fetch error for', activeTab, err);
        const msg = err?.response?.data?.message || err.message || 'Error fetching data from server.';
        showFeedback(msg, 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, user]);

  const showFeedback = (msg, type = 'success') => {
    setFeedbackMsg({ text: msg, type });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
    window.location.reload();
  };

  // Helper to determine if the current user has admin privileges
  const isAdmin = () => {
    const admin = JSON.parse(localStorage.getItem('adminUserLogin') || '{}');
    return !!admin.email && !!admin.password;
  };

  // Open modal for Create (admin only)
  const openAddModal = () => {
    if (!isAdmin()) {
      showFeedback('Only admin can add new items.', 'danger');
      return;
    }
    setModalMode('add');
    setEditingId(null);

    // Initialize default fields based on active tab
    const defaults = {};
    if (activeTab === 'notifications') {
      defaults.title = '';
      defaults.message = '';
      defaults.type = 'notice';
      defaults.event_date = new Date().toISOString().split('T')[0];
    } else if (activeTab === 'businesses') {
      defaults.name = '';
      defaults.owner_name = '';
      defaults.phone = '';
      defaults.location = '';
      defaults.business_type = '';
      defaults.description = '';
    } else if (activeTab === 'gallery') {
      defaults.title = '';
      defaults.category = 'village';
      defaults.image_url = '';
      defaults.description = '';
    } else if (activeTab === 'schemes') {
      defaults.name = '';
      defaults.category = '';
      defaults.description = '';
      defaults.beneficiary_count = 0;
      defaults.total_eligible = 0;
      defaults.portal_url = '';
    } else if (activeTab === 'issues') {
      defaults.title = '';
      defaults.category = '';
      defaults.description = '';
      defaults.reported_count = 1;
      defaults.priority = 0;
      defaults.status = 'open';
    } else if (activeTab === 'projects') {
      defaults.title = '';
      defaults.description = '';
      defaults.target_amount = 0;
      defaults.collected_amount = 0;
      defaults.status = 'active';
    } else if (activeTab === 'volunteers') {
      defaults.title = '';
      defaults.category = '';
      defaults.description = '';
      defaults.contact_info = '';
    } else if (activeTab === 'census') {
      defaults.year = '';
      defaults.totalPopulation = '';
      defaults.households = '';
      defaults.malePopulation = '';
      defaults.femalePopulation = '';
      defaults.childPopulation = '';
      defaults.seniorPopulation = '';
    } else if (activeTab === 'villagestats') {
      defaults.category = '';
      defaults.stat_key = '';
      defaults.stat_value = '';
      defaults.sort_order = 0;
    } else if (activeTab === 'svrratings') {
      defaults.category = 'scores';
      defaults.stat_key = '';
      defaults.stat_value = '';
      defaults.sort_order = 0;
    } else if (activeTab === 'awards') {
      defaults.title = '';
      defaults.category = 'sdg';
      defaults.description = '';
      defaults.year = new Date().getFullYear().toString();
      defaults.icon_name = 'Award';
      defaults.color = '#3b82f6';
    }

    setFormValues(defaults);
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  // Open modal for Edit
  const openEditModal = (item) => {
  if (!isAdmin()) {
    showFeedback('Only admin can edit items.', 'danger');
    return;
  }
  setModalMode('edit');
  setEditingId(item.id);
  setFormValues({ ...item });
  setImageFile(null);
  // Show existing image as preview if it's a real URL
  if (item.image_url && (item.image_url.startsWith('/') || item.image_url.startsWith('http'))) {
    setImagePreview(item.image_url);
  } else {
    setImagePreview(null);
  }
  setShowModal(true);
};;

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  // Handle Image File Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Submit Form (Save/Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (activeTab === 'notifications') {
        if (modalMode === 'add') {
          const newItem = await notificationsAPI.create(formValues);
          setData(prev => ({ ...prev, notifications: [newItem, ...prev.notifications] }));
          showFeedback('Notification created successfully!');
        } else {
          const updatedItem = await notificationsAPI.update(editingId, formValues);
          setData(prev => ({
            ...prev,
            notifications: prev.notifications.map(item => item.id === editingId ? updatedItem : item)
          }));
          showFeedback('Notification updated successfully!');
        }
      } else if (activeTab === 'businesses') {
        if (modalMode === 'add') {
          const newItem = await businessesAPI.create(formValues);
          setData(prev => ({ ...prev, businesses: [newItem, ...prev.businesses] }));
          showFeedback('Business added successfully!');
        } else {
          const updatedItem = await businessesAPI.update(editingId, formValues);
          setData(prev => ({
            ...prev,
            businesses: prev.businesses.map(item => item.id === editingId ? updatedItem : item)
          }));
          showFeedback('Business updated successfully!');
        }
      } else if (activeTab === 'gallery') {
        if (modalMode === 'add') {
          // Add always requires a file upload — send as FormData
          if (!imageFile) {
            showFeedback('Please select an image to upload.', 'danger');
            setActionLoading(false);
            return;
          }
          const formData = new FormData();
          formData.append('title', formValues.title || '');
          formData.append('category', formValues.category || 'village');
          formData.append('description', formValues.description || '');
          formData.append('image', imageFile);
          const newItem = await galleryAPI.create(formData);
          setData(prev => ({ ...prev, gallery: [newItem, ...prev.gallery] }));
          showFeedback('Gallery photo added successfully!');
        } else {
          // Edit — only use FormData if a new file was selected, otherwise use JSON
          if (imageFile) {
            const formData = new FormData();
            formData.append('title', formValues.title || '');
            formData.append('category', formValues.category || 'village');
            formData.append('description', formValues.description || '');
            formData.append('image', imageFile);
            const updatedItem = await galleryAPI.update(editingId, formData);
            setData(prev => ({
              ...prev,
              gallery: prev.gallery.map(item => item.id === editingId ? updatedItem : item)
            }));
          } else {
            // No new file — send plain JSON, keep existing image_url on the server
            const updatedItem = await galleryAPI.update(editingId, {
              title: formValues.title || '',
              category: formValues.category || 'village',
              description: formValues.description || ''
            });
            setData(prev => ({
              ...prev,
              gallery: prev.gallery.map(item => item.id === editingId ? updatedItem : item)
            }));
          }
          showFeedback('Gallery photo updated successfully!');
        }
      }

      else if (activeTab === 'schemes') {
        if (modalMode === 'add') {
          const newItem = await schemesAPI.create(formValues);
          setData(prev => ({ ...prev, schemes: [newItem, ...prev.schemes] }));
          showFeedback('Government scheme created successfully!');
        } else {
          const updatedItem = await schemesAPI.update(editingId, formValues);
          setData(prev => ({
            ...prev,
            schemes: prev.schemes.map(item => item.id === editingId ? updatedItem : item)
          }));
          showFeedback('Government scheme updated successfully!');
        }
      } else if (activeTab === 'issues') {
        if (modalMode === 'add') {
          const newItem = await issuesAPI.create(formValues);
          setData(prev => ({ ...prev, issues: [newItem, ...prev.issues] }));
          showFeedback('Issue created successfully!');
        } else {
          const updatedItem = await issuesAPI.update(editingId, formValues);
          setData(prev => ({
            ...prev,
            issues: prev.issues.map(item => item.id === editingId ? updatedItem : item)
          }));
          showFeedback('Issue updated successfully!');
        }
      } else if (activeTab === 'census') {
        if (modalMode === 'add') {
          const newItem = await censusAPI.create(formValues);
          setData(prev => ({ ...prev, census: [newItem, ...prev.census] }));
          showFeedback('Census record created successfully!');
        } else {
          const updatedItem = await censusAPI.update(editingId, formValues);
          setData(prev => ({
            ...prev,
            census: prev.census.map(item => item.id === editingId ? updatedItem : item)
          }));
          showFeedback('Census record updated successfully!');
        }
      } else if (activeTab === 'projects') {
        if (modalMode === 'add') {
          const newItem = await nriProjectsAPI.create(formValues);
          setData(prev => ({ ...prev, projects: [newItem, ...prev.projects] }));
          showFeedback('Funding project created successfully!');
        } else {
          const updatedItem = await nriProjectsAPI.update(editingId, formValues);
          setData(prev => ({
            ...prev,
            projects: prev.projects.map(item => item.id === editingId ? updatedItem : item)
          }));
          showFeedback('Funding project updated successfully!');
        }
      } else if (activeTab === 'volunteers') {
        if (modalMode === 'add') {
          const newItem = await volunteerAPI.create(formValues);
          setData(prev => ({ ...prev, volunteers: [newItem, ...prev.volunteers] }));
          showFeedback('Volunteer opportunity created successfully!');
        } else {
          const updatedItem = await volunteerAPI.update(editingId, formValues);
          setData(prev => ({
            ...prev,
            volunteers: prev.volunteers.map(item => item.id === editingId ? updatedItem : item)
          }));
          showFeedback('Volunteer opportunity updated successfully!');
        }
      } else if (activeTab === 'villagestats' || activeTab === 'svrratings') {
        if (modalMode === 'add') {
          const newItem = await villageStatsAPI.upsert(formValues);
          setData(prev => {
            const exists = prev[activeTab].find(i => i.id === newItem.id);
            return {
              ...prev,
              [activeTab]: exists
                ? prev[activeTab].map(i => i.id === newItem.id ? newItem : i)
                : [newItem, ...prev[activeTab]]
            };
          });
          showFeedback(activeTab === 'svrratings' ? 'SVR rating saved successfully!' : 'Village stat saved successfully!');
        } else {
          const updatedItem = await villageStatsAPI.update(editingId, formValues);
          setData(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].map(item => item.id === editingId ? updatedItem : item)
          }));
          showFeedback(activeTab === 'svrratings' ? 'SVR rating updated successfully!' : 'Village stat updated successfully!');
        }
      } else if (activeTab === 'awards') {
        if (modalMode === 'add') {
          const newItem = await awardsAPI.create(formValues);
          setData(prev => ({ ...prev, awards: [newItem, ...prev.awards] }));
          showFeedback('Award created successfully!');
        } else {
          const updatedItem = await awardsAPI.update(editingId, formValues);
          setData(prev => ({
            ...prev,
            awards: prev.awards.map(item => item.id === editingId ? updatedItem : item)
          }));
          showFeedback('Award updated successfully!');
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      showFeedback('Operation failed. Check server log.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Item
  const handleDelete = async (id) => {
    if (!isAdmin()) {
      showFeedback('Only admin can delete items.', 'danger');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      if (activeTab === 'notifications') {
        await notificationsAPI.delete(id);
        setData(prev => ({ ...prev, notifications: prev.notifications.filter(item => item.id !== id) }));
      } else if (activeTab === 'businesses') {
        await businessesAPI.delete(id);
        setData(prev => ({ ...prev, businesses: prev.businesses.filter(item => item.id !== id) }));
      } else if (activeTab === 'gallery') {
        await galleryAPI.delete(id);
        setData(prev => ({ ...prev, gallery: prev.gallery.filter(item => item.id !== id) }));
      } else if (activeTab === 'schemes') {
        await schemesAPI.delete(id);
        setData(prev => ({ ...prev, schemes: prev.schemes.filter(item => item.id !== id) }));
      } else if (activeTab === 'issues') {
        await issuesAPI.delete(id);
        setData(prev => ({ ...prev, issues: prev.issues.filter(item => item.id !== id) }));
      } else if (activeTab === 'census') {
        await censusAPI.delete(id);
        setData(prev => ({ ...prev, census: prev.census.filter(item => item.id !== id) }));
      } else if (activeTab === 'projects') {
        await nriProjectsAPI.delete(id);
        setData(prev => ({ ...prev, projects: prev.projects.filter(item => item.id !== id) }));
      } else if (activeTab === 'volunteers') {
        await volunteerAPI.delete(id);
        setData(prev => ({ ...prev, volunteers: prev.volunteers.filter(item => item.id !== id) }));
      } else if (activeTab === 'villagestats') {
        await villageStatsAPI.delete(id);
        setData(prev => ({ ...prev, villagestats: prev.villagestats.filter(item => item.id !== id) }));
      } else if (activeTab === 'svrratings') {
        await villageStatsAPI.delete(id);
        setData(prev => ({ ...prev, svrratings: prev.svrratings.filter(item => item.id !== id) }));
      } else if (activeTab === 'awards') {
        await awardsAPI.delete(id);
        setData(prev => ({ ...prev, awards: prev.awards.filter(item => item.id !== id) }));
      }
      showFeedback('Item deleted successfully!');
    } catch (err) {
      console.error(err);
      showFeedback('Failed to delete. ' + (err?.response?.data?.error || err.message), 'danger');
    }
  };

  if (loading && !user) {
    return (
      <div className="flex-center" style={{ minHeight: '80vh', flexDirection: 'column', gap: '16px' }}>
        <Loader size={36} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <p className="text-secondary">Verifying credentials and loading database...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header Panel */}
      <div className="flex-between" style={{
        background: 'var(--bg-card)',
        padding: 'var(--space-md) var(--space-lg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--space-xl)',
        flexWrap: 'wrap',
        gap: 'var(--space-md)'
      }}>
        <div className="flex" style={{ gap: 'var(--space-md)', alignItems: 'center' }}>
          <div style={{
            background: 'var(--primary-glow)',
            color: 'var(--primary)',
            padding: '12px',
            borderRadius: '12px'
          }}>
            <Shield size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Admin Workspace</h2>
            <p className="text-xs text-secondary">Logged in as: <strong>{user?.username}</strong></p>
          </div>
        </div>

        <button className="btn btn-outline" onClick={handleLogout} style={{ color: 'var(--danger)', borderColor: 'rgba(211,47,47,0.3)' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      {feedbackMsg && (
        <div className="animate-fadeIn" style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 1000,
          background: feedbackMsg.type === 'danger' ? 'var(--danger)' : 'var(--success)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          <CheckCircle size={18} />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Tabs Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gap: 'var(--space-xl)',
      }} className="grid-layout-admin">

        {/* Navigation Sidebar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'var(--bg-card)',
          padding: 'var(--space-md)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          height: 'fit-content'
        }}>
          {[
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'businesses', label: 'Businesses', icon: Store },
            { id: 'gallery', label: 'Gallery Photos', icon: Image },
            { id: 'schemes', label: 'Govt. Schemes', icon: Shield },
            { id: 'issues', label: 'Village Issues', icon: AlertTriangle },
            { id: 'projects', label: 'NRI Projects', icon: Heart },
            { id: 'volunteers', label: 'Volunteers', icon: HandHeart },
            { id: 'census', label: 'Census', icon: Users },
            { id: 'admin_user', label: 'User Login', icon: User },
            { id: 'villagestats1', label: 'Demographics Stats', icon: BarChart3 },
            { id: 'villagestats2', label: 'Infrastructure Stats', icon: BarChart3 },
            { id: 'awards', label: 'Awards & Goals', icon: Award },
            { id: 'svrratings', label: 'SVR Ratings', icon: Star },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  background: isActive ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : 'transparent',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div style={{
          background: 'var(--bg-card)',
          padding: 'var(--space-lg)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          minHeight: '500px',
          position: 'relative'
        }}>

          <div className="flex-between mb-lg">
            <h3 style={{ textTransform: 'capitalize', fontSize: '1.2rem' }}>
              Manage {activeTab === 'projects' ? 'NRI Fund Projects' : activeTab === 'volunteers' ? 'Volunteer Roles' : activeTab === 'villagestats1' ? 'Demographics Stats' : activeTab === 'villagestats2' ? 'Infrastructure Stats' : activeTab}
            </h3>
            <div className="flex gap-sm">
              {activeTab === 'issues' && (
                <button
                  className="btn btn-outline btn-sm"
                  style={{ padding: '8px 14px', fontSize: '0.78rem', color: 'var(--warning)' }}
                  onClick={async () => {
                    try {
                      await issuesAPI.recalculate();
                      const res = await issuesAPI.getAll(true);
                      setData(prev => ({ ...prev, issues: res }));
                      showFeedback('Priorities recalculated by domain totals!');
                    } catch (e) {
                      showFeedback('Recalculation failed.', 'danger');
                    }
                  }}
                  title="Re-rank all issues by category total reports"
                >
                  ↺ Recalculate Priorities
                </button>
              )}
              <button className="btn btn-primary btn-sm" onClick={openAddModal} style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                <Plus size={16} /> Add New
              </button>
            </div>
          </div>

          {activeTab === 'admin_user' ? (
            <div style={{ padding: 'var(--space-lg)' }}>
              <h3 style={{ marginBottom: 'var(--space-md)' }}>Set Default User Login</h3>
              <form onSubmit={handleAdminSave} className="flex-col gap-md">
                <div className="flex-col gap-sm">
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Email</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div className="flex-col gap-sm">
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Password</label>
                  <input
                    type="text"
                    value={adminPwd}
                    onChange={e => setAdminPwd(e.target.value)}
                    placeholder="password"
                    required
                  />
                </div>
                <div className="flex" style={{ gap: 'var(--space-md)', justifyContent: 'flex-end', marginTop: 'var(--space-md)' }}>
                  <button type="submit" className="btn btn-primary">Save Credentials</button>
                </div>
              </form>
            </div>
          ) : activeTab === 'villagestats1' ? (
            <div style={{ overflowX: 'auto', padding: '10px' }}>
              <VillageStats1 />
            </div>
          ) : activeTab === 'villagestats2' ? (
            <div style={{ overflowX: 'auto', padding: '10px' }}>
              <VillageStats2 />
            </div>
          ) : (
          <div style={{ overflowX: 'auto' }}>
            {renderTable()}
          </div>
        )}

        </div>
      </div>

      {/* CRUD Form Modal Overlay */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: 'var(--space-md)'
        }}>
          <div className="card animate-fadeInUp" style={{
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: 'var(--space-xl)'
          }}>
            <h3 style={{ marginBottom: 'var(--space-lg)', textTransform: 'capitalize' }}>
              {modalMode === 'add' ? 'Add' : 'Edit'}{' '}
              {activeTab === 'villagestats' ? 'Stat' : activeTab === 'svrratings' ? 'SVR Rating' : activeTab.slice(0, -1)}
            </h3>

            <form onSubmit={handleFormSubmit} className="flex-col gap-md">
              {renderFormFields()}

              <div className="flex" style={{ gap: 'var(--space-md)', justifyContent: 'flex-end', marginTop: 'var(--space-md)' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // Render list data inside tables
  function renderTable() {
    const list = data[activeTab] || [];
    if (list.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-muted)' }}>
          <p>No items found. Click "Add New" to insert records into the database.</p>
        </div>
      );
    }

    return (
      <table className="data-table" style={{ width: '100%' }}>
        <thead>
          {activeTab === 'notifications' && (
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          )}
          {activeTab === 'businesses' && (
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Type</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          )}
          {activeTab === 'gallery' && (
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          )}
          {activeTab === 'schemes' && (
            <tr>
              <th>Scheme Name</th>
              <th>Category</th>
              <th>Beneficiaries</th>
              <th>Actions</th>
            </tr>
          )}
          {activeTab === 'issues' && (
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          )}
          {activeTab === 'projects' && (
            <tr>
              <th>Project Title</th>
              <th>Target</th>
              <th>Collected</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          )}
          {activeTab === 'volunteers' && (
            <tr>
              <th>Role</th>
              <th>Category</th>
              <th>Contact Info</th>
              <th>Actions</th>
            </tr>
          )}
          {activeTab === 'census' && (
            <tr>
              <th>Year</th>
              <th>Total Population</th>
              <th>Households</th>
              <th>Male</th>
              <th>Female</th>
              <th>Children</th>
              <th>Senior</th>
              <th>Actions</th>
            </tr>
          )}
          {activeTab === 'awards' && (
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          )}
          {activeTab === 'villagestats' && (
            <tr>
              <th>Category</th>
              <th>Stat Name</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          )}
          {activeTab === 'svrratings' && (
            <tr>
              <th>Metric Name</th>
              <th>Score Value</th>
              <th>Actions</th>
            </tr>
          )}
        </thead>
        <tbody>
          {list.map(item => (
            <tr key={item.id}>
              {activeTab === 'notifications' && (
                <>
                  <td className="font-bold">{item.title}</td>
                  <td><span className={`badge ${item.type === 'notice' ? 'warning' : 'primary'}`}>{item.type}</span></td>
                  <td>{item.event_date || 'N/A'}</td>
                </>
              )}
              {activeTab === 'businesses' && (
                <>
                  <td className="font-bold">{item.name}</td>
                  <td>{item.owner_name || 'N/A'}</td>
                  <td><span className="badge primary">{item.business_type}</span></td>
                  <td>{item.phone || 'N/A'}</td>
                </>
              )}
              {activeTab === 'gallery' && (
                <>
                  <td>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '6px',
                      background: 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      overflow: 'hidden',
                      border: '1px solid var(--border)'
                    }}>
                      {item.image_url && (item.image_url.startsWith('/') || item.image_url.startsWith('http')) ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span>{item.image_url || '🖼️'}</span>
                      )}
                    </div>
                  </td>
                  <td className="font-bold">{item.title || 'Untitled'}</td>
                  <td><span className="badge success">{item.category}</span></td>
                </>
              )}
              {activeTab === 'schemes' && (
                <>
                  <td className="font-bold">{item.name}</td>
                  <td>{item.category || 'N/A'}</td>
                  <td><strong>{item.beneficiary_count}</strong> / {item.total_eligible}</td>
                </>
              )}
              {activeTab === 'issues' && (
                <>
                  <td className="font-bold">{item.title}</td>
                  <td>{item.category || 'N/A'}</td>
                  <td>
                    <span className={`badge ${item.status === 'pending' ? 'warning' :
                      item.status === 'open' ? 'danger' : 'success'
                      }`}>
                      {item.status === 'pending' ? '⏳ Pending Review' : item.status}
                    </span>
                  </td>
                  <td><strong>Priority #{item.priority}</strong></td>
                </>
              )}
              {activeTab === 'projects' && (
                <>
                  <td className="font-bold">{item.title}</td>
                  <td>₹{item.target_amount?.toLocaleString() || 0}</td>
                  <td>₹{item.collected_amount?.toLocaleString() || 0}</td>
                  <td><span className={`badge ${item.status === 'active' ? 'primary' : 'success'}`}>{item.status}</span></td>
                </>
              )}
              {activeTab === 'volunteers' && (
                <>
                  <td className="font-bold">{item.title}</td>
                  <td><span className="badge primary">{item.category}</span></td>
                  <td style={{ fontSize: '0.8rem' }}>{item.contact_info || 'N/A'}</td>
                </>
              )}
              {activeTab === 'census' && (
                <>
                  <td className="font-bold">{item.year}</td>
                  <td>{item.totalPopulation}</td>
                  <td>{item.households}</td>
                  <td>{item.malePopulation}</td>
                  <td>{item.femalePopulation}</td>
                  <td>{item.childPopulation}</td>
                  <td>{item.seniorPopulation}</td>
                </>
              )}
              {activeTab === 'awards' && (
                <>
                  <td className="font-bold">{item.title}</td>
                  <td><span className={`badge ${item.category === 'sdg' ? 'success' : 'primary'}`}>{item.category.toUpperCase()}</span></td>
                  <td>{item.year || 'N/A'}</td>
                </>
              )}
              {activeTab === 'villagestats' && (
                <>
                  <td><span className="badge">{item.category}</span></td>
                  <td className="font-bold">{item.stat_key}</td>
                  <td>{item.stat_value}</td>
                </>
              )}
              {activeTab === 'svrratings' && (
                <>
                  <td className="font-bold">{item.stat_key}</td>
                  <td><span className="badge success" style={{ fontSize: '1rem' }}>{item.stat_value}/100</span></td>
                </>
              )}

              <td>
                <div className="flex gap-sm">
                  {activeTab === 'issues' && item.status === 'pending' && (
                    <button
                      onClick={async () => {
                        try {
                          const updated = await issuesAPI.update(item.id, { status: 'open', priority: 5 });
                          setData(prev => ({
                            ...prev,
                            issues: prev.issues.map(i => i.id === item.id ? updated : i)
                          }));
                          showFeedback('Issue approved and published!');
                        } catch (err) {
                          showFeedback('Failed to approve issue.', 'danger');
                        }
                      }}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: 'rgba(34,197,94,0.15)',
                        color: 'var(--success)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}
                      title="Approve & Publish"
                    >
                      ✓ Approve
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(item)}
                    style={{
                      padding: '6px',
                      borderRadius: '6px',
                      background: 'var(--bg-surface)',
                      color: 'var(--primary-light)',
                      display: 'flex'
                    }}
                    title="Edit Record"
                  >
                    <Edit3 size={14} />
                  </button>
                  {isAdmin() && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        background: 'var(--danger-bg)',
                        color: 'var(--danger)',
                        display: 'flex'
                      }}
                      title="Delete Record"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Dynamic form renderer depending on tab type
  function renderFormFields() {
    if (activeTab === 'notifications') {
      return (
        <>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Title</label>
            <input
              name="title"
              value={formValues.title || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. Gram Sabha Meeting"
            />
          </div>
          <div className="grid-2">
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Type</label>
              <select name="type" value={formValues.type || 'notice'} onChange={handleInputChange}>
                <option value="notice">Notice</option>
                <option value="event">Event</option>
              </select>
            </div>
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Event Date</label>
              <input
                type="date"
                name="event_date"
                value={formValues.event_date || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Announcement Description</label>
            <textarea
              name="message"
              value={formValues.message || ''}
              onChange={handleInputChange}
              rows={4}
              placeholder="Enter detailed announcement message here..."
            />
          </div>
        </>
      );
    }

    if (activeTab === 'businesses') {
      return (
        <>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Business Name</label>
            <input
              name="name"
              value={formValues.name || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. Sri Lakshmi Kirana Store"
            />
          </div>
          <div className="grid-2">
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Owner Name</label>
              <input
                name="owner_name"
                value={formValues.owner_name || ''}
                onChange={handleInputChange}
                placeholder="e.g. Narayana Reddy"
              />
            </div>
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Contact Phone</label>
              <input
                name="phone"
                value={formValues.phone || ''}
                onChange={handleInputChange}
                placeholder="e.g. 9876543210"
              />
            </div>
          </div>
          <div className="grid-2">
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Business Type / Category</label>
              <input
                name="business_type"
                value={formValues.business_type || ''}
                onChange={handleInputChange}
                placeholder="e.g. Grocery Store"
              />
            </div>
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Location Address</label>
              <input
                name="location"
                value={formValues.location || ''}
                onChange={handleInputChange}
                placeholder="e.g. Main Road, Seetharamapuram"
              />
            </div>
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
            <textarea
              name="description"
              value={formValues.description || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="e.g. General provisions, groceries, and daily essentials"
            />
          </div>
        </>
      );
    }

    if (activeTab === 'gallery') {
      return (
        <>
          <div className="grid-2">
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Photo Title</label>
              <input
                name="title"
                value={formValues.title || ''}
                onChange={handleInputChange}
                required
                placeholder="e.g. Paddy Fields"
              />
            </div>
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category</label>
              <select name="category" value={formValues.category || 'village'} onChange={handleInputChange}>
                <option value="village">Village</option>
                <option value="school">School</option>
                <option value="temple">Temple</option>
                <option value="agriculture">Agriculture</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="festival">Festival</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Upload Image</label>
            <label style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '24px',
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              background: 'var(--bg-surface)',
              transition: 'border-color var(--transition-fast)',
              minHeight: '120px'
            }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) {
                  setImageFile(file);
                  const reader = new FileReader();
                  reader.onloadend = () => setImagePreview(reader.result);
                  reader.readAsDataURL(file);
                }
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxHeight: '160px',
                    maxWidth: '100%',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <>
                  <Image size={32} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Click to browse or drag & drop an image here
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    JPEG, PNG, GIF, WebP — max 5 MB
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>
            {imagePreview && (
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                style={{
                  alignSelf: 'flex-start',
                  fontSize: '0.75rem',
                  color: 'var(--danger)',
                  background: 'none',
                  padding: '2px 0'
                }}
              >
                ✕ Remove image
              </button>
            )}
          </div>

          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Short Description</label>
            <textarea
              name="description"
              value={formValues.description || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe the photo..."
            />
          </div>
        </>
      );
    }

    if (activeTab === 'schemes') {
      return (
        <>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Scheme Name</label>
            <input
              name="name"
              value={formValues.name || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. PM-KISAN"
            />
          </div>
          <div className="grid-2">
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category</label>
              <input
                name="category"
                value={formValues.category || ''}
                onChange={handleInputChange}
                placeholder="e.g. Agriculture"
              />
            </div>
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Portal URL</label>
              <input
                name="portal_url"
                value={formValues.portal_url || ''}
                onChange={handleInputChange}
                placeholder="e.g. https://pmkisan.gov.in"
              />
            </div>
          </div>
          <div className="grid-2">
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Beneficiary Count</label>
              <input
                type="number"
                name="beneficiary_count"
                value={formValues.beneficiary_count || 0}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Eligible</label>
              <input
                type="number"
                name="total_eligible"
                value={formValues.total_eligible || 0}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
            <textarea
              name="description"
              value={formValues.description || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="Explain the scheme benefits..."
            />
          </div>
        </>
      );
    }

    if (activeTab === 'issues') {
      return (
        <>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Issue Title</label>
            <input
              name="title"
              value={formValues.title || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. Poor Drainage System"
            />
          </div>
          <div className="grid-2">
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category</label>
              <input
                name="category"
                value={formValues.category || ''}
                onChange={handleInputChange}
                placeholder="e.g. Infrastructure"
              />
            </div>
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status</label>
              <select name="status" value={formValues.status || 'open'} onChange={handleInputChange}>
                <option value="open">Open / Unresolved</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Reported Count</label>
              <input
                type="number"
                name="reported_count"
                value={formValues.reported_count || 1}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Priority Ranking (1-10)</label>
              <input
                type="number"
                name="priority"
                value={formValues.priority || 0}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
            <textarea
              name="description"
              value={formValues.description || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe the village issue in details..."
            />
          </div>
        </>
      );
    }

    if (activeTab === 'projects') {
      return (
        <>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Project Title</label>
            <input
              name="title"
              value={formValues.title || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. School Renovation"
            />
          </div>
          <div className="grid-2">
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Target Amount (₹)</label>
              <input
                type="number"
                name="target_amount"
                value={formValues.target_amount || 0}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Collected Amount (₹)</label>
              <input
                type="number"
                name="collected_amount"
                value={formValues.collected_amount || 0}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status</label>
            <select name="status" value={formValues.status || 'active'} onChange={handleInputChange}>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
            <textarea
              name="description"
              value={formValues.description || ''}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe what the fund is for..."
            />
          </div>
        </>
      );
    }

    if (activeTab === 'volunteers') {
      return (
        <>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Opportunity / Role Title</label>
            <input
              name="title"
              value={formValues.title || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. Weekend Teaching"
            />
          </div>
          <div className="grid-2">
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category</label>
              <input
                name="category"
                value={formValues.category || ''}
                onChange={handleInputChange}
                placeholder="e.g. Education"
              />
            </div>
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Contact Information</label>
              <input
                name="contact_info"
                value={formValues.contact_info || ''}
                onChange={handleInputChange}
                placeholder="e.g. Contact: School HM - 9876543201"
              />
            </div>
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Role Description</label>
            <textarea
              name="description"
              value={formValues.description || ''}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe the volunteering activity and schedule..."
            />
          </div>
        </>
      );
    }

    if (activeTab === 'census') {
      return (
        <>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Year</label>
            <input
              name="year"
              type="number"
              value={formValues.year || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. 2023"
            />
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Population</label>
            <input
              name="totalPopulation"
              type="number"
              value={formValues.totalPopulation || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. 5423"
            />
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Households</label>
            <input
              name="households"
              type="number"
              value={formValues.households || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. 1200"
            />
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Male Population</label>
            <input
              name="malePopulation"
              type="number"
              value={formValues.malePopulation || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. 2700"
            />
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Female Population</label>
            <input
              name="femalePopulation"
              type="number"
              value={formValues.femalePopulation || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. 2700"
            />
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Child Population</label>
            <input
              name="childPopulation"
              type="number"
              value={formValues.childPopulation || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. 800"
            />
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Senior Population</label>
            <input
              name="seniorPopulation"
              type="number"
              value={formValues.seniorPopulation || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. 500"
            />
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Occupation Distribution</label>
            <input
              name="occupationDistribution"
              value={formValues.occupationDistribution || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. Agriculture, Business"
            />
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Social Categories</label>
            <input
              name="socialCategories"
              value={formValues.socialCategories || ''}
              onChange={handleInputChange}
              placeholder="e.g. ST, SC, OC"
            />
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Adult Literacy Rate (%)</label>
            <input
              name="adultLiteracyRate"
              type="number"
              value={formValues.adultLiteracyRate || ''}
              onChange={handleInputChange}
              placeholder="e.g. 85"
            />
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>School Enrollment Rate (%)</label>
            <input
              name="schoolEnrollmentRate"
              type="number"
              value={formValues.schoolEnrollmentRate || ''}
              onChange={handleInputChange}
              placeholder="e.g. 92"
            />
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Male Illiterate</label>
            <input
              name="maleIlliterate"
              type="number"
              value={formValues.maleIlliterate || ''}
              onChange={handleInputChange}
              placeholder="e.g. 10"
            />
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Female Illiterate</label>
            <input
              name="femaleIlliterate"
              type="number"
              value={formValues.femaleIlliterate || ''}
              onChange={handleInputChange}
              placeholder="e.g. 12"
            />
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Male Graduates</label>
            <input
              name="maleGraduates"
              type="number"
              value={formValues.maleGraduates || ''}
              onChange={handleInputChange}
              placeholder="e.g. 30"
            />
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Female Graduates</label>
            <input
              name="femaleGraduates"
              type="number"
              value={formValues.femaleGraduates || ''}
              onChange={handleInputChange}
              placeholder="e.g. 28"
            />
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Migration Count</label>
            <input
              name="migrationCount"
              type="number"
              value={formValues.migrationCount || ''}
              onChange={handleInputChange}
              placeholder="e.g. 5"
            />
          </div>
        </>
      );
    }

    if (activeTab === 'svrratings') {
      return (
        <>
          <input type="hidden" name="category" value="scores" />
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Metric Name (Key)</label>
            <input
              name="stat_key"
              value={formValues.stat_key || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. Overall Score"
              disabled={modalMode === 'edit'}
            />
          </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Score (out of 100)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <input
                type="number"
                name="stat_value"
                value={formValues.stat_value || 0}
                onChange={handleInputChange}
                required
                min="0"
                max="100"
                style={{ width: '80px', fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center' }}
              />
              <input
                type="range"
                name="stat_value"
                min="0" max="100"
                value={formValues.stat_value || 0}
                onChange={handleInputChange}
                style={{ flex: 1 }}
              />
            </div>
          </div>
        </>
      );
    }

    if (activeTab === 'villagestats') {
      return (
        <>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category</label>
            <select
              name="category"
              value={formValues.category || ''}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Select Category --</option>
              {[
                'overview', 'demographics', 'age_groups', 'social',
                'education', 'occupation', 'housing', 'water',
                'agriculture', 'health', 'economics', 'income_buckets',
                'financial', 'schemes_coverage', 'vehicles', 'appliances',
                'problems', 'vulnerability', 'scores'
              ].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <p className="text-xs text-muted" style={{ marginTop: '2px' }}>
              e.g. social → ST/OC/SC/BC counts | education → literacy rates
            </p>
          </div>

          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Stat Name (Key)</label>
            <input
              name="stat_key"
              value={formValues.stat_key || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. ST (Scheduled Tribe)"
            />
            <p className="text-xs text-muted" style={{ marginTop: '2px' }}>
              Must match exactly for the Census page to pick it up
            </p>
          </div>

          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Value</label>
            <input
              name="stat_value"
              value={formValues.stat_value ?? ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. 269"
            />
          </div>

          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sort Order</label>
            <input
              name="sort_order"
              type="number"
              value={formValues.sort_order ?? 0}
              onChange={handleInputChange}
              placeholder="e.g. 1"
            />
            <p className="text-xs text-muted" style={{ marginTop: '2px' }}>
              Lower numbers appear first within the same category
            </p>
          </div>
        </>
      );
    }

    if (activeTab === 'awards') {
      return (
        <>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Title</label>
            <input
              name="title"
              value={formValues.title || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. Clean Water and Sanitation"
            />
          </div>
          <div className="grid-2">
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category</label>
              <select name="category" value={formValues.category || 'sdg'} onChange={handleInputChange}>
                <option value="sdg">Sustainable Development Goal (SDG)</option>
                <option value="hldg">Human Life Development Goal (HLDG)</option>
              </select>
            </div>
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Year</label>
              <input
                name="year"
                type="number"
                value={formValues.year || ''}
                onChange={handleInputChange}
                required
                placeholder="e.g. 2023"
              />
            </div>
          </div>
            <div className="flex-col gap-sm">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Icon Name</label>
              <select name="icon_name" value={formValues.icon_name || 'Award'} onChange={handleInputChange}>
                <option value="Trophy">Trophy 🏆</option>
                <option value="Medal">Medal 🥇</option>
                <option value="Award">Award 🏅</option>
                <option value="Star">Star ⭐</option>
                <option value="Crown">Crown 👑</option>
                <option value="BadgeCheck">Badge ✔️</option>
              </select>
              <p className="text-xs text-muted" style={{ marginTop: '2px' }}>
                Select a standard icon to represent this goal
              </p>
            </div>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
            <textarea
              name="description"
              value={formValues.description || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="Detailed description of the award/goal..."
            />
          </div>
        </>
      );
    }

    return null;
  }
}
