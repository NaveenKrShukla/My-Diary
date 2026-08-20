import { useState, useEffect } from 'react';
import { getPoems, createReader, getAnnotations, saveAnnotations, updateReader } from '../utils/api';
import Book from '../components/Book';
import ReaderOnboarding from '../components/ReaderOnboarding';
import AnnotationToolbar from '../components/AnnotationToolbar';
import toast from 'react-hot-toast';
import './BookReader.css';

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

export default function BookReader() {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSheet, setCurrentSheet] = useState(0);
  const [showTOC, setShowTOC] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Reader & Onboarding state
  const [reader, setReader] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('cat');

  // Annotation states
  const [activeTool, setActiveTool] = useState('select');
  const [highlightColor, setHighlightColor] = useState({
    id: 'yellow',
    value: 'rgba(253, 224, 71, 0.45)',
  });
  const [annotations, setAnnotations] = useState({});

  // 1. Initial mounting & Loading user profile + poems
  useEffect(() => {
    async function initReaderAndPoems() {
      try {
        setLoading(true);

        // Load poems
        const data = await getPoems();
        setPoems(data);

        // Check for local reader profile
        const savedReaderData = localStorage.getItem('local_reader');
        if (savedReaderData) {
          try {
            const parsed = JSON.parse(savedReaderData);
            // Support both old format (direct profile) and new format (nested profile with expiry)
            const profile = parsed.profile || parsed;
            const savedAt = parsed.savedAt || Date.now();
            const thirtyMinutes = 30 * 60 * 1000;

            if (Date.now() - savedAt < thirtyMinutes) {
              setReader(profile);
              // Load annotations for reader
              const annos = await getAnnotations(profile._id);
              setAnnotations(annos || {});
            } else {
              localStorage.removeItem('local_reader');
            }
          } catch (e) {
            localStorage.removeItem('local_reader');
          }
        }
      } catch (err) {
        setError('Failed to open the diary.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    initReaderAndPoems();
  }, []);

  // Track and save reader progress (debounced)
  useEffect(() => {
    if (!reader || !poems || poems.length === 0) return;

    // Resolve what they are reading based on currentSheet
    let currentReadingTitle = 'Cover Page';
    if (isMobile) {
      // Mobile single page layout index mapping
      const currentPageIndex = Math.min(currentSheet, poems.length + 2); // Max pages limit
      if (currentPageIndex === 1) {
        currentReadingTitle = 'Index';
      } else if (currentPageIndex >= 2 && currentPageIndex < 2 + poems.length) {
        currentReadingTitle = poems[currentPageIndex - 2]?.title || 'Poem';
      } else if (currentPageIndex >= 2 + poems.length) {
        currentReadingTitle = 'Back Cover';
      }
    } else {
      // Desktop dual page layout index mapping
      if (currentSheet === 0) {
        currentReadingTitle = 'Cover & Index';
      } else {
        const leftPoemIdx = (currentSheet - 1) * 2;
        const rightPoemIdx = leftPoemIdx + 1;
        const leftTitle = poems[leftPoemIdx]?.title;
        const rightTitle = poems[rightPoemIdx]?.title;

        if (leftTitle && rightTitle) {
          currentReadingTitle = `${leftTitle} / ${rightTitle}`;
        } else if (leftTitle) {
          currentReadingTitle = `${leftTitle} / Back Cover`;
        } else {
          currentReadingTitle = 'Back Cover';
        }
      }
    }

    const timer = setTimeout(() => {
      updateReader(reader._id, {
        lastReadPage: isMobile ? currentSheet + 1 : (currentSheet * 2) + 1,
        lastReadPoem: currentReadingTitle
      }).catch(err => console.warn('Could not update reading progress:', err.message));
    }, 2000); // 2s debounce

    return () => clearTimeout(timer);
  }, [currentSheet, reader, poems, isMobile]);

  // Monitor resize for layout transitions
  useEffect(() => {
    const handleResize = () => {
      const mobileState = window.innerWidth <= 768;
      if (mobileState !== isMobile) {
        setIsMobile(mobileState);
        setCurrentSheet(0);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Handle onboarding profile completion
  const handleOnboardingComplete = async (profileData) => {
    try {
      const created = await createReader(profileData);
      if (created) {
        setReader(created);
        toast.success(`Welcome, ${created.name}!`);
        // Store in localStorage with 30-minute expiration format
        const readerDataWithExpiry = {
          profile: created,
          savedAt: Date.now()
        };
        localStorage.setItem('local_reader', JSON.stringify(readerDataWithExpiry));
        // Load annotations (should be empty for new profile)
        setAnnotations({});
      }
    } catch (err) {
      toast.error('Failed to create profile.');
      console.error(err);
    }
  };

  // Sync annotations change
  const handleSaveAnnotations = async (poemId, updatedPoemAnnos) => {
    if (!reader) return;
    const nextAnnos = {
      ...annotations,
      [poemId]: updatedPoemAnnos,
    };
    setAnnotations(nextAnnos);
    await saveAnnotations(reader._id, nextAnnos);
  };

  // Profile management
  const handleSignOut = () => {
    localStorage.removeItem('local_reader');
    setReader(null);
    setAnnotations({});
    setShowProfileMenu(false);
    toast.success('Signed out.');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    try {
      const updated = await updateReader(reader._id, {
        name: editName.trim(),
        profilePicture: editAvatar,
      });
      if (updated) {
        setReader(updated);
        const readerDataWithExpiry = {
          profile: updated,
          savedAt: Date.now() // Reset timer on update
        };
        localStorage.setItem('local_reader', JSON.stringify(readerDataWithExpiry));
        setIsEditingProfile(false);
        setShowProfileMenu(false);
        toast.success('Profile updated.');
      }
    } catch (err) {
      toast.error('Could not update profile.');
    }
  };

  // Jump to specific poem
  const handleJumpToPoem = (index) => {
    if (isMobile) {
      setCurrentSheet(index + 2);
    } else {
      const targetSheet = Math.floor(index / 2) + 1;
      setCurrentSheet(targetSheet);
    }
    setShowTOC(false);
  };

  if (loading) {
    return (
      <div className="reader-loading">
        <div className="loader"></div>
        <p>Opening the diary...</p>
      </div>
    );
  }

  if (error || poems.length === 0) {
    return (
      <div className="reader-error">
        <h2>Failed to open the diary</h2>
        <p>{error || 'No poems available.'}</p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
          Return Home
        </button>
      </div>
    );
  }

  // 2. Render onboarding modal if no reader profile
  if (!reader) {
    return <ReaderOnboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="reader-page">
      <div className="ambient-background">
        <div className="lamp-glow"></div>
        <div className="accent-glow"></div>
      </div>

      {/* Reader Header */}
      <header className="reader-header glass">
        <button className="header-back-btn" onClick={() => window.location.href = '/'}>
          ← Home
        </button>

        <h1 className="reader-title gradient-text">My Diary</h1>

        <div className="header-right">
          {/* Reader Profile Dropdown */}
          <div className="reader-profile-wrapper">
            <button
              className="profile-badge-btn glass"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setEditName(reader.name);
                setEditAvatar(reader.profilePicture);
                setIsEditingProfile(false);
              }}
            >
              <span className="profile-avatar-emoji">
                {ANIMAL_EMOJIS[reader.profilePicture] || '🐱'}
              </span>
              <span className="profile-name-text">{reader.name}</span>
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown-menu glass animate-slide-in-down">
                {!isEditingProfile ? (
                  <div className="profile-menu-view">
                    <p className="menu-welcome">Logged in as</p>
                    <div className="menu-user-details">
                      <span className="details-avatar">
                        {ANIMAL_EMOJIS[reader.profilePicture]}
                      </span>
                      <span className="details-name">{reader.name}</span>
                    </div>
                    <button
                      className="btn-dropdown-action"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      ✏️ Edit Profile
                    </button>
                    <div className="menu-divider"></div>
                    <button className="btn-dropdown-action sign-out-btn" onClick={handleSignOut}>
                      🚪 Sign Out
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="profile-menu-form">
                    <div className="dropdown-form-group">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Name"
                        required
                        maxLength={25}
                      />
                    </div>
                    <div className="avatar-mini-select">
                      {Object.entries(ANIMAL_EMOJIS).map(([id, emoji]) => (
                        <button
                          type="button"
                          key={id}
                          className={`mini-avatar-btn ${editAvatar === id ? 'active' : ''}`}
                          onClick={() => setEditAvatar(id)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <div className="profile-form-actions">
                      <button
                        type="button"
                        className="btn-dropdown-action mini-cancel"
                        onClick={() => setIsEditingProfile(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-dropdown-action mini-save">
                        Save
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          <button className="toc-toggle-btn" onClick={() => setShowTOC(!showTOC)}>
            Index 📋
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="reader-workspace">
        {/* Floating annotations toolbar */}
        <aside className="workspace-sidebar">
          <AnnotationToolbar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            highlightColor={highlightColor}
            setHighlightColor={setHighlightColor}
          />
        </aside>

        {/* 3D Book Layout Area */}
        <main className="reader-main">
          <Book
            poems={poems}
            currentSheet={currentSheet}
            setCurrentSheet={setCurrentSheet}
            isMobile={isMobile}
            reader={reader}
            activeTool={activeTool}
            highlightColor={highlightColor}
            annotations={annotations}
            onSaveAnnotations={handleSaveAnnotations}
          />
        </main>
      </div>

      {/* Table of Contents sidebar */}
      <div className={`toc-sidebar glass ${showTOC ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Table of Contents</h3>
          <button className="close-sidebar-btn" onClick={() => setShowTOC(false)}>
            ✕
          </button>
        </div>
        <div className="sidebar-content">
          <button
            className={`toc-sidebar-item ${currentSheet === 0 ? 'active' : ''}`}
            onClick={() => {
              setCurrentSheet(0);
              setShowTOC(false);
            }}
          >
            📖 Cover Page
          </button>
          <div className="sidebar-divider">Poems</div>
          <div className="toc-sidebar-list">
            {poems.map((poem, index) => {
              let isCurrent = false;
              if (isMobile) {
                isCurrent = currentSheet === index + 2;
              } else {
                const targetSheet = Math.floor(index / 2) + 1;
                isCurrent = currentSheet === targetSheet;
              }

              return (
                <button
                  key={poem._id}
                  className={`toc-sidebar-item ${isCurrent ? 'active' : ''}`}
                  onClick={() => handleJumpToPoem(index)}
                >
                  <span className="sidebar-num">{String(index + 1).padStart(2, '0')}.</span>
                  <span className="sidebar-title">{poem.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {showTOC && <div className="sidebar-overlay" onClick={() => setShowTOC(false)}></div>}
    </div>
  );
}
