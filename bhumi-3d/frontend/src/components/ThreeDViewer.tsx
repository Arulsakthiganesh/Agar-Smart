import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { Building, Floor, Unit, UndergroundAsset } from '../types';
import { Box, Layers, Eye, ShieldCheck, CheckCircle2, ChevronRight, X, Pipette } from 'lucide-react';

// --- Building 3D Mesh Component ---
interface Building3DProps {
  building: Building;
  isMain?: boolean;
}

const Building3D: React.FC<Building3DProps> = ({ building, isMain = false }) => {
  const {
    explodedView,
    explodedDistance,
    selectedFloor,
    setSelectedFloor,
    selectedUnit,
    setSelectedUnit,
    setSelectedBuilding,
    setSelectedParcel,
    undergroundMode
  } = useStore();

  const floorCount = building.floors_count || 8;
  const floorHeight = 1.2; // 3D units per floor
  const buildingWidth = 6.0;
  const buildingLength = 8.0;

  return (
    <group position={isMain ? [0, 0, 0] : [14, 0, -8]}>
      {/* Base Foundation / Parcel boundary */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[buildingWidth + 4, buildingLength + 4]} />
        <meshStandardMaterial
          color={isMain ? "#1e3a8a" : "#1e293b"}
          wireframe={false}
          opacity={undergroundMode ? 0.2 : 0.8}
          transparent
        />
      </mesh>

      {/* Building Label */}
      <Text
        position={[0, (floorCount * floorHeight) + 1.5, 0]}
        fontSize={0.9}
        color="#38bdf8"
        anchorX="center"
        anchorY="middle"
      >
        {building.name}
      </Text>

      {/* Render Each Floor */}
      {Array.from({ length: floorCount }).map((_, idx) => {
        const floorNum = idx + 1;
        
        // Calculate Y position with smooth exploded offset
        const yOffset = explodedView
          ? idx * (floorHeight + explodedDistance)
          : idx * floorHeight;

        const isFloorSelected = selectedFloor === floorNum;
        const isFloorHidden = selectedFloor !== null && !explodedView && floorNum > selectedFloor;

        if (isFloorHidden) return null;

        return (
          <group
            key={floorNum}
            position={[0, yOffset + (floorHeight / 2), 0]}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBuilding(building);
              setSelectedFloor(floorNum);
            }}
          >
            {/* Floor Slab Mesh */}
            <mesh position={[0, -(floorHeight / 2) + 0.05, 0]}>
              <boxGeometry args={[buildingWidth + 0.2, 0.1, buildingLength + 0.2]} />
              <meshStandardMaterial
                color={isFloorSelected ? "#0284c7" : "#334155"}
                metalness={0.5}
                roughness={0.2}
              />
            </mesh>

            {/* 4 Vertical Units per Floor */}
            {[
              { id: `A-${floorNum}01`, pos: [-buildingWidth/4, 0, -buildingLength/4], label: 'A' },
              { id: `B-${floorNum}02`, pos: [buildingWidth/4, 0, -buildingLength/4], label: 'B' },
              { id: `C-${floorNum}03`, pos: [-buildingWidth/4, 0, buildingLength/4], label: 'C' },
              { id: `D-${floorNum}04`, pos: [buildingWidth/4, 0, buildingLength/4], label: 'D' },
            ].map((unitInfo) => {
              const isUnitSelected = selectedUnit?.unit_number === unitInfo.id;

              return (
                <mesh
                  key={unitInfo.id}
                  position={unitInfo.pos as [number, number, number]}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBuilding(building);
                    setSelectedFloor(floorNum);
                    setSelectedUnit({
                      id: floorNum * 10 + unitInfo.label.charCodeAt(0),
                      floor_id: floorNum,
                      unit_number: unitInfo.id,
                      area: 1250,
                      property_type: '3 BHK Apartment',
                      ulpin: `IN-TN-CHN-ADY-00482-B03-F0${floorNum}-U${unitInfo.label}${floorNum}01-X7`,
                      ownership_status: 'Owned',
                      owner_name: unitInfo.id === 'C-703' ? 'Sanjay Raghavan (Conflict)' : 'Dr. K. Ramanathan',
                      status: unitInfo.id === 'C-703' ? 'Boundary Mismatch' : 'Verified'
                    });
                  }}
                >
                  <boxGeometry args={[buildingWidth / 2 - 0.2, floorHeight - 0.2, buildingLength / 2 - 0.2]} />
                  <meshStandardMaterial
                    color={
                      isUnitSelected
                        ? "#06b6d4"
                        : unitInfo.id === 'C-703'
                        ? "#f59e0b"
                        : isFloorSelected
                        ? "#0284c7"
                        : isMain
                        ? "#1e293b"
                        : "#0f172a"
                    }
                    opacity={undergroundMode ? 0.15 : isUnitSelected ? 0.95 : 0.8}
                    transparent
                    roughness={0.1}
                    metalness={0.2}
                  />
                </mesh>
              );
            })}

            {/* Floor Label Tag */}
            <Html position={[-buildingWidth / 2 - 1.2, 0, 0]} distanceFactor={15}>
              <div
                onClick={() => setSelectedFloor(floorNum)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-all ${
                  isFloorSelected
                    ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/50 scale-110'
                    : 'bg-slate-900/90 text-slate-300 border border-slate-700 hover:bg-slate-800'
                }`}
              >
                F{floorNum}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

// --- Subsurface Underground Assets Mesh ---
const SubsurfaceInfrastructure: React.FC = () => {
  const { undergroundMode, setSelectedParcel } = useStore();

  if (!undergroundMode) return null;

  return (
    <group position={[0, 0, 0]}>
      {/* CMWSSB Water Pipeline (Blue Pipe) */}
      <group position={[0, -4.8, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.5, 0.5, 30, 16]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.8} emissive="#0284c7" emissiveIntensity={0.2} />
        </mesh>
        <Text position={[0, 0.8, 0]} fontSize={0.6} color="#38bdf8">
          Water Pipeline (Depth: -4.8m)
        </Text>
      </group>

      {/* GCC Trunk Sewage Pipeline (Green Pipe) */}
      <group position={[4, -6.2, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.6, 0.6, 30, 16]} />
          <meshStandardMaterial color="#10b981" roughness={0.2} emissive="#10b981" emissiveIntensity={0.2} />
        </mesh>
        <Text position={[0, 0.9, 0]} fontSize={0.6} color="#34d399">
          Sewage Trunk Line (Depth: -6.2m)
        </Text>
      </group>

      {/* TANGEDCO Underground Power Conduit (Yellow/Orange Cable) */}
      <group position={[-4, -2.5, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 30, 16]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.1} emissive="#f59e0b" emissiveIntensity={0.3} />
        </mesh>
        <Text position={[0, 0.6, 0]} fontSize={0.6} color="#fbbf24">
          33kV Power Conduit (Depth: -2.5m)
        </Text>
      </group>

      {/* Chennai Metro Underground Tunnel (Grey Large Tunnel) */}
      <group position={[0, -18.5, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[2.5, 2.5, 35, 24]} />
          <meshStandardMaterial color="#475569" wireframe={true} />
        </mesh>
        <Text position={[0, 3.2, 0]} fontSize={0.8} color="#94a3b8">
          Chennai Metro Phase-2 Tunnel (Depth: -18.5m)
        </Text>
      </group>
    </group>
  );
};

// --- Main 3D Canvas Container ---
export const ThreeDViewer: React.FC = () => {
  const {
    explodedView,
    toggleExplodedView,
    explodedDistance,
    setExplodedDistance,
    selectedFloor,
    setSelectedFloor,
    selectedUnit,
    setSelectedUnit,
    selectedBuilding,
    setSelectedBuilding,
    undergroundMode,
    toggleUndergroundMode,
    cameraPreset,
    setCameraPreset,
    layers,
    toggleLayer
  } = useStore();

  const [showLayerMenu, setShowLayerMenu] = useState(true);

  // Sample Building Data
  const mainBuilding: Building = {
    id: 1,
    building_id: "BLD-0001",
    parcel_id: 1,
    name: "BHUMI Residency",
    height: 26.5,
    floors_count: 8,
    built_up_area: 42000,
    ai_confidence: 98.4,
    status: "Verified",
    floors: []
  };

  const secondaryBuilding: Building = {
    id: 2,
    building_id: "BLD-0002",
    parcel_id: 2,
    name: "Cauvery Heights",
    height: 16.8,
    floors_count: 5,
    built_up_area: 22000,
    ai_confidence: 95.2,
    status: "Verified",
    floors: []
  };

  return (
    <div className="relative w-full h-[calc(100vh-7rem)] rounded-2xl overflow-hidden border border-slate-800 bg-[#070a12] shadow-2xl">
      {/* 3D Canvas Scene */}
      <Canvas
        camera={{ position: cameraPreset === 'top' ? [0, 35, 0.1] : cameraPreset === 'front' ? [0, 5, 30] : [20, 18, 25], fov: 45 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[15, 30, 20]} intensity={1.2} castShadow />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#38bdf8" />

        {/* Ground Matrix Grid */}
        <Grid
          infiniteGrid
          cellSize={1}
          cellThickness={0.8}
          cellColor={undergroundMode ? "#1e293b" : "#334155"}
          sectionSize={5}
          sectionThickness={1.5}
          sectionColor={undergroundMode ? "#334155" : "#0284c7"}
          fadeDistance={60}
          fadeStrength={1}
        />

        {/* 3D Buildings */}
        {layers.buildings && <Building3D building={mainBuilding} isMain={true} />}
        {layers.buildings && <Building3D building={secondaryBuilding} isMain={false} />}

        {/* Subsurface Underground Assets */}
        <SubsurfaceInfrastructure />

        {/* Orbit Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={undergroundMode ? Math.PI : Math.PI / 2 - 0.02}
          minDistance={5}
          maxDistance={70}
        />
      </Canvas>

      {/* LEFT: Layer Toggle Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          className="flex items-center gap-2 px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-semibold text-cyan-400 hover:bg-slate-800 shadow-xl backdrop-blur-md"
        >
          <Layers size={16} /> GIS Layers
        </button>

        {showLayerMenu && (
          <div className="w-56 p-3 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-2 animate-in fade-in">
            <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] mb-1">Layer Visibility</h4>
            {Object.keys(layers).map((key) => (
              <label key={key} className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer py-1">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <input
                  type="checkbox"
                  checked={layers[key as keyof typeof layers]}
                  onChange={() => toggleLayer(key as keyof typeof layers)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-0 cursor-pointer"
                />
              </label>
            ))}
          </div>
        )}
      </div>

      {/* TOP RIGHT: Camera & View Action Toolbar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-900/90 p-1.5 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md text-xs">
        <button
          onClick={() => setCameraPreset('isometric')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
            cameraPreset === 'isometric' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Isometric
        </button>
        <button
          onClick={() => setCameraPreset('top')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
            cameraPreset === 'top' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Top View
        </button>
        <button
          onClick={() => setCameraPreset('front')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
            cameraPreset === 'front' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Front View
        </button>
        <div className="w-px h-5 bg-slate-800"></div>
        <button
          onClick={toggleExplodedView}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
            explodedView ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/40' : 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
          }`}
        >
          <Box size={14} /> Exploded View
        </button>
        <button
          onClick={toggleUndergroundMode}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
            undergroundMode ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/40' : 'bg-slate-800 text-amber-400 hover:bg-slate-700'
          }`}
        >
          <Pipette size={14} /> Subsurface Mode
        </button>
      </div>

      {/* BOTTOM CENTER: Floor Slider Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 border border-slate-800 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-4 text-xs">
        <span className="font-semibold text-slate-300 flex items-center gap-2">
          <Layers size={16} className="text-cyan-400" /> Floor Level:
        </span>
        <input
          type="range"
          min={1}
          max={8}
          value={selectedFloor || 8}
          onChange={(e) => setSelectedFloor(parseInt(e.target.value))}
          className="w-48 accent-cyan-400 cursor-pointer"
        />
        <span className="font-mono text-cyan-400 font-bold text-sm bg-slate-800 px-2 py-1 rounded-lg">
          {selectedFloor ? `Floor ${selectedFloor}` : 'All Floors'}
        </span>
        {selectedFloor !== null && (
          <button
            onClick={() => setSelectedFloor(null)}
            className="text-slate-400 hover:text-white underline text-[11px]"
          >
            Show All
          </button>
        )}
      </div>

      {/* RIGHT DRAWER: Selected Entity Property Inspector */}
      {(selectedBuilding || selectedUnit) && (
        <div className="absolute top-4 right-4 bottom-4 w-96 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-5 backdrop-blur-md z-30 overflow-y-auto animate-in slide-in-from-right-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
              <Box size={18} className="text-cyan-400" /> Property Intelligence
            </h3>
            <button
              onClick={() => {
                setSelectedBuilding(null);
                setSelectedUnit(null);
              }}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>

          {/* Unit Details if unit selected */}
          {selectedUnit ? (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-cyan-400">3D ULPIN Spatial ID</span>
                <p className="font-mono font-bold text-slate-100 text-sm mt-0.5 break-all">
                  {selectedUnit.ulpin}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Unit ID</span>
                  <p className="font-bold text-slate-100 text-sm mt-0.5">{selectedUnit.unit_number}</p>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Floor Level</span>
                  <p className="font-bold text-slate-100 text-sm mt-0.5">Floor {selectedUnit.floor_id}</p>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Carpet Area</span>
                  <p className="font-bold text-slate-100 text-sm mt-0.5">{selectedUnit.area} sq.ft</p>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Status</span>
                  <p className={`font-bold text-sm mt-0.5 ${selectedUnit.status === 'Verified' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {selectedUnit.status}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Registered Owner:</span>
                  <strong className="text-slate-200">{selectedUnit.owner_name}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Ownership Rights:</span>
                  <strong className="text-cyan-400">Freehold Air-Rights</strong>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Elevation (MSL):</span>
                  <strong className="text-slate-200">33.5 meters</strong>
                </div>
              </div>

              <button
                onClick={() => window.open(`/ulpin?generated=${selectedUnit.ulpin}`, '_blank')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold text-white rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
              >
                Generate ULPIN Certificate
              </button>
            </div>
          ) : (
            /* Building Details */
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">Building Name</span>
                <p className="font-bold text-slate-100 text-base mt-0.5">{selectedBuilding?.name}</p>
                <span className="text-[10px] text-cyan-400 font-mono">ID: {selectedBuilding?.building_id}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Total Height</span>
                  <p className="font-bold text-slate-100 text-sm mt-0.5">{selectedBuilding?.height} m</p>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Floors Mapped</span>
                  <p className="font-bold text-slate-100 text-sm mt-0.5">{selectedBuilding?.floors_count} Stories</p>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Built-Up Area</span>
                  <p className="font-bold text-slate-100 text-sm mt-0.5">{selectedBuilding?.built_up_area} sq.ft</p>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400">AI Confidence</span>
                  <p className="font-bold text-emerald-400 text-sm mt-0.5">{selectedBuilding?.ai_confidence}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
