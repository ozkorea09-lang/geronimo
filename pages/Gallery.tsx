import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // 1. Supabase 클라이언트 불러오기
import { GalleryItem } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. 데이터 불러오기 로직 수정
  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false }); // 최신순 정렬

        if (error) throw error;
        if (data) {
          // DB 컬럼명(image_url)과 타입(imageUrl)이 다를 경우를 대비한 매핑
          const mappedData = data.map(item => ({
            id: item.id,
            title: item.title,
            imageUrl: item.image_url || item.imageUrl,
            category: item.category,
            created_at: item.created_at
          }));
          setItems(mappedData);
        }
      } catch (error) {
        console.error('갤러리 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto';
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
        {loading ? (
          <div className="text-center text-brand-coffee py-24 text-xl font-medium animate-pulse">이미지를 불러오는 중입니다...</div>
        ) : items.length === 0 ? (
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

      {/* Lightbox Modal - UI 유지 */}
      {selectedIndex !== null && items[selectedIndex] && (
        <div 
          className="fixed inset-0 z-[100] bg-brand-coffee/95 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
          onClick={closeLightbox}
        >
          <button onClick={closeLightbox} className="absolute top-4 right-4 md:top-8 md:right-8 text-brand-latte/70 hover:text-brand-gold transition-colors z-[101]">
            <X size={40} />
          </button>

          <button onClick={showPrev} className="absolute left-2 md:left-10 text-brand-latte/70 hover:text-brand-gold hover:bg-white/10 p-2 md:p-4 rounded-full transition-all z-[101]">
            <ChevronLeft className="w-10 h-10 md:w-[60px] md:h-[60px]" />
          </button>

          <div className="relative w-full max-w-6xl h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex-1 min-h-0 flex items-center justify-center w-full p-2">
                <img src={items[selectedIndex].imageUrl} alt={items[selectedIndex].title} className="max-w-full max-h-full object-contain shadow-2xl rounded-sm border-4 md:border-8 border-brand-wood/50" />
            </div>
            <div className="flex-shrink-0 mt-4 md:mt-6 text-center bg-brand-coffee/90 backdrop-blur-md px-8 py-4 rounded-xl border border-brand-wood/30 shadow-2xl max-w-[90%]">
              <h3 className="text-brand-gold font-serif text-2xl md:text-3xl font-bold">{items[selectedIndex].title}</h3>
              <p className="text-brand-latte/90 text-sm md:text-base mt-2 uppercase tracking-widest inline-block font-bold border-t border-brand-wood/30 pt-2">
                {items[selectedIndex].category}
              </p>
            </div>
          </div>

          <button onClick={showNext} className="absolute right-2 md:right-10 text-brand-latte/70 hover:text-brand-gold hover:bg-white/10 p-2 md:p-4 rounded-full transition-all z-[101]">
            <ChevronRight className="w-10 h-10 md:w-[60px] md:h-[60px]" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;