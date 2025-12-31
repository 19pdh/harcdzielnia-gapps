import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchItems } from "../store/itemsSlice";
import backImg from "../assets/back.png";

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
      <button
        type="button"
        className="item-view-back-link"
        onClick={() => window.history.back()}
      >
        <img src={backImg} alt="Wróć" width="20" height="20" />
        <span>Wróć</span>
      </button>

      <h1>{item.name}</h1>
      <img className="item-detail-img" src={item.photo} alt={item.name} />
      <p>{item.description}</p>
      <h2>Dane kontaktowe:</h2>
      <p>{item.contact}</p>
    </div>
  );
};

export default ItemDetail;
