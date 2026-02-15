import { useEffect, useState, useMemo } from 'react';
import './style.scss';

const API = 'https://script.google.com/macros/s/AKfycbw5jaBScObj5sZjYWeOf4CZr6ZH6KDiknjo5m4qXCAA4aMHDxa9tX5TTDD_PSei8hAM/exec';


const CACHE_KEY = 'contacts_cache';
const CACHE_TIME = 'contacts_cache_time';
const TTL = 10 * 60 * 10000;


function formatRuPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  const normalized = digits.startsWith('8')
    ? '7' + digits.slice(1)
    : digits;

  if (normalized.length !== 11) return phone;

  return `+7 ${normalized.slice(1, 4)} ${normalized.slice(4, 7)} ${normalized.slice(7, 9)} ${normalized.slice(9, 11)}`;
}

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME);
    const now = Date.now();

    // 1️⃣ Если есть валидный кэш — используем сразу
    if (cached && cachedTime && now - Number(cachedTime) < TTL) {
      setContacts(JSON.parse(cached));
      setLoading(false);

      // 🔄 фоновое обновление
      fetch(API)
        .then(r => r.json())
        .then(data => {
          setContacts(data);
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          localStorage.setItem(CACHE_TIME, String(Date.now()));
        })
        .catch(console.error);

      return;
    }

    // 2️⃣ Если кэша нет — обычная загрузка
    fetch(API)
      .then(r => r.json())
      .then(data => {
        setContacts(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME, String(Date.now()));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);


  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return contacts.filter(c =>
      c.fullName.toLowerCase().includes(q)
    );
  }, [contacts, search]);

  return (
    <div className="contacts-page">



      <div className="contacts-search">

        <h1>Телефонная книжка</h1>
        <input
          placeholder="Поиск..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="contacts-list">

        {loading && (
          <div className="contacts-loading">
            Загрузка...
          </div>
        )}

        {filtered.map((c, i) => (
          <a
            key={i}
            href={`tel:${c.phone}`}
            className="contact-card"
          >
            <div className="contact-left">
              <div className="contact-name">{c.fullName}</div>
            </div>

            <div className="contact-phone">
              {formatRuPhone(c.phone)}
            </div>
          </a>
        ))}
      </div>


    </div>
  );
}
