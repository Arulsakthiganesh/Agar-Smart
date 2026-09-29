import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NotificationDrawer } from './components/NotificationDrawer';
import { OverviewDashboard } from './pages/OverviewDashboard';
import { LiveNowcastMapPage } from './pages/LiveNowcastMapPage';
import { ThunderstormPage } from './pages/ThunderstormPage';
import { LightningPage } from './pages/LightningPage';
import { RadarPage } from './pages/RadarPage';
import { SatellitePage } from './pages/SatellitePage';
import { AlertCenterPage } from './pages/AlertCenterPage';
import { HistoricalAnalysisPage } from './pages/HistoricalAnalysisPage';
import { AiModelCenterPage } from './pages/AiModelCenterPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { SystemHealthPage } from './pages/SystemHealthPage';
import { SettingsPage } from './pages/SettingsPage';
import { fetchApi } from './api/apiClient';
import { DashboardSummary, NowcastPrediction, RadarStation, AiModelMetric, SystemHealth, DataMode } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 15000, // Sync live data every 15s
      staleTime: 10000,
    },
  },
});

const MainLayout: React.FC = () => {
  const [dataMode, setDataMode] = useState<DataMode>('DEMO');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // TanStack Query Hooks for data synchronization
  const { data: summary, refetch: refetchSummary } = useQuery<DashboardSummary>({
    queryKey: ['dashboardSummary'],
    queryFn: () => fetchApi<DashboardSummary>('/dashboard/summary'),
  });

  const { data: predictions = [] } = useQuery<NowcastPrediction[]>({
    queryKey: ['predictions'],
    queryFn: () => fetchApi<NowcastPrediction[]>('/predictions/latest'),
  });

  const { data: radars = [] } = useQuery<RadarStation[]>({
    queryKey: ['radars'],
    queryFn: () => fetchApi<RadarStation[]>('/radar'),
  });

  const { data: models = [] } = useQuery<AiModelMetric[]>({
    queryKey: ['models'],
    queryFn: () => fetchApi<AiModelMetric[]>('/models'),
  });

  const { data: health = null } = useQuery<SystemHealth>({
    queryKey: ['systemHealth'],
    queryFn: () => fetchApi<SystemHealth>('/system/health'),
  });

  const activeAlerts = summary?.recent_alerts || [];

  const handleToggleDataMode = () => {
    setDataMode((prev) => (prev === 'DEMO' ? 'REAL' : 'DEMO'));
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans antialiased">
      {/* Platform Command Center Header */}
      <Header
        dataMode={dataMode}
        onToggleDataMode={handleToggleDataMode}
        onOpenNotifications={() => setIsDrawerOpen(true)}
        activeAlertCount={activeAlerts.length}
      />

      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Operational Page Viewport */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#080C14]">
          <Routes>
            <Route path="/" element={<OverviewDashboard summary={summary || null} predictions={predictions} />} />
            <Route path="/live-map" element={<LiveNowcastMapPage summary={summary || null} />} />
            <Route path="/thunderstorm" element={<ThunderstormPage summary={summary || null} predictions={predictions} />} />
            <Route path="/lightning" element={<LightningPage summary={summary || null} />} />
            <Route path="/radar" element={<RadarPage summary={summary || null} radars={radars} />} />
            <Route path="/satellite" element={<SatellitePage />} />
            <Route path="/alerts" element={<AlertCenterPage alerts={activeAlerts} onRefresh={refetchSummary} />} />
            <Route path="/history" element={<HistoricalAnalysisPage />} />
            <Route path="/ai-models" element={<AiModelCenterPage models={models} />} />
            <Route path="/data-sources" element={<DataSourcesPage dataMode={dataMode} onToggleDataMode={handleToggleDataMode} sources={[]} />} />
            <Route path="/system-health" element={<SystemHealthPage health={health} />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        alerts={activeAlerts}
      />
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <MainLayout />
      </Router>
    </QueryClientProvider>
  );
}
