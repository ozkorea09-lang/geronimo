import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Trash2, Plus, LogIn, Save, Coffee, Image as ImageIcon, 
  Edit, CheckCircle 
} from 'lucide-react'; // 여기에 Plus를 추가했습니다!

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
      const { data, error } = await supabase
        .from('menu_item')
        .select('*')
        .order('id', { ascending: false });
      
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234' || password === '0000') { 
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
        setSaveMessage({ text: '수정되었습니다.', type: 'success' });
      } else {
        await supabase.from('menu_item').insert([newItem]);
        setSaveMessage({ text: '등록되었습니다.', type: 'success' });
      }
      setEditingId(null);
      setNewItem({ name: '', price: 0, description: '', category: 'coffee', image_url: '', available: true });
      loadData();
      setTimeout(() => setSaveMessage(null), 2000);
    } catch (error) {
      alert("저장 실패");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await supabase.from('menu_item').delete().eq('id', id);
    loadData();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
          <div className="flex justify-center mb-6"><Coffee className="text-[#4A3428]" size={48} /></div>
          <h1 className="text-2xl font-bold text-center text-[#4A3428] mb-8">관리자 로그인</h1>
          <input 
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-xl mb-4 bg-white text-black" 
            placeholder="비밀번호를 입력하세요"
          />
          <button type="submit" className="w-full bg-[#4A3428] text-white py-4 rounded-xl font-bold">
            접속하기
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex text-black">
      <div className="w-64 bg-[#4A3428] text-white p-6 hidden lg:block">
        <div className="flex items-center gap-2 mb-10 pb-4 border-b border-white/10">
          <Coffee size={24} /> <span className="font-bold text-xl">Cafe Admin</span>
        </div>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab('menu')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'menu' ? 'bg-white text-[#4A3428] font-bold' : 'hover:bg-white/10'}`}>
            <Coffee size={18} /> MENU
          </button>
        </nav>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {saveMessage && (
            <div className="mb-6 p-4 rounded-xl bg-green-100 text-green-700 flex items-center gap-2">
              <CheckCircle size={20} /> {saveMessage.text}
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#4A3428]">
              <Plus size={20}/> {editingId ? '메뉴 수정' : '새 메뉴 등록'}
            </h2>
            <form onSubmit={handleSaveMenu} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="메뉴명" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="p-3 border rounded-xl bg-gray-50 text-black" required />
              <input type="number" placeholder="가격" value={newItem.price} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} className="p-3 border rounded-xl bg-gray-50 text-black" required />
              <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="p-3 border rounded-xl bg-gray-50 text-black">
                <option value="coffee">Coffee</option>
                <option value="non-coffee">Non-Coffee</option>
                <option value="dessert">Dessert</option>
              </select>
              <input type="text" placeholder="이미지 URL" value={newItem.image_url} onChange={e => setNewItem({...newItem, image_url: e.target.value})} className="p-3 border rounded-xl bg-gray-50 text-black" />
              <button type="submit" className="md:col-span-2 bg-[#4A3428] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                <Save size={20} /> {editingId ? '수정 완료' : '메뉴 추가하기'}
              </button>
            </form>
          </div>

          <div className="grid gap-4">
            {menuItems.map((item: any) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={item.image_url || 'https://via.placeholder.com/100'} className="w-16 h-16 object-cover rounded-xl bg-gray-100" />
                  <div>
                    <h4 className="font-bold text-lg">{item.name}</h4>
                    <p className="text-[#4A3428] font-semibold">{item.price.toLocaleString()}원</p>
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
    </div>
  );
};

export default Admin;