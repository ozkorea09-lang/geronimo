import React, { useEffect, useState } from 'react';
import { DataService } from '../services/storage';
import { Post } from '../types';
import { Calendar, Pin, Bell, X } from 'lucide-react';

const News: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<'all' | 'notice' | 'event'>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchedPosts = DataService.getPosts();
    // Sort: Pinned first, then by date descending
    const sortedPosts = fetchedPosts.sort((a, b) => {
      if (a.isPinned === b.isPinned) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.isPinned ? -1 : 1;
    });
    setPosts(sortedPosts);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedPost]);

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.category === filter);

  return (
    <div className="pt-24 min-h-screen bg-brand-latte text-brand-text">
      {/* Header */}
      <div className="bg-brand-coffee py-20 mb-16 shadow-wood relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="font-serif text-5xl md:text-6xl text-brand-gold mb-6 drop-shadow-md">NEWS & EVENTS</h1>
          <p className="text-brand-cream text-xl">제로니모의 새로운 소식과 특별한 이벤트를 확인하세요</p>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-24">
        {/* Filter Tabs */}
        <div className="flex justify-center gap-5 mb-20">
          <button
            onClick={() => setFilter('all')}
            className={`px-8 py-3 rounded-lg text-base font-bold transition-all border-2 shadow-sm ${
              filter === 'all' 
                ? 'bg-brand-coffee border-brand-coffee text-white scale-105' 
                : 'bg-brand-cream border-brand-wood/30 text-brand-muted hover:border-brand-coffee hover:text-brand-coffee'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('notice')}
            className={`px-8 py-3 rounded-lg text-base font-bold transition-all border-2 shadow-sm ${
              filter === 'notice' 
                ? 'bg-brand-catCoffee border-brand-catCoffee text-white scale-105' 
                : 'bg-brand-cream border-brand-wood/30 text-brand-muted hover:border-brand-catCoffee hover:text-brand-catCoffee'
            }`}
          >
            Notice
          </button>
          <button
            onClick={() => setFilter('event')}
            className={`px-8 py-3 rounded-lg text-base font-bold transition-all border-2 shadow-sm ${
              filter === 'event' 
                ? 'bg-brand-catBaker border-brand-catBaker text-white scale-105' 
                : 'bg-brand-cream border-brand-wood/30 text-brand-muted hover:border-brand-catBaker hover:text-brand-catBaker'
            }`}
          >
            Event
          </button>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPosts.map((post) => (
            <article 
              key={post.id} 
              onClick={() => setSelectedPost(post)}
              className={`flex flex-col bg-brand-cream rounded-xl overflow-hidden group hover:transform hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-wood hover:shadow-2xl ${
                post.isPinned ? 'border-2 border-brand-gold' : 'border border-brand-wood/10'
              }`}
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden bg-brand-wood/20">
                {post.imageUrl ? (
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-wood/30">
                    <span className="font-serif italic text-3xl opacity-50">GERONIMO</span>
                  </div>
                )}
                {/* Category Badge */}
                <div className="absolute top-5 left-5 flex gap-3">
                  <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-sm text-white shadow-md ${
                    post.category === 'notice' ? 'bg-brand-catCoffee' : 'bg-brand-catBaker'
                  }`}>
                    {post.category}
                  </span>
                  {post.isPinned && (
                    <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-sm bg-brand-cream text-brand-gold flex items-center gap-1 shadow-md border border-brand-gold">
                      <Pin size={12} fill="currentColor" /> Pinned
                    </span>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center text-sm text-brand-muted mb-4 gap-2 font-medium">
                  <Calendar size={16} />
                  <span>{post.date}</span>
                </div>
                <h3 className="text-2xl font-serif text-brand-text mb-4 leading-snug group-hover:text-brand-gold transition-colors font-bold">
                  {post.title}
                </h3>
                <p className="text-brand-coffee text-base leading-relaxed line-clamp-3 mb-6 flex-grow font-medium">
                  {post.content}
                </p>
                <div className="mt-auto pt-6 border-t border-brand-wood/10">
                  <span className="text-brand-wood text-sm font-bold uppercase tracking-wider group-hover:underline cursor-pointer group-hover:text-brand-coffee">
                    Read More
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
           <div className="text-center py-24 bg-brand-cream border-2 border-brand-wood/20 rounded-xl shadow-wood">
             <Bell size={56} className="mx-auto text-brand-wood/30 mb-6" />
             <p className="text-brand-muted text-xl font-medium">등록된 게시글이 없습니다.</p>
           </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] bg-brand-coffee/90 backdrop-blur-md flex justify-center items-start overflow-y-auto p-4 md:p-8 animate-fade-in">
          <div className="relative w-full max-w-5xl bg-brand-cream border-4 border-brand-wood/30 rounded-lg shadow-2xl my-10 flex flex-col">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute -top-14 right-0 md:-right-14 text-brand-latte/80 hover:text-brand-gold transition-colors p-2"
            >
              <X size={40} />
            </button>

            {/* Modal Image */}
            {selectedPost.imageUrl && (
              <div className="w-full rounded-t-lg overflow-hidden relative bg-brand-wood/5 border-b border-brand-wood/10">
                <img 
                  src={selectedPost.imageUrl} 
                  alt={selectedPost.title} 
                  className="w-full h-auto object-contain"
                />
              </div>
            )}

            {/* Modal Content */}
            <div className="p-10 md:p-16 relative z-10">
              <div className="bg-brand-cream">
                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    <span className={`px-4 py-1.5 text-sm font-bold uppercase tracking-widest rounded-sm text-white shadow-sm ${
                        selectedPost.category === 'notice' ? 'bg-brand-catCoffee' : 'bg-brand-catBaker'
                      }`}>
                        {selectedPost.category}
                    </span>
                    <div className="flex items-center text-base text-brand-muted gap-2 font-medium">
                      <span className="w-1.5 h-1.5 bg-brand-wood rounded-full"></span>
                      <Calendar size={18} />
                      <span>{selectedPost.date}</span>
                    </div>
                    {selectedPost.isPinned && (
                        <span className="text-sm text-brand-gold font-bold flex items-center gap-1 border border-brand-gold/30 px-3 py-1 rounded-sm bg-brand-gold/5">
                          <Pin size={12} fill="currentColor" /> Pinned
                        </span>
                    )}
                  </div>

                  <h2 className="text-3xl md:text-5xl font-serif text-brand-text mb-10 leading-tight font-bold">
                    {selectedPost.title}
                  </h2>

                  <div className="prose prose-xl max-w-none prose-headings:font-serif prose-p:text-brand-coffee prose-a:text-brand-gold font-medium leading-loose">
                    <p className="whitespace-pre-wrap">
                      {selectedPost.content}
                    </p>
                  </div>

                  <div className="mt-16 pt-10 border-t-2 border-brand-wood/20 flex justify-center">
                    <button 
                      onClick={() => setSelectedPost(null)}
                      className="px-12 py-4 border-2 border-brand-wood/40 hover:border-brand-coffee text-brand-muted hover:text-brand-coffee transition-all duration-300 rounded-sm uppercase tracking-widest text-base font-bold hover:bg-brand-wood/5"
                    >
                      Close
                    </button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;