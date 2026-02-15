import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';

import { useEffect, useState } from 'react';
import { AliveScope, KeepAlive } from 'react-activation';

import { SettingsProvider } from './context/SettingsContext';

import './App.scss';
import './reset.css';

import PinLock from './components/PinLock';

import Contacts from './pages/Contacts';
import Price from './pages/Price';
import TrucksHome from './pages/TrucksHome/index';
import TrucksLoading from './pages/TrucksHome/loading';
import TrucksEcuador from './pages/TrucksHome/ecuador';
import TrucksExotics from './pages/TrucksHome/exotics';
import TrucksChrysant from './pages/TrucksHome/chrysant';

import Settings from './pages/Settings';

import Header from './layouts/Header';
import Footer from './layouts/Footer';

import InstallMobileIcon from '@mui/icons-material/InstallMobile';

// =======================
// Scroll Restoration
function ScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/price') {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return null;
}

// =======================
// PWA + VH
function SetupHandlers() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const updateVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateVH();
    window.addEventListener('resize', updateVH);
    return () => window.removeEventListener('resize', updateVH);
  }, []);

  useEffect(() => {
    const handler = e => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  return (
    showInstall && (
      <button className="install-btn" onClick={handleInstall}>
        <InstallMobileIcon /> Установить приложение
      </button>
    )
  );
}

// =======================
// APP
function App() {
  const [unlocked, setUnlocked] = useState(
    () => localStorage.getItem('pin_ok') === '1'
  );

  // 🔒 ПОКА PIN НЕ ВВЕДЁН — ТОЛЬКО ЭТО
  if (!unlocked) {
    return <PinLock onSuccess={() => setUnlocked(true)} />;
  }

  // 🔓 ПОСЛЕ PIN — ПОЛНОЕ ПРИЛОЖЕНИЕ
  return (
    <Router>

      <SettingsProvider>
        <AliveScope>
          <ScrollHandler />
          <SetupHandlers />



          <Header />

          <Routes>
            <Route path="/settings" element={<KeepAlive><Settings /></KeepAlive>} />
            <Route path="/contacts" element={<KeepAlive><Contacts /></KeepAlive>} />
            <Route path="/price" element={<KeepAlive><Price /></KeepAlive>} />
            <Route path="/truckshome" element={<KeepAlive><TrucksHome /></KeepAlive>} />
            <Route path="/trucks/loading" element={<TrucksLoading />} />
            <Route path="/trucks/ecuador" element={<TrucksEcuador />} />
            <Route path="/trucks/exotics" element={<TrucksExotics />} />
            <Route path="/trucks/chrysanthemum" element={<TrucksChrysant />} />
            <Route path="*" element={<Navigate to="/settings" replace />} />
          </Routes>

          <Footer />




        </AliveScope>
      </SettingsProvider>
    </Router>
  );
}

export default App;
