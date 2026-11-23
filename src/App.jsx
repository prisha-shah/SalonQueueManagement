import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { QueueProvider } from './context/QueueContext';
import HeaderNav from './components/HeaderNav';

// Pages for the 7 Required Views
import Home from './pages/Home';
import JoinQueue from './pages/JoinQueue';
import StatusTracker from './pages/StatusTracker';
import ReceptionDashboard from './pages/ReceptionDashboard';
import BarberWorkstation from './pages/BarberWorkstation';
import WallDisplay from './pages/WallDisplay';
import AdminSettings from './pages/AdminSettings';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout({ children }) {
  const location = useLocation();
  // Wall TV display has its own dedicated full-bleed immersive screen without standard web header
  const isWallDisplay = location.pathname === '/display';

  return (
    <div className="min-h-screen bg-canvas text-ink transition-colors duration-200 flex flex-col">
      {!isWallDisplay && <HeaderNav />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <QueueProvider>
          <ScrollToTop />
          <Layout>
            <Routes>
              {/* 1. Customer Mobile Home */}
              <Route path="/" element={<Home />} />

              {/* 2. Customer Remote Join Queue */}
              <Route path="/join" element={<JoinQueue />} />

              {/* 3. Customer Live Status Tracker */}
              <Route path="/status/:id" element={<StatusTracker />} />

              {/* 4. Receptionist Tablet Dashboard */}
              <Route path="/reception" element={<ReceptionDashboard />} />

              {/* 5. Barber Workstation View */}
              <Route path="/barber/:name" element={<BarberWorkstation />} />

              {/* 6. Waiting Area Wall TV Display */}
              <Route path="/display" element={<WallDisplay />} />

              {/* 7. Owner Settings & Analytics */}
              <Route path="/admin" element={<AdminSettings />} />

              {/* Fallback */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Layout>
        </QueueProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
