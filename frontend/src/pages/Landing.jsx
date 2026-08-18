import Hero from '../components/Hero';
import Features from '../components/Features';
import './Landing.css';

export default function Landing({ theme }) {
  return (
    <main className="landing">
      <Hero />
      <Features />
    </main>
  );
}
