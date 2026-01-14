import React, { useState, useEffect } from 'react';
import { DataService } from '../services/storage';
import { MenuItem, MenuCategory } from '../types';
import { X, ChevronLeft, ChevronRight, Coffee } from 'lucide-react';

const Menu: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'all'>('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setItems(DataService.getMenu());
  }, []);

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  const categories: { id: MenuCategory | 'all'; label: string; colorClass: string }[] = [
    { id: 'all', label: 'All Menu', colorClass: 'border-brand-coffee text-brand-coffee' },
    { id: 'coffee', label: 'Specialty Coffee', colorClass: 'border-brand-catCoffee text-brand-catCoffee' },
    { id: 'beverage', label: 'Coffee & Beverage', colorClass: 'border-brand-catBev text-brand-catBev' },
    { id: 'bakery', label: 'Master Bakery', colorClass: 'border-brand-catBaker text-brand-catBaker' },
    { id: 'brunch', label: 'Brunch & Meal', colorClass: 'border-brand-catBrunch text-brand-catBrunch' },
  ];

  // Helper to get accent color based on item category
  const getCategoryColor = (category: MenuCategory) => {
      switch(category) {
          case 'coffee': return 'text-brand-catCoffee';
          case 'beverage': return 'text-brand-catBev';
          case 'bakery': return 'text-brand-catBaker';
          case 'brunch': return 'text-brand-catBrunch';
          default: return 'text-brand-coffee';
      }
  };

  const getCategoryBg = (category: MenuCategory) => {
      switch(category) {
          case 'coffee': return 'bg-brand-catCoffee';
          case 'beverage': return 'bg-brand-catBev';
          case 'bakery': return 'bg-brand-catBaker';
          case 'brunch': return 'bg-brand-catBrunch';
          default: return 'bg-brand-coffee';
      }
  };

  const openModal = (index: number) => {
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedIndex(null);
  };

  const showNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
    }
  };

  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null));
    }
  };

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredItems.length]);

  const selectedItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  return (
    <div className="pt-24 min-h-screen bg-brand-latte">
      {/* Header with separate look */}
      <div className="bg-brand-coffee py-20 mb-16 shadow-wood relative overflow-hidden">
        {/* Pattern overlay if desired */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="font-serif text-5xl md:text-6xl text-brand-gold mb-6 drop-shadow-md tracking-wider">MENU</h1>
          <p className="text-brand-cream text-lg font-light tracking-wide">제로니모만의 특별한 미식 경험을 만나보세요</p>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-24">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-5 mb-20">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            let activeClass = '';
            
            // Define active styles based on category color
            if (isActive) {
                if (cat.id === 'all') activeClass = 'bg-brand-coffee text-white border-brand-coffee shadow-lg scale-105';
                else if (cat.id === 'coffee') activeClass = 'bg-brand-catCoffee text-white border-brand-catCoffee shadow-lg scale-105';
                else if (cat.id === 'beverage') activeClass = 'bg-brand-catBev text-white border-brand-catBev shadow-lg scale-105';
                else if (cat.id === 'bakery') activeClass = 'bg-brand-catBaker text-white border-brand-catBaker shadow-lg scale-105';
                else if (cat.id === 'brunch') activeClass = 'bg-brand-catBrunch text-white border-brand-catBrunch shadow-lg scale-105';
            } else {
                activeClass = `bg-brand-cream hover:bg-white ${cat.colorClass}`;
            }

            return (
                <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSelectedIndex(null); }}
                className={`px-8 py-4 text-base font-bold tracking-wider uppercase transition-all duration-300 border-2 rounded-lg shadow-sm ${activeClass}`}
                >
                {cat.label}
                </button>
            )
          })}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-16 max-w-6xl mx-auto">
          {filteredItems.map((item, index) => (
            <div 
              key={item.id} 
              className="flex flex-col sm:flex-row gap-6 group cursor-pointer bg-brand-cream p-6 rounded-xl shadow-wood hover:shadow-2xl transition-all duration-300 border border-brand-wood/20 hover:-translate-y-2 hover:border-brand-gold/30"
              onClick={() => openModal(index)}
            >
              <div className="w-full sm:w-48 h-48 flex-shrink-0 overflow-hidden rounded-lg bg-brand-wood/20 shadow-inner relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Category color strip */}
                <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${getCategoryBg(item.category)}`}></div>
              </div>
              <div className="flex-grow flex flex-col justify-center border-b border-brand-wood/10 pb-4 sm:border-none sm:pb-0">
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="text-2xl font-serif text-brand-text group-hover:text-brand-coffee transition-colors font-bold">
                    {item.name}
                  </h3>
                  <span className={`text-xl font-bold ${getCategoryColor(item.category)}`}>
                    ₩ {item.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-brand-muted uppercase tracking-widest mb-3 font-bold">{item.nameEng}</p>
                <p className="text-base md:text-lg text-brand-coffee leading-relaxed line-clamp-3 font-medium">
                  {item.description}
                </p>
                {item.isSignature && (
                  <span className="inline-block mt-4 text-xs bg-brand-gold text-brand-coffee px-3 py-1.5 rounded-sm w-fit font-bold shadow-sm">
                    SIGNATURE
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center text-brand-muted py-24 text-xl">
            해당 카테고리의 메뉴가 준비중입니다.
          </div>
        )}
      </div>

      {/* Detail Modal - Wood Theme */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] bg-brand-coffee/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={closeModal}
        >
          {/* Navigation Buttons */}
          <button 
            onClick={showPrev}
            className="absolute left-4 md:left-8 text-brand-latte/70 hover:text-brand-gold hover:bg-brand-coffee/50 p-3 rounded-full transition-all z-[101]"
          >
            <ChevronLeft size={56} />
          </button>
          
          <button 
            onClick={showNext}
            className="absolute right-4 md:right-8 text-brand-latte/70 hover:text-brand-gold hover:bg-brand-coffee/50 p-3 rounded-full transition-all z-[101]"
          >
            <ChevronRight size={56} />
          </button>

          {/* Close Button */}
          <button 
            onClick={closeModal}
            className="absolute top-6 right-6 text-brand-latte/70 hover:text-brand-gold transition-colors z-[101]"
          >
            <X size={44} />
          </button>

          {/* Modal Content */}
          <div 
            className="relative bg-brand-cream w-full max-w-6xl rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] border-4 border-brand-wood"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section */}
            <div className="md:w-1/2 bg-brand-wood/20 h-72 md:h-auto md:min-h-[600px]">
              <img 
                src={selectedItem.imageUrl} 
                alt={selectedItem.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Section */}
            <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center overflow-y-auto bg-brand-cream relative">
               {/* Decorative Background Icon */}
               <Coffee className="absolute top-10 right-10 text-brand-wood/10 w-40 h-40 -z-0" />
               
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                    <span className={`text-sm font-bold uppercase tracking-widest text-white px-4 py-1.5 rounded-full shadow-md ${getCategoryBg(selectedItem.category)}`}>
                    {categories.find(c => c.id === selectedItem.category)?.label || selectedItem.category}
                    </span>
                    {selectedItem.isSignature && (
                    <span className="text-sm font-bold uppercase tracking-widest bg-brand-gold text-brand-coffee px-4 py-1.5 rounded-full shadow-md">
                        Signature
                    </span>
                    )}
                </div>

                <h2 className="text-4xl md:text-5xl font-serif text-brand-text mb-3 leading-tight font-bold">
                    {selectedItem.name}
                </h2>
                <p className={`text-lg font-bold uppercase tracking-widest mb-8 ${getCategoryColor(selectedItem.category)}`}>
                    {selectedItem.nameEng}
                </p>
                
                <div className="w-20 h-1.5 bg-brand-wood/40 mb-8 rounded-full"></div>

                <p className="text-brand-coffee leading-loose text-xl mb-10 font-medium">
                    {selectedItem.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-8 border-t-2 border-brand-wood/20">
                    <span className="text-brand-muted text-lg tracking-wider uppercase font-bold">Price</span>
                    <span className="text-4xl font-serif text-brand-text font-bold">₩ {selectedItem.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;