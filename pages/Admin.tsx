import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Trash2, Plus, LogIn, Save, Coffee, Image as ImageIcon, 
  Edit, CheckCircle, X 
} from 'lucide-react';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // 입력 필드 상태 (이미지 필드명을 image_url로 통일)
  const [newItem, setNewItem] = useState({
    name: '', price: 0, description: '', category: 'coffee', image_url: '', available: true
  });

  // 1. 데이터 로드 (에러 발생 시에도 중단되지 않도록 catch 처리)
  const loadData = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_item')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) console.log("메뉴 로드 중 알림: 아직 데이터가 없습니다.");
      if (data) setMenuItems(data);
    } catch (e) {
      console.error("연결 오류:", e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

  // 2. 로그인 로직
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0000' || password === '1234') { 
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  // 3. 메뉴 저장 (추가 및 수정)
  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // 수정 모드
        const { error } = await supabase.from('menu_item').update(newItem).eq('id', editingId);
        if (error) throw error;
        alert("수정되었습니다.");
      } else {
        // 추가 모드
        const { error } = await supabase.from('menu_item').insert([newItem]);
        if (error) throw error;
        alert("추가되었습니다.");
      }
      
      setEditingId(null);
      setNewItem({ name: '', price: 0, description: '', category: 'coffee', image_url: '', available: true });
      loadData();
    } catch (err: any) {
      alert("저장 실패: " + err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">관리자 접속</h1>
          <input 
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border rounded-xl mb-4 bg-gray-50 text-black focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="비밀번호를 입력하세요"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700">로그인</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* 헤더 부분 */}
      <div className="bg-[#4A3428] text-white p-6 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Coffee /> GERONIMO ADMIN
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm opacity-80 hover:opacity-100">로그아웃</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 md:p-10">
        {/* 입력 섹션 */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            {editingId ? <Edit size={20} className="text-blue-500"/> : <Plus size={20} className="text-green-500"/>}
            {editingId ? '메뉴 정보 수정' : '새 메뉴 등록'}
          </h2>
          <form onSubmit={handleSaveMenu} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">메뉴 이름</label>
              <input type="text" placeholder="예: 쌍화차" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full p-4 border rounded-2xl bg-gray-50" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">가격 (원)</label>
              <input type="number" placeholder="예: 8000" value={newItem.price} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} className="w-full p-4 border rounded-2xl bg-gray-50" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">카테고리</label>
              <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full p-4 border rounded-2xl bg-gray-50">
                <option value="coffee">Coffee</option>
                <option value="non-coffee">Non-Coffee</option>
                <option value="dessert">Dessert</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">이미지 주소 (URL)</label>
              <input type="text" placeholder="https://..." value={newItem.image_url} onChange={e => setNewItem({...newItem, image_url: e.target.value})} className="w-full p-4 border rounded-2xl bg-gray-50" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-md transition-all">
                <Save size={20} /> {editingId ? '수정 완료' : '메뉴 추가하기'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setNewItem({name:'', price:0, description:'', category:'coffee', image_url:'', available:true}); }} className="px-8 bg-gray-100 text-gray-500 rounded-2xl font-bold">취소</button>
              )}
            </div>
          </form>
        </div>

        {/* 목록 섹션 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-400 mb-4">현재 등록된 메뉴 목록 ({menuItems.length})</h3>
          <div className="grid grid-cols-1 gap-4">
            {menuItems.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden border">
                    <img 
                      src={item.image_url || 'https://via.placeholder.com/150?text=No+Image'} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error'; }}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">{item.name}</h4>
                    <p className="text-blue-600 font-bold">{item.price.toLocaleString()}원 <span className="text-gray-300 mx-2 font-normal">|</span> <span className="text-gray-400 font-medium capitalize">{item.category}</span></p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingId(item.id); setNewItem(item); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="p-3 text-blue-500 hover:bg-blue-50 rounded-2xl transition-colors"><Edit size={22}/></button>
                  <button onClick={() => { if(confirm(`${item.name}을(를) 삭제하시겠습니까?`)) supabase.from('menu_item').delete().eq('id', item.id).then(() => loadData()); }} className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"><Trash2 size={22}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;