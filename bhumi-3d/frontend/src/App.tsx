import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { Map3DPage } from './pages/Map3DPage';
import { ParcelExplorerPage } from './pages/ParcelExplorerPage';
import { UlpinGeneratorPage } from './pages/UlpinGeneratorPage';
import { BuildingsPage } from './pages/BuildingsPage';
import { FloorsUnitsPage } from './pages/FloorsUnitsPage';
import { UndergroundPage } from './pages/UndergroundPage';
import { AiAnalysisPage } from './pages/AiAnalysisPage';
import { DataUploadPage } from './pages/DataUploadPage';
import { ValidationPage } from './pages/ValidationPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AdminPage } from './pages/AdminPage';
import { SettingsPage } from './pages/SettingsPage';
import { useStore } from './store/useStore';

export const App: React.FC = () => {
  const { user } = useStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Layout Shell */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="map3d" element={<Map3DPage />} />
          <Route path="parcels" element={<ParcelExplorerPage />} />
          <Route path="ulpin" element={<UlpinGeneratorPage />} />
          <Route path="buildings" element={<BuildingsPage />} />
          <Route path="floors-units" element={<FloorsUnitsPage />} />
          <Route path="underground" element={<UndergroundPage />} />
          <Route path="ai-analysis" element={<AiAnalysisPage />} />
          <Route path="upload" element={<DataUploadPage />} />
          <Route path="validation" element={<ValidationPage />} />
          <Route path="property/:id" element={<PropertyDetailsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
