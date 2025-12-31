import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchItems } from "../store/itemsSlice";
import backImg from "../assets/back.png";

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading } = useSelector((state: RootState) => state.items);

  const item = items.find((i) => i.id === Number(id));

  const { categories } = useSelector((state: RootState) => state.categories);

  // Create a map for quick category image lookup
  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat.name] = cat.link;
    });
    return map;
  }, [categories]);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchItems());
    }
  }, [dispatch, items.length]);

  if (isLoading) return <div>Ładowanie...</div>;
  if (!item) return <div>Nie znaleziono przedmiotu.</div>;

  return (
    <div>
      <button
        type="button"
        className="item-view-back-link"
        onClick={() => window.history.back()}
      >
        <img src={backImg} alt="Wróć" width="20" height="20" />
        <span>Wróć</span>
      </button>

      <div className="item-detail">
        <div>
          <img
            src={categoryMap[item.category]}
            className="item-detail-icon"
            alt=""
            aria-hidden="true"
          />
          <h1 className="item-detail-title">{item.name}</h1>
        </div>
        <img className="item-detail-img" src={item.photo} alt={item.name} />
        <p>{item.description || <i>Brak opisu</i>}</p>
        <div>
          <h2>Dane kontaktowe:</h2>
          <p>{item.contact}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
