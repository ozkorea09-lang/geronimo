import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Trash2, Plus, LogIn, Save, Coffee, Image as ImageIcon, 
  Edit, CheckCircle, X, AlertCircle 
} from 'lucide-react'; // 모든 필요한 아이콘을 포함했습니다.

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'menu' | 'gallery'>('menu');
  const [saveMessage, setSaveMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    name: '', price: 0, description: '', category: 'coffee', image_url: '', available: true
  });

  const loadData = async () => {
    try {
      // 테이블 이름을 'menu_item'으로 정확히 맞췄습니다.
      const { data, error } = await supabase
        .from('menu_item') 
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234' || password === '0000') { 
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다. (0000 시도)');
    }
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase.from('menu_item').update(newItem).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('menu_item').insert([newItem]);
        if (error) throw error;
      }
      setEditingId(null);
      setNewItem({ name: '', price: 0, description: '', category: 'coffee', image_url: '', available: true });
      loadData();
      setSaveMessage({ text: '저장되었습니다.', type: 'success' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      alert("저장 오류: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await supabase.from('menu_item').delete().eq('id', id);
    loadData();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="flex justify-center mb-4"><Coffee className="text-brown-600" size={48} /></div>
          <h1 className="text-2xl font-bold text-center mb-6 text-black">관리자 접속</h1>
          <input 
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-xl mb-4 text-black bg-white" placeholder="비밀번호"
          />
          <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold">로그인</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex text-black">
      <div className="flex-1 p-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2"><Plus /> 메뉴 관리</h2>
        
        {saveMessage && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-xl">{saveMessage.text}</div>}

        <form onSubmit={handleSaveMenu} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 bg-gray-50 p-6 rounded-2xl border">
          <input type="text" placeholder="메뉴 이름" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="p-3 border rounded-xl bg-white text-black" required />
          <input type="number" placeholder="가격" value={newItem.price} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} className="p-3 border rounded-xl bg-white text-black" required />
          <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="p-3 border rounded-xl bg-white text-black">
            <option value="coffee">Coffee</option>
            <option value="non-coffee">Non-Coffee</option>
            <option value="dessert">Dessert</option>
          </select>
          <input type="text" placeholder="이미지 주소" value={newItem.image_url} onChange={e => setNewItem({...newItem, image_url: e.target.value})} className="p-3 border rounded-xl bg-white text-black" />
          <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
            <Save size={20} /> {editingId ? '수정 완료' : '메뉴 추가'}
          </button>
        </form>

        <div className="space-y-4">
          {menuItems.map((item: any) => (
            <div key={item.id} className="p-4 border rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <img src={item.image_url || 'https://via.placeholder.com/60'} className="w-16 h-16 object-cover rounded-xl" />
                <div>
                  <h4 className="font-bold text-lg">{item.name}</h4>
                  <p className="text-gray-500">{item.price.toLocaleString()}원</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingId(item.id); setNewItem(item); window.scrollTo(0,0); }} className="p-2 text-blue-600"><Edit size={20}/></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;