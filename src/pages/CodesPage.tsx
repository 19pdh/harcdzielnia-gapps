import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { fetchItems, type Item } from "../store/itemsSlice";
import { fetchRecentCodes } from "../store/recentCodesSlice";
import ItemCard from "../components/ItemCard";
import "./CodesPage.css";

const CodesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { items, isLoading: itemsLoading } = useSelector((state: RootState) => state.items);
  const { codes, isLoading: codesLoading } = useSelector((state: RootState) => state.recentCodes);
  const { categories } = useSelector((state: RootState) => state.categories);

  const [now, setNow] = useState(new Date().getTime());

  useEffect(() => {
    // Refresh the current time every second for the timer
    const interval = setInterval(() => {
      setNow(new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch items and recent codes on mount
    dispatch(fetchItems());
    dispatch(fetchRecentCodes());
  }, [dispatch]);

  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat.name] = cat.link;
    });
    return map;
  }, [categories]);

  const isLoading = itemsLoading || codesLoading;

  // Join items with recent codes
  const recentItems = useMemo(() => {
    const ONE_HOUR = 60 * 60 * 1000;
    const joined = codes.map((codeInfo) => {
      const item = items.find((i) => i.id === codeInfo.id);
      if (!item) return null;

      const itemTime = parseInt(item.id) * 1000;
      const timeLeft = itemTime + ONE_HOUR - now;

      if (timeLeft <= 0) return null; // Time is up, hide it

      return {
        item,
        code: codeInfo.code,
        timeLeft,
        totalTime: ONE_HOUR
      };
    }).filter(Boolean) as Array<{ item: Item; code: string; timeLeft: number; totalTime: number }>;

    return joined;
  }, [codes, items, now]);

  if (isLoading && recentItems.length === 0) {
    return (
      <div className="codes-page">
        <h2>Ostatnio dodane mundury</h2>
        <div className="container">
          <span>Ładowanie...</span>
        </div>
      </div>
    );
  }

  if (recentItems.length === 0) {
    return (
      <div className="codes-page">
        <h2>Ostatnio dodane mundury</h2>
        <div className="container">
          <span>Brak mundurów dodanych w ciągu ostatniej godziny.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="codes-page">
      <h2>Ostatnio dodane mundury</h2>
      <p>Kody odbioru są widoczne tylko przez godzinę od dodania munduru. Zapisz swój kod, aby móc go nakleić na oddawany przedmiot!</p>

      <div className="container">
        {recentItems.map(({ item, code, timeLeft, totalTime }) => {
          const minutes = Math.floor(timeLeft / (60 * 1000));
          const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
          const timeStr = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

          const progress = timeLeft / totalTime;
          const radius = 24;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference * (1 - progress);

          return (
            <div key={item.id} className="code-item-wrapper">
              <ItemCard
                item={item}
                categoryIcon={categoryMap[item.category]}
              />
              <div className="timer-overlay">
                <div className="timer-ring-container">
                  <svg width="60" height="60" className="timer-svg">
                    <circle
                      className="timer-ring-bg"
                      cx="30"
                      cy="30"
                      r={radius}
                      strokeWidth="4"
                      fill="rgba(0, 0, 0, 0.4)"
                    />
                    <circle
                      className="timer-ring-progress"
                      cx="30"
                      cy="30"
                      r={radius}
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      style={{
                        stroke: "var(--fg-light)",
                        transform: "rotate(-90deg)",
                        transformOrigin: "50% 50%",
                        transition: "stroke-dashoffset 1s linear"
                      }}
                    />
                  </svg>
                  <span className="timer-text">{timeStr}</span>
                </div>
              </div>
              <div className="pickup-code-box">
                Kod odbioru: <strong>{code}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CodesPage;