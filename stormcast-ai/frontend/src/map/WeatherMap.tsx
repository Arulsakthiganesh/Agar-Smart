import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { StormCell, LightningStrike, RiskLevel } from '../types';
import { MapLegend } from './MapLegend';
import { TimeStep } from './MapTimeline';
import { RiskBadge } from '../components/RiskBadge';
import { Zap, Navigation, Wind, Droplets, Thermometer, ShieldAlert, Radio } from 'lucide-react';

// Custom Lightning Strike Icon
const createLightningIcon = (type: string, isForecast: boolean) => {
  const color = type === 'CG' ? '#EF4444' : '#F59E0B';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${color}" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>`;
  return L.divIcon({
    className: `lightning-marker ${isForecast ? 'opacity-60' : 'animate-pulse'}`,
    html: svg,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Custom Storm Centroid Icon
const createStormCentroidIcon = (cellCode: string, severity: RiskLevel) => {
  const colorMap: Record<RiskLevel, string> = {
    LOW: '#10B981',
    MODERATE: '#F59E0B',
    HIGH: '#F97316',
    SEVERE: '#EF4444',
    CRITICAL: '#991B1B'
  };
  const bg = colorMap[severity] || '#EF4444';
  const html = `<div style="background-color: ${bg}; border: 2px solid white; box-shadow: 0 0 12px ${bg};" class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] text-white tracking-tighter">
    ${cellCode}
  </div>`;
  return L.divIcon({
    className: 'storm-centroid-icon',
    html,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

interface WeatherMapProps {
  stormCells: StormCell[];
  lightningStrikes: LightningStrike[];
  timeStep: TimeStep;
  activeLayers: {
    thunderstormProb: boolean;
    lightningProb: boolean;
    stormCells: boolean;
    lightningStrikes: boolean;
    radarReflectivity: boolean;
    windVectors: boolean;
    riskZones: boolean;
  };
}

export const WeatherMap: React.FC<WeatherMapProps> = ({
  stormCells,
  lightningStrikes,
  timeStep,
  activeLayers
}) => {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  // Time-step offset translation for demo storm movement (moves NE over time)
  const getOffset = (step: TimeStep) => {
    switch (step) {
      case '-30m': return { lat: -0.15, lon: -0.15 };
      case '-15m': return { lat: -0.075, lon: -0.075 };
      case 'NOW': return { lat: 0, lon: 0 };
      case '+15m': return { lat: 0.08, lon: 0.08 };
      case '+30m': return { lat: 0.16, lon: 0.16 };
      case '+45m': return { lat: 0.24, lon: 0.24 };
      case '+60m': return { lat: 0.32, lon: 0.32 };
      default: return { lat: 0, lon: 0 };
    }
  };

  const offset = getOffset(timeStep);
  const isForecast = timeStep.startsWith('+');

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-[#1F2937] shadow-2xl">
      <MapContainer
        center={[13.0827, 80.2707]}
        zoom={8}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        {/* Dark GIS Meteorological Tile Layer (OpenStreetMap with Dark Filter) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | STORMCAST AI GIS Engine'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />



        {/* 1. Radar Reflectivity Overlay Rings */}
        {activeLayers.radarReflectivity && stormCells.map((cell) => {
          const lat = cell.latitude + offset.lat;
          const lon = cell.longitude + offset.lon;
          return (
            <React.Fragment key={`rad-${cell.id}`}>
              <Circle
                center={[lat, lon]}
                radius={35000}
                pathOptions={{
                  color: isForecast ? '#F97316' : '#EF4444',
                  fillColor: isForecast ? '#F97316' : '#EF4444',
                  fillOpacity: isForecast ? 0.2 : 0.35,
                  weight: 2,
                  dashArray: isForecast ? '6,6' : undefined
                }}
              />
              <Circle
                center={[lat, lon]}
                radius={20000}
                pathOptions={{
                  color: '#991B1B',
                  fillColor: '#991B1B',
                  fillOpacity: 0.45,
                  weight: 2
                }}
              />
            </React.Fragment>
          );
        })}

        {/* 2. Thunderstorm Risk Polygons */}
        {activeLayers.riskZones && stormCells.map((cell) => {
          const lat = cell.latitude + offset.lat;
          const lon = cell.longitude + offset.lon;
          const polyCoords: [number, number][] = [
            [lat + 0.15, lon - 0.1],
            [lat + 0.25, lon + 0.2],
            [lat - 0.05, lon + 0.35],
            [lat - 0.2, lon - 0.05],
          ];
          return (
            <Polygon
              key={`poly-${cell.id}`}
              positions={polyCoords}
              pathOptions={{
                color: cell.severity_level === 'CRITICAL' ? '#EF4444' : '#F59E0B',
                fillColor: cell.severity_level === 'CRITICAL' ? '#EF4444' : '#F59E0B',
                fillOpacity: isForecast ? 0.15 : 0.25,
                weight: 2,
                dashArray: isForecast ? '5, 5' : undefined,
              }}
            >
              <Tooltip sticky>
                <div className="text-xs font-semibold">
                  <div>Risk Zone: {cell.severity_level}</div>
                  <div>Prob: {Math.round(cell.thunderstorm_prob * 100)}%</div>
                </div>
              </Tooltip>
            </Polygon>
          );
        })}

        {/* 3. Storm Movement Vector Arrows */}
        {activeLayers.stormCells && stormCells.map((cell) => {
          const startLat = cell.latitude + offset.lat;
          const startLon = cell.longitude + offset.lon;
          const endLat = startLat + 0.18;
          const endLon = startLon + 0.18;
          return (
            <Polyline
              key={`vec-${cell.id}`}
              positions={[[startLat, startLon], [endLat, endLon]]}
              pathOptions={{ color: '#60A5FA', weight: 3, dashArray: '4,4' }}
            />
          );
        })}

        {/* 4. Storm Centroids */}
        {activeLayers.stormCells && stormCells.map((cell) => {
          const lat = cell.latitude + offset.lat;
          const lon = cell.longitude + offset.lon;
          return (
            <Marker
              key={cell.id}
              position={[lat, lon]}
              icon={createStormCentroidIcon(cell.cell_code, cell.severity_level)}
            >
              <Popup className="storm-popup">
                <div className="p-2 space-y-2 min-w-[220px]">
                  <div className="flex items-center justify-between border-b border-gray-700 pb-1.5">
                    <span className="font-bold text-sm text-white font-mono">{cell.cell_code}</span>
                    <RiskBadge level={cell.severity_level} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 block">Thunderstorm</span>
                      <span className="font-bold text-blue-400">{Math.round(cell.thunderstorm_prob * 100)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Lightning</span>
                      <span className="font-bold text-amber-400">{Math.round(cell.lightning_prob * 100)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Reflectivity</span>
                      <span className="font-bold text-red-400">{cell.intensity_dbz} dBZ</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Confidence</span>
                      <span className="font-bold text-emerald-400">{Math.round(cell.confidence * 100)}%</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-400 border-t border-gray-700 pt-1.5 flex items-center justify-between">
                    <span>Vector: {cell.direction_cardinal} @ {cell.speed_kmh} km/h</span>
                    <span className="text-amber-400 font-semibold">{isForecast ? 'FORECAST' : 'OBSERVED'}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 5. Lightning Strike Markers */}
        {activeLayers.lightningStrikes && lightningStrikes.map((strike) => {
          const lat = strike.latitude + offset.lat;
          const lon = strike.longitude + offset.lon;
          return (
            <Marker
              key={strike.id}
              position={[lat, lon]}
              icon={createLightningIcon(strike.type, isForecast)}
            >
              <Popup>
                <div className="p-1.5 text-xs space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1">
                    <Zap size={14} /> Lightning Strike Event
                  </div>
                  <div>Type: <span className="font-semibold text-white">{strike.type === 'CG' ? 'Cloud-to-Ground' : 'Intra-Cloud'}</span></div>
                  <div>Peak Current: <span className="font-semibold text-red-400">{strike.polarity}{strike.peak_current_ka} kA</span></div>
                  <div>Confidence: <span className="font-semibold text-emerald-400">{Math.round(strike.confidence * 100)}%</span></div>
                  <div className="text-[10px] text-gray-400">{new Date(strike.timestamp).toLocaleTimeString()}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Legend Overlay */}
      <div className="absolute bottom-4 right-4 z-20">
        <MapLegend />
      </div>
    </div>
  );
};
