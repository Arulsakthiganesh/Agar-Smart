export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE' | 'CRITICAL';
export type DataMode = 'DEMO' | 'REAL';
export type UserRole = 'ADMIN' | 'METEOROLOGIST' | 'ANALYST' | 'VIEWER';

export interface LocationPoint {
  latitude: number;
  longitude: number;
  location_name?: string;
}

export interface StormCell {
  id: string;
  cell_code: string;
  latitude: number;
  longitude: number;
  intensity_dbz: number;
  severity_level: RiskLevel;
  thunderstorm_prob: number;
  lightning_prob: number;
  direction_cardinal: string;
  bearing_deg: number;
  speed_kmh: number;
  confidence: number;
  is_demo: boolean;
  detected_at: string;
}

export interface LightningStrike {
  id: string;
  latitude: number;
  longitude: number;
  peak_current_ka: number;
  type: 'CG' | 'IC';
  polarity: '+' | '-';
  confidence: number;
  is_demo: boolean;
  timestamp: string;
}

export interface WeatherObservation {
  id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  temperature_c: number;
  humidity_pct: number;
  pressure_hpa: number;
  wind_speed_kmh: number;
  wind_direction_deg: number;
  rainfall_mm: number;
  cape_jkg: number;
  cin_jkg: number;
  is_demo: boolean;
  observed_at: string;
}

export interface NowcastPrediction {
  id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  horizon_minutes: 15 | 30 | 45 | 60;
  thunderstorm_prob: number;
  lightning_prob: number;
  risk_level: RiskLevel;
  storm_direction: string;
  storm_speed_kmh: number;
  confidence: number;
  is_demo: boolean;
  created_at: string;
  valid_until: string;
}

export interface RadarStation {
  id: string;
  station_code: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  max_range_km: number;
  last_scan_at: string;
  is_demo: boolean;
}

export interface Alert {
  id: string;
  alert_code: string;
  category: string;
  severity: RiskLevel;
  location_name: string;
  latitude: number;
  longitude: number;
  thunderstorm_prob: number;
  lightning_prob: number;
  confidence: number;
  message: string;
  recommended_action: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'EXPIRED';
  acknowledged_by?: string;
  is_demo: boolean;
  created_at: string;
  expires_at: string;
}

export interface DataSourceStatus {
  id: string;
  name: string;
  type: string;
  provider: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  is_demo: boolean;
  last_ingested_at: string;
  latency_seconds: number;
  quality_flag: 'GOOD' | 'SUSPECT' | 'MISSING' | 'STALE';
}

export interface DashboardSummary {
  active_storm_cells_count: number;
  active_storm_cells_trend: string;
  lightning_events_60m_count: number;
  high_risk_zones_count: number;
  critical_risk_zones_count: number;
  predicted_events_count: number;
  data_mode: DataMode;
  last_updated: string;
  recent_alerts: Alert[];
  active_storm_cells: StormCell[];
  latest_lightning_strikes: LightningStrike[];
}

export interface AiModelMetric {
  model_name: string;
  version: string;
  training_dataset: string;
  features: string[];
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  inference_time_ms: number;
  status: string;
}

export interface SystemHealth {
  api_status: string;
  database_status: string;
  ai_engine_status: string;
  websocket_status: string;
  data_mode: string;
  cpu_usage_pct: number;
  memory_usage_pct: number;
  active_connections: number;
  last_model_inference: string;
  providers_status: Record<string, string>;
}
