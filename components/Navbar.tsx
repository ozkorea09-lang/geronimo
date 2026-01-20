import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Coffee } from 'lucide-react';
import { DataService } from '../services/storage';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Load logo from config
    const config = DataService.getConfig();
    setLogoUrl(config.logoImageUrl);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]); // Re-check config on location change to update after admin saves

  const navLinks = [
    { name: '브랜드 소개', path: '/about' },
    { name: '메뉴', path: '/menu' },
    { name: '갤러리', path: '/gallery' },
    { name: '새소식', path: '/news' },
  ];

  // Distinct separated look: Always dark background for clear separation
  const headerClass = `fixed w-full z-50 transition-all duration-300 shadow-wood ${
    isScrolled 
      ? 'bg-brand-coffee/95 backdrop-blur-md py-4' 
      : 'bg-brand-coffee py-6'
  }`;

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className={`bg-brand-gold rounded-sm shadow-md group-hover:bg-white transition-colors duration-300 flex items-center justify-center overflow-hidden ${logoUrl ? 'w-11 h-11' : 'p-2'}`}>
             {logoUrl ? (
               <img src={logoUrl} alt="Logo" className="w-90% h-90% object-cover" />
             ) : (
               <Coffee className="text-brand-coffee w-7 h-7" />
             )}
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-widest text-brand-cream group-hover:text-brand-gold transition-colors">GERONIMO</span>
            <span className="text-xs tracking-[0.3em] uppercase text-brand-wood">Coffee House</span>
          </div>
        </Link>

        {/* Desktop Nav - Increased Font Size */}
        <nav className="hidden xl:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-xl font-bold tracking-wider transition-colors duration-300 ${
                location.pathname === link.path 
                  ? 'text-brand-gold border-b-2 border-brand-gold pb-1' 
                  : 'text-brand-latte hover:text-brand-gold'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        {/* Tablet Nav (Smaller font if needed, or keep hidden) */}
        <nav className="hidden md:flex xl:hidden items-center space-x-6">
          {navLinks.map((link) => (
             <Link
             key={link.name}
             to={link.path}
             className={`text-lg font-bold tracking-wide transition-colors duration-300 ${
               location.pathname === link.path 
                 ? 'text-brand-gold' 
                 : 'text-brand-latte hover:text-brand-gold'
             }`}
           >
             {link.name}
           </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-brand-latte hover:text-brand-gold transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-brand-coffee/95 backdrop-blur-lg border-t border-brand-mocha py-10 px-6 flex flex-col space-y-8 animate-fade-in-down shadow-xl h-screen">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-2xl font-serif text-brand-latte hover:text-brand-gold border-l-4 border-transparent hover:border-brand-gold pl-6 transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;