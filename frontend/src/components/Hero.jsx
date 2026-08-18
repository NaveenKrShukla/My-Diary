import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cta1Ref = useRef(null);
  const cta2Ref = useRef(null);
  const floatingBoxesRef = useRef([]);
  floatingBoxesRef.current = [];

  useEffect(() => {
    // Animate title with zoom-in effect
    gsap.fromTo(
      titleRef.current,
      {
        opacity: 0,
        scale: 0.8,
        y: 30,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        ease: 'back.out',
      }
    );

    // Animate subtitle
    gsap.fromTo(
      subtitleRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power2.out',
      }
    );

    // Animate CTA buttons with stagger
    gsap.fromTo(
      [cta1Ref.current, cta2Ref.current],
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.6,
        ease: 'power2.out',
      }
    );

    // Animate floating boxes
    floatingBoxesRef.current.forEach((box, index) => {
      if (!box) return;
      gsap.fromTo(
        box,
        {
          opacity: 0,
          y: 100,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.8 + index * 0.15,
          ease: 'power2.out',
        }
      );

      // Continuous floating animation
      gsap.to(box, {
        y: -20 - index * 10,
        duration: 3 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Parallax effect on scroll - translate the entire content block together to prevent collisions
    const heroContent = heroRef.current?.querySelector('.hero-content');
    if (heroContent) {
      gsap.to(heroContent, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
        y: 120,
        opacity: 0,
        ease: 'none',
      });
    }
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-container">
        {/* Animated Background Elements */}
        <div className="background-elements">
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
          <div className="glow-orb orb-3"></div>
        </div>

        {/* Main Content */}
        <div className="hero-content">
          <h1 ref={titleRef} className="hero-title gradient-text">
            NaKSh's Diary
          </h1>

          <p ref={subtitleRef} className="hero-subtitle">
            Welcome to my private collection of verses, thoughts, and reflections. Explore my writing in an interactive 3D reader, customize themes to match your mood, highlight your favorite lines, and export beautiful poetry cards to share.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta">
            <Link ref={cta1Ref} to="/read" className="btn btn-primary">
              <span>📖</span>
              Open Diary
            </Link>
            <Link ref={cta2Ref} to="/admin" className="btn btn-secondary">
              <span>🔒</span>
              Admin Gate
            </Link>
          </div>
        </div>

        {/* Floating Feature Cards */}
        <div className="floating-cards">
          <div
            className="float-card"
            ref={(el) => { if (el) floatingBoxesRef.current.push(el); }}
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="card-icon">✍️</div>
            <p className="card-text">My Writings</p>
          </div>

          <div
            className="float-card"
            ref={(el) => { if (el) floatingBoxesRef.current.push(el); }}
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="card-icon">🎨</div>
            <p className="card-text">Custom Themes</p>
          </div>

          <div
            className="float-card"
            ref={(el) => { if (el) floatingBoxesRef.current.push(el); }}
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="card-icon">📤</div>
            <p className="card-text">Share Cards</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </motion.div>
    </section>
  );
}
