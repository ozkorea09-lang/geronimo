import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-coffee text-white pt-20 pb-10 border-t-8 border-brand-gold">
      <div className="container mx-auto px-6">
        {/* Adjusted Grid Layout: Brand(5) | Quick(2) | Contact(3) | Hours(2) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          
          {/* Brand Info - Increased width to push Quick Links right */}
          <div className="md:col-span-5 pr-8">
            <h3 className="font-serif text-3xl text-brand-gold mb-8 font-bold">Geronimo Coffee House</h3>
            <p className="text-white text-sm leading-loose mb-8 font-medium">
              일상의 휴식과 예술적 영감을 제공하는<br/>
              프리미엄 복합 문화 공간.<br/>
              최고의 커피와 빵, 브런치로 당신의 하루를 완성합니다.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-white hover:text-brand-gold transition-colors transform hover:scale-110 duration-300"><Instagram size={24} /></a>
              <a href="#" className="text-white hover:text-brand-gold transition-colors transform hover:scale-110 duration-300"><Facebook size={24} /></a>
            </div>
          </div>

          {/* Quick Links - Shifted right by Brand column expansion */}
          <div className="md:col-span-2">
            <h4 className="font-serif text-brand-gold text-lg mb-8 font-bold border-b border-brand-wood/30 pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-4 text-sm text-white">
              <li><Link to="/menu" className="hover:text-brand-gold transition-colors block hover:translate-x-1 duration-300">Menu</Link></li>
              <li><Link to="/gallery" className="hover:text-brand-gold transition-colors block hover:translate-x-1 duration-300">Gallery</Link></li>
              <li><Link to="/news" className="hover:text-brand-gold transition-colors block hover:translate-x-1 duration-300">Notice</Link></li>
              <li><Link to="/about" className="hover:text-brand-gold transition-colors block hover:translate-x-1 duration-300">Brand Story</Link></li>
            </ul>
          </div>

          {/* Contact - Increased width for address, moved left relative to right edge */}
          <div className="md:col-span-3">
            <h4 className="font-serif text-brand-gold text-lg mb-8 font-bold border-b border-brand-wood/30 pb-2 inline-block">Contact Us</h4>
            <ul className="space-y-5 text-sm text-white">
              <li className="flex items-start group">
                <MapPin size={20} className="mt-0.5 mr-3 text-brand-gold group-hover:text-white transition-colors flex-shrink-0" />
                <span className="leading-relaxed whitespace-nowrap">경기도 양주시 화합로 1597번길 3<br/>(주차 200대 가능)</span>
              </li>
              <li className="flex items-center group">
                <Phone size={20} className="mr-3 text-brand-gold group-hover:text-white transition-colors flex-shrink-0" />
                <span>031-858-3434</span>
              </li>
              <li className="flex items-center group">
                <Mail size={20} className="mr-3 text-brand-gold group-hover:text-white transition-colors flex-shrink-0" />
                <span>geronimo2291@naver.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="md:col-span-2">
            <h4 className="font-serif text-brand-gold text-lg mb-8 font-bold border-b border-brand-wood/30 pb-2 inline-block">Opening Hours</h4>
            <ul className="space-y-4 text-sm text-white">
              <li className="flex justify-between border-b border-brand-wood/50 pb-3">
                <span className="font-medium">월 - 금</span>
                <span className="font-bold tracking-wide">09:00 - 24:00</span>
              </li>
              <li className="flex justify-between border-b border-brand-wood/50 pb-3">
                <span className="font-medium">주말/공휴일</span>
                <span className="font-bold tracking-wide">09:00 - 24:00</span>
              </li>
              <li className="flex justify-between border-b border-brand-wood/50 pb-3">
                <span className="font-medium">12/24 & 12/31</span>
                <span className="font-bold tracking-wide">09:00 - 01:00</span>
              </li>              
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-wood/30 pt-10 flex flex-col md:flex-row justify-between items-center text-xs text-white/80">
          <p className="mb-4 md:mb-0">&copy; 2026 GERONIMO COFFEE HOUSE. All rights reserved.</p>
          <div className="flex space-x-8">
            <Link to="/privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-brand-gold transition-colors">Terms of Service</Link>
            <Link to="/admin" className="hover:text-brand-gold transition-colors">ADMIN</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;