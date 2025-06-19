import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import Dashboard from './Dashboard';

export default function Home() {
  const { user } = useAuth();

  // Si el usuario está autenticado, mostrar el dashboard
  if (user) {
    return <Dashboard />;
  }

  // Si no está autenticado, mostrar la landing page
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}

