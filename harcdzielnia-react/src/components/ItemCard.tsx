import React from 'react';
import type { Item } from '../store/itemsSlice';
import { Link } from 'react-router-dom';
import './ItemCard.css';

interface ItemCardProps {
  item: Item;
  categoryIcon?: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, categoryIcon }) => {
  return (
    <div className="item-card">
      <Link to={`/item/${item.id}`}>
        {item.photo ? (
           <img src={item.photo} alt={item.name} className="main-img" loading="lazy" />
        ) : (
           <div className="placeholder">Brak zdjęcia</div>
        )}

        <div className="name">
          {categoryIcon && <img src={categoryIcon} className="icon" alt="" />}
          <p>{item.name}</p>
        </div>
      </Link>
    </div>
  );
};

export default ItemCard;
