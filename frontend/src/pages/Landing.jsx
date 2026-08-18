import { useState } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import { subscribeNewsletter } from '../utils/api';
import toast from 'react-hot-toast';
import './Landing.css';

export default function Landing({ theme }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter an email address.');
      return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      // Retrieve reader ID from localStorage if they have onboarded already
      const readerData = JSON.parse(localStorage.getItem('local_reader'));
      const readerId = readerData ? readerData._id : undefined;

      const res = await subscribeNewsletter(email.trim(), readerId, 'instant');
      if (res && res.success) {
        toast.success(res.message || 'Subscribed successfully! Check your inbox.');
        setEmail('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to subscribe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="landing">
      <Hero />
      <Features />
      
      {/* Newsletter Section */}
      <section className="newsletter-section" id="subscribe">
        <div className="newsletter-card glass animate-slide-in-up">
          <span className="newsletter-icon">✉️</span>
          <h2 className="font-headings">Subscribe to the Diary</h2>
          <p className="newsletter-desc">
            Get instant email alerts whenever NaKSh publishes a new verse or releases a custom layout configuration. No spam, ever.
          </p>

          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              className="newsletter-input"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary newsletter-btn" disabled={loading}>
              {loading ? 'Subscribing...' : 'Subscribe ✨'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
