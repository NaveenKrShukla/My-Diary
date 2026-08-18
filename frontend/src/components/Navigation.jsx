import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBackendThemes } from '../utils/api';
import { BUILT_IN_THEMES } from '../utils/ThemeManager';
import './Navigation.css';

const THEME_ICONS = {
  'theme-light': '☀️',
  'theme-dark': '🌙',
  'theme-zen': '🧘',
  'theme-cyberpunk': '⚡',
  'theme-vintage': '📖',
  'theme-aurora': '🌌',
};

export default function Navigation({ theme, setTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [customThemes, setCustomThemes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const menuRef = useRef(null);
  const themeRef = useRef(null);

  // Combine built-in and custom themes dynamically
  const themesList = [
    ...BUILT_IN_THEMES.map(t => ({
      _id: t._id,
      name: t.name,
      icon: THEME_ICONS[t._id] || '🎨'
    })),
    ...(Array.isArray(customThemes) ? customThemes : []).map(t => ({
      _id: t._id,
      name: t.name,
      icon: '🎨'
    }))
  ];

  // Monitor auth status changes
  useEffect(() => {
    const checkAuth = () => {
      setIsAdmin(!!localStorage.getItem('admin_token'));
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Fetch custom themes on load
  useEffect(() => {
    async function loadCustomThemes() {
      try {
        const data = await getBackendThemes();
        setCustomThemes(data);
      } catch (err) {
        console.error('Failed to load custom themes for navigation:', err);
      }
    }
    loadCustomThemes();
  }, [theme]); // reload if theme changes

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setShowThemeMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (t) => {
    const fullTheme = [...BUILT_IN_THEMES, ...customThemes].find(item => item._id === t._id);
    setTheme(fullTheme || t.name.toLowerCase());
    setShowThemeMenu(false);
  };

  const isThemeActive = (t) => {
    if (typeof theme === 'string') {
      return theme.toLowerCase() === t.name.toLowerCase() || `theme-${theme.toLowerCase()}` === t._id;
    }
    return theme?._id === t._id;
  };

  const getActiveThemeIcon = () => {
    const active = themesList.find(t => isThemeActive(t));
    return active ? active.icon : '🌙';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">📖</span>
          <span className="logo-text">My Diary</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <a href="#features" className="nav-link">
            Features
          </a>
          <Link to="/read" className="nav-link">
            Diary Reader
          </Link>
          <Link to="/admin/themes" className="nav-link">
            Theme Editor 🎨
          </Link>
        </div>

        {/* Right Side - Theme Switcher & Buttons */}
        <div className="navbar-right">
          {/* Theme Switcher */}
          <div className="theme-switcher-wrapper" ref={themeRef}>
            <button
              className="theme-btn"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              title="Change theme"
            >
              <span className="theme-icon">
                {getActiveThemeIcon()}
              </span>
            </button>

            {showThemeMenu && (
              <div className="theme-menu glass">
                {themesList.map((t) => (
                  <button
                    key={t._id}
                    className={`theme-option ${isThemeActive(t) ? 'active' : ''}`}
                    onClick={() => handleThemeChange(t)}
                  >
                    <span className="theme-option-icon">{t.icon}</span>
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <Link to="/read" className="btn btn-secondary">
            <span>📖</span>
            Visit as Reader
          </Link>
          {isAdmin ? (
            <Link to="/admin/dashboard" className="btn btn-primary">
              <span>⚙️</span>
              Dashboard
            </Link>
          ) : (
            <Link to="/admin" className="btn btn-primary">
              <span>✨</span>
              Admin Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-wrapper" ref={menuRef}>
          <button
            className={`mobile-menu-btn ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="mobile-menu glass">
              <Link to="/" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <a href="#features" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                Features
              </a>
              <Link to="/read" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                Diary Reader
              </Link>
              <Link to="/admin/themes" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                Theme Editor 🎨
              </Link>
              <div className="mobile-menu-divider"></div>
              <Link to="/read" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsOpen(false)}>
                <span>📖</span>
                Visit as Reader
              </Link>
              {isAdmin ? (
                <Link to="/admin/dashboard" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsOpen(false)}>
                  <span>⚙️</span>
                  Dashboard
                </Link>
              ) : (
                <Link to="/admin" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsOpen(false)}>
                  <span>✨</span>
                  Admin Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
