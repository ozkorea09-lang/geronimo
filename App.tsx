import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import About from './pages/About';
import News from './pages/News';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// Wrapper to conditionally render Layout (Admin might have different layout, but for now we keep Nav)
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Using brand-latte as the base background
  return (
    <div className="flex flex-col min-h-screen bg-brand-latte text-brand-text">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
};

export default App;