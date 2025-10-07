import React from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import Showcase from './components/Showcase';
import CTA from './components/CTA';

export default function App() {
  return (
    <div className="min-h-screen bg-[#07080b] text-white antialiased selection:bg-indigo-500/30 selection:text-white">
      <Hero />
      <Features />
      <Showcase />
      <CTA />
    </div>
  );
}
