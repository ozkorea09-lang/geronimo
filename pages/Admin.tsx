import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Trash2, Plus, LogIn, Save, Coffee, Image as ImageIcon, 
  Edit, CheckCircle 
} from 'lucide-react'; // Plus 아이콘을 확실히 포함했습니다!

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    name: '', price: 0, description: '', category: 'coffee', image_url: '', available: true
  });

  // 데이터 로드 (에러가 나도 화면이 멈추지 않게 처리)
  const loadData = async () => {
    try {
      const { data, error } = await supabase.from('menu_item').select('*').order('id', { ascending: false });
      if (data) setMenuItems(data);
    } catch (e) {
      console.log("데이터를 불러올 수 없습니다. 테이블 이름을 확인해주세요.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0000' || password === '1234') { 
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await supabase.from('menu_item').update(newItem).eq('id', editingId);
      } else {
        await supabase.from('menu_item').insert([newItem]);
      }
      setEditingId(null);
      setNewItem({ name: '', price: 0, description: '', category: 'coffee', image_url: '', available: true });
      loadData();
      alert("성공적으로 저장되었습니다.");
    } catch (err) {
      alert("저장 실패. 테이블 설정을 확인해주세요.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-black">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <input 
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-xl mb-4 bg-white" placeholder="Password (0000)"
          />
          <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold">접속</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-10 text-black">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-8 text-2xl font-bold">
          <Plus size={28} /> <h2>메뉴 등록/관리</h2>
        </div>

        {/* 입력 폼 */}
        <div className="bg-gray-50 p-6 rounded-2xl border mb-10">
          <form onSubmit={handleSaveMenu} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="메뉴 이름" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="p-3 border rounded-xl bg-white" required />
            <input type="number" placeholder="가격" value={newItem.price} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} className="p-3 border rounded-xl bg-white" required />
            <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="p-3 border rounded-xl bg-white">
              <option value="coffee">Coffee</option>
              <option value="non-coffee">Non-Coffee</option>
              <option value="dessert">Dessert</option>
            </select>
            <input type="text" placeholder="이미지 주소 (URL)" value={newItem.image_url} onChange={e => setNewItem({...newItem, image_url: e.target.value})} className="p-3 border rounded-xl bg-white" />
            <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
              <Save size={20} /> {editingId ? '정보 수정' : '메뉴 추가'}
            </button>
          </form>
        </div>

        {/* 목록 */}
        <div className="space-y-4">
          <h3 className="text-gray-400 font-bold">등록된 메뉴 목록 ({menuItems.length})</h3>
          {menuItems.map((item) => (
            <div key={item.id} className="p-4 border rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <img src={item.image_url || 'https://via.placeholder.com/60'} className="w-14 h-14 object-cover rounded-lg" />
                <span className="font-bold text-lg">{item.name} ({item.price}원)</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingId(item.id); setNewItem(item); }} className="p-2 text-blue-500"><Edit size={20}/></button>
                <button onClick={() => { if(confirm('삭제할까요?')) supabase.from('menu_item').delete().eq('id', item.id).then(() => loadData()); }} className="p-2 text-red-500"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;