import {
  Route,
  Routes,
} from 'react-router-dom';

import { featurePages } from '../data/siteData';
import AboutPage from '../pages/AboutPage';
import BlogPage from '../pages/BlogPage';
import CaseStudiesPage from '../pages/CaseStudiesPage';
import ContactPage from '../pages/ContactPage';
import FeaturePage from '../pages/FeaturePage';
import HomePage from '../pages/HomePage';
import Login from '../pages/login';
import NotFoundPage from '../pages/NotFoundPage';
import PricingPage from '../pages/PricingPage';
import Register from '../pages/Register';
import Footer from './Footer';
import FloatingChatWidget from './FloatingChatWidget';
import SiteHeader from './SiteHeader';

export default function SiteLayout() {
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
