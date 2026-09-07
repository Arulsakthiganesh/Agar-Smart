export type Role = 'administrator' | 'govt_officer' | 'surveyor' | 'viewer';

export interface User {
  id: number;
  name: str;
  email: str;
  role: Role;
}

export interface Unit {
  id: number;
  floor_id: number;
  unit_number: string;
  area: number;
  property_type: string;
  ulpin?: string;
  ownership_status: string;
  owner_name?: string;
  status: string;
  geometry?: any;
}

export interface Floor {
  id: number;
  building_id: number;
  floor_number: number;
  height: number;
  area: number;
  status: string;
  units: Unit[];
}

export interface Building {
  id: number;
  building_id: string;
  parcel_id: number;
  name: string;
  height: number;
  floors_count: number;
  built_up_area: number;
  ai_confidence: number;
  status: string;
  geometry?: any;
  floors: Floor[];
}

export interface Parcel {
  id: number;
  parcel_id: string;
  ulpin?: string;
  survey_number: string;
  area: number;
  latitude: number;
  longitude: number;
  elevation: number;
  state: string;
  district: string;
  taluk: string;
  village: string;
  property_type: string;
  owner_name: string;
  status: string;
  geometry?: any;
  buildings: Building[];
}

export interface UndergroundAsset {
  id: number;
  asset_id: string;
  name: string;
  type: string;
  depth: number;
  length: number;
  owner_agency: string;
  status: string;
  geometry?: any;
  last_inspection: string;
}

export interface ULPINRecord {
  id: number;
  ulpin: string;
  spatial_level: string;
  state: string;
  district: string;
  locality: string;
  parcel_id?: string;
  building_id?: string;
  floor_id?: string;
  unit_id?: string;
  latitude: number;
  longitude: number;
  elevation: number;
  qr_code_path?: string;
  created_at: string;
}

export interface ValidationIssue {
  id: number;
  entity_type: string;
  entity_id: string;
  issue_type: string;
  severity: 'Critical' | 'Warning' | 'Info';
  description: string;
  status: 'Open' | 'Resolved' | 'Ignored';
  created_at: string;
}

export interface ProcessingJob {
  id: number;
  filename: string;
  job_type: string;
  status: string;
  progress: number;
  result?: any;
  confidence_scores?: Record<string, number>;
  created_at: string;
}

export interface ActivityLog {
  id: number;
  action: string;
  title: string;
  description: string;
  user_email: string;
  timestamp: string;
}

export interface DashboardStats {
  total_parcels: number;
  mapped_3d_properties: number;
  total_buildings: number;
  floors_mapped: number;
  ulpins_generated: number;
  underground_assets: number;
  validation_issues: number;
  ai_processing_jobs: number;
}

export interface LayerVisibility {
  landParcels: boolean;
  buildings: boolean;
  floors: boolean;
  roads: boolean;
  underground: boolean;
  propertyBoundaries: boolean;
  airRights: boolean;
  dem: boolean;
}

export type CameraPreset = 'isometric' | 'top' | 'front' | 'underground';
