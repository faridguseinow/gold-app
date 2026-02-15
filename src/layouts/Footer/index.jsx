import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { NavLink, useLocation } from 'react-router-dom';
import './style.scss';

export default function Footer() {
  const location = useLocation();
  const { settings } = useSettings();

  const tabs = [
    { key: 'contacts', path: '/contacts', label: 'Контакты' },
    { key: 'price', path: '/price', label: 'Прайс-лист' },
    { key: 'transport', path: '/truckshome', label: 'Транспорт' },
    { key: 'settings', path: '/settings', label: 'Настройки' } 
  ];

  // 🔥 Фильтрация вкладок по настройкам
const visibleTabs = tabs.filter(tab =>
  tab.key === 'settings' || settings.tabs[tab.key]
);


  const activeIndex = visibleTabs.findIndex(tab =>
    location.pathname.startsWith(tab.path)
  );

  return (
    <nav className="bottom-nav">

      {visibleTabs.map(tab => (
        <NavLink
          key={tab.key}
          to={tab.path}
          className="nav-button"
        >
          {tab.key === 'contacts' && (
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e3e3e3"><path d="M795-120q-116 0-236.5-56T335-335Q232-438 176-558.5T120-795q0-19.29 12.86-32.14Q145.71-840 165-840h140q14 0 24 10t14 25l26.93 125.64Q372-665 369.5-653.5t-10.73 19.73L259-533q26 44 55 82t64 72q37 38 78 69.5t86 55.5l95-98q10-11 23.15-15 13.15-4 25.85-2l119 26q15 4 25 16.04 10 12.05 10 26.96v135q0 19.29-12.86 32.14Q814.29-120 795-120ZM229-588l81-82-23-110H180q2 42 13.5 88.5T229-588Zm369 363q41 19 89 31t93 14v-107l-103-21-79 83ZM229-588Zm369 363Z"/></svg>
          )}

          {tab.key === 'price' && (
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e3e3e3"><path d="M863-404 557-97q-9 8.5-20.25 12.75T514.25-80Q503-80 492-84.5T472-97L98-472q-8-8-13-18.96-5-10.95-5-23.04v-306q0-24.75 17.63-42.38Q115.25-880 140-880h307q12.07 0 23.39 4.87Q481.7-870.25 490-862l373 373q9.39 9 13.7 20.25 4.3 11.25 4.3 22.5t-4.5 22.75Q872-412 863-404ZM516-138l306-307-375-375H140v304l376 378ZM245-664q21 0 36.5-15.5T297-716q0-21-15.5-36.5T245-768q-21 0-36.5 15.5T193-716q0 21 15.5 36.5T245-664Zm236 185Z"/></svg>
          )}

          {tab.key === 'transport' && (
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e3e3e3"><path d="M188-196q-32-36-27-85H61l13-60h112q15-18 36.5-28.5T270-380q26 0 47.5 10.5T354-341h198l92-399H186l3-13q5-21 21-34t37-13h472l-39 170h125l114 152-39 197h-80q5 49-27.5 85T690-160q-50 0-82-36t-27-85H380q5 49-27.5 85T270-160q-50 0-82-36Zm446-234h215l6-33-80-107H666l-32 140Zm1-273 9-37-92 399 8-36 34-146 41-180ZM22-437l15-60h220l-15 60H22Zm80-146 15-60h260l-15 60H102Zm168 363q21 0 35.5-15t14.5-35q0-21-14.5-35.5T270-320q-20 0-35 14.5T220-270q0 20 15 35t35 15Zm420 0q21 0 35.5-15t14.5-35q0-21-14.5-35.5T690-320q-20 0-35 14.5T640-270q0 20 15 35t35 15Z"/></svg>
          )}

          {tab.key === 'settings' && (
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#fff"><path d="m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm48-60h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Zm44-210q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-130Z"/></svg>
          )}
        </NavLink>
      ))}

      {visibleTabs.length > 0 && (
        <div
          className="footer-indicator"
          style={{
            width: `${100 / visibleTabs.length}%`,
            transform: `translateX(${activeIndex * 100}%)`
          }}
        />
      )}

    </nav>
  );
}
