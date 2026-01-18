export default function TruckCard({ truck, onClick, active, loading }) {
  const statusClass = truck.status
    ?.toLowerCase()
    .replace(/\s+/g, '-');

  return (
    <div
      className={`truck-card ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="truck-top">
        <span className="truck-id">{truck.truckId}</span>

        {loading ? (
          <span className="loader">Загрузка…</span>
        ) : (
          <span className={`status status-${statusClass}`}>
            {truck.status}
          </span>
        )}
      </div>

      <div className="truck-bottom">
        <span>{truck.warehouse}</span>
        <span>{truck.type}</span>
      </div>
    </div>
  );
}
