import { useEffect } from 'react';

import {
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import { featurePages } from '../data/siteData';
import AboutPage from '../pages/AboutPage';
import BlogPage from '../pages/BlogPage';
import CaseStudiesPage from '../pages/CaseStudiesPage';
import ContactPage from '../pages/ContactPage';
import FeaturePage from '../pages/FeaturePage';
import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import NotFoundPage from '../pages/NotFoundPage';
import PricingPage from '../pages/PricingPage';
import Register from '../pages/Register';
import FloatingChatWidget from './FloatingChatWidget';
import Footer from './Footer';
import SiteHeader from './SiteHeader';

export default function SiteLayout() {
  const { pathname, hash } = useLocation()

  // Scroll to top on every page navigation (skip if hash link like /#features)
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return (
    <div className="app-shell">
      <SiteHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {featurePages.map((feature) => (
            <Route
              key={feature.slug}
              path={`/features/${feature.slug}`}
              element={<FeaturePage feature={feature} />}
            />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <FloatingChatWidget />
    </div>
  )
}
