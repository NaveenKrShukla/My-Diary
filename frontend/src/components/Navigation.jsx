import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const THEMES = [
  { id: 'dark', label: 'Dark', icon: '🌙' },
  { id: 'zen', label: 'Zen', icon: '🧘' },
  { id: 'cyberpunk', label: 'Cyberpunk', icon: '⚡' },
  { id: 'vintage', label: 'Vintage', icon: '📖' },
  { id: 'aurora', label: 'Aurora', icon: '🌌' },
];

export default function Navigation({ theme, setTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const menuRef = useRef(null);
  const themeRef = useRef(null);

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

  const handleThemeChange = (themeId) => {
    setTheme(themeId);
    setShowThemeMenu(false);
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
          <a href="#collections" className="nav-link">
            Collections
          </a>
          <a href="#about" className="nav-link">
            About
          </a>
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
                {THEMES.find((t) => t.id === theme)?.icon}
              </span>
            </button>

            {showThemeMenu && (
              <div className="theme-menu glass">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    className={`theme-option ${theme === t.id ? 'active' : ''}`}
                    onClick={() => handleThemeChange(t.id)}
                  >
                    <span className="theme-option-icon">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <a href="#reader" className="btn btn-secondary">
            <span>📖</span>
            Visit as Reader
          </a>
          <a href="#admin" className="btn btn-primary">
            <span>✨</span>
            Admin Login
          </a>
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
              <a href="#collections" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                Collections
              </a>
              <a href="#about" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                About
              </a>
              <div className="mobile-menu-divider"></div>
              <a href="#reader" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsOpen(false)}>
                <span>📖</span>
                Visit as Reader
              </a>
              <a href="#admin" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsOpen(false)}>
                <span>✨</span>
                Admin Login
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
