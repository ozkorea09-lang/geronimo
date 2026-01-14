import React, { useState, useEffect } from 'react';
import { DataService } from '../services/storage';
import { GalleryItem } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setItems(DataService.getGallery());
  }, []);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev !== null ? (prev + 1) % items.length : null));
    }
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : null));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') setSelectedIndex((prev) => (prev !== null ? (prev + 1) % items.length : null));
      if (e.key === 'ArrowLeft') setSelectedIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : null));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, items.length]);

  return (
    <div className="pt-24 min-h-screen bg-brand-latte">
      <div className="bg-brand-coffee py-20 mb-16 shadow-wood relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="font-serif text-5xl md:text-6xl text-brand-gold mb-6 drop-shadow-md">GALLERY</h1>
          <p className="text-brand-cream text-xl">공간의 미학, 그 이상의 감동</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-24">
        {items.length === 0 ? (
          <div className="text-center text-brand-muted py-24 text-xl font-medium">등록된 갤러리 이미지가 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((img, index) => (
              <div 
                key={img.id} 
                className="relative group overflow-hidden aspect-square cursor-pointer bg-brand-cream rounded-lg shadow-wood hover:shadow-2xl transition-all duration-300 border-2 border-brand-wood/20"
                onClick={() => openLightbox(index)}
              >
                <img 
                  src={img.imageUrl} 
                  alt={img.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-brand-coffee/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <span className="text-brand-cream font-serif text-2xl tracking-wider border-b-2 border-brand-gold pb-1 bg-brand-coffee/80 px-6 py-3 rounded-sm shadow-lg">
                    {img.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && items[selectedIndex] && (
        <div 
          className="fixed inset-0 z-[100] bg-brand-coffee/95 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
          onClick={closeLightbox}
        >
          <button 
            onClick={closeLightbox}
            className="absolute top-8 right-8 text-brand-latte/70 hover:text-brand-gold transition-colors z-[101]"
          >
            <X size={50} />
          </button>

          <button 
            onClick={showPrev}
            className="absolute left-4 md:left-10 text-brand-latte/70 hover:text-brand-gold hover:bg-white/10 p-4 rounded-full transition-all z-[101]"
          >
            <ChevronLeft size={60} />
          </button>

          <div 
            className="relative max-w-6xl max-h-[90vh] w-full flex flex-col items-center" 
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={items[selectedIndex].imageUrl} 
              alt={items[selectedIndex].title} 
              className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm border-8 border-brand-wood/50"
            />
            <div className="mt-8 text-center bg-brand-coffee/80 backdrop-blur-sm px-10 py-4 rounded-full border border-brand-wood/30">
              <h3 className="text-brand-gold font-serif text-3xl">{items[selectedIndex].title}</h3>
              <p className="text-brand-latte/80 text-base mt-2 uppercase tracking-widest inline-block font-bold">
                {items[selectedIndex].category}
              </p>
            </div>
          </div>

          <button 
            onClick={showNext}
            className="absolute right-4 md:right-10 text-brand-latte/70 hover:text-brand-gold hover:bg-white/10 p-4 rounded-full transition-all z-[101]"
          >
            <ChevronRight size={60} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;