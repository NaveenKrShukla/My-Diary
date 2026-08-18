import { useState } from 'react';
import './ReaderOnboarding.css';

const ANIMAL_AVATARS = [
  { id: 'cat', emoji: '🐱', label: 'Cat', color: '#ffb3ba' },
  { id: 'dog', emoji: '🐶', label: 'Dog', color: '#ffdfba' },
  { id: 'fox', emoji: '🦊', label: 'Fox', color: '#ffffba' },
  { id: 'owl', emoji: '🦉', label: 'Owl', color: '#baffc9' },
  { id: 'bird', emoji: '🐦', label: 'Bird', color: '#bae1ff' },
  { id: 'rabbit', emoji: '🐰', label: 'Rabbit', color: '#e8c4ff' },
  { id: 'panda', emoji: '🐼', label: 'Panda', color: '#f3f3f3' },
  { id: 'koala', emoji: '🐨', label: 'Koala', color: '#d3d3d3' },
  { id: 'penguin', emoji: '🐧', label: 'Penguin', color: '#a0e7e5' },
  { id: 'tiger', emoji: '🐯', label: 'Tiger', color: '#ffd1b3' },
  { id: 'lion', emoji: '🦁', label: 'Lion', color: '#ffe4b5' },
  { id: 'bear', emoji: '🐻', label: 'Bear', color: '#e6c280' },
];

export default function ReaderOnboarding({ onComplete }) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('cat');
  const [email, setEmail] = useState('');
  const [subscribe, setSubscribe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    setError('');

    onComplete({
      name: name.trim(),
      profilePicture: selectedAvatar,
      email: email.trim() || undefined,
      subscribed: subscribe && !!email.trim()
    });
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card glass animate-slide-in-up">
        <div className="onboarding-header">
          <span className="onboarding-logo">📖</span>
          <h2>Welcome to My Diary</h2>
          <p>Create your reader profile to customize your experience and leave notes</p>
        </div>

        <form onSubmit={handleSubmit} className="onboarding-form">
          {error && <div className="onboarding-error">{error}</div>}

          {/* Name Input */}
          <div className="form-group">
            <label htmlFor="reader-name">Your Name</label>
            <input
              type="text"
              id="reader-name"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              required
            />
          </div>

          {/* Avatar Selector Grid */}
          <div className="form-group">
            <label>Select Your Animal Avatar</label>
            <div className="avatar-grid">
              {ANIMAL_AVATARS.map((avatar) => (
                <button
                  type="button"
                  key={avatar.id}
                  className={`avatar-option ${selectedAvatar === avatar.id ? 'selected' : ''}`}
                  style={{ '--avatar-bg': avatar.color }}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  title={avatar.label}
                >
                  <span className="avatar-emoji">{avatar.emoji}</span>
                  <span className="avatar-label">{avatar.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Email Subscription Fields */}
          <div className="form-group">
            <label htmlFor="reader-email">Email Address (Optional)</label>
            <input
              type="email"
              id="reader-email"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {email.trim() && (
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="reader-subscribe"
                checked={subscribe}
                onChange={(e) => setSubscribe(e.target.checked)}
              />
              <label htmlFor="reader-subscribe">
                Yes, email me notifications when NaKSh uploads new poems!
              </label>
            </div>
          )}

          <button type="submit" className="btn btn-primary onboarding-submit-btn">
            <span>✨</span> Open Diary
          </button>
        </form>
      </div>
    </div>
  );
}
