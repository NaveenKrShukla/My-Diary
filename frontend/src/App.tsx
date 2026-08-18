import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import { applyTheme } from './utils/ThemeManager';
import './App.css';

// Lazy load pages to decrease initial chunk loads for readers
const Landing = lazy(() => import('./pages/Landing'));
const BookReader = lazy(() => import('./pages/BookReader'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Unsubscribe = lazy(() => import('./pages/Unsubscribe'));

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('selected_theme');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return saved;
      }
    }
    return 'dark';
  });

  // Apply theme variables dynamically whenever theme state changes
  useEffect(() => {
    applyTheme(theme);
    if (typeof theme === 'string') {
      localStorage.setItem('selected_theme', JSON.stringify(theme));
    } else if (theme && typeof theme === 'object') {
      localStorage.setItem('selected_theme', JSON.stringify(theme));
    }
  }, [theme]);

  return (
    <Router>
      <div className="app">
        <Navigation theme={theme} setTheme={setTheme} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            },
          }}
        />
        <Suspense
          fallback={
            <div className="reader-loading">
              <div className="loader"></div>
              <p>Loading page...</p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Landing theme={theme} />} />
            <Route path="/read" element={<BookReader />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/unsubscribe/:token" element={<Unsubscribe />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
