import React, { useState, useEffect } from 'react';
import { DataService } from '../services/storage';
import { MenuItem, Post, MenuCategory, GalleryItem, AboutPageData, SiteConfig } from '../types';
import { Trash2, Plus, LogIn, Save, Coffee, FileText, Settings, Edit, X, Image as ImageIcon, BookOpen, Pin, Calendar, Upload, CheckCircle, AlertCircle } from 'lucide-react';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'menu' | 'gallery' | 'about' | 'news' | 'settings'>('menu');
  const [saveMessage, setSaveMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // Data State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [newsItems, setNewsItems] = useState<Post[]>([]);
  const [aboutData, setAboutData] = useState<AboutPageData | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  // Forms State
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({ category: 'coffee' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newGalleryItem, setNewGalleryItem] = useState<Partial<GalleryItem>>({ category: 'interior' });
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  
  const [newPost, setNewPost] = useState<Partial<Post>>({ category: 'notice', isPinned: false });
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = () => {
    setMenuItems(DataService.getMenu());
    setGalleryItems(DataService.getGallery());
    const posts = DataService.getPosts();
    setNewsItems([...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setAboutData(DataService.getAboutPage());
    setSiteConfig(DataService.getConfig());
  };

  // 메시지 자동 숨김
  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPw = DataService.getAdminPassword();
    if (password === currentPw) {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 올바르지 않습니다.');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length < 4) {
      alert('비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }
    DataService.saveAdminPassword(newPassword);
    alert('비밀번호가 변경되었습니다.');
    setNewPassword('');
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    onLoad: (result: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // LocalStorage 용량 제한을 고려하여 1MB로 제한 (권장)
      if (file.size > 1024 * 1024) {
        alert("이미지 크기는 1MB 이하여야 저장이 원활합니다.\n용량이 큰 이미지는 저장이 안 될 수 있습니다.");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
          onLoad(reader.result as string);
          // 입력값 초기화는 읽기가 끝난 후 수행하여 동일 파일 재선택 가능하게 함
          e.target.value = ''; 
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Menu Handlers ---
  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return alert('메뉴명과 가격은 필수입니다.');
    
    try {
        let updatedItems: MenuItem[];
        if (editingId) {
          updatedItems = menuItems.map(item => item.id === editingId ? { ...item, ...newItem } as MenuItem : item);
          alert('메뉴가 수정되었습니다.');
        } else {
          const item: MenuItem = {
            id: Date.now().toString(),
            name: newItem.name,
            nameEng: newItem.nameEng || '',
            description: newItem.description || '',
            price: Number(newItem.price),
            category: newItem.category as MenuCategory,
            imageUrl: newItem.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image',
            isSignature: !!newItem.isSignature,
          };
          updatedItems = [item, ...menuItems];
          alert('메뉴가 추가되었습니다.');
        }
        DataService.saveMenu(updatedItems); // Try saving first
        setMenuItems(updatedItems); // Update state only if save succeeds (or assumes success, but error catches below)
        setNewItem({ category: 'coffee', name: '', nameEng: '', price: 0, description: '', imageUrl: '', isSignature: false });
        setEditingId(null);
    } catch (error) {
        alert("저장 공간이 부족합니다. 이미지 용량을 줄여주세요.");
    }
  };

  const handleDeleteMenu = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const updated = menuItems.filter(item => item.id !== id);
      setMenuItems(updated);
      DataService.saveMenu(updated);
    }
  };

  const handleEditMenu = (item: MenuItem) => {
    setEditingId(item.id);
    setNewItem({ ...item });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Gallery Handlers ---
  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.title || !newGalleryItem.imageUrl) return alert('제목과 이미지는 필수입니다.');

    try {
        let updatedItems: GalleryItem[];
        if (editingGalleryId) {
            updatedItems = galleryItems.map(item => item.id === editingGalleryId ? { ...item, ...newGalleryItem } as GalleryItem : item);
            alert('갤러리 항목이 수정되었습니다.');
        } else {
            const item: GalleryItem = {
                id: Date.now().toString(),
                title: newGalleryItem.title,
                imageUrl: newGalleryItem.imageUrl,
                category: newGalleryItem.category as 'interior' | 'menu'
            };
            updatedItems = [item, ...galleryItems];
            alert('갤러리 항목이 추가되었습니다.');
        }
        DataService.saveGallery(updatedItems);
        setGalleryItems(updatedItems);
        setNewGalleryItem({ category: 'interior', title: '', imageUrl: '' });
        setEditingGalleryId(null);
    } catch (error) {
        alert("저장 공간이 부족합니다. 이미지 용량을 줄여주세요.");
    }
  };

  const handleDeleteGallery = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const updated = galleryItems.filter(item => item.id !== id);
      setGalleryItems(updated);
      DataService.saveGallery(updated);
    }
  };

  const handleEditGallery = (item: GalleryItem) => {
    setEditingGalleryId(item.id);
    setNewGalleryItem({ ...item });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- News Handlers ---
  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return alert('제목과 내용은 필수입니다.');

    try {
        const todayStr = new Date().toISOString().split('T')[0];
        const postDate = newPost.date || todayStr;

        let updatedItems: Post[];
        if (editingPostId) {
            updatedItems = newsItems.map(item => item.id === editingPostId ? { ...item, ...newPost, date: postDate } as Post : item);
            alert('게시글이 수정되었습니다.');
        } else {
            const item: Post = {
                id: Date.now().toString(),
                title: newPost.title!,
                content: newPost.content!,
                date: postDate,
                category: newPost.category as 'notice' | 'event',
                imageUrl: newPost.imageUrl,
                isPinned: !!newPost.isPinned
            };
            updatedItems = [item, ...newsItems];
            alert('게시글이 등록되었습니다.');
        }
        // Re-sort
        updatedItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        DataService.savePosts(updatedItems);
        setNewsItems(updatedItems);
        setNewPost({ category: 'notice', title: '', content: '', date: '', imageUrl: '', isPinned: false });
        setEditingPostId(null);
    } catch (error) {
        alert("저장 공간이 부족합니다. 이미지 용량을 줄여주세요.");
    }
  };

  const handleDeleteNews = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const updated = newsItems.filter(item => item.id !== id);
      setNewsItems(updated);
      DataService.savePosts(updated);
    }
  };

  const handleEditNews = (item: Post) => {
    setEditingPostId(item.id);
    setNewPost({ ...item });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- About Handlers (Modified for Stability) ---
  const handleSaveAbout = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (aboutData) {
      try {
        DataService.saveAboutPage(aboutData);
        setSaveMessage({ text: '성공적으로 저장되었습니다.', type: 'success' });
      } catch (error) {
        console.error("Storage Save Error:", error);
        setSaveMessage({ text: '저장 실패: 이미지 용량이 너무 큽니다.', type: 'error' });
      }
    }
  };

  const updateAboutField = (section: keyof AboutPageData, field: string, value: any) => {
    setAboutData(prev => {
      if (!prev) return null;
      // Deep copy specific section to ensure immutability and React rerender
      const sectionData = { ...prev[section], [field]: value };
      return {
        ...prev,
        [section]: sectionData
      } as AboutPageData;
    });
  };

  const updateAboutPhilosophyItem = (index: number, field: 'title' | 'description', value: string) => {
    setAboutData(prev => {
        if (!prev) return null;
        const newItems = [...prev.philosophy.items];
        newItems[index] = { ...newItems[index], [field]: value };
        return {
            ...prev,
            philosophy: { ...prev.philosophy, items: newItems }
        };
    });
  };

  const addAboutGalleryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleImageUpload(e, (url) => {
          setAboutData(prev => {
              if(!prev) return null;
              const newImg = { id: Date.now().toString(), url, caption: '새 이미지' };
              return {
                  ...prev,
                  gallery: { ...prev.gallery, images: [...prev.gallery.images, newImg] }
              };
          });
      });
  };

  const removeAboutGalleryImage = (id: string) => {
      if(window.confirm('삭제하시겠습니까?')) {
        setAboutData(prev => {
            if(!prev) return null;
            return {
                ...prev,
                gallery: { ...prev.gallery, images: prev.gallery.images.filter(img => img.id !== id) }
            };
        });
      }
  };

  const updateAboutGalleryCaption = (id: string, caption: string) => {
    setAboutData(prev => {
        if(!prev) return null;
        return {
            ...prev,
            gallery: { ...prev.gallery, images: prev.gallery.images.map(img => img.id === id ? {...img, caption} : img) }
        };
    });
  };

  // --- Settings Handlers ---
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (siteConfig) {
      try {
        DataService.saveConfig(siteConfig);
        alert('사이트 설정이 저장되었습니다.');
      } catch (error) {
        alert("저장 공간이 부족합니다. 이미지 용량을 줄여주세요.");
      }
    }
  };


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-latte flex items-center justify-center px-4">
        <div className="bg-brand-cream p-8 rounded-lg border-2 border-brand-wood/20 shadow-wood w-full max-w-md">
          <div className="text-center mb-8">
            <Coffee size={40} className="mx-auto text-brand-coffee mb-2" />
            <h2 className="text-2xl font-serif text-brand-text mb-2">Admin Dashboard</h2>
            <p className="text-brand-muted text-sm">제로니모 관리자 시스템</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-brand-wood text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-latte border border-brand-wood/30 text-brand-text p-3 rounded focus:outline-none focus:border-brand-coffee transition-colors"
                placeholder="관리자 비밀번호 입력"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-coffee hover:bg-brand-mocha text-white py-3 rounded font-medium transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <LogIn size={18} /> 로그인
            </button>
            <p className="text-center text-xs text-brand-muted/50">Initial Password: 1234abcd</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-latte pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-brand-wood/20 pb-4">
          <div>
            <h1 className="text-3xl font-serif text-brand-text mb-2">Dashboard</h1>
            <p className="text-brand-muted">콘텐츠 관리 시스템 (CMS)</p>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={() => setIsAuthenticated(false)}
               className="text-brand-muted hover:text-brand-coffee text-sm font-bold underline"
             >
               로그아웃
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-2">
            {[
                {id: 'menu', label: '메뉴 관리', icon: Coffee},
                {id: 'gallery', label: '갤러리 관리', icon: ImageIcon},
                {id: 'news', label: '뉴스 & 이벤트', icon: FileText},
                {id: 'about', label: '브랜드 소개', icon: BookOpen},
                {id: 'settings', label: '메인 설정', icon: Settings},
            ].map(tab => (
                 <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`w-full flex items-center gap-3 p-4 rounded transition-all shadow-sm font-bold ${
                   activeTab === tab.id 
                    ? 'bg-brand-coffee text-brand-gold translate-x-2' 
                    : 'bg-brand-cream text-brand-wood hover:bg-brand-wood/10 hover:translate-x-1'
                 }`}
               >
                 <tab.icon size={20} /> {tab.label}
               </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
             <div className="bg-brand-cream p-6 rounded-lg border border-brand-wood/20 shadow-wood min-h-[500px]">
                
                {/* --- MENU TAB --- */}
                {activeTab === 'menu' && (
                    <div className="space-y-8 animate-fade-in">
                         <div className="flex justify-between items-center mb-4 border-b border-brand-wood/10 pb-2">
                             <h3 className="text-brand-text text-xl font-bold font-serif">메뉴 등록/수정</h3>
                             <button onClick={() => {setEditingId(null); setNewItem({category:'coffee', isSignature: false});}} className="text-sm text-brand-muted hover:text-brand-coffee flex items-center gap-1">
                                 <Plus size={16}/> 초기화
                             </button>
                         </div>
                         <form onSubmit={handleSaveMenu} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-brand-latte/50 p-6 rounded-lg border border-brand-wood/10">
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-brand-wood mb-1">카테고리</label>
                                <select 
                                    value={newItem.category} 
                                    onChange={e => setNewItem({...newItem, category: e.target.value as any})} 
                                    className="w-full p-2 border border-brand-wood/30 rounded bg-white text-brand-text"
                                >
                                    <option value="coffee">Specialty Coffee</option>
                                    <option value="beverage">Beverage</option>
                                    <option value="bakery">Bakery</option>
                                    <option value="brunch">Brunch</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-brand-wood mb-1">가격 (원)</label>
                                <input type="number" value={newItem.price||''} onChange={e=>setNewItem({...newItem, price:Number(e.target.value)})} className="w-full p-2 border border-brand-wood/30 rounded bg-white" placeholder="0" />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-brand-wood mb-1">메뉴명 (한글)</label>
                                <input type="text" value={newItem.name||''} onChange={e=>setNewItem({...newItem, name:e.target.value})} className="w-full p-2 border border-brand-wood/30 rounded bg-white" placeholder="예: 아메리카노" />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-brand-wood mb-1">메뉴명 (영문)</label>
                                <input type="text" value={newItem.nameEng||''} onChange={e=>setNewItem({...newItem, nameEng:e.target.value})} className="w-full p-2 border border-brand-wood/30 rounded bg-white" placeholder="Ex: Americano" />
                            </div>
                            
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-brand-wood mb-1">메뉴 설명</label>
                                <textarea value={newItem.description||''} onChange={e=>setNewItem({...newItem, description:e.target.value})} className="w-full p-2 border border-brand-wood/30 rounded bg-white h-20" placeholder="메뉴에 대한 설명을 입력하세요." />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-brand-wood mb-1">메뉴 이미지</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-brand-wood/10 rounded overflow-hidden flex-shrink-0 border border-brand-wood/20">
                                        {newItem.imageUrl ? <img src={newItem.imageUrl} alt="Preview" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-brand-wood/40"/></div>}
                                    </div>
                                    <div className="flex-grow">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, (url) => setNewItem({...newItem, imageUrl: url}))}
                                            className="block w-full text-sm text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-coffee file:text-white hover:file:bg-brand-mocha"
                                        />
                                        <p className="text-xs text-brand-muted mt-1">* 3MB 이하 권장</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 flex items-center gap-2 mt-2">
                                <input type="checkbox" id="isSignature" checked={newItem.isSignature||false} onChange={e=>setNewItem({...newItem, isSignature:e.target.checked})} className="w-4 h-4 text-brand-coffee focus:ring-brand-gold" />
                                <label htmlFor="isSignature" className="text-brand-coffee font-bold text-sm">시그니처 메뉴로 등록 (메인 화면 노출)</label>
                            </div>

                            <button type="submit" className="col-span-2 bg-brand-coffee text-white py-3 rounded hover:bg-brand-mocha transition-colors font-bold shadow-md flex justify-center items-center gap-2">
                                <Save size={18}/> {editingId ? '수정사항 저장' : '새 메뉴 등록'}
                            </button>
                         </form>

                         <div className="mt-8">
                             <h4 className="text-brand-wood font-bold mb-4 border-b border-brand-wood/10 pb-2">등록된 메뉴 목록</h4>
                             <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {menuItems.map(item => (
                                    <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded border border-brand-wood/10 hover:border-brand-gold transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"/>
                                            </div>
                                            <div>
                                                <p className="font-bold text-brand-text text-sm">{item.name} <span className="text-xs font-normal text-brand-muted">({item.category})</span></p>
                                                <p className="text-xs text-brand-coffee font-bold">₩ {item.price.toLocaleString()}</p>
                                            </div>
                                            {item.isSignature && <span className="text-[10px] bg-brand-gold text-white px-2 py-0.5 rounded-full">Signature</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={()=>handleEditMenu(item)} className="p-2 text-brand-wood hover:text-brand-coffee hover:bg-brand-latte rounded transition-colors"><Edit size={16}/></button>
                                            <button onClick={()=>handleDeleteMenu(item.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                ))}
                             </div>
                         </div>
                    </div>
                )}

                {/* --- GALLERY TAB --- */}
                {activeTab === 'gallery' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex justify-between items-center mb-4 border-b border-brand-wood/10 pb-2">
                             <h3 className="text-brand-text text-xl font-bold font-serif">갤러리 관리</h3>
                             <button onClick={() => {setEditingGalleryId(null); setNewGalleryItem({category:'interior'});}} className="text-sm text-brand-muted hover:text-brand-coffee flex items-center gap-1">
                                 <Plus size={16}/> 초기화
                             </button>
                        </div>
                        <form onSubmit={handleSaveGallery} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-brand-latte/50 p-6 rounded-lg border border-brand-wood/10">
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-brand-wood mb-1">카테고리</label>
                                <select 
                                    value={newGalleryItem.category} 
                                    onChange={e => setNewGalleryItem({...newGalleryItem, category: e.target.value as any})} 
                                    className="w-full p-2 border border-brand-wood/30 rounded bg-white text-brand-text"
                                >
                                    <option value="interior">Interior</option>
                                    <option value="menu">Menu Concept</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-brand-wood mb-1">제목</label>
                                <input type="text" value={newGalleryItem.title||''} onChange={e=>setNewGalleryItem({...newGalleryItem, title:e.target.value})} className="w-full p-2 border border-brand-wood/30 rounded bg-white" placeholder="이미지 제목" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-brand-wood mb-1">이미지 업로드</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-brand-wood/10 rounded overflow-hidden flex-shrink-0 border border-brand-wood/20">
                                        {newGalleryItem.imageUrl ? <img src={newGalleryItem.imageUrl} alt="Preview" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-brand-wood/40"/></div>}
                                    </div>
                                    <div className="flex-grow">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, (url) => setNewGalleryItem({...newGalleryItem, imageUrl: url}))}
                                            className="block w-full text-sm text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-coffee file:text-white hover:file:bg-brand-mocha"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="col-span-2 bg-brand-coffee text-white py-3 rounded hover:bg-brand-mocha transition-colors font-bold shadow-md flex justify-center items-center gap-2">
                                <Save size={18}/> {editingGalleryId ? '수정사항 저장' : '이미지 등록'}
                            </button>
                        </form>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            {galleryItems.map(item => (
                                <div key={item.id} className="relative group rounded-lg overflow-hidden border border-brand-wood/20 shadow-sm aspect-square bg-white">
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover"/>
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2">
                                        <p className="text-white text-xs font-bold px-2 text-center">{item.title}</p>
                                        <div className="flex gap-2">
                                            <button onClick={()=>handleEditGallery(item)} className="p-1.5 bg-white text-brand-coffee rounded-full hover:bg-brand-gold hover:text-white transition-colors"><Edit size={14}/></button>
                                            <button onClick={()=>handleDeleteGallery(item.id)} className="p-1.5 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-brand-coffee/80 text-white text-[10px] py-1 px-2 text-center truncate">
                                        {item.category}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- NEWS TAB --- */}
                {activeTab === 'news' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex justify-between items-center mb-4 border-b border-brand-wood/10 pb-2">
                             <h3 className="text-brand-text text-xl font-bold font-serif">뉴스 & 이벤트 관리</h3>
                             <button onClick={() => {setEditingPostId(null); setNewPost({category:'notice', isPinned: false});}} className="text-sm text-brand-muted hover:text-brand-coffee flex items-center gap-1">
                                 <Plus size={16}/> 초기화
                             </button>
                        </div>
                        <form onSubmit={handleSaveNews} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-brand-latte/50 p-6 rounded-lg border border-brand-wood/10">
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-brand-wood mb-1">카테고리</label>
                                <select 
                                    value={newPost.category} 
                                    onChange={e => setNewPost({...newPost, category: e.target.value as any})} 
                                    className="w-full p-2 border border-brand-wood/30 rounded bg-white text-brand-text"
                                >
                                    <option value="notice">공지사항 (Notice)</option>
                                    <option value="event">이벤트 (Event)</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-brand-wood mb-1">게시 날짜</label>
                                <input 
                                    type="date" 
                                    value={newPost.date || ''} 
                                    onChange={e => setNewPost({...newPost, date: e.target.value})}
                                    className="w-full p-2 border border-brand-wood/30 rounded bg-white"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-brand-wood mb-1">제목</label>
                                <input type="text" value={newPost.title||''} onChange={e=>setNewPost({...newPost, title:e.target.value})} className="w-full p-2 border border-brand-wood/30 rounded bg-white" placeholder="게시글 제목" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-brand-wood mb-1">내용</label>
                                <textarea value={newPost.content||''} onChange={e=>setNewPost({...newPost, content:e.target.value})} className="w-full p-2 border border-brand-wood/30 rounded bg-white h-32" placeholder="내용을 입력하세요." />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-brand-wood mb-1">대표 이미지</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-brand-wood/10 rounded overflow-hidden flex-shrink-0 border border-brand-wood/20">
                                        {newPost.imageUrl ? <img src={newPost.imageUrl} alt="Preview" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-brand-wood/40"/></div>}
                                    </div>
                                    <div className="flex-grow">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, (url) => setNewPost({...newPost, imageUrl: url}))}
                                            className="block w-full text-sm text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-coffee file:text-white hover:file:bg-brand-mocha"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-2 flex items-center gap-2 mt-2">
                                <input type="checkbox" id="isPinned" checked={newPost.isPinned||false} onChange={e=>setNewPost({...newPost, isPinned:e.target.checked})} className="w-4 h-4 text-brand-coffee" />
                                <label htmlFor="isPinned" className="text-brand-coffee font-bold text-sm flex items-center gap-1"><Pin size={14}/> 상단 고정 (Pinned)</label>
                            </div>
                            <button type="submit" className="col-span-2 bg-brand-coffee text-white py-3 rounded hover:bg-brand-mocha transition-colors font-bold shadow-md flex justify-center items-center gap-2">
                                <Save size={18}/> {editingPostId ? '수정사항 저장' : '게시글 등록'}
                            </button>
                        </form>

                        <div className="space-y-4">
                            {newsItems.map(item => (
                                <div key={item.id} className={`p-4 rounded border flex justify-between items-start ${item.isPinned ? 'bg-brand-gold/10 border-brand-gold/30' : 'bg-white border-brand-wood/10'}`}>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white ${item.category === 'notice' ? 'bg-brand-catCoffee' : 'bg-brand-catBaker'}`}>{item.category}</span>
                                            {item.isPinned && <span className="text-[10px] flex items-center gap-0.5 text-brand-gold font-bold"><Pin size={10}/> Pinned</span>}
                                            <span className="text-xs text-brand-muted flex items-center gap-1"><Calendar size={10}/> {item.date}</span>
                                        </div>
                                        <h4 className="font-bold text-brand-text">{item.title}</h4>
                                        <p className="text-sm text-brand-coffee line-clamp-1 mt-1">{item.content}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={()=>handleEditNews(item)} className="p-2 text-brand-wood hover:text-brand-coffee hover:bg-brand-latte rounded transition-colors"><Edit size={16}/></button>
                                        <button onClick={()=>handleDeleteNews(item.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- ABOUT TAB --- */}
                {activeTab === 'about' && aboutData && (
                    <div className="space-y-12 animate-fade-in pb-10">
                        <div className="flex justify-between items-center mb-6 border-b border-brand-wood/10 pb-4 sticky top-0 bg-brand-cream z-10 py-2">
                             <h3 className="text-brand-text text-xl font-bold font-serif">브랜드 페이지 관리</h3>
                             <div className="flex items-center gap-4">
                                {saveMessage && (
                                    <div className={`text-sm font-bold flex items-center gap-1 animate-fade-in ${saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                        {saveMessage.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                                        {saveMessage.text}
                                    </div>
                                )}
                                <button onClick={(e) => handleSaveAbout(e)} className="bg-brand-coffee text-white px-6 py-2 rounded font-bold hover:bg-brand-mocha transition-colors flex items-center gap-2 shadow-md">
                                    <Save size={18}/> 전체 저장
                                </button>
                             </div>
                        </div>

                        {/* Hero Section */}
                        <div className="bg-brand-latte/30 p-6 rounded-lg border border-brand-wood/10">
                            <h4 className="text-brand-wood font-bold mb-4 flex items-center gap-2"><BookOpen size={18}/> 히어로 섹션 (Hero)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-brand-wood mb-1">메인 타이틀</label>
                                    <textarea value={aboutData.hero.title} onChange={e=>updateAboutField('hero', 'title', e.target.value)} className="w-full p-2 border border-brand-wood/30 rounded bg-white h-20" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-wood mb-1">서브 텍스트</label>
                                    <textarea value={aboutData.hero.subtitle} onChange={e=>updateAboutField('hero', 'subtitle', e.target.value)} className="w-full p-2 border border-brand-wood/30 rounded bg-white h-20" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-brand-wood mb-1">배경 이미지</label>
                                    <div className="flex items-center gap-4">
                                        <img src={aboutData.hero.imageUrl} className="w-24 h-16 object-cover rounded bg-gray-200" alt="hero"/>
                                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateAboutField('hero', 'imageUrl', url))} className="text-sm text-brand-muted"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Story Section */}
                        <div className="bg-brand-latte/30 p-6 rounded-lg border border-brand-wood/10">
                            <h4 className="text-brand-wood font-bold mb-4">브랜드 스토리 (Story)</h4>
                            <div className="space-y-4">
                                <input type="text" value={aboutData.story.title} onChange={e=>updateAboutField('story', 'title', e.target.value)} className="w-full p-2 border border-brand-wood/30 rounded bg-white" placeholder="타이틀" />
                                <textarea value={aboutData.story.description1} onChange={e=>updateAboutField('story', 'description1', e.target.value)} className="w-full p-2 border border-brand-wood/30 rounded bg-white h-24" placeholder="설명 1" />
                                <textarea value={aboutData.story.description2} onChange={e=>updateAboutField('story', 'description2', e.target.value)} className="w-full p-2 border border-brand-wood/30 rounded bg-white h-24" placeholder="설명 2" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-brand-wood mb-1">메인 이미지</label>
                                        <img src={aboutData.story.imageMain} className="w-full h-32 object-cover rounded mb-2 bg-gray-200" alt="main"/>
                                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateAboutField('story', 'imageMain', url))} className="text-sm text-brand-muted w-full"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-brand-wood mb-1">서브 이미지</label>
                                        <img src={aboutData.story.imageSub} className="w-full h-32 object-cover rounded mb-2 bg-gray-200" alt="sub"/>
                                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateAboutField('story', 'imageSub', url))} className="text-sm text-brand-muted w-full"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Philosophy Section */}
                        <div className="bg-brand-latte/30 p-6 rounded-lg border border-brand-wood/10">
                             <h4 className="text-brand-wood font-bold mb-4">철학 (Philosophy)</h4>
                             <div className="mb-4">
                                <input type="text" value={aboutData.philosophy.title} onChange={e=>updateAboutField('philosophy', 'title', e.target.value)} className="w-full p-2 border border-brand-wood/30 rounded bg-white mb-2" placeholder="메인 타이틀" />
                                <input type="text" value={aboutData.philosophy.subtitle} onChange={e=>updateAboutField('philosophy', 'subtitle', e.target.value)} className="w-full p-2 border border-brand-wood/30 rounded bg-white" placeholder="서브 타이틀" />
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {aboutData.philosophy.items.map((item, idx) => (
                                    <div key={idx} className="p-3 bg-white rounded border border-brand-wood/10">
                                        <p className="text-xs text-brand-gold font-bold mb-1">Item {idx+1}</p>
                                        <input type="text" value={item.title} onChange={e=>updateAboutPhilosophyItem(idx, 'title', e.target.value)} className="w-full p-1 border-b border-brand-wood/20 mb-2 font-bold text-sm" />
                                        <textarea value={item.description} onChange={e=>updateAboutPhilosophyItem(idx, 'description', e.target.value)} className="w-full p-1 border border-brand-wood/20 rounded text-xs h-20" />
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* About Gallery Section */}
                        <div className="bg-brand-latte/30 p-6 rounded-lg border border-brand-wood/10">
                             <div className="flex justify-between items-center mb-4">
                                <h4 className="text-brand-wood font-bold">내부 갤러리 (Gallery)</h4>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="about-gallery-upload" className="cursor-pointer bg-brand-wood text-white px-3 py-1 rounded text-xs flex items-center gap-1 hover:bg-brand-coffee transition-colors">
                                        <Upload size={14}/> 추가
                                    </label>
                                    <input id="about-gallery-upload" type="file" accept="image/*" onChange={addAboutGalleryImage} className="hidden" />
                                </div>
                             </div>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {aboutData.gallery.images.map((img) => (
                                    <div key={img.id} className="relative group bg-white rounded overflow-hidden shadow-sm">
                                        <img src={img.url} alt={img.caption} className="w-full h-32 object-cover" />
                                        <div className="p-2">
                                            <input type="text" value={img.caption} onChange={e=>updateAboutGalleryCaption(img.id, e.target.value)} className="w-full text-xs border-b border-brand-wood/20 pb-1" placeholder="캡션"/>
                                        </div>
                                        <button onClick={()=>removeAboutGalleryImage(img.id)} className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                            <X size={14}/>
                                        </button>
                                    </div>
                                ))}
                             </div>
                        </div>

                         {/* Location Section */}
                         <div className="bg-brand-latte/30 p-6 rounded-lg border border-brand-wood/10">
                            <h4 className="text-brand-wood font-bold mb-4">위치 정보 (Location)</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-brand-wood mb-1">주소</label>
                                    <input type="text" value={aboutData.location.address} onChange={e=>updateAboutField('location', 'address', e.target.value)} className="w-full p-2 border border-brand-wood/30 rounded bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-wood mb-1">상세 정보</label>
                                    <input type="text" value={aboutData.location.subAddress} onChange={e=>updateAboutField('location', 'subAddress', e.target.value)} className="w-full p-2 border border-brand-wood/30 rounded bg-white" />
                                </div>
                            </div>
                         </div>
                    </div>
                )}

                {/* --- SETTINGS TAB --- */}
                {activeTab === 'settings' && siteConfig && (
                    <div className="space-y-8 animate-fade-in">
                        <h3 className="text-brand-text text-xl font-bold font-serif mb-6 border-b border-brand-wood/10 pb-4">사이트 메인 설정</h3>
                        <form onSubmit={handleSaveConfig} className="bg-brand-latte/50 p-6 rounded-lg border border-brand-wood/10 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-brand-wood mb-1">메인 히어로 타이틀</label>
                                <input 
                                    type="text" 
                                    value={siteConfig.heroTitle} 
                                    onChange={e => setSiteConfig({...siteConfig, heroTitle: e.target.value})}
                                    className="w-full p-2 border border-brand-wood/30 rounded bg-white"
                                />
                                <p className="text-xs text-brand-muted mt-1">* 줄바꿈을 위해 '&' 문자를 사용할 수 있습니다.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-wood mb-1">메인 히어로 서브타이틀</label>
                                <input 
                                    type="text" 
                                    value={siteConfig.heroSubtitle} 
                                    onChange={e => setSiteConfig({...siteConfig, heroSubtitle: e.target.value})}
                                    className="w-full p-2 border border-brand-wood/30 rounded bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-wood mb-1">철학 섹션 배경 이미지</label>
                                <div className="flex items-center gap-4">
                                     <img src={siteConfig.philosophyBackgroundImage} className="w-40 h-24 object-cover rounded bg-gray-200" alt="philosophy bg"/>
                                     <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setSiteConfig({...siteConfig, philosophyBackgroundImage: url}))} className="text-sm text-brand-muted"/>
                                </div>
                            </div>
                            
                            <hr className="border-brand-wood/10 my-4"/>
                            
                            <div>
                                <label className="block text-xs font-bold text-brand-wood mb-1">관리자 비밀번호 변경</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="password" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="새 비밀번호"
                                        className="p-2 border border-brand-wood/30 rounded bg-white"
                                    />
                                    <button type="button" onClick={handleChangePassword} className="bg-brand-wood text-white px-4 py-2 rounded text-sm hover:bg-brand-coffee transition-colors">변경</button>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-brand-coffee text-white py-3 rounded hover:bg-brand-mocha transition-colors font-bold shadow-md flex justify-center items-center gap-2 mt-4">
                                <Save size={18}/> 설정 저장
                            </button>
                        </form>
                    </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;