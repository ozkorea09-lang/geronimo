import React, { useEffect, useState } from 'react';
import { Coffee, MapPin, Star, X, ChevronLeft, ChevronRight, ExternalLink, Utensils, ArrowRight } from 'lucide-react';
import { supabase } from '../supabaseClient'; // 1. Supabase 클라이언트 추가
import { AboutPageData } from '../types';

const About: React.FC = () => {
  const [data, setData] = useState<AboutPageData | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. Supabase에서 About 페이지 데이터 불러오기
  useEffect(() => {
    const fetchAboutData = async () => {
      setLoading(true);
      try {
        const { data: aboutData, error } = await supabase
          .from('site_settings')
          .select('content')
          .eq('key', 'about_page')
          .single();

        if (error) throw error;
        if (aboutData) {
          setData(aboutData.content as AboutPageData);
        }
      } catch (error) {
        console.error('About 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // 로딩 중 표시
  if (loading) return <div className="min-h-screen bg-brand-latte text-brand-text pt-20 flex items-center justify-center font-serif text-xl animate-pulse">Loading Geronimo Story...</div>;
  
  if (!data) return <div className="min-h-screen bg-brand-latte text-brand-text pt-20 flex items-center justify-center font-serif text-xl">데이터를 찾을 수 없습니다.</div>;

  // Lightbox Logic (기존 유지)
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'auto';
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && data.gallery.images.length > 0) {
      setLightboxIndex((prev) => (prev !== null ? (prev + 1) % data.gallery.images.length : null));
    }
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && data.gallery.images.length > 0) {
      setLightboxIndex((prev) => (prev !== null ? (prev - 1 + data.gallery.images.length) % data.gallery.images.length : null));
    }
  };

  const displayLimit = 4;
  const displayedImages = data.gallery.images.slice(0, displayLimit);
  const hasMoreImages = data.gallery.images.length > displayLimit;

  return (
    <div className="w-full bg-brand-latte text-brand-text pt-20">
      {/* Hero Section */}
      <section className="relative h-[75vh] flex items-center justify-center overflow-hidden bg-brand-coffee">
        <div className="absolute inset-0">
          <img 
            src={data.hero.imageUrl} 
            alt="Hero Background" 
            className="w-full h-full object-cover animate-fade-in opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-brand-coffee/90"></div>
        </div>
        <div className="relative z-10 text-center px-6">
          <span className="text-brand-gold tracking-[0.4em] text-lg font-bold uppercase mb-8 block animate-fade-in-up drop-shadow-md">
            About Brand
          </span>
          <h1 className="font-serif text-6xl md:text-8xl mb-10 leading-tight drop-shadow-2xl animate-fade-in-up delay-100 whitespace-pre-line text-brand-cream font-bold">
            {data.hero.title}
          </h1>
          <p className="text-brand-cream max-w-3xl mx-auto text-2xl font-medium leading-relaxed animate-fade-in-up delay-200 whitespace-pre-line drop-shadow-md">
            {data.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-28 container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-20">
          <div className="md:w-1/2">
            <div className="relative">
              <img src={data.story.imageMain} alt="Cafe Interior" className="w-full rounded-lg shadow-wood border-2 border-brand-wood/20" />
              <div className="absolute -bottom-12 -right-12 w-2/3 hidden md:block">
                 <img src={data.story.imageSub} alt="Coffee Detail" className="w-full rounded-lg shadow-wood border-8 border-brand-latte transition-all duration-700 hover:scale-105" />
              </div>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-12 mt-12 md:mt-0">
            <h2 className="font-serif text-5xl mb-10 leading-snug whitespace-pre-line text-brand-text font-bold">
              {data.story.title.includes('GERONIMO') ? (
                 <>
                   <span className="text-brand-gold">GERONIMO</span><br/>
                   COFFEE HOUSE
                 </>
              ) : data.story.title}
            </h2>
            <div className="space-y-8 text-brand-coffee leading-9 text-lg text-justify font-medium">
              <p className="whitespace-pre-wrap">{data.story.description1}</p>
              <p className="whitespace-pre-wrap">{data.story.description2}</p>
              <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-brand-wood/20 mt-10">
                <div>
                  <h4 className="text-brand-coffee font-serif text-4xl mb-2 font-bold">200+</h4>
                  <p className="text-base text-brand-muted uppercase tracking-wider font-bold">Parking Spaces</p>
                </div>
                <div>
                  <h4 className="text-brand-coffee font-serif text-4xl mb-2 font-bold">Master</h4>
                  <p className="text-base text-brand-muted uppercase tracking-wider font-bold">Bakery Quality</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Icons */}
      <section className="bg-brand-cream py-28 border-y-2 border-brand-wood/20 relative overflow-hidden shadow-sm">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl text-brand-text mb-6 font-bold">{data.philosophy.title}</h2>
            <p className="text-brand-coffee text-lg">{data.philosophy.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
            {data.philosophy.items.map((item, idx) => (
              <div key={idx} className="p-12 bg-brand-latte border-2 border-brand-wood/10 hover:border-brand-gold transition-all duration-500 rounded-xl group shadow-wood hover:shadow-2xl hover:-translate-y-3">
                <div className="w-24 h-24 bg-brand-coffee/10 rounded-full flex items-center justify-center mx-auto mb-10 group-hover:bg-brand-gold transition-colors duration-500">
                  {idx === 0 && <Coffee className="text-brand-coffee w-12 h-12 group-hover:text-white" />}
                  {idx === 1 && <img src="https://res.cloudinary.com/db0stvcjw/image/upload/v1768825324/korean_master_drf9io.png" alt="Korea Master" className="w-16 h-16 object-contain" />}
                  {idx === 2 && <Utensils className="text-brand-coffee w-12 h-12 group-hover:text-white" />}
                  {idx === 3 && <Star className="text-brand-coffee w-12 h-12 group-hover:text-white" />}
                </div>
                <h3 className="text-3xl font-serif text-brand-text mb-6 group-hover:text-brand-coffee transition-colors font-bold whitespace-pre-line">{item.title}</h3>
                <p className="text-brand-muted leading-relaxed text-lg font-medium">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Showcase */}
      <section className="py-28">
        <div className="container mx-auto px-6 mb-16 flex flex-col md:flex-row justify-between items-end">
          <div>
            <span className="text-brand-gold text-sm font-bold tracking-widest uppercase mb-3 block">Gallery</span>
            <h2 className="font-serif text-4xl md:text-5xl text-brand-text font-bold">{data.gallery.title}</h2>
          </div>
          <p className="text-brand-muted mt-6 md:mt-0 max-w-md text-right md:text-left text-lg font-medium">{data.gallery.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr bg-brand-coffee p-3 gap-3">
          {displayedImages.map((img, index) => (
            <div key={img.id} className="group relative h-[450px] overflow-hidden cursor-pointer" onClick={() => openLightbox(index)}>
              <img src={img.url} alt={img.caption} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-brand-coffee/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px]">
                <span className="text-brand-cream font-serif text-3xl transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 border-b-2 border-brand-gold pb-2">{img.caption}</span>
              </div>
            </div>
          ))}
        </div>
        {hasMoreImages && (
            <div className="flex justify-center mt-12">
                <button onClick={() => openLightbox(0)} className="group flex items-center gap-3 px-12 py-4 border-2 border-brand-coffee text-brand-coffee hover:bg-brand-coffee hover:text-brand-gold transition-all duration-300 font-serif font-bold text-lg tracking-widest uppercase rounded-sm">
                  View Full Gallery <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        )}
      </section>

      {/* Location */}
      <section className="bg-brand-cream py-28 border-t border-brand-wood/20">
        <div className="container mx-auto px-6 flex flex-col items-center text-center">
           <div className="w-20 h-20 bg-brand-latte rounded-full flex items-center justify-center mb-8 border-2 border-brand-wood/20 shadow-md">
              <MapPin size={32} className="text-brand-coffee" />
           </div>
           <h2 className="font-serif text-4xl text-brand-text mb-8 font-bold">Come Visit Us</h2>
           <p className="text-brand-text text-2xl font-bold mb-3">{data.location.address}</p>
           <p className="text-brand-muted mb-12 text-lg font-medium">{data.location.subAddress}</p>
           
           <div className="w-full max-w-6xl h-[500px] bg-white rounded-xl overflow-hidden relative group border-8 border-brand-latte shadow-wood">
             <iframe 
               src={`https://maps.google.com/maps?q=${encodeURIComponent("제로니모 커피하우스 " + data.location.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
               className="w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-500"
               allowFullScreen loading="lazy" title="Google Map"
             ></iframe>
           </div>
        </div>
      </section>

      {/* Lightbox Modal (기존 유지) */}
      {lightboxIndex !== null && data.gallery.images[lightboxIndex] && (
        <div className="fixed inset-0 z-[100] bg-brand-coffee/95 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-4 right-4 md:top-8 md:right-8 text-brand-latte/70 hover:text-brand-gold transition-colors z-[101]"><X size={40} /></button>
          <button onClick={showPrev} className="absolute left-2 md:left-10 text-brand-latte/70 hover:text-brand-gold hover:bg-white/10 p-2 md:p-4 rounded-full transition-all z-[101]"><ChevronLeft className="w-[60px] h-[60px]" /></button>
          <div className="relative w-full max-w-6xl h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex-1 min-h-0 flex items-center justify-center w-full p-2">
                <img src={data.gallery.images[lightboxIndex].url} alt={data.gallery.images[lightboxIndex].caption} className="max-w-full max-h-full object-contain shadow-2xl rounded-sm border-4 md:border-8 border-brand-wood/50" />
            </div>
            <div className="flex-shrink-0 mt-4 md:mt-6 text-center bg-brand-coffee/90 px-8 py-4 rounded-xl border border-brand-gold/50 backdrop-blur-sm shadow-xl max-w-[90%] flex flex-col items-center gap-3">
              <h3 className="text-brand-gold font-serif text-2xl md:text-3xl font-bold">{data.gallery.images[lightboxIndex].caption}</h3>
              {data.gallery.images[lightboxIndex].externalLink && (
                  <a href={data.gallery.images[lightboxIndex].externalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-brand-gold hover:bg-white text-brand-coffee hover:text-brand-gold px-6 py-2 rounded-full font-bold text-sm transition-colors shadow-md"><ExternalLink size={16} /> 자세히 보기</a>
              )}
            </div>
          </div>
          <button onClick={showNext} className="absolute right-2 md:right-10 text-brand-latte/70 hover:text-brand-gold hover:bg-white/10 p-2 md:p-4 rounded-full transition-all z-[101]"><ChevronRight className="w-[60px] h-[60px]" /></button>
        </div>
      )}
    </div>
  );
};

export default About;