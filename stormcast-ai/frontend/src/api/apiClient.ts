const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`API Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`Backend endpoint ${endpoint} unavailable, using fallback mock provider.`, error);
    return getFallbackData<T>(endpoint);
  }
}

// Fallback data provider for standalone frontend preview
function getFallbackData<T>(endpoint: string): T {
  const now = new Date().toISOString();

  if (endpoint.includes('/dashboard/summary')) {
    return {
      active_storm_cells_count: 4,
      active_storm_cells_trend: '+3 from 15 min ago',
      lightning_events_60m_count: 428,
      high_risk_zones_count: 7,
      critical_risk_zones_count: 2,
      predicted_events_count: 16,
      data_mode: 'DEMO',
      last_updated: now,
      recent_alerts: [
        {
          id: 'alt-001',
          alert_code: 'ALT-IMD-2026-CHN01',
          category: 'THUNDERSTORM',
          severity: 'CRITICAL',
          location_name: 'Chennai Coastal & Urban Sector',
          latitude: 13.0827,
          longitude: 80.2707,
          thunderstorm_prob: 0.94,
          lightning_prob: 0.91,
          confidence: 0.95,
          message: 'Critical severe convective thunderstorm cell detected moving northeast. Rapid electrification observed.',
          recommended_action: 'Activate civil defense protocols, delay airport departures, alert fishermen.',
          status: 'ACTIVE',
          is_demo: true,
          created_at: now,
          expires_at: new Date(Date.now() + 7200000).toISOString(),
        }
      ],
      active_storm_cells: [
        {
          id: 'cell-001',
          cell_code: 'CELL-001',
          latitude: 13.0827,
          longitude: 80.2707,
          intensity_dbz: 54.5,
          severity_level: 'SEVERE',
          thunderstorm_prob: 0.88,
          lightning_prob: 0.82,
          direction_cardinal: 'NE',
          bearing_deg: 45.0,
          speed_kmh: 22.0,
          confidence: 0.92,
          is_demo: true,
          detected_at: now
        },
        {
          id: 'cell-002',
          cell_code: 'CELL-002',
          latitude: 12.9716,
          longitude: 77.5946,
          intensity_dbz: 46.0,
          severity_level: 'HIGH',
          thunderstorm_prob: 0.74,
          lightning_prob: 0.65,
          direction_cardinal: 'ENE',
          bearing_deg: 67.5,
          speed_kmh: 18.5,
          confidence: 0.89,
          is_demo: true,
          detected_at: now
        }
      ],
      latest_lightning_strikes: Array.from({ length: 30 }).map((_, i) => ({
        id: `lgt-fb-${i}`,
        latitude: 13.0827 + (Math.random() * 0.4 - 0.2),
        longitude: 80.2707 + (Math.random() * 0.4 - 0.2),
        peak_current_ka: Math.round(15 + Math.random() * 60),
        type: i % 3 === 0 ? 'IC' : 'CG',
        polarity: Math.random() > 0.2 ? '+' : '-',
        confidence: 0.94,
        is_demo: true,
        timestamp: new Date(Date.now() - i * 90000).toISOString()
      }))
    } as unknown as T;
  }

  if (endpoint.includes('/predictions/latest')) {
    return [
      {
        id: 'prd-15m',
        location_name: 'Chennai Coastal & Urban Sector',
        latitude: 13.0827,
        longitude: 80.2707,
        horizon_minutes: 15,
        thunderstorm_prob: 0.88,
        lightning_prob: 0.82,
        risk_level: 'SEVERE',
        storm_direction: 'NE',
        storm_speed_kmh: 22.0,
        confidence: 0.92,
        is_demo: true,
        created_at: now,
        valid_until: new Date(Date.now() + 900000).toISOString()
      },
      {
        id: 'prd-30m',
        location_name: 'Chennai Coastal & Urban Sector',
        latitude: 13.0827,
        longitude: 80.2707,
        horizon_minutes: 30,
        thunderstorm_prob: 0.94,
        lightning_prob: 0.89,
        risk_level: 'CRITICAL',
        storm_direction: 'NE',
        storm_speed_kmh: 24.5,
        confidence: 0.90,
        is_demo: true,
        created_at: now,
        valid_until: new Date(Date.now() + 1800000).toISOString()
      }
    ] as unknown as T;
  }

  if (endpoint.includes('/radar')) {
    return [
      { id: 'rad-001', station_code: 'CHN-DWR', name: 'Chennai Doppler Radar', latitude: 13.0827, longitude: 80.2707, elevation_m: 45, status: 'ONLINE', max_range_km: 250, last_scan_at: now, is_demo: true },
      { id: 'rad-002', station_code: 'BLR-DWR', name: 'Bengaluru Radar Station', latitude: 12.9716, longitude: 77.5946, elevation_m: 920, status: 'ONLINE', max_range_km: 250, last_scan_at: now, is_demo: true },
      { id: 'rad-003', station_code: 'HYD-DWR', name: 'Hyderabad Radar Station', latitude: 17.3850, longitude: 78.4867, elevation_m: 540, status: 'OFFLINE', max_range_km: 250, last_scan_at: now, is_demo: true }
    ] as unknown as T;
  }

  if (endpoint.includes('/models')) {
    return [
      { model_name: 'ThunderstormNowcast-ConvXGB', version: '2.1.0', training_dataset: 'IMD Historical DWR + INSAT-3D Convective Archive', features: ['Radar Reflectivity (dBZ)', 'CAPE (J/kg)', 'CIN', 'VIL'], accuracy: 0.894, precision: 0.872, recall: 0.915, f1_score: 0.893, inference_time_ms: 14.2, status: 'VALIDATED' },
      { model_name: 'LightningFlash-SpatioTemporal', version: '1.4.0', training_dataset: 'IMD Lightning Sensor Network', features: ['Cloud Top Temp (IR)', 'Echo Top 18dBZ'], accuracy: 0.881, precision: 0.865, recall: 0.898, f1_score: 0.881, inference_time_ms: 9.8, status: 'VALIDATED' },
      { model_name: 'StormTracker-VectorFlow', version: '3.0.1', training_dataset: 'IMD Dual-Polarization Optical Flow Vectors', features: ['Cross-Correlation Vector', 'Steering Wind 700hPa'], accuracy: 0.912, precision: 0.904, recall: 0.920, f1_score: 0.912, inference_time_ms: 11.5, status: 'VALIDATED' }
    ] as unknown as T;
  }

  if (endpoint.includes('/system/health')) {
    return {
      api_status: 'ONLINE',
      database_status: 'ONLINE',
      ai_engine_status: 'ONLINE',
      websocket_status: 'ONLINE',
      data_mode: 'DEMO',
      cpu_usage_pct: 18.4,
      memory_usage_pct: 44.2,
      active_connections: 14,
      last_model_inference: now,
      providers_status: {
        Radar: 'ONLINE (DEMO)',
        Satellite: 'ONLINE (DEMO)',
        Lightning: 'ONLINE (DEMO)',
        NWP: 'ONLINE (DEMO)'
      }
    } as unknown as T;
  }

  return [] as unknown as T;
}
