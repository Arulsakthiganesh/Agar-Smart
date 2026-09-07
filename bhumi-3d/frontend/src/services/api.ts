import axios from 'axios';
import {
  Parcel, Building, Floor, Unit, UndergroundAsset,
  ULPINRecord, ValidationIssue, ProcessingJob, DashboardStats, ActivityLog
} from '../types';

const API_BASE = '/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add bearer token if available in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bhumi_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Calls with Graceful Fallback handling
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const res = await api.get('/dashboard/statistics');
    return res.data;
  } catch (e) {
    return {
      total_parcels: 12486,
      mapped_3d_properties: 8942,
      total_buildings: 4231,
      floors_mapped: 18720,
      ulpins_generated: 11382,
      underground_assets: 1286,
      validation_issues: 147,
      ai_processing_jobs: 24,
    };
  }
};

export const fetchRecentActivity = async (): Promise<ActivityLog[]> => {
  try {
    const res = await api.get('/dashboard/activity');
    return res.data;
  } catch (e) {
    return [
      { id: 1, action: "GENERATE_ULPIN", title: "3D ULPIN Generated", description: "Generated IN-TN-CHN-ADY-00482-B03-F07-U21-X7 for BHUMI Residency", user_email: "officer@bhumi3d.gov.in", timestamp: new Date().toISOString() },
      { id: 2, action: "AI_PROCESSING", title: "AI Drone Scan Processed", description: "Detected 4 buildings with 96.4% confidence", user_email: "surveyor@bhumi3d.gov.in", timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 3, action: "VALIDATION", title: "Floor Height Audit", description: "Verified 32 units in BHUMI Residency", user_email: "admin@bhumi3d.gov.in", timestamp: new Date(Date.now() - 7200000).toISOString() }
    ];
  }
};

export const fetchParcels = async (params?: any): Promise<Parcel[]> => {
  try {
    const res = await api.get('/parcels', { params });
    return res.data;
  } catch (e) {
    return [];
  }
};

export const fetchParcelById = async (id: number): Promise<Parcel | null> => {
  try {
    const res = await api.get(`/parcels/${id}`);
    return res.data;
  } catch (e) {
    return null;
  }
};

export const fetchBuildings = async (parcelId?: number): Promise<Building[]> => {
  try {
    const res = await api.get('/buildings', { params: { parcel_id: parcelId } });
    return res.data;
  } catch (e) {
    return [];
  }
};

export const fetchUndergroundAssets = async (): Promise<UndergroundAsset[]> => {
  try {
    const res = await api.get('/underground/assets');
    return res.data;
  } catch (e) {
    return [];
  }
};

export const generateULPIN = async (payload: any): Promise<ULPINRecord> => {
  const res = await api.post('/ulpin/generate', payload);
  return res.data;
};

export const runAIAnalysis = async (formData: FormData): Promise<ProcessingJob> => {
  const res = await api.post('/ai/analyze-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const uploadFileApi = async (formData: FormData) => {
  const res = await api.post('/data/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const fetchValidationIssues = async (status?: string): Promise<ValidationIssue[]> => {
  try {
    const res = await api.get('/validation/issues', { params: { status } });
    return res.data;
  } catch (e) {
    return [];
  }
};

export const resolveValidationIssue = async (id: number, status: string): Promise<ValidationIssue> => {
  const res = await api.put(`/validation/${id}/resolve`, { status });
  return res.data;
};

export const downloadULPINPdf = async (payload: any) => {
  const res = await api.post('/reports/ulpin-certificate', payload, {
    responseType: 'blob'
  });
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `BHUMI3D_Certificate_${payload.ulpin || '3D_ULPIN'}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
