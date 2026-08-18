import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark');

  // Apply theme to html element when theme changes
  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.classList.remove(
      'theme-dark',
      'theme-zen',
      'theme-cyberpunk',
      'theme-vintage',
      'theme-aurora'
    );
    htmlElement.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

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
        <Routes>
          <Route path="/" element={<Landing theme={theme} />} />
          {/* Additional routes will be added in future steps */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
