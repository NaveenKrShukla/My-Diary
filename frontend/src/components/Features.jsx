import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Features.css';

gsap.registerPlugin(ScrollTrigger);

const FEATURES_DATA = [
  {
    id: 1,
    icon: '📖',
    title: 'Read Beautiful Poems',
    description: 'Discover curated poetry collections with stunning typography and book-like reading experience.',
  },
  {
    id: 2,
    icon: '🎨',
    title: '5 Premium Themes',
    description: 'Choose from Dark, Zen, Cyberpunk, Vintage, and Aurora themes with seamless theme switching.',
  },
  {
    id: 3,
    icon: '✍️',
    title: 'Share Your Verses',
    description: 'Publish your poetry and reach a community of enthusiastic readers and fellow poets.',
  },
  {
    id: 4,
    icon: '💬',
    title: 'Engage & Connect',
    description: 'Rate poems, leave feedback, and connect with poets through a vibrant community.',
  },
  {
    id: 5,
    icon: '📧',
    title: 'Email Notifications',
    description: 'Stay updated with new poems and receive curated recommendations in your inbox.',
  },
  {
    id: 6,
    icon: '📥',
    title: 'Export as PDF/JPEG',
    description: 'Download your favorite poems as beautifully formatted PDF or JPEG files.',
  },
];

export default function Features() {
  const featuresRef = useRef(null);
  const featureCardsRef = useRef([]);

  useEffect(() => {
    // Animate feature cards on scroll
    featureCardsRef.current.forEach((card, index) => {
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

      // Hover animation
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          duration: 0.3,
          overwrite: 'auto',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          duration: 0.3,
          overwrite: 'auto',
        });
      });
    });

    return () => {
      featureCardsRef.current.forEach((card) => {
        card.removeEventListener('mouseenter', () => {});
        card.removeEventListener('mouseleave', () => {});
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
