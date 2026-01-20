import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // 1. Supabase 불러오기
import { MenuItem, MenuCategory } from '../types';
import { X, ChevronLeft, ChevronRight, Coffee } from 'lucide-react';

const Menu: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'all'>('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. 데이터 불러오기 로직 수정
  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('id', { ascending: true }); // ID 순서대로 정렬

        if (error) throw error;
        if (data) setItems(data);
      } catch (error) {
        console.error('메뉴 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  const categories: { id: MenuCategory | 'all'; label: string; colorClass: string }[] = [
    { id: 'all', label: 'All Menu', colorClass: 'border-brand-coffee text-brand-coffee' },
    { id: 'coffee', label: 'Specialty Coffee', colorClass: 'border-brand-catCoffee text-brand-catCoffee' },
    { id: 'beverage', label: 'Coffee & Beverage', colorClass: 'border-brand-catBev text-brand-catBev' },
    { id: 'bakery', label: 'Master Bakery', colorClass: 'border-brand-catBaker text-brand-catBaker' },
    { id: 'brunch', label: 'Brunch & Meal', colorClass: 'border-brand-catBrunch text-brand-catBrunch' },
  ];

  // 기존 헬퍼 함수 및 핸들러 로직은 그대로 유지됩니다.
  const getCategoryColor = (category: MenuCategory) => {
      switch(category) {
          case 'coffee': return 'text-brand-catCoffee';
          case 'beverage': return 'text-brand-catBev';
          case 'bakery': return 'text-brand-catBaker';
          case 'brunch': return 'text-brand-catBrunch';
          default: return 'text-brand-coffee';
      }
  };

  const getCategoryBg = (category: MenuCategory) => {
      switch(category) {
          case 'coffee': return 'bg-brand-catCoffee';
          case 'beverage': return 'bg-brand-catBev';
          case 'bakery': return 'bg-brand-catBaker';
          case 'brunch': return 'bg-brand-catBrunch';
          default: return 'bg-brand-coffee';
      }
  };

  const openModal = (index: number) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  const showNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
    }
  };

  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null));
    }
  };

  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredItems.length]);

  const selectedItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  if (loading) return <div className="pt-40 text-center text-brand-coffee font-bold">메뉴를 불러오는 중입니다...</div>;

  return (
    <div className="pt-24 min-h-screen bg-brand-latte">
      {/* Header */}
      <div className="bg-brand-coffee py-20 mb-16 shadow-wood relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="font-serif text-5xl md:text-6xl text-brand-gold mb-6 drop-shadow-md tracking-wider">MENU</h1>
          <p className="text-brand-cream text-lg font-light tracking-wide">제로니모만의 특별한 미식 경험을 만나보세요</p>
        </div>
      </div>

<div className="container mx-auto px-6">
          <p className="text-center text-brand-coffee">메뉴 데이터를 불러오는 중이거나 메뉴가 비어 있습니다.</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;      