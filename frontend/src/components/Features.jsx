import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Features.css';

gsap.registerPlugin(ScrollTrigger);

const FEATURES_DATA = [
  {
    id: 1,
    icon: '📖',
    title: 'Interactive 3D Reader',
    description: 'Flip through a realistic page-turning book interface designed to showcase my journal and poems.',
  },
  {
    id: 2,
    icon: '🎨',
    title: '5 Immersive Themes',
    description: 'Switch between Dark, Zen, Cyberpunk, Vintage, and Aurora themes to match the emotional tone of the verses.',
  },
  {
    id: 3,
    icon: '✍️',
    title: 'Personal Margins Pen',
    description: 'Highlight your favorite verses and write your thoughts directly in the margins as custom notes.',
  },
  {
    id: 4,
    icon: '📤',
    title: 'Download & Share Cards',
    description: 'Instantly export any page as a beautiful customized JPEG image or clean PDF layout to share with friends.',
  },
  {
    id: 5,
    icon: '🔒',
    title: 'Private Drafts Editor',
    description: 'A secure admin dashboard where I can write, format, preview, and save my poems in real time.',
  },
  {
    id: 6,
    icon: '📧',
    title: 'Direct Reader Letters',
    description: 'Subscribe with your email to receive automated notifications as soon as I post new writings.',
  },
];

export default function Features() {
  const featuresRef = useRef(null);
  const featureCardsRef = useRef([]);

  useEffect(() => {
    const cards = featureCardsRef.current.filter(Boolean);

    // Animate feature cards on scroll
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 0.5,
            once: true,
          },
        }
      );
    });

    // Hover animation handlers
    const enterHandlers = cards.map(card => {
      const handler = () => {
        gsap.to(card, {
          y: -10,
          duration: 0.3,
          overwrite: 'auto',
        });
      };
      card.addEventListener('mouseenter', handler);
      return handler;
    });

    const leaveHandlers = cards.map(card => {
      const handler = () => {
        gsap.to(card, {
          y: 0,
          duration: 0.3,
          overwrite: 'auto',
        });
      };
      card.addEventListener('mouseleave', handler);
      return handler;
    });

    return () => {
      cards.forEach((card, index) => {
        if (card) {
          card.removeEventListener('mouseenter', enterHandlers[index]);
          card.removeEventListener('mouseleave', leaveHandlers[index]);
        }
      });
    };
  }, []);

  return (
    <section className="features" id="features" ref={featuresRef}>
      <div className="container">
        <div className="features-header">
          <h2 className="features-title">Premium Features</h2>
          <p className="features-subtitle">
            Everything you need for the ultimate poetry reading and sharing experience
          </p>
        </div>

        <div className="features-grid">
          {FEATURES_DATA.map((feature, index) => (
            <div
              key={feature.id}
              className="feature-card glass"
              ref={(el) => (featureCardsRef.current[index] = el)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
