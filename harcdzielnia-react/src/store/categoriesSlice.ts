import { createSlice } from '@reduxjs/toolkit';

// Import all images from src/assets/categories folder
// eager: true returns { path: Module }
// In Vite, importing an image returns the URL as the default export.
const categoriesFiles = import.meta.glob('../assets/categories/*.png', { eager: true });

export interface Category {
  name: string;
  link: string;
}

interface CategoriesState {
  categories: Category[];
}

// Process custom categories from the file system
const customCategories = Object.entries(categoriesFiles).map(([path, module]) => {
  // path is relative to this file, e.g., "../assets/categories/Name.png"
  const fileName = path.split('/').pop() || '';
  const name = fileName.split('.')[0];

  // module is { default: "/src/assets/categories/Name.png" }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const link = (module as any).default;

  return { name, link };
});

import allImg from '../assets/all.png';
import otherImg from '../assets/other.png';

const categories: Category[] = [
  { name: 'Wszystko', link: allImg },
  ...customCategories,
  { name: 'Inne', link: otherImg },
];

const initialState: CategoriesState = {
  categories,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
});

export default categoriesSlice.reducer;
