export default function TruckModal({ truck, onClose }) {
  return (
    <div className="truck-modal-overlay" onClick={onClose}>
      <div className="truck-modal" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <div>
            <div className="modal-auto">{truck.truckId}</div>
            <div className="modal-status">{truck.status}</div>
          </div>
          <button onClick={onClose}>×</button>
        </div>

        <div className="modal-info">
          <div><b>Дата:</b> {truck.date}</div>
          <div><b>Маршрут:</b> {truck.route}</div>
          <div><b>Соотношение:</b> {truck.ratio}</div>
          <div><b>Основной склад:</b> {truck.warehouse}</div>
        </div>

        <div className="modal-table">
          <div className="modal-row modal-row--head">
            <div>Поставщик</div>
            <div>Кор.</div>
            <div>Марк.</div>
            {/* <div>Вес</div> */}
            <div>Прим.</div>
            <div>Клиент</div>
          </div>

          {truck.details?.map((row, i) => (
            <div className="modal-row" key={i}>
              <div>{row.supplier}</div>
              <div>{row.boxes}</div>
              <div>{row.mark}</div>
              {/* <div>{row.weight}</div> */}
              <div>{row.note}</div>
              <div>{row.client}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
