import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import { Parcel, UndergroundAsset } from '../types';
import { Box, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MapViewProps {
  parcels?: Parcel[];
  undergroundAssets?: UndergroundAsset[];
  center?: [number, number];
  zoom?: number;
  onParcelSelect?: (parcel: Parcel) => void;
}

// Custom Leaflet Marker Icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const MapView: React.FC<MapViewProps> = ({
  parcels = [],
  undergroundAssets = [],
  center = [13.0067, 80.2206], // Adyar, Chennai
  zoom = 15,
  onParcelSelect
}) => {
  const navigate = useNavigate();

  // Demo Parcels fallback if empty
  const defaultParcels = parcels.length > 0 ? parcels : [
    {
      id: 1,
      parcel_id: 'PCL-0001',
      ulpin: 'IN-TN-CHN-ADY-00482-B00-F00-U00-A1',
      survey_number: 'SY-104/2A',
      area: 12500,
      latitude: 13.0067,
      longitude: 80.2206,
      elevation: 12.5,
      state: 'Tamil Nadu',
      district: 'Chennai',
      taluk: 'Mylapore-Triplicane',
      village: 'Adyar',
      property_type: 'Mixed Residential',
      owner_name: 'BHUMI Housing Development Corp',
      status: 'Verified',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.2200, 13.0062],
          [80.2212, 13.0062],
          [80.2212, 13.0072],
          [80.2200, 13.0072]
        ]]
      },
      buildings: []
    },
    {
      id: 2,
      parcel_id: 'PCL-0002',
      ulpin: 'IN-TN-CHN-ADY-00483-B00-F00-U00-B2',
      survey_number: 'SY-104/2B',
      area: 8400,
      latitude: 13.0075,
      longitude: 80.2218,
      elevation: 12.8,
      state: 'Tamil Nadu',
      district: 'Chennai',
      taluk: 'Mylapore-Triplicane',
      village: 'Adyar',
      property_type: 'Commercial',
      owner_name: 'Cauvery Commercial Trust',
      status: 'Verified',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.2213, 13.0070],
          [80.2223, 13.0070],
          [80.2223, 13.0080],
          [80.2213, 13.0080]
        ]]
      },
      buildings: []
    }
  ];

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-800 relative shadow-2xl">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Parcel Polygons */}
        {defaultParcels.map((parcel) => {
          if (!parcel.geometry || !parcel.geometry.coordinates) return null;

          // Convert GeoJSON [lon, lat] to Leaflet [lat, lon]
          const positions: [number, number][] = parcel.geometry.coordinates[0].map(
            (coord: [number, number]) => [coord[1], coord[0]]
          );

          return (
            <React.Fragment key={parcel.id}>
              <Polygon
                positions={positions}
                pathOptions={{
                  color: parcel.status === 'Verified' ? '#3b82f6' : '#f59e0b',
                  fillColor: parcel.status === 'Verified' ? '#0284c7' : '#d97706',
                  fillOpacity: 0.35,
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => {
                    if (onParcelSelect) onParcelSelect(parcel);
                  }
                }}
              >
                <Popup>
                  <div className="p-2 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                      <span className="font-bold text-blue-400 text-sm">{parcel.parcel_id}</span>
                      <span className="text-[10px] bg-blue-600/30 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                        {parcel.survey_number}
                      </span>
                    </div>
                    <p className="text-slate-300"><strong>Owner:</strong> {parcel.owner_name}</p>
                    <p className="text-slate-300"><strong>Area:</strong> {parcel.area} sq.ft</p>
                    <p className="text-slate-300 font-mono text-[11px]"><strong>ULPIN:</strong> {parcel.ulpin}</p>
                    <button
                      onClick={() => navigate('/map3d')}
                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Box size={14} /> View in 3D Cadastre
                    </button>
                  </div>
                </Popup>
              </Polygon>

              <Marker position={[parcel.latitude, parcel.longitude]} icon={customIcon} />
            </React.Fragment>
          );
        })}

        {/* Subsurface Underground Assets Polyline */}
        {undergroundAssets.map((asset) => {
          if (!asset.geometry || !asset.geometry.coordinates) return null;

          const polylineCoords: [number, number][] = asset.geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]]
          );

          const lineColor =
            asset.type === 'Water Pipeline' ? '#0284c7' :
            asset.type === 'Sewage Pipeline' ? '#10b981' :
            asset.type === 'Electrical Cable' ? '#f59e0b' : '#64748b';

          return (
            <Polyline
              key={asset.id}
              positions={polylineCoords}
              pathOptions={{ color: lineColor, weight: 4, dashArray: '6, 6' }}
            >
              <Popup>
                <div className="p-1 text-xs">
                  <strong className="text-amber-400">{asset.name}</strong>
                  <p>Type: {asset.type}</p>
                  <p>Depth: {asset.depth} m below surface</p>
                  <p>Agency: {asset.owner_agency}</p>
                </div>
              </Popup>
            </Polyline>
          );
        })}
      </MapContainer>
    </div>
  );
};
