import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { DataService } from '../services/storage';
import { MenuItem } from '../types';

const Home: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const config = DataService.getConfig();

  useEffect(() => {
    // Get signatures items
    const allItems = DataService.getMenu();
    setFeaturedItems(allItems.filter(item => item.isSignature).slice(0, 3));
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      {/* Removed overflow-hidden to prevent cutting off content on small screens */}
      <section className="relative min-h-screen w-full flex items-center justify-center bg-brand-coffee">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/id/431/1920/1080" 
            alt="Coffee House Interior" 
            className="w-full h-full object-cover opacity-80"
          />
          {/* Warm Coffee Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-coffee/60 via-brand-coffee/30 to-brand-coffee/90"></div>
        </div>

        {/* Content */}
        {/* Increased top padding (pt-40) to ensure 'Since 2021' is visible below navbar on mobile */}
        {/* Added bottom padding (pb-20) to ensure buttons are not cut off */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-40 pb-20 md:py-0 flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-brand-gold tracking-[0.4em] text-sm md:text-lg font-bold mb-4 md:mb-6 animate-pulse uppercase drop-shadow-lg">
            Since 2021
          </h2>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-brand-cream mb-6 md:mb-8 leading-tight tracking-tight drop-shadow-2xl break-keep">
            {config.heroTitle.split('&').map((part, i) => (
                <span key={i} className="block">{part} {i === 0 && <span className="text-brand-gold">&</span>}</span>
            ))}
          </h1>
          <p className="text-brand-latte text-lg md:text-2xl font-medium mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg break-keep px-4">
            {config.heroSubtitle}
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 w-full px-4">
            <Link 
              to="/menu" 
              className="w-full md:w-auto px-10 py-4 md:py-5 bg-brand-gold hover:bg-white hover:text-brand-coffee text-brand-coffee text-lg font-bold transition-all duration-300 min-w-[200px] flex items-center justify-center group rounded-sm shadow-xl"
            >
              <span className="mr-2">메뉴 보기</span>
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/about" 
              className="w-full md:w-auto px-10 py-4 md:py-5 bg-brand-coffee/60 backdrop-blur-md border border-brand-latte hover:bg-brand-latte hover:text-brand-coffee text-brand-latte text-lg transition-all duration-300 min-w-[200px] rounded-sm shadow-lg font-bold block text-center"
            >
              공간 소개
            </Link>
          </div>
        </div>
      </section>

      {/* Signature Menu Preview - Wood Theme */}
      <section className="py-28 bg-brand-latte">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-brand-coffee text-sm tracking-[0.2em] uppercase font-bold">Signature Collection</span>
            <h2 className="font-serif text-4xl md:text-5xl text-brand-text mt-4 mb-6">제로니모의 시그니처</h2>
            <div className="w-24 h-1.5 bg-brand-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredItems.map((item) => (
              <div key={item.id} className="group relative overflow-hidden bg-brand-cream rounded-xl shadow-wood hover:shadow-2xl transition-all duration-500 border border-brand-wood/10 hover:-translate-y-3">
                <div className="aspect-[4/3] overflow-hidden rounded-t-xl">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-10 relative">
                  <div className="absolute -top-6 right-6 bg-brand-gold text-brand-coffee p-3 rounded-full shadow-lg border-2 border-brand-cream">
                    <Star size={20} fill="currentColor" />
                  </div>
                  <h3 className="font-serif text-2xl text-brand-text mb-3 group-hover:text-brand-coffee transition-colors font-bold">{item.name}</h3>
                  <p className="text-brand-muted text-sm font-bold mb-4 uppercase tracking-wide">{item.nameEng}</p>
                  <p className="text-brand-coffee text-lg line-clamp-2 mb-6 h-14 font-medium leading-relaxed">{item.description}</p>
                  <p className="text-2xl font-bold text-brand-text">₩ {item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link to="/menu" className="inline-block border-b-2 border-brand-gold text-brand-text pb-1 hover:text-brand-gold transition-colors font-bold tracking-wide text-lg">
              전체 메뉴 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section - Wood Theme */}
      <section className="py-28 relative bg-brand-mocha border-t border-brand-coffee/30">
        <div 
            className="absolute inset-0 bg-fixed bg-cover bg-center opacity-20 mix-blend-overlay" 
            style={{ backgroundImage: `url(${config.philosophyBackgroundImage})` }}
        ></div>
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-20">
          <div className="md:w-1/2">
            <h2 className="font-serif text-5xl md:text-6xl text-brand-cream mb-10 leading-tight">
              커피 한 잔에 담긴<br/>
              <span className="text-brand-gold">장인의 철학</span>
            </h2>
            <p className="text-brand-latte text-lg md:text-xl leading-9 mb-8 font-medium">
              제로니모 커피하우스는 단순한 카페가 아닙니다. 
              세계 각지의 최상급 스페셜티 원두를 엄선하고, 
              매일 아침 구워내는 베이커리와 신선한 샐러드를 곁들인 브런치가 있는 미식의 공간입니다.
            </p>
            <p className="text-brand-latte text-lg md:text-xl leading-9 font-medium">
              높은 층고와 개방감 있는 인테리어는 도심 속 여유를 선사하며,
              곳곳에 배치된 식물들은 자연 속에 있는 듯한 편안함을 제공합니다.
              당신의 일상에 특별한 영감을 더해보세요.
            </p>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-6">
            <img src="https://picsum.photos/id/425/400/500" className="rounded-lg shadow-2xl border-4 border-brand-wood/30 mt-12 transform hover:scale-105 transition-transform duration-500" alt="Roasting" />
            <img src="https://picsum.photos/id/225/400/500" className="rounded-lg shadow-2xl border-4 border-brand-wood/30 transform hover:scale-105 transition-transform duration-500" alt="Pour over" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;