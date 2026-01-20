import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // 경로 주의: 최상위에 만들었을 경우
import { MenuItem, Post, MenuCategory, GalleryItem, AboutPageData, SiteConfig } from '../types';
import { AdminImageInput } from '../components/AdminImageInput';
import { 
  Trash2, Plus, LogIn, Save, Coffee, FileText, Settings, 
  Edit, X, Image as ImageIcon, BookOpen, Calendar, 
  CheckCircle, AlertCircle, ArrowLeft 
} from 'lucide-react';

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

  // 로딩 상태 및 폼 상태 (생략 없이 기존 로직 유지)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '', price: 0, description: '', category: 'coffee', imageUrl: '', available: true
  });

  // 1. 데이터 불러오기 (실시간 반영의 핵심)
  const loadAllData = async () => {
    try {
      // 메뉴 불러오기
      const { data: menu } = await supabase.from('menu_items').select('*').order('id');
      if (menu) setMenuItems(menu);

      // 브랜드 정보 불러오기 (ID 1번 기준)
      const { data: about } = await supabase.from('brand_info').select('*').single();
      if (about) setAboutData(about);

      // 갤러리 불러오기
      const { data: gallery } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (gallery) setGalleryItems(gallery);

      // 새소식 불러오기
      const { data: news } = await supabase.from('news_events').select('*').order('created_at', { ascending: false });
      if (news) setNewsItems(news);
      
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  // 2. 로그인 로직 (간단화)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') { // 실제 비밀번호로 변경 권장
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  // 3. 메뉴 저장 함수 (Insert / Update)
  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: newItem.name,
      price: newItem.price,
      description: newItem.description,
      category: newItem.category,
      image_url: newItem.imageUrl,
      available: newItem.available
    };

    if (editingId) {
      const { error } = await supabase.from('menu_items').update(payload).eq('id', editingId);
      if (error) alert("수정 실패");
    } else {
      const { error } = await supabase.from('menu_items').insert([payload]);
      if (error) alert("추가 실패");
    }
    
    setEditingId(null);
    setNewItem({ name: '', price: 0, description: '', category: 'coffee', imageUrl: '', available: true });
    loadAllData();
  };

  // 4. 브랜드 소개 저장 함수
  const handleSaveAbout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aboutData) return;

    const { error } = await supabase.from('brand_info').update({
      title: aboutData.hero.title,
      description: aboutData.hero.subtitle,
      image_url: aboutData.hero.imageUrl
    }).eq('id', 1);

    if (!error) {
      setSaveMessage({ text: '데이터베이스에 저장되었습니다.', type: 'success' });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // 5. 삭제 함수 (메뉴 예시)
  const handleDeleteMenu = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (!error) loadAllData();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-brand-wood/20">
          <div className="flex justify-center mb-6"><Coffee className="text-brand-coffee" size={48} /></div>
          <h1 className="text-2xl font-bold text-center text-brand-coffee mb-8">Admin 관리자 로그인</h1>
          <input 
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-brand-wood/30 rounded mb-4" placeholder="비밀번호를 입력하세요"
          />
          <button type="submit" className="w-full bg-brand-coffee text-white py-3 rounded font-bold flex items-center justify-center gap-2">
            <LogIn size={20} /> 접속하기
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 메뉴 (기존 UI 유지) */}
      <div className="w-64 bg-brand-coffee text-white p-6 hidden md:block">
        <div className="flex items-center gap-2 mb-10 pb-4 border-b border-white/20">
          <Coffee size={24} /> <span className="font-bold text-xl">Admin Panel</span>
        </div>
        <nav className="space-y-2">
          {(['menu', 'gallery', 'about', 'news', 'settings'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab ? 'bg-white text-brand-coffee font-bold' : 'hover:bg-white/10'}`}>
              {tab === 'menu' && <Coffee size={18} />}
              {tab === 'gallery' && <ImageIcon size={18} />}
              {tab === 'about' && <BookOpen size={18} />}
              {tab === 'news' && <Calendar size={18} />}
              {tab === 'settings' && <Settings size={18} />}
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-5xl mx-auto">
          {saveMessage && (
            <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              <CheckCircle size={20} /> {saveMessage.text}
            </div>
          )}

          {activeTab === 'menu' && (
             <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
               <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-brand-coffee"><Coffee /> 메뉴 관리</h2>
               {/* 메뉴 입력 폼 및 리스트 UI (기존 Admin.tsx의 JSX를 그대로 사용하세요) */}
               <form onSubmit={handleSaveMenu} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 bg-brand-beige/30 rounded-lg">
                 <input type="text" placeholder="메뉴 이름" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="p-2 border rounded" />
                 <input type="number" placeholder="가격" value={newItem.price} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} className="p-2 border rounded" />
                 <AdminImageInput value={newItem.imageUrl} onChange={url => setNewItem({...newItem, imageUrl: url})} />
                 <button type="submit" className="md:col-span-2 bg-brand-coffee text-white py-2 rounded flex items-center justify-center gap-2">
                   <Save size={18}/> {editingId ? '메뉴 수정' : '메뉴 추가'}
                 </button>
               </form>

               <div className="grid gap-4">
                 {menuItems.map(item => (
                   <div key={item.id} className="flex items-center justify-between p-4 border rounded hover:bg-gray-50">
                     <div className="flex items-center gap-4">
                       <img src={item.imageUrl} className="w-12 h-12 object-cover rounded" />
                       <div>
                         <div className="font-bold">{item.name}</div>
                         <div className="text-sm text-gray-500">{item.price}원</div>
                       </div>
                     </div>
                     <div className="flex gap-2">
                       <button onClick={() => { setEditingId(item.id); setNewItem(item); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18}/></button>
                       <button onClick={() => handleDeleteMenu(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                     </div>
                   </div>
                 ))}
               </div>
             </section>
          )}

          {/* 나머지 Tab(Gallery, About 등)도 동일한 방식으로 handleSave 함수와 연결하면 됩니다. */}
        </div>
      </div>
    </div>
  );
};

export default Admin;