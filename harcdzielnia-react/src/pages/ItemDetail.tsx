import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { fetchItems } from '../store/itemsSlice';
import backImg from '../assets/back.png';

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading } = useSelector((state: RootState) => state.items);

  const item = items.find((i) => i.id === Number(id));

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchItems());
    }
  }, [dispatch, items.length]);

  if (isLoading) return <div>Ładowanie...</div>;
  if (!item) return <div>Nie znaleziono przedmiotu.</div>;

  return (
    <div className="item-detail">
      <Link to="/" className="back-link">
        <img src={backImg} alt="Wróć" width="30" /> Wróć
      </Link>

      <h2>{item.name}</h2>

      <div className="detail-content">
        {item.photo && (
          <div className="detail-image">
             <img src={item.photo} alt={item.name} />
          </div>
        )}

        <div className="detail-info">
          <p><strong>Kategoria:</strong> {item.category}</p>
          <p><strong>Opis:</strong> {item.description}</p>
          <p><strong>Kontakt:</strong> {item.contact}</p>
          <p><strong>Data dodania:</strong> {item.timestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
