import React from 'react';
import type { Category } from '../store/categoriesSlice';
import './CategoryList.css';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="category-filtering">
      <aside>
        <strong>Kategorie</strong>
        {categories.map((cat) => (
          <button
            key={cat.name}
            className={selectedCategory === cat.name ? 'active' : ''}
            onClick={() => onSelectCategory(cat.name)}
          >
            <img src={cat.link} alt={cat.name} width="40" height="40" />
            <span>{cat.name}</span>
          </button>
        ))}
      </aside>
    </div>
  );
};

export default CategoryList;
