import { useEffect, useState, useMemo } from 'react';
import './style.scss';
import TruckCard from './truckcard.jsx';
import TruckModal from './truckModal.jsx';

const API =
  'https://script.google.com/macros/s/AKfycbxJPGjHsgUjehMyL9eYd7cPqpupjwqr_MOdRXQlLWwSk_J_6GYPL9-Y6NJbGwHgJQxx/exec';

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

  /* ===== LOAD LIST + PREFETCH DETAILS ===== */
  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return;

        // ❌ убираем пустые и с дефисом
        const clean = data.filter(t =>
          t.truckId &&
          typeof t.truckId === 'string' &&
          !t.truckId.includes('-')
        );

        setTrucks(clean);

        // 🔹 Prefetch details ТОЛЬКО для валидных машин
        clean.forEach(t => prefetchDetails(t.truckId));
      })
      .finally(() => setLoadingList(false));
  }, []);


  /* ===== PREFETCH DETAILS ===== */
  const prefetchDetails = truckId => {
    const key = `truck_details_${truckId}`;
    const timeKey = `${key}_time`;
    const cachedTime = localStorage.getItem(timeKey);

    if (cachedTime && Date.now() - Number(cachedTime) < DETAILS_CACHE_TTL) {
      const cached = localStorage.getItem(key);
      if (cached) {
        setDetailsMap(prev => ({ ...prev, [truckId]: JSON.parse(cached).details }));
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
    let list = trucks.filter(t =>
      t.truckId &&
      typeof t.truckId === 'string' &&
      !t.truckId.includes('-')
    );

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


  /* ===== OPEN MODAL ===== */
  const openTruck = truck => {
    setActiveId(truck.truckId);
    setActiveTruck({
      ...truck,
      details: detailsMap[truck.truckId] || []
    });
  };

  if (loadingList) {
    return <div className="trucks-loading">Загрузка транспорта…</div>;
  }

  return (
    <div className="trucks-page">

      {/* ===== FILTER BLOCK ===== */}
      <div className="trucks-filter">

        <div className="search-box">
          <input
            placeholder="Поиск по маркировке…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="search-btn"
            onClick={() => setSearch(search.trim())}
          >
            🔍
          </button>
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

          {/* 🔁 RESET */}
          {(search || statusFilter) && (
            <button
              className="reset-btn"
              onClick={() => {
                setSearch('');
                setStatusFilter(null);
              }}
            >
              Сбросить🔁
            </button>
          )}
        </div>
      </div>


      {/* ===== CARDS ===== */}
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
  );
}
