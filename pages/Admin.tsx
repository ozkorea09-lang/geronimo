import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Trash2, Plus, LogIn, Save, Coffee, Image as ImageIcon, 
  Edit, CheckCircle, X, AlertCircle 
} from 'lucide-react';

const Admin: React.FC = () => {
  // 1. 상태 관리
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'menu' | 'gallery'>('menu');
  const [saveMessage, setSaveMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    name: '', price: 0, description: '', category: 'coffee', image_url: '', available: true
  });

  // 2. 데이터 불러오기 함수
  const loadData = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_item') // 사용자님의 실제 테이블 이름
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      if (data) setMenuItems(data);
    } catch (error: any) {
      console.error("데이터 로드 실패:", error.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // 3. 로그인 처리
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234' || password === '0000') { 
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다. (0000 또는 1234 시도)');
    }
  };

  // 4. 메뉴 저장/수정 처리
  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase.from('menu_item').update(newItem).eq('id', editingId);
        if (error) throw error;
        setSaveMessage({ text: '성공적으로 수정되었습니다.', type: 'success' });
      } else {
        const { error } = await supabase.from('menu_item').insert([newItem]);
        if (error) throw error;
        setSaveMessage({ text: '새 메뉴가 등록되었습니다.', type: 'success' });
      }
      
      setEditingId(null);
      setNewItem({ name: '', price: 0, description: '', category: 'coffee', image_url: '', available: true });
      loadData();
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      alert("저장 오류: " + error.message);
    }
  };

  // 5. 메뉴 삭제 처리
  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('menu_item').delete().eq('id', id);
    if (!error) loadData();
  };

  // [화면 1: 로그인 전]
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4">
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

  // [화면 2: 관리자 메인]
  return (
    <div className="min-h-screen bg-gray-50 flex text-black">
      {/* 사이드바 */}
      <div className="w-64 bg-[#4A3428] text-white p-6 hidden lg:block">
        <div className="flex items-center gap-2 mb-10 pb-4 border-b border-white/10">
          <Coffee size={24} /> <span className="font-bold text-xl">Cafe Admin</span>
        </div>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab('menu')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'menu' ? 'bg-white text-[#4A3428] font-bold' : 'hover:bg-white/10'}`}>
            <Coffee size={18} /> 메뉴 관리
          </button>
        </nav>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {saveMessage && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              <CheckCircle size={20} /> {saveMessage.text}
            </div>
          )}

          {/* 입력 폼 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#4A3428]">
              <Plus size={20}/> {editingId ? '메뉴 정보 수정' : '새 메뉴 등록'}
            </h2>
            <form onSubmit={handleSaveMenu} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1">메뉴 이름</label>
                <input type="text" placeholder="예: 아이스 아메리카노" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 text-black" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1">가격 (숫자만)</label>
                <input type="number" placeholder="예: 4500" value={newItem.price} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} className="w-full p-3 border rounded-xl bg-gray-50 text-black" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1">카테고리</label>
                <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 text-black">
                  <option value="coffee">Coffee</option>
                  <option value="non-coffee">Non-Coffee</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1">이미지 URL</label>
                <input type="text" placeholder="https://..." value={newItem.image_url} onChange={e => setNewItem({...newItem, image_url: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 text-black" />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1">상세 설명</label>
                <textarea placeholder="메뉴에 대한 설명을 입력하세요" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 text-black h-24" />
              </div>
              
              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="flex-1 bg-[#4A3428] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#38271E]">
                  <Save size={20} /> {editingId ? '수정 완료' : '메뉴 추가하기'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setNewItem({name:'', price:0, description:'', category:'coffee', image_url:'', available:true}); }} className="px-6 bg-gray-200 text-gray-600 rounded-xl font-bold">취소</button>
                )}
              </div>
            </form>
          </div>

          {/* 목록 표시 */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-400 ml-1">등록된 메뉴 ({menuItems.length})</h3>
            {menuItems.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-dashed text-gray-400">데이터가 없습니다. 첫 메뉴를 등록해 보세요!</div>
            ) : (
              menuItems.map((item: any) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <img src={item.image_url || 'https://via.placeholder.com/100'} alt="" className="w-16 h-16 object-cover rounded-xl bg-gray-100" />
                    <div>
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <p className="text-[#4A3428] font-semibold">{item.price.toLocaleString()}원 <span className="text-gray-300 mx-2">|</span> <span className="text-gray-400 font-normal">{item.category}</span></p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingId(item.id); setNewItem(item); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={20}/></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={20}/></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;