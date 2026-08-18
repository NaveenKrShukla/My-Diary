import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getPoems,
  getDashboardStats,
  getAdminSettings,
  updateAdminSettings,
  createPoem,
  updatePoem,
  deletePoem,
  getBackendThemes,
  getPoemRatings,
  deleteRating,
  getSubscribersList
} from '../utils/api';
import { BUILT_IN_THEMES } from '../utils/ThemeManager';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const ANIMAL_EMOJIS = {
  cat: '🐱',
  dog: '🐶',
  fox: '🦊',
  owl: '🦉',
  bird: '🐦',
  rabbit: '🐰',
  panda: '🐼',
  koala: '🐨',
  penguin: '🐧',
  tiger: '🐯',
  lion: '🦁',
  bear: '🐻',
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Data states
  const [stats, setStats] = useState(null);
  const [poems, setPoems] = useState([]);
  const [themes, setThemes] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [settings, setSettings] = useState({
    defaultTheme: 'dark',
    siteTitle: 'My Diary',
    siteDescription: '',
    emailNotificationsEnabled: true
  });

  // Poem Editor states
  const [showEditor, setShowEditor] = useState(false);
  const [editingPoem, setEditingPoem] = useState(null);
  const [poemTitle, setPoemTitle] = useState('');
  const [poemContent, setPoemContent] = useState('');
  const [poemDate, setPoemDate] = useState('');
  const [poemTheme, setPoemTheme] = useState('');
  const [poemStatus, setPoemStatus] = useState('draft');
  const [poemFeatured, setPoemFeatured] = useState(false);
  const [poemTags, setPoemTags] = useState('');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Verify Authentication & Load Dashboard Data
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }

    async function loadDashboardData() {
      try {
        setLoading(true);
        // Load stats
        const statsData = await getDashboardStats();
        setStats(statsData);

        // Load poems
        const poemsList = await getPoems();
        setPoems(poemsList);

        // Load themes
        const themesList = await getBackendThemes();
        setThemes([...BUILT_IN_THEMES, ...themesList]);

        // Load settings
        const settingsData = await getAdminSettings();
        setSettings(settingsData);

        // Load newsletter subscribers
        const subsList = await getSubscribersList();
        setSubscribers(subsList);

        // Gather comments across all poems for moderation tab
        const commentsAccumulator = [];
        for (const p of poemsList) {
          const pComments = await getPoemRatings(p._id);
          const feedbackComments = pComments.filter(c => c.feedback).map(c => ({
            ...c,
            poemTitle: p.title
          }));
          commentsAccumulator.push(...feedbackComments);
        }
        // Sort comments by newest first
        commentsAccumulator.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllComments(commentsAccumulator);

      } catch (err) {
        toast.error('Failed to load dashboard statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    toast.success('Logged out successfully.');
    navigate('/admin');
    window.dispatchEvent(new Event('storage'));
  };

  // Open editor for creating
  const handleOpenCreate = () => {
    setEditingPoem(null);
    setPoemTitle('');
    setPoemContent('');
    setPoemDate(new Date().toISOString().split('T')[0]);
    setPoemTheme(themes[0]?._id || '');
    setPoemStatus('draft');
    setPoemFeatured(false);
    setPoemTags('');
    setShowEditor(true);
  };

  // Open editor for editing
  const handleOpenEdit = (poem) => {
    setEditingPoem(poem);
    setPoemTitle(poem.title);
    setPoemContent(poem.content);
    setPoemDate(new Date(poem.writtenDate).toISOString().split('T')[0]);
    setPoemTheme(poem.theme || '');
    setPoemStatus(poem.status || 'draft');
    setPoemFeatured(poem.featured || false);
    setPoemTags(poem.tags ? poem.tags.join(', ') : '');
    setShowEditor(true);
  };

  // Handle Poem submission
  const handleSavePoem = async (e) => {
    e.preventDefault();
    if (!poemTitle.trim() || !poemContent.trim()) {
      toast.error('Title and Content are required.');
      return;
    }

    const poemData = {
      title: poemTitle.trim(),
      content: poemContent.trim(),
      writtenDate: new Date(poemDate).toISOString(),
      theme: poemTheme || null,
      status: poemStatus,
      featured: poemFeatured,
      tags: poemTags ? poemTags.split(',').map(t => t.trim()).filter(t => t) : []
    };

    try {
      if (editingPoem) {
        // Update
        const updated = await updatePoem(editingPoem._id, poemData);
        if (updated) {
          toast.success('Poem updated successfully!');
          setPoems(prev => prev.map(p => p._id === editingPoem._id ? { ...p, ...poemData } : p));
        }
      } else {
        // Create
        const created = await createPoem(poemData);
        if (created) {
          toast.success('Poem published successfully!');
          setPoems(prev => [created, ...prev]);
        }
      }
      setShowEditor(false);
      // Refresh stats
      const updatedStats = await getDashboardStats();
      setStats(updatedStats);
    } catch (err) {
      toast.error('Failed to save poem.');
    }
  };

  // Handle Poem deletion
  const handleDeletePoem = async (poemId) => {
    if (confirm('Are you sure you want to delete this poem? All reviews will also be deleted.')) {
      try {
        const success = await deletePoem(poemId);
        if (success) {
          toast.success('Poem deleted.');
          setPoems(prev => prev.filter(p => p._id !== poemId));
          // Refresh stats
          const updatedStats = await getDashboardStats();
          setStats(updatedStats);
        }
      } catch (err) {
        toast.error('Failed to delete poem.');
      }
    }
  };

  // Handle Rating deletion
  const handleDeleteComment = async (ratingId) => {
    if (confirm('Delete this comment permanently?')) {
      try {
        const success = await deleteRating(ratingId);
        if (success) {
          toast.success('Comment deleted.');
          setAllComments(prev => prev.filter(c => c._id !== ratingId));
          const updatedStats = await getDashboardStats();
          setStats(updatedStats);
        }
      } catch (err) {
        toast.error('Failed to delete comment.');
      }
    }
  };

  // Handle Settings save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateAdminSettings(settings);
      if (updated) {
        toast.success('Settings updated successfully.');
      }
    } catch (err) {
      toast.error('Failed to update settings.');
    }
  };

  // Filter poems for search query
  const filteredPoems = (Array.isArray(poems) ? poems : []).filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="reader-loading">
        <div className="loader"></div>
        <p>Loading administration panel...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar glass">
        <div className="sidebar-brand">
          <span className="brand-logo">⚙️</span>
          <h2>NaKSh Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            📊 Dashboard
          </button>
          <button className={`nav-item ${activeTab === 'poems' ? 'active' : ''}`} onClick={() => setActiveTab('poems')}>
            📖 Manage Poems
          </button>
          <button className={`nav-item ${activeTab === 'moderation' ? 'active' : ''}`} onClick={() => setActiveTab('moderation')}>
            💬 Comments Moderation
          </button>
          <button className={`nav-item ${activeTab === 'subscribers' ? 'active' : ''}`} onClick={() => setActiveTab('subscribers')}>
            📧 Subscribers List
          </button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            ⚙️ System Settings
          </button>
          <div className="sidebar-footer-divider"></div>
          <button className="nav-item sign-out-nav-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-content">
        <header className="dashboard-header glass">
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Workspace</h2>
          <button className="panel-back-btn" onClick={() => navigate('/')}>
            View Website
          </button>
        </header>

        {/* ==================================== */}
        {/* TABS CONTENT */}
        {/* ==================================== */}

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && stats && (
          <div className="tab-pane animate-fade-in">
            <div className="stats-summary-grid">
              <div className="dashboard-stat-card glass">
                <span className="stat-icon">👁️</span>
                <div className="stat-card-details">
                  <span className="card-label">Total Poem Views</span>
                  <span className="card-value">{stats.engagement.totalViews}</span>
                </div>
              </div>
              <div className="dashboard-stat-card glass">
                <span className="stat-icon">⭐</span>
                <div className="stat-card-details">
                  <span className="card-label">Avg Reader Rating</span>
                  <span className="card-value">{stats.engagement.avgRating} / 5</span>
                </div>
              </div>
              <div className="dashboard-stat-card glass">
                <span className="stat-icon">📖</span>
                <div className="stat-card-details">
                  <span className="card-label">Published Poems</span>
                  <span className="card-value">{stats.poems.published}</span>
                </div>
              </div>
              <div className="dashboard-stat-card glass">
                <span className="stat-icon">📧</span>
                <div className="stat-card-details">
                  <span className="card-label">Newsletter Subscribers</span>
                  <span className="card-value">{stats.readers.subscribed}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats list cards */}
            <div className="dashboard-layout-row">
              <div className="dashboard-row-card glass">
                <h3>Diary Health Overview</h3>
                <div className="health-stat-list">
                  <div className="health-row">
                    <span>Draft Verses</span>
                    <span className="health-val">{stats.poems.draft} drafts</span>
                  </div>
                  <div className="health-row">
                    <span>Active Reader Profiles</span>
                    <span className="health-val">{stats.readers.total} accounts</span>
                  </div>
                  <div className="health-row">
                    <span>Total Rating Submissions</span>
                    <span className="health-val">{stats.engagement.totalRatings} ratings</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-row-card glass info-row-card">
                <h3>Quick Actions</h3>
                <div className="quick-actions-list">
                  <button className="btn btn-primary" onClick={handleOpenCreate}>
                    ✍️ Write New Poem
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MANAGE POEMS TAB */}
        {activeTab === 'poems' && (
          <div className="tab-pane animate-fade-in">
            <div className="table-controls-row">
              <input
                type="text"
                placeholder="Search poems by title or verses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-field"
              />
              <button className="btn btn-primary" onClick={handleOpenCreate}>
                ➕ Create Poem
              </button>
            </div>

            <div className="table-wrapper glass">
              <table className="poems-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Written Date</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPoems.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-table-row">No poems found.</td>
                    </tr>
                  ) : (
                    filteredPoems.map((p) => {
                      return (
                        <tr key={p._id}>
                          <td className="poem-table-title font-headings">
                            {p.title}
                            {p.featured && <span className="featured-badge">Featured</span>}
                          </td>
                          <td>{new Date(p.writtenDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge ${p.status}`}>
                              {p.status || 'published'}
                            </span>
                          </td>
                          <td>👁️ {p.views || 0}</td>
                          <td>⭐ {p.avgRating?.toFixed(1) || '0.0'} ({p.totalRatings || 0})</td>
                          <td className="table-actions">
                            <button className="edit-action-btn" onClick={() => handleOpenEdit(p)}>
                              ✏️ Edit
                            </button>
                            <button className="delete-action-btn" onClick={() => handleDeletePoem(p._id)}>
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. COMMENTS MODERATION TAB */}
        {activeTab === 'moderation' && (
          <div className="tab-pane animate-fade-in">
            <div className="comments-moderation-list">
              {allComments.length === 0 ? (
                <div className="glass empty-moderation-card">
                  <p>No user comments available for moderation.</p>
                </div>
              ) : (
                allComments.map((comment) => {
                  const reviewer = typeof comment.readerId === 'object'
                    ? comment.readerId
                    : { name: 'Anonymous', profilePicture: 'cat' };
                  const emoji = ANIMAL_EMOJIS[reviewer.profilePicture] || '🐱';

                  return (
                    <div key={comment._id} className="moderation-comment-card glass">
                      <div className="mod-card-header">
                        <div className="mod-user-info">
                          <span className="mod-user-avatar">{emoji}</span>
                          <div>
                            <span className="mod-user-name">{reviewer.name}</span>
                            <span className="mod-poem-ref">commented on <strong>"{comment.poemTitle}"</strong></span>
                          </div>
                        </div>
                        <div className="mod-rating-stars">
                          {'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}
                        </div>
                      </div>
                      <p className="mod-comment-body">"{comment.feedback}"</p>
                      <div className="mod-card-footer">
                        <span className="mod-comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
                        <button className="delete-comment-btn" onClick={() => handleDeleteComment(comment._id)}>
                          🗑️ Delete Review
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* 4. SUBSCRIBERS LIST TAB */}
        {activeTab === 'subscribers' && (
          <div className="tab-pane animate-fade-in">
            <div className="table-wrapper glass">
              <table className="poems-table">
                <thead>
                  <tr>
                    <th>Email Address</th>
                    <th>Subscribed Date</th>
                    <th>Alert Frequency</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {!Array.isArray(subscribers) || subscribers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-table-row">No subscribers registered yet.</td>
                    </tr>
                  ) : (
                    subscribers.map((s) => (
                      <tr key={s._id}>
                        <td style={{ fontWeight: 600 }}>{s.email}</td>
                        <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                        <td style={{ textTransform: 'capitalize' }}>{s.preference || 'instant'}</td>
                        <td>
                          <span className={`status-badge ${s.isActive ? 'published' : 'draft'}`}>
                            {s.isActive ? 'Active' : 'Unsubscribed'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. SYSTEM SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="tab-pane animate-fade-in">
            <form onSubmit={handleSaveSettings} className="section-card glass settings-form">
              <h3>System Settings</h3>
              <div className="form-group">
                <label>Website Title</label>
                <input
                  type="text"
                  value={settings.siteTitle}
                  onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Anthology Description</label>
                <textarea
                  rows={4}
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Default Page Theme</label>
                <select
                  value={settings.defaultTheme}
                  onChange={(e) => setSettings({ ...settings, defaultTheme: e.target.value })}
                >
                  {themes.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="settings-emails"
                  checked={settings.emailNotificationsEnabled}
                  onChange={(e) => setSettings({ ...settings, emailNotificationsEnabled: e.target.checked })}
                />
                <label htmlFor="settings-emails">
                  Enable automated email notifications on new uploads
                </label>
              </div>

              <button type="submit" className="btn btn-primary settings-submit-btn">
                💾 Save System Configurations
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ==================================== */}
      {/* POEM EDITOR MODAL */}
      {/* ==================================== */}
      {showEditor && (
        <div className="editor-overlay">
          <form onSubmit={handleSavePoem} className="editor-modal glass animate-slide-in-up">
            <div className="editor-modal-header">
              <h3>{editingPoem ? 'Modify Diary Verse' : 'Compose New Poetry'}</h3>
              <button type="button" className="close-editor-btn" onClick={() => setShowEditor(false)}>✕</button>
            </div>
            
            <div className="editor-modal-body">
              <div className="form-group">
                <label>Poem Title</label>
                <input
                  type="text"
                  placeholder="The Silent Brook"
                  value={poemTitle}
                  onChange={(e) => setPoemTitle(e.target.value)}
                  required
                />
              </div>

              <div className="editor-form-row">
                <div className="form-group">
                  <label>Written Date</label>
                  <input
                    type="date"
                    value={poemDate}
                    onChange={(e) => setPoemDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Theme Styling</label>
                  <select value={poemTheme} onChange={(e) => setPoemTheme(e.target.value)}>
                    <option value="">Default (Global Theme)</option>
                    {themes.map(t => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Poem Stanzas & Verses</label>
                <textarea
                  rows={8}
                  placeholder="Write stanzas here. Use enter for breaks..."
                  value={poemContent}
                  onChange={(e) => setPoemContent(e.target.value)}
                  className="poem-textarea-editor font-headings"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tags (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="Melancholy, Autumn, Stars"
                  value={poemTags}
                  onChange={(e) => setPoemTags(e.target.value)}
                />
              </div>

              <div className="editor-form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select value={poemStatus} onChange={(e) => setPoemStatus(e.target.value)}>
                    <option value="draft">📁 Saved Draft</option>
                    <option value="published">🟢 Published Live</option>
                  </select>
                </div>
                <div className="form-checkbox-group">
                  <input
                    type="checkbox"
                    id="poem-featured"
                    checked={poemFeatured}
                    onChange={(e) => setPoemFeatured(e.target.checked)}
                  />
                  <label htmlFor="poem-featured">⭐ Feature on Homepage</label>
                </div>
              </div>
            </div>

            <div className="editor-modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowEditor(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingPoem ? 'Update Verse' : 'Save & Publish'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
