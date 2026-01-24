import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MenuItem, Post, MenuCategory, GalleryItem, AboutPageData } from '../types';
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
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [newsItems, setNewsItems] = useState<Post[]>([]);
  const [aboutData, setAboutData] = useState<AboutPageData | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '', price: 0, description: '', category: 'coffee', imageUrl: '', available: true
  });

  // 1. 데이터 불러오기 (테이블 이름 수정됨)
  const loadAllData = async () => {
    try {
      // menu_items -> menu_item 으로 수정
      const { data: menu } = await supabase.from('menu_item').select('*').order('id');
      if (menu) setMenuItems(menu);

      // brand_info
      const { data: about } = await supabase.from('brand_info').select('*').single();
      if (about) setAboutData(about);

      // gallery
      const { data: gallery } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (gallery) setGalleryItems(gallery);

      // news_events
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

  // 2. 로그인 로직 (비밀번호 확인을 위해 1234와 0000 모두 허용)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234' || password === '0000') { 
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다. (힌트: 1234 또는 0000)');
    }
  };

  // 3. 메뉴 저장 함수 (menu_item 으로 수정)
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
      const { error } = await supabase.from('menu_item').update(payload).eq('id', editingId);
      if (error) alert("수정 실패: " + error.message);
    } else {
      const { error } = await supabase.from('menu_item').insert([payload]);
      if (error) alert("추가 실패: " + error.message);
    }
    
    setEditingId(null);
    setNewItem({ name: '', price: 0, description: '', category: 'coffee', imageUrl: '', available: true });
    loadAllData();
  };

  // 삭제 함수 (menu_item 으로 수정)
  const handleDeleteMenu = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('menu_item').delete().eq('id', id);
    if (!error) loadAllData();
  };

  // (로그인 전 화면 생략 - 기존과 동일)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-brand-wood/20">
          <div className="flex justify-center mb-6"><Coffee className="text-brand-coffee" size={48} /></div>
          <h1 className="text-2xl font-bold text-center text-brand-coffee mb-8">Admin 관리자 로그인</h1>
          <input 
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-brand-wood/30 rounded mb-4 text-black" placeholder="비밀번호를 입력하세요"
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
      {/* 사이드바 */}
      <div className="w-64 bg-brand-coffee text-white p-6 hidden md:block">
        <div className="flex items-center gap-2 mb-10 pb-4 border-b border-white/20">
          <Coffee size={24} /> <span className="font-bold text-xl">Admin Panel</span>
        </div>
        <nav className="space-y-2">
          {(['menu', 'gallery', 'about', 'news', 'settings'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab ? 'bg-white text-brand-coffee font-bold' : 'hover:bg-white/10'}`}>
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'menu' && (
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-brand-coffee text-black"><Coffee /> 메뉴 관리</h2>
              
              {/* 입력 폼 (이게 보여야 함) */}
              <form onSubmit={handleSaveMenu} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 bg-gray-100 rounded-lg">
                <input type="text" placeholder="메뉴 이름" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="p-2 border rounded text-black" required />
                <input type="number" placeholder="가격" value={newItem.price} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} className="p-2 border rounded text-black" required />
                <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value as any})} className="p-2 border rounded text-black">
                    <option value="coffee">Coffee</option>
                    <option value="non-coffee">Non-Coffee</option>
                    <option value="dessert">Dessert</option>
                </select>
                <input type="text" placeholder="이미지 URL (직접 입력 혹은 아래 이미지 도구 사용)" value={newItem.imageUrl} onChange={e => setNewItem({...newItem, imageUrl: e.target.value})} className="p-2 border rounded text-black" />
                <button type="submit" className="md:col-span-2 bg-brand-coffee text-white py-2 rounded flex items-center justify-center gap-2">
                  <Save size={18}/> {editingId ? '메뉴 수정' : '새 메뉴 등록'}
                </button>
              </form>

              {/* 리스트 출력 */}
              <div className="grid gap-4">
                {menuItems.length === 0 ? <p className="text-gray-500 text-center py-10">등록된 메뉴가 없습니다. 위 폼에서 메뉴를 등록해 주세요.</p> : 
                  menuItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded text-black">
                      <div className="flex items-center gap-4">
                        <img src={item.imageUrl || 'https://via.placeholder.com/50'} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="font-bold">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.price}원</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingId(item.id); setNewItem(item); }} className="p-2 text-blue-600"><Edit size={18}/></button>
                        <button onClick={() => handleDeleteMenu(item.id)} className="p-2 text-red-600"><Trash2 size={18}/></button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;