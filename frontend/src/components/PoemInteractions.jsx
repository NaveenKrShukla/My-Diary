import { useState, useEffect } from 'react';
import { submitRating, getPoemRatings } from '../utils/api';
import toast from 'react-hot-toast';
import './PoemInteractions.css';

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

export default function PoemInteractions({ poem, reader, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [ratingsList, setRatingsList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingRatings, setLoadingRatings] = useState(true);

  // Load reviews/ratings for the current poem
  useEffect(() => {
    async function loadRatings() {
      try {
        setLoadingRatings(true);
        const data = await getPoemRatings(poem._id);
        setRatingsList(data);

        // Check if reader has already rated this poem
        const readerRating = data.find((r) => {
          const rId = typeof r.readerId === 'object' ? r.readerId._id : r.readerId;
          return rId === reader._id;
        });
        if (readerRating) {
          setRating(readerRating.rating);
          setFeedback(readerRating.feedback || '');
          setIsPublic(readerRating.isPublic);
        }
      } catch (err) {
        console.error('Failed to load ratings list:', err);
      } finally {
        setLoadingRatings(false);
      }
    }
    loadRatings();
  }, [poem._id, reader._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating of 1 to 5 stars.');
      return;
    }

    try {
      setSubmitting(true);
      const ratingData = {
        poemId: poem._id,
        readerId: reader._id,
        rating,
        feedback: feedback.trim(),
        isPublic,
      };

      const submitted = await submitRating(ratingData);
      
      if (submitted) {
        toast.success('Thank you for rating this poem!');
        // Refresh ratings list
        const updatedList = await getPoemRatings(poem._id);
        setRatingsList(updatedList);
      }
    } catch (err) {
      toast.error('Could not submit rating.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = ratingsList.length > 0
    ? (ratingsList.reduce((sum, r) => sum + r.rating, 0) / ratingsList.length).toFixed(1)
    : 0;

  return (
    <div className="interactions-modal">
      <div className="interactions-card glass animate-slide-in-up">
        <div className="interactions-header">
          <div>
            <h3>Poem Feedback</h3>
            <p className="interactions-poem-title">"{poem.title}"</p>
          </div>
          <button className="close-interactions-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Stats summary row */}
        <div className="interactions-stats-row">
          <div className="stat-box glass">
            <span className="stat-label">Views</span>
            <span className="stat-value">👁️ {poem.views || 0}</span>
          </div>
          <div className="stat-box glass">
            <span className="stat-label">Average Rating</span>
            <span className="stat-value">⭐ {averageRating > 0 ? `${averageRating} / 5` : 'No ratings'}</span>
          </div>
          <div className="stat-box glass">
            <span className="stat-label">Reviews</span>
            <span className="stat-value">💬 {ratingsList.length}</span>
          </div>
        </div>

        <div className="interactions-grid">
          {/* Left Panel: Submit Review */}
          <div className="interactions-left">
            <h4 className="panel-subheading">Submit Your Review</h4>
            <form onSubmit={handleSubmit} className="review-form">
              {/* Star Rating Input */}
              <div className="form-group">
                <label>Your Rating</label>
                <div className="stars-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`star-btn ${(hoverRating || rating) >= star ? 'filled' : ''}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Comment Input */}
              <div className="form-group">
                <label htmlFor="feedback-text">Your Thoughts</label>
                <textarea
                  id="feedback-text"
                  rows={4}
                  placeholder="Share what this poem made you feel... (optional)"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  maxLength={1000}
                />
              </div>

              {/* Public Toggle Switch */}
              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="feedback-public"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                <label htmlFor="feedback-public">
                  Make comment visible to the public community
                </label>
              </div>

              <button type="submit" className="btn btn-primary submit-review-btn" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </form>
          </div>

          {/* Right Panel: Community Feedback List */}
          <div className="interactions-right">
            <h4 className="panel-subheading">Community Comments</h4>
            <div className="comments-section">
              {loadingRatings ? (
                <div className="comments-loading">
                  <div className="loader small"></div>
                </div>
              ) : ratingsList.filter((r) => r.feedback).length === 0 ? (
                <p className="no-comments">No public comments yet. Be the first to share your thoughts!</p>
              ) : (
                <div className="comments-list">
                  {ratingsList
                    .filter((r) => r.feedback)
                    .map((item) => {
                      const reviewer = typeof item.readerId === 'object'
                        ? item.readerId
                        : { name: 'Anonymous', profilePicture: 'cat' };
                      const emoji = ANIMAL_EMOJIS[reviewer.profilePicture] || '🐱';

                      return (
                        <div key={item._id} className="comment-card glass">
                          <div className="comment-meta">
                            <div className="comment-user">
                              <span className="comment-avatar">{emoji}</span>
                              <span className="comment-username">{reviewer.name}</span>
                            </div>
                            <span className="comment-rating">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</span>
                          </div>
                          <p className="comment-text">{item.feedback}</p>
                          <span className="comment-date">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
