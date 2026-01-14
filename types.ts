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
  category: 'interior' | 'menu';
}

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  philosophyBackgroundImage: string;
}

// New Types for About Page
export interface AboutGalleryImage {
  id: string;
  url: string;
  caption: string;
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
    }[]; // Fixed 3 items for layout
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