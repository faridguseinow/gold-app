import { useEffect, useState, useMemo } from 'react';
import './style.scss';
import TruckCard from './truckcard.jsx';
import TruckModal from './truckModal.jsx';

const API =
  'https://script.google.com/macros/s/AKfycbxJPGjHsgUjehMyL9eYd7cPqpupjwqr_MOdRXQlLWwSk_J_6GYPL9-Y6NJbGwHgJQxx/exec';

const LIST_CACHE_KEY = 'trucks_list';
const LIST_CACHE_TIME = 'trucks_list_time';
const LIST_TTL = 5 * 60 * 1000; // 5 минут

const DETAILS_CACHE_TTL = 5 * 60 * 1000;

const STATUS_ORDER = {
  'Gömrükdən çıxıb': 1,
  'Gömrükdədir': 2,
  'Serheddedir': 3,
  'Zatamojkada Avropada': 4,
  'Hələ Avropadadır': 5
};

export default function Trucks() {
  const [trucks, setTrucks] = useState([]);
  const [detailsMap, setDetailsMap] = useState({});
  const [activeTruck, setActiveTruck] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [loadingList, setLoadingList] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);

  /* ===== LOAD LIST (CACHE FIRST) ===== */
  useEffect(() => {
    const cached = localStorage.getItem(LIST_CACHE_KEY);
    const cachedTime = localStorage.getItem(LIST_CACHE_TIME);
    const now = Date.now();

    if (cached && cachedTime && now - Number(cachedTime) < LIST_TTL) {
      const parsed = JSON.parse(cached);
      setTrucks(parsed);
      setLoadingList(false);

      // 🔄 обновление в фоне
      backgroundUpdate();
      return;
    }

    fetchList();
  }, []);

  /* ===== FETCH LIST ===== */
  const fetchList = () => {
    setLoadingList(true);

    fetch(API)
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return;

        const clean = data.filter(t =>
          t.truckId &&
          typeof t.truckId === 'string' &&
          !t.truckId.includes('-')
        );

        setTrucks(clean);
        localStorage.setItem(LIST_CACHE_KEY, JSON.stringify(clean));
        localStorage.setItem(LIST_CACHE_TIME, String(Date.now()));

        clean.forEach(t => prefetchDetails(t.truckId));
      })
      .finally(() => setLoadingList(false));
  };

  /* ===== BACKGROUND UPDATE ===== */
  const backgroundUpdate = () => {
    fetch(API)
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return;

        const clean = data.filter(t =>
          t.truckId &&
          typeof t.truckId === 'string' &&
          !t.truckId.includes('-')
        );

        setTrucks(clean);
        localStorage.setItem(LIST_CACHE_KEY, JSON.stringify(clean));
        localStorage.setItem(LIST_CACHE_TIME, String(Date.now()));
      })
      .catch(() => { });
  };

  /* ===== PREFETCH DETAILS ===== */
  const prefetchDetails = truckId => {
    const key = `truck_details_${truckId}`;
    const timeKey = `${key}_time`;
    const cachedTime = localStorage.getItem(timeKey);

    if (cachedTime && Date.now() - Number(cachedTime) < DETAILS_CACHE_TTL) {
      const cached = localStorage.getItem(key);
      if (cached) {
        setDetailsMap(prev => ({
          ...prev,
          [truckId]: JSON.parse(cached).details
        }));
      }
      return;
    }

    fetch(`${API}?id=${encodeURIComponent(truckId)}`)
      .then(r => r.json())
      .then(data => {
        if (!data?.error) {
          localStorage.setItem(key, JSON.stringify(data));
          localStorage.setItem(timeKey, String(Date.now()));
          setDetailsMap(prev => ({ ...prev, [truckId]: data.details }));
        }
      })
      .catch(() => { });
  };

  /* ===== FILTER + SEARCH ===== */
  const filteredTrucks = useMemo(() => {
    let list = [...trucks];

    if (statusFilter) {
      list = list.filter(t => t.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        detailsMap[t.truckId]?.some(r =>
          r.mark?.toLowerCase().includes(q)
        )
      );
    }

    return list.sort(
      (a, b) =>
        (STATUS_ORDER[a.status] || 99) -
        (STATUS_ORDER[b.status] || 99)
    );
  }, [trucks, detailsMap, search, statusFilter]);

const openTruck = truck => {
  setActiveId(truck.truckId);

  // открываем модалку сразу
  setActiveTruck({
    ...truck,
    loading: true,
    details: []
  });

  const key = `truck_details_${truck.truckId}`;
  const timeKey = `${key}_time`;
  const cached = localStorage.getItem(key);
  const cachedTime = localStorage.getItem(timeKey);
  const now = Date.now();

  // ✅ 1. Сначала кэш
  if (cached && cachedTime && now - Number(cachedTime) < DETAILS_CACHE_TTL) {
    const data = JSON.parse(cached);
    setActiveTruck({
      ...truck,
      ...data,          // ← тут date / route / ratio
      loading: false
    });
    return;
  }

  // ❌ 2. Если нет — грузим
  fetch(`${API}?id=${encodeURIComponent(truck.truckId)}`)
    .then(r => r.json())
    .then(data => {
      if (!data?.error) {
        localStorage.setItem(key, JSON.stringify(data));
        localStorage.setItem(timeKey, String(Date.now()));

        setActiveTruck({
          ...truck,
          ...data,
          loading: false
        });
      }
    })
    .catch(() => {
      setActiveTruck(prev => prev && { ...prev, loading: false });
    });
};



  if (loadingList) {
    return <div className="trucks-loading">Загрузка транспорта…</div>;
  }

  return (
    <div className="trucks-container">
      <div className="header_search">
        <div className="trucks-filter">
          <div className="search-box">
            <input
              placeholder="Поиск по маркировке…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="search-btn">ОК</button>
          </div>

          <div className="status-filters">
            {Object.keys(STATUS_ORDER).map(s => (
              <button
                key={s}
                className={statusFilter === s ? 'active' : ''}
                onClick={() => setStatusFilter(statusFilter === s ? null : s)}
              >
                {s}
              </button>
            ))}

            {(search || statusFilter) && (
              <button
                className="reset-btn"
                onClick={() => {
                  setSearch('');
                  setStatusFilter(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Вернуть
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="trucks_page">
        {filteredTrucks.map(truck => (
          <TruckCard
            key={truck.truckId}
            truck={truck}
            active={activeId === truck.truckId}
            onClick={() => openTruck(truck)}
          />
        ))}

        {activeTruck && (
          <TruckModal
            truck={activeTruck}
            onClose={() => {
              setActiveTruck(null);
              setActiveId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
