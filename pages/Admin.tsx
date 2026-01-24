import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Trash2, LogIn, Save, Coffee, Image as ImageIcon, 
  Edit, CheckCircle, Settings, BookOpen, Calendar 
} from 'lucide-react';

const Admin: React.FC = () => {
  // 상태 관리
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'menu' | 'gallery' | 'about' | 'news'>('menu');
  const [saveMessage, setSaveMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    name: '', price: 0, description: '', category: 'coffee', image_url: '', available: true
  });

  // 1. 데이터 불러오기
  const loadData = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_item') // 확인하신 테이블 이름
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      if (data) setMenuItems(data);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // 2. 로그인 로직
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234' || password === '0000') { 
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  // 3. 메뉴 저장 (추가/수정)
  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...newItem };

    try {
      if (editingId) {
        const { error } = await supabase.from('menu_item').update(payload).eq('id', editingId);
        if (error) throw error;
        setSaveMessage({ text: '수정되었습니다.', type: 'success' });
      } else {
        const { error } = await supabase.from('menu_item').insert([payload]);
        if (error) throw error;
        setSaveMessage({ text: '등록되었습니다.', type: 'success' });
      }
      
      setEditingId(null);
      setNewItem({ name: '', price: 0, description: '', category: 'coffee', image_url: '', available: true });
      loadData();
      setTimeout(() => setSaveMessage(null), 2000);
    } catch (error: any) {
      alert("저장 실패: " + error.message);
    }
  };

  // 4. 메뉴 삭제
  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('menu_item').delete().eq('id', id);
    if (!error) loadData();
  };

  // --- [로그인 전 화면] ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4 text-black">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
          <div className="flex justify-center mb-6"><Coffee className="text-[#4A3428]" size={48} /></div>
          <h1 className="text-2xl font-bold text-center text-[#4A3428] mb-8">관리자 로그인</h1>
          <input 
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-xl mb-4 bg-white text-black focus:ring-2 focus:ring-[#4A3428] outline-none" 
            placeholder="비밀번호를 입력하세요"
          />
          <button type="submit" className="w-full bg-[#4A3428] text-white py-4 rounded-xl font-bold hover:bg-[#38271E] transition-all">
            접속하기
          </button>
        </form>
      </div>
    );
  }

  // --- [로그인 후 화면] ---
  return (
    <div className="min-h-screen bg-gray-50 flex text-black">
      {/* 사이드바 */}
      <div className="w-64 bg-[#4A3428] text-white p-6 hidden lg:block">
        <div className="flex items-center gap-2 mb-10 pb-4 border-b border-white/10">
          <Coffee size={24} /> <span className="font-bold text-xl">Cafe Admin</span>
        </div>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab('menu')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'menu' ? 'bg-white text-[#4A3428] font-bold' : 'hover:bg-white/10'}`}>
            <Coffee size={18} /> MENU
          </button>
          <button onClick={() => setActiveTab('gallery')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'gallery' ? 'bg-white text-[#4A3428] font-bold' : 'hover:bg-white/10'}`}>
            <ImageIcon size={18} /> GALLERY
          </button>
        </nav>
      </div>

      {/* 메인 영역 */}
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {saveMessage && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              <CheckCircle size={20} /> {saveMessage.text}
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-8">
              {/* 입력 폼 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#4A3428]"><Plus size={20}/> {editingId ? '메뉴 수정' : '새 메뉴 등록'}</h2>
                <form onSubmit={handleSaveMenu} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-600">메뉴명</label>
                    <input type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 text-black" required placeholder="예: 아이스 아메리카노" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-600">가격</label>
                    <input type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} className="w-full p-3 border rounded-xl bg-gray-50 text-black" required placeholder="예: 4500" />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-sm font-semibold text-gray-600">설명</label>
                    <textarea value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 text-black" placeholder="메뉴에 대한 설명을 적어주세요" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-600">카테고리</label>
                    <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 text-black">
                      <option value="coffee">Coffee</option>
                      <option value="non-coffee">Non-Coffee</option>
                      <option value="dessert">Dessert</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-600">이미지 주소 (URL)</label>
                    <input type="text" value={newItem.image_url} onChange={e => setNewItem({...newItem, image_url: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 text-black" placeholder="https://..." />
                  </div>
                  <button type="submit" className="md:col-span-2 bg-[#4A3428] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#38271E] transition-all">
                    <Save size={20} /> {editingId ? '수정 완료' : '메뉴 추가하기'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); setNewItem({name:'', price:0, description:'', category:'coffee', image_url:'', available:true}); }} className="md:col-span-2 bg-gray-200 text-gray-700 py-2 rounded-xl">취소</button>
                  )}
                </form>
              </div>

              {/* 리스트 목록 */}
              <div className="grid gap-4">
                <h3 className="font-bold text-gray-500">등록된 메뉴 ({menuItems.length})</h3>
                {menuItems.length === 0 ? (
                   <div className="text-center py-20 bg-white rounded-2xl border border-dashed text-gray-400">등록된 메뉴가 없습니다.</div>
                ) : (
                  menuItems.map((item: any) => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <img src={item.image_url || 'https://via.placeholder.com/100'} alt="" className="w-16 h-16 object-cover rounded-xl bg-gray-100" />
                        <div>
                          <h4 className="font-bold text-lg">{item.name}</h4>
                          <p className="text-[#4A3428] font-semibold">{item.price.toLocaleString()}원 · <span className="text-gray-400 font-normal">{item.category}</span></p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingId(item.id); setNewItem(item); window.scrollTo(0,0); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={20}/></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={20}/></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;