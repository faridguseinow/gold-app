export default function TruckModal({ truck, onClose }) {
  return (
    <div className="truck-modal-overlay" onClick={onClose}>
      <div className="truck-modal" onClick={e => e.stopPropagation()}>

        {/* ===== STICKY HEADER ===== */}
        <div className="modal-header sticky">
          <div>
            <div className="modal-auto">{truck.truckId}</div>
            <div className="modal-status">{truck.status}</div>
          </div>
          <button onClick={onClose}>×</button>
        </div>

        {/* ===== INFO ===== */}
        <div className="modal-info">
          <div><b>Дата:</b> {truck.date || '—'}</div>
          <div><b>Маршрут:</b> {truck.route || '—'}</div>
          <div><b>Соотношение:</b> {truck.ratio || '—'}</div>
          <div><b>Основной склад:</b> {truck.warehouse}</div>
        </div>

        {/* ===== LOADING ===== */}
        {truck.loading && (
          <div className="modal-loading">Загрузка данных…</div>
        )}

        {/* ===== TABLE ===== */}
        {!truck.loading && (
          <div className="modal-table">
            <div className="modal-row modal-row--head">
              <div>Поставщик</div>
              <div>Тел.</div>
              <div>Кор.</div>
              <div>Марк.</div>
              <div>Прим.</div>
              <div>Клиент</div>
            </div>

            {truck.details?.map((row, i) => (
              <div className="modal-row" key={i}>
                <div>{row.supplier}</div>
                <div>{row.cc}</div>
                <div>{row.boxes}</div>
                <div>{row.mark}</div>
                <div>{row.note}</div>
                <div>{row.client}</div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
