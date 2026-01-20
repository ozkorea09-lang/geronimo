
export type MenuCategory = 'coffee' | 'beverage' | 'bakery' | 'brunch';

export interface MenuItem {
  id: string;
  name: string;
  nameEng: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl: string;
  isSignature: boolean;
}

export interface Post {
  id: string;
  title: string;
  date: string;
  content: string;
  category: 'notice' | 'event';
  imageUrl?: string;
  isPinned?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: 'interior' | 'menu' | 'exterior';
}

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroBackgroundImage: string;      // 메인 히어로 배경
  philosophyBackgroundImage: string; // 철학 섹션 배경
  philosophyContentImage1: string;  // 철학 섹션 콘텐츠 이미지 1 (좌/상)
  philosophyContentImage2: string;  // 철학 섹션 콘텐츠 이미지 2 (우/하)
  logoImageUrl: string;             // 사이트 로고
}

// New Types for About Page
export interface AboutGalleryImage {
  id: string;
  url: string;
  caption: string;
  externalLink?: string; // New: External link for the image
}

export interface AboutPageData {
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  story: {
    title: string;
    description1: string;
    description2: string;
    imageMain: string;
    imageSub: string;
  };
  philosophy: {
    title: string;
    subtitle: string;
    items: {
      title: string;
      description: string;
    }[]; // 4 items for layout
  };
  gallery: {
    title: string;
    description: string;
    images: AboutGalleryImage[];
  };
  location: {
    address: string;
    subAddress: string;
    mapImage: string;
  };
}
