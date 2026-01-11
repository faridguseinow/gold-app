import { useEffect, useState } from 'react';
import './style.scss';

import Logo from '../../assets/icons/logopng.png'

const MASTER_PIN = '0000';

export default function PinLock({ onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  // ===== PIN INPUT =====
  const press = n => {
    if (pin.length >= 4) return;

    const next = pin + n;
    setPin(next);

    if (next.length === 4) {
      if (next === MASTER_PIN) {
        onSuccess();
      } else {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 600);
      }
    }
  };

  const del = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="pin-lock">
      <div className="pin-logo">
        <img src={Logo} alt="" />
        <div className="pin-title">Приложение для сотрудников</div>
      </div>

      <div className={`pin-dots ${error ? 'error' : ''}`}>
        {[0,1,2,3].map(i => (
          <span key={i} className={pin[i] ? 'filled' : ''} />
        ))}
      </div>

      <div className="pin-pad">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} onClick={() => press(n)}>{n}</button>
        ))}
        <button onClick={del}>◀</button>
        <button onClick={() => press(0)}>0</button>
      </div>
    </div>
  );
}
