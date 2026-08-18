import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { unsubscribeNewsletter } from '../utils/api';
import toast from 'react-hot-toast';
import './Unsubscribe.css';

export default function Unsubscribe() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUnsubscribe = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await unsubscribeNewsletter(token);
      if (res && res.success) {
        setSuccess(true);
        toast.success('Successfully unsubscribed.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to unsubscribe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="unsubscribe-page">
      <div className="unsubscribe-backdrop">
        <div className="unsub-glow"></div>
      </div>

      <div className="unsubscribe-card glass animate-slide-in-up">
        <span className="unsub-icon">{success ? '🕊️' : '💔'}</span>
        
        {success ? (
          <div className="unsub-success-view">
            <h2>Successfully Unsubscribed</h2>
            <p className="unsub-desc">
              You will no longer receive email alerts from My Diary. We are sorry to see you go!
            </p>
            <button className="btn btn-primary unsub-home-btn" onClick={() => navigate('/')}>
              Return to Website
            </button>
          </div>
        ) : (
          <div className="unsub-confirm-view">
            <h2>Unsubscribe Request</h2>
            <p className="unsub-desc">
              Are you sure you want to unsubscribe from My Diary newsletter alerts? You will miss out on new poetry uploads and theme releases.
            </p>
            
            <div className="unsub-actions-row">
              <button
                className="btn btn-secondary"
                disabled={loading}
                onClick={() => navigate('/')}
              >
                Keep Subscription
              </button>
              <button
                className="btn btn-danger-unsub"
                disabled={loading}
                onClick={handleUnsubscribe}
              >
                {loading ? 'Unsubscribing...' : 'Yes, Unsubscribe'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
