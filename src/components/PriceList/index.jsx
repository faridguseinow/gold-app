import React, { useState, useEffect } from 'react';
import './style.scss';

const API_URL = 'https://gfcc-price-api-server.onrender.com/api/prices';

const CACHE_KEY = 'price_cache';
const CACHE_TIME_KEY = 'price_cache_time';
const CACHE_TTL = 30 * 60 * 1000; // 30 минут

const PriceList = ({ searchTerm, fontSize, reloadKey, selectedCategory }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    const now = Date.now();

    // ===== USE CACHE =====
    if (cached && cachedTime && now - Number(cachedTime) < CACHE_TTL) {
      setData(JSON.parse(cached));
      setLoading(false);
      return;
    }

    // ===== FETCH NEW =====
    setLoading(true);

    fetch(API_URL)
      .then(res => res.json())
      .then(json => {
        const cleaned = Array.isArray(json)
          ? json.filter(i => i.name && i.category)
          : [];

        setData(cleaned);
        localStorage.setItem(CACHE_KEY, JSON.stringify(cleaned));
        localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
      })
      .catch(err => {
        console.error('Ошибка загрузки прайса:', err);
      })
      .finally(() => setLoading(false));
  }, [reloadKey]);

  if (loading) {
    return <p className="price-loading">Загрузка прайса…</p>;
  }

  /* ===== FILTER ===== */
  const filtered = data.filter(item => {
    const cleanCategory = item.category.replace(/[.,]/g, '').trim();
    const matchesCategory = selectedCategory
      ? cleanCategory === selectedCategory
      : true;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  /* ===== GROUP ===== */
  const grouped = {};
  filtered.forEach(item => {
    const cleanCategory = item.category.replace(/[.,]/g, '').trim();
    if (!grouped[cleanCategory]) grouped[cleanCategory] = [];
    grouped[cleanCategory].push(item);
  });

  const sortedGrouped = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, items]) => [
      category,
      items.sort((a, b) => a.name.localeCompare(b.name))
    ]);

  return (
    <div className="price-wrapper">
      {sortedGrouped.map(([category, items]) => (
        <div key={category} className="price-category-block">
          <h3 className="price-category-title sticky-category">
            {category} ({items.length})
          </h3>

          <table
            className="price-table"
            style={{ fontSize: `${fontSize}px` }}
          >
            <thead>
              <tr>
                <th>Наименование</th>
                <th>Опт</th>
                <th>+5%</th>
                <th>Розн</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{format(item.wholesalePrice)}</td>
                  <td>{format(item.extraPrice)}</td>
                  <td>{format(item.retailPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

function format(num) {
  return typeof num === 'number'
    ? num.toLocaleString('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })
    : '–';
}

export default PriceList;
