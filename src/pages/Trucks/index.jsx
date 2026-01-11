import { useEffect, useState } from 'react';
import './style.scss';
import TruckCard from './truckcard.jsx';
import TruckModal from './truckModal.jsx';

const API =
  'https://script.google.com/macros/s/AKfycbxJPGjHsgUjehMyL9eYd7cPqpupjwqr_MOdRXQlLWwSk_J_6GYPL9-Y6NJbGwHgJQxx/exec';

export default function Trucks() {
  const [trucks, setTrucks] = useState([]);
  const [activeTruck, setActiveTruck] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [loadingList, setLoadingList] = useState(true);

  /* ===== LOAD LIST ===== */
  useEffect(() => {
    setLoadingList(true);

    fetch(API)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTrucks(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingList(false));
  }, []);

  /* ===== OPEN MODAL ===== */
  const openTruck = truckId => {
    setActiveId(truckId);
    setLoadingId(truckId);

    fetch(`${API}?id=${encodeURIComponent(truckId)}`)
      .then(r => r.json())
      .then(data => {
        if (!data?.error) {
          setActiveTruck(data);
        }
      })
      .finally(() => setLoadingId(null));
  };

  /* ===== GLOBAL LOADING ===== */
  if (loadingList) {
    return (
      <div className="trucks-loading">
        Загрузка транспорта…
      </div>
    );
  }

  return (
    <div className="trucks-page">
      {trucks.map(truck => (
        <TruckCard
          key={truck.truckId}
          truck={truck}
          active={activeId === truck.truckId}
          loading={loadingId === truck.truckId}
          onClick={() => openTruck(truck.truckId)}
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
