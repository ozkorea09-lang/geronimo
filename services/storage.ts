import { MenuItem, Post, GalleryItem, SiteConfig, AboutPageData } from '../types';

// Initial Data (Seed)
const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    name: '게이샤 시그니처 브루',
    nameEng: 'Geisha Signature Brew',
    description: '파나마 에스메랄다 농장의 최고급 게이샤 원두로 내린 핸드드립 커피',
    price: 15000,
    category: 'coffee',
    imageUrl: 'https://picsum.photos/id/1060/800/600',
    isSignature: true,
  },
  {
    id: '2',
    name: '솔트 크림 라떼',
    nameEng: 'Salt Cream Latte',
    description: '히말라야 핑크 솔트와 진한 에스프레소, 부드러운 크림의 조화',
    price: 8500,
    category: 'coffee',
    imageUrl: 'https://picsum.photos/id/1085/800/600',
    isSignature: true,
  },
  {
    id: '7',
    name: '리얼 딸기 라떼',
    nameEng: 'Real Strawberry Latte',
    description: '매일 아침 들어오는 신선한 생딸기로 직접 만든 수제 청이 듬뿍 들어간 라떼',
    price: 9000,
    category: 'beverage',
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=2578&auto=format&fit=crop',
    isSignature: false,
  },
  {
    id: '8',
    name: '제주 말차 라떼',
    nameEng: 'Jeju Matcha Latte',
    description: '제주 유기농 말차의 진하고 쌉싸름한 맛과 부드러운 우유의 조화',
    price: 8500,
    category: 'beverage',
    imageUrl: 'https://images.unsplash.com/photo-1515823150537-2816505a6df9?q=80&w=2670&auto=format&fit=crop',
    isSignature: false,
  },
  {
    id: '9',
    name: '자몽 에이드',
    nameEng: 'Grapefruit Ade',
    description: '상큼한 자몽 과육이 씹히는 청량감 넘치는 에이드',
    price: 8500,
    category: 'beverage',
    imageUrl: 'https://images.unsplash.com/photo-1575556276274-129486c8f625?q=80&w=2574&auto=format&fit=crop',
    isSignature: false,
  },
  {
    id: '3',
    name: '명장 몽블랑',
    nameEng: 'Master Mont Blanc',
    description: '프랑스산 고메 버터를 사용하여 128겹의 결이 살아있는 페이스트리',
    price: 9000,
    category: 'bakery',
    imageUrl: 'https://picsum.photos/id/292/800/600',
    isSignature: true,
  },
  {
    id: '5',
    name: '바질 치즈 스콘',
    nameEng: 'Basil Cheese Scone',
    description: '향긋한 바질과 고소한 치즈가 어우러진 짭짤한 스콘',
    price: 5500,
    category: 'bakery',
    imageUrl: 'https://picsum.photos/id/493/800/600',
    isSignature: false,
  },
  {
    id: '4',
    name: '크루아상 샌드위치',
    nameEng: 'Croissant Sandwich',
    description: '신선한 야채와 프리미엄 햄을 곁들인 브런치 메뉴',
    price: 13000,
    category: 'brunch',
    imageUrl: 'https://picsum.photos/id/835/800/600',
    isSignature: false,
  },
  {
    id: '6',
    name: '에그 베네딕트',
    nameEng: 'Eggs Benedict',
    description: '수란과 홀랜다이즈 소스를 곁들인 클래식 브런치',
    price: 16000,
    category: 'brunch',
    imageUrl: 'https://picsum.photos/id/674/800/600',
    isSignature: true,
  },
];

const INITIAL_GALLERY: GalleryItem[] = [
  { id: '1', imageUrl: 'https://picsum.photos/id/431/800/800', title: 'Interior Hall', category: 'interior' },
  { id: '2', imageUrl: 'https://picsum.photos/id/292/800/800', title: 'Bakery Display', category: 'menu' },
  { id: '3', imageUrl: 'https://picsum.photos/id/425/800/800', title: 'Roasting Room', category: 'interior' },
  { id: '4', imageUrl: 'https://picsum.photos/id/1060/800/800', title: 'Barista', category: 'interior' },
  { id: '5', imageUrl: 'https://picsum.photos/id/225/800/800', title: 'Hand Drip', category: 'menu' },
  { id: '6', imageUrl: 'https://picsum.photos/id/1085/800/800', title: 'Terrace View', category: 'interior' },
  { id: '7', imageUrl: 'https://picsum.photos/id/674/800/800', title: 'Signature Brunch', category: 'menu' },
  { id: '8', imageUrl: 'https://picsum.photos/id/835/800/800', title: 'Night View', category: 'interior' },
];

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: '제로니모 커피하우스 그랜드 오픈',
    date: '2021-04-10',
    content: '세계적인 스페셜티 커피와 명장의 베이커리, 브런치를 이제 한국에서 만나보세요.',
    category: 'notice',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop',
    isPinned: true
  },
  {
    id: '2',
    title: '[이벤트] 인스타그램 해시태그 이벤트',
    date: '2023-11-15',
    content: '매장 방문 사진을 #제로니모커피 태그와 함께 올려주시면 추첨을 통해 시식권을 드립니다.',
    category: 'event',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2572&auto=format&fit=crop',
    isPinned: false
  },
  {
    id: '3',
    title: '시즌 한정 딸기 메뉴 출시 안내',
    date: '2023-12-01',
    content: '겨울 시즌을 맞아 신선한 딸기를 활용한 라떼와 케이크가 출시되었습니다. 많은 관심 부탁드립니다.',
    category: 'notice',
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=2578&auto=format&fit=crop',
    isPinned: false
  }
];

const INITIAL_CONFIG: SiteConfig = {
  heroTitle: "World Premium Coffee & Luxury Brunch & Master Bakery",
  heroSubtitle: "도심 속에서 만나는 압도적인 공간감과 예술적인 미식 경험",
  heroBackgroundImage: "https://picsum.photos/id/431/1920/1080",
  philosophyBackgroundImage: "https://picsum.photos/id/325/1920/1080",
  philosophyContentImage1: "https://picsum.photos/id/425/400/500",
  philosophyContentImage2: "https://picsum.photos/id/225/400/500",
  logoImageUrl: ""
};

const INITIAL_ABOUT: AboutPageData = {
  hero: {
    title: "압도적인 공간,\n예술이 되다",
    subtitle: "단순한 카페를 넘어, 당신의 일상에 영감을 불어넣는\n프리미엄 복합 문화 공간을 지향합니다.",
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop"
  },
  story: {
    title: "GERONIMO\nCOFFEE HOUSE",
    description1: "제로니모 커피하우스는 대한민국 명장의 혼이 담긴 베이커리와 스페셜티 커피, 럭셔리 브런치를 함께 즐길 수 있는 초대형 프리미엄 카페입니다.",
    description2: "방송 매체에서도 주목한 압도적인 규모의 인테리어는 마치 유럽의 대성당이나 오페라 하우스에 온 듯한 웅장함을 선사합니다. 화려한 조명 아래 펼쳐지는 드라마틱한 공간감, 곳곳에 배치된 포토존과 테마가 있는 좌석들은 방문하는 모든 분들에게 특별한 추억을 선물합니다.",
    imageMain: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop",
    imageSub: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop"
  },
  philosophy: {
    title: "Our Philosophy",
    subtitle: "제로니모가 추구하는 4가지 가치",
    items: [
      { title: "스페셜티 커피", description: "상위 7% 이내의 최상급 원두만을 선별하여 전문 바리스타가 정성스럽게 추출합니다." },
      { title: "대한민국 10대\n명장 베이커리", description: "대한민국 제과기능장이 매일 아침 최고급 재료로 구워내는 건강한 빵입니다." },
      { title: "럭셔리 브런치", description: "신선한 제철 식재료와 셰프의 감각이 더해진 다이닝급 브런치를 경험해보세요." },
      { title: "웅장한 공간과\n진정한 휴식", description: "높은 층고와 화려한 조명이 어우러진 드라마틱한 공간에서 진정한 휴식을 즐기세요." }
    ]
  },
  gallery: {
    title: "Space & Atmosphere",
    description: "제로니모의 낮과 밤, 그리고 공간의 미학을 담았습니다.",
    images: [
      { id: '1', url: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=2070&auto=format&fit=crop", caption: "Main Hall" },
      { id: '2', url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1974&auto=format&fit=crop", caption: "Brewing Bar" },
      { id: '3', url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop", caption: "Bakery Zone" },
      { id: '4', url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1971&auto=format&fit=crop", caption: "Terrace Night" }
    ]
  },
  location: {
    address: "경기도 양주시 화합로 1597번길 3",
    subAddress: "양주 IC에서 5분 거리 | 200대 동시 주차 가능",
    mapImage: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop"
  }
};


// Storage Keys
const KEYS = {
  MENU: 'geronimo_menu',
  GALLERY: 'geronimo_gallery',
  POSTS: 'geronimo_posts',
  CONFIG: 'geronimo_config',
  ABOUT: 'geronimo_about',
  AUTH_PW: 'geronimo_auth_pw',
};

// Helper to get data or seed
const getStorage = <T>(key: string, initial: T): T => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Storage Parse Error", e);
      return initial;
    }
  }
  return initial;
};

// Helper to set data
const setStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const DataService = {
  getMenu: (): MenuItem[] => getStorage(KEYS.MENU, INITIAL_MENU),
  saveMenu: (items: MenuItem[]) => setStorage(KEYS.MENU, items),

  getGallery: (): GalleryItem[] => getStorage(KEYS.GALLERY, INITIAL_GALLERY),
  saveGallery: (items: GalleryItem[]) => setStorage(KEYS.GALLERY, items),
  
  getPosts: (): Post[] => getStorage(KEYS.POSTS, INITIAL_POSTS),
  savePosts: (posts: Post[]) => setStorage(KEYS.POSTS, posts),

  // Config: Merge with initial to support new fields on existing data
  getConfig: (): SiteConfig => {
    const stored = getStorage(KEYS.CONFIG, INITIAL_CONFIG);
    return { ...INITIAL_CONFIG, ...stored };
  },
  saveConfig: (config: SiteConfig) => setStorage(KEYS.CONFIG, config),

  getAboutPage: (): AboutPageData => getStorage(KEYS.ABOUT, INITIAL_ABOUT),
  saveAboutPage: (data: AboutPageData) => setStorage(KEYS.ABOUT, data),

  getAdminPassword: (): string => {
    return localStorage.getItem(KEYS.AUTH_PW) || '1234abcd';
  },
  saveAdminPassword: (pw: string) => {
    localStorage.setItem(KEYS.AUTH_PW, pw);
  }
};