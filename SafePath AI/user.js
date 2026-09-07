/* ==================== GLOBAL USER PORTAL STATE ==================== */
const SafePathState = {
  currentMap: null,
  activeRoutes: {}, // references to leaflet polylines
  activeMarkers: [], // references to leaflet markers
  trackingMarker: null,
  trackingPathLine: null,
  trackingProgressStep: 0,
  gpsSimulationPath: [], // Coordinates of the selected active tracking route
  isSOSActive: false,
  routeLoaded: false,
  isTrackingActive: false,
  
  // Local Database (hydrated from localStorage or defaults)
  reports: [
    {
      id: 1,
      type: "Poor Lighting",
      location: "Middle Circle Alleyway",
      description: "Streetlights have been out for 4 days. Pitch black after 8 PM.",
      status: "Verified",
      timestamp: "Today, 11:20 AM",
      lat: 28.6290,
      lng: 77.2215
    },
    {
      id: 2,
      type: "Suspicious Activity",
      location: "Barakhamba Crossroad",
      description: "A group loitering in the closed arcade walkway, making passing pedestrians feel uncomfortable.",
      status: "Pending",
      timestamp: "Yesterday, 8:45 PM",
      lat: 28.6280,
      lng: 77.2255
    },
    {
      id: 3,
      type: "Poor Lighting",
      location: "Connaught Lane Crossing",
      description: "Broken bulbs in the alley walkway.",
      status: "Resolved",
      timestamp: "16 Jul, 10:15 PM",
      lat: 28.6265,
      lng: 77.2200
    }
  ],
  
  // Map configuration data
  coordinates: {
    start: { lat: 28.6304, lng: 77.2177, name: "Rajiv Chowk Metro Station" },
    end: { lat: 28.6255, lng: 77.2335, name: "Mandi House Metro Station" }
  },

  // Map POIs
  pois: {
    police: [
      { lat: 28.6295, lng: 77.2185, name: "Connaught Place Police Station" },
      { lat: 28.6285, lng: 77.2270, name: "Barakhamba Police Post" }
    ],
    hospitals: [
      { lat: 28.6250, lng: 77.2310, name: "Mandi House First Aid Clinic" },
      { lat: 28.6260, lng: 77.2200, name: "Janpath Emergency Care" }
    ],
    lights: [
      { lat: 28.6295, lng: 77.2210, status: "Active" },
      { lat: 28.6285, lng: 77.2240, status: "Active" },
      { lat: 28.6270, lng: 77.2290, status: "Active" }
    ]
  }
};

// Map Route Coordinates
const ROUTE_PATHS = {
  safest: [
    [28.6304, 77.2177], // Start
    [28.6272, 77.2235], // KG Marg Boulevard
    [28.6255, 77.2335]  // Mandi House
  ],
  shortest: [
    [28.6304, 77.2177], // Start
    [28.6290, 77.2215], // Middle Circle Alleyway
    [28.6255, 77.2335]  // Mandi House
  ],
  alternative: [
    [28.6304, 77.2177], // Start
    [28.6285, 77.2270], // Barakhamba Road
    [28.6255, 77.2335]  // Mandi House
  ]
};

/* ==================== INITIALIZATION & CORE EVENTS ==================== */
document.addEventListener("DOMContentLoaded", () => {
  // Load saved local storage reports if they exist
  const savedReports = localStorage.getItem("safepath_reports");
  if (savedReports) {
    SafePathState.reports = JSON.parse(savedReports);
  }

  // Initialize unified components
  initSmartMap();
  initReportingPanel();
  initChatbot();
  initSOSPanel();
  initRoutingEvents();

  // Reset default tracking screen text
  resetTrackingState();
});

/* ==================== SMART INTERACTIVE MAP ==================== */
function initSmartMap() {
  const mapElement = document.getElementById('user-interactive-map');
  if (!mapElement) return;

  // Center Leaflet Map on India on initial load
  const centerLat = 28.6280;
  const centerLng = 77.2250;
  
  SafePathState.currentMap = L.map('user-interactive-map', {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView([centerLat, centerLng], 14);

  // Use OpenStreetMap standard tile layers
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }).addTo(SafePathState.currentMap);

  // Add India Flag and Label control
  const countryControl = L.control({ position: 'bottomleft' });
  countryControl.onAdd = function() {
    const div = L.DomUtil.create('div', 'map-country-label');
    div.innerHTML = '🇮🇳 <strong>India</strong>';
    return div;
  };
  countryControl.addTo(SafePathState.currentMap);

  // Setup markers and layers
  renderPoisAndRoutes();
  setupMapEventListeners();

  // Trigger Leaflet render resize calculation
  setTimeout(() => {
    SafePathState.currentMap.invalidateSize();
  }, 250);
}

function renderPoisAndRoutes() {
  const map = SafePathState.currentMap;
  if (!map) return;

  // Clear existing items
  SafePathState.activeMarkers.forEach(m => map.removeLayer(m));
  SafePathState.activeMarkers = [];
  
  for (let key in SafePathState.activeRoutes) {
    map.removeLayer(SafePathState.activeRoutes[key]);
  }
  SafePathState.activeRoutes = {};

  if (SafePathState.trackingMarker) {
    map.removeLayer(SafePathState.trackingMarker);
    SafePathState.trackingMarker = null;
  }
  if (SafePathState.trackingPathLine) {
    map.removeLayer(SafePathState.trackingPathLine);
    SafePathState.trackingPathLine = null;
  }

  // 1. Draw Start & End Locations
  const startIcon = L.divIcon({
    className: 'custom-leaflet-marker start',
    html: '<div style="background-color:#2563EB; width:14px; height:14px; border-radius:50%; border:3px solid #FFF; box-shadow:0 2px 5px rgba(0,0,0,0.3)"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  const startMarker = L.marker([SafePathState.coordinates.start.lat, SafePathState.coordinates.start.lng], { icon: startIcon })
    .bindPopup(`<strong>Starting Point:</strong> ${SafePathState.coordinates.start.name}`)
    .addTo(map);
  SafePathState.activeMarkers.push(startMarker);

  const endIcon = L.divIcon({
    className: 'custom-leaflet-marker end',
    html: '<div style="background-color:#EF4444; width:14px; height:14px; border-radius:50%; border:3px solid #FFF; box-shadow:0 2px 5px rgba(0,0,0,0.3)"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  const endMarker = L.marker([SafePathState.coordinates.end.lat, SafePathState.coordinates.end.lng], { icon: endIcon })
    .bindPopup(`<strong>Destination:</strong> ${SafePathState.coordinates.end.name}`)
    .addTo(map);
  SafePathState.activeMarkers.push(endMarker);

  // 2. Draw POIs (Police, Hospitals, Streetlights)
  // Police Markers
  SafePathState.pois.police.forEach(p => {
    const policeMarker = L.marker([p.lat, p.lng], {
      icon: L.divIcon({
        html: '<div class="map-dot-police" style="background-color:#2563EB; color:#FFF; border-radius:50%; width:24px; height:24px; display:flex; align-items:center; justify-content:center; border:2px solid #FFF; box-shadow:0 2px 5px rgba(0,0,0,0.3)"><i class="fa-solid fa-building-shield" style="font-size:0.65rem"></i></div>',
        className: 'marker-police-station',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    }).bindPopup(`<strong>Police Hub:</strong> ${p.name}`).addTo(map);
    SafePathState.activeMarkers.push(policeMarker);
  });

  // Hospital Markers
  SafePathState.pois.hospitals.forEach(h => {
    const hospMarker = L.marker([h.lat, h.lng], {
      icon: L.divIcon({
        html: '<div class="map-dot-hosp" style="background-color:#EF4444; color:#FFF; border-radius:50%; width:24px; height:24px; display:flex; align-items:center; justify-content:center; border:2px solid #FFF; box-shadow:0 2px 5px rgba(0,0,0,0.3)"><i class="fa-solid fa-house-medical" style="font-size:0.65rem"></i></div>',
        className: 'marker-hospital',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    }).bindPopup(`<strong>Safe Medical Hub:</strong> ${h.name}`).addTo(map);
    SafePathState.activeMarkers.push(hospMarker);
  });

  // Streetlight markers
  SafePathState.pois.lights.forEach(l => {
    const lightMarker = L.marker([l.lat, l.lng], {
      icon: L.divIcon({
        html: '<div class="map-dot-light" style="background-color:#F59E0B; color:#FFF; border-radius:50%; width:18px; height:18px; display:flex; align-items:center; justify-content:center; border:2px solid #FFF; box-shadow:0 2px 3px rgba(0,0,0,0.2)"><i class="fa-solid fa-lightbulb" style="font-size:0.5rem"></i></div>',
        className: 'marker-light',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      })
    }).bindPopup(`<strong>Active Streetlight:</strong> Luminosity Level: 94%`).addTo(map);
    SafePathState.activeMarkers.push(lightMarker);
  });

  // 3. Draw Community Reports (Verified & Pending)
  SafePathState.reports.forEach(report => {
    if (report.status === "Dismissed") return;
    
    let color = "#F59E0B"; // Amber
    let icon = "fa-lightbulb";
    if (report.type === "Harassment" || report.type === "Suspicious Activity") {
      color = "#EF4444"; // Red
      icon = "fa-triangle-exclamation";
    }

    const hazardMarker = L.marker([report.lat, report.lng], {
      icon: L.divIcon({
        html: `<div style="background-color:${color}; color:#FFF; border-radius:50%; width:26px; height:26px; display:flex; align-items:center; justify-content:center; border:2px solid #FFF; box-shadow:0 2px 6px rgba(0,0,0,0.3)"><i class="fa-solid ${icon}" style="font-size:0.7rem"></i></div>`,
        className: 'marker-hazard',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      })
    }).bindPopup(`
      <div style="font-family:var(--font-primary); font-size:0.8rem">
        <strong>${report.type} (${report.status})</strong><br>
        <span style="color:#6B7280; font-size:0.7rem">${report.location} &bull; ${report.timestamp}</span><br>
        <p style="margin-top:0.4rem; line-height:1.35">${report.description}</p>
      </div>
    `).addTo(map);

    SafePathState.activeMarkers.push(hazardMarker);
  });

  // 4. Draw Safety routes
  drawRoutePolylines();
}

function drawRoutePolylines() {
  const map = SafePathState.currentMap;
  if (!map) return;

  const routeStyles = {
    safest: { color: "var(--color-accent)", weight: 7, opacity: 0.95 },
    shortest: { color: "var(--color-danger)", weight: 5, opacity: 0.7, dashArray: "5, 10" },
    alternative: { color: "var(--color-warning)", weight: 5, opacity: 0.75 }
  };

  for (let key in ROUTE_PATHS) {
    const polyline = L.polyline(ROUTE_PATHS[key], routeStyles[key]).addTo(map);
    
    // Add popups
    if (key === 'safest') {
      polyline.bindPopup("<strong>AI Safest Route:</strong> Highly illuminated, 0 incidents active, active patrols.");
    } else if (key === 'shortest') {
      polyline.bindPopup("<strong>Shortest Route:</strong> Crosses dark unlit lanes, crime records reported.");
    } else {
      polyline.bindPopup("<strong>Alternative Path:</strong> Medium lighting, higher pedestrian crowd.");
    }

    SafePathState.activeRoutes[key] = polyline;
  }

  // Set default view limits
  if (SafePathState.routeLoaded) {
    map.fitBounds(L.polyline([
      [SafePathState.coordinates.start.lat, SafePathState.coordinates.start.lng],
      [SafePathState.coordinates.end.lat, SafePathState.coordinates.end.lng]
    ]).getBounds(), { padding: [40, 40] });
  }
}

function setupMapEventListeners() {
  // Layer filter toggles
  document.getElementById("toggle-layer-heatmap").addEventListener("click", (e) => {
    e.currentTarget.classList.toggle("active");
    alert("Vulnerability Heatmap Overlay toggled on map layer.");
  });

  document.getElementById("toggle-layer-police").addEventListener("click", (e) => {
    const isActive = e.currentTarget.classList.toggle("active");
    toggleMarkersByClass("marker-police-station", isActive);
  });

  document.getElementById("toggle-layer-hospitals").addEventListener("click", (e) => {
    const isActive = e.currentTarget.classList.toggle("active");
    toggleMarkersByClass("marker-hospital", isActive);
  });

  document.getElementById("toggle-layer-lights").addEventListener("click", (e) => {
    const isActive = e.currentTarget.classList.toggle("active");
    toggleMarkersByClass("marker-light", isActive);
  });
}

function toggleMarkersByClass(className, show) {
  const elements = document.getElementsByClassName(className);
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = show ? "block" : "none";
  }
}

function highlightRouteOnMap(selectedRouteId) {
  for (let key in SafePathState.activeRoutes) {
    const routeLine = SafePathState.activeRoutes[key];
    if (key === selectedRouteId) {
      routeLine.setStyle({ weight: 9, opacity: 1 });
      routeLine.bringToFront();
    } else {
      routeLine.setStyle({ weight: 4, opacity: 0.4 });
    }
  }
}

/* ==================== ROUTE SELECTION & GPS SIMULATION ==================== */
function initRoutingEvents() {
  const routeCards = document.querySelectorAll(".route-option-card");
  routeCards.forEach(card => {
    card.addEventListener("click", () => {
      routeCards.forEach(c => c.classList.remove("active-route"));
      card.classList.add("active-route");
      
      SafePathState.routeLoaded = true;
      const routeId = card.getAttribute("data-route-id");
      highlightRouteOnMap(routeId);
    });
  });

  // Calculate button recalculates mock coordinates
  const calcRouteBtn = document.getElementById("btn-calculate-routes");
  calcRouteBtn.addEventListener("click", () => {
    const startPoint = document.getElementById("route-start").value || "Rajiv Chowk Metro Station";
    const endPoint = document.getElementById("route-end").value || "Mandi House Metro Station";

    const pulseLoadingBadge = document.querySelector(".status-dot");
    pulseLoadingBadge.style.backgroundColor = "var(--color-warning)";
    document.querySelector(".status-text").textContent = "Recalculating Routes...";

    setTimeout(() => {
      pulseLoadingBadge.style.backgroundColor = "var(--color-accent)";
      document.querySelector(".status-text").textContent = "AI Systems Online";
      
      // Update label texts in journey monitor
      document.getElementById("lbl-start-pt").textContent = startPoint.split(' ')[0] + " Station";
      document.getElementById("lbl-end-pt").textContent = endPoint.split(' ')[0] + " Station";

      alert(`AI computed 3 alternative routes to: "${endPoint}". Comparison cards populated.`);
      SafePathState.routeLoaded = true;
      renderPoisAndRoutes();
    }, 1200);
  });

  // Start active journey button
  const startTrackingBtn = document.getElementById("btn-start-tracking-from-map");
  startTrackingBtn.addEventListener("click", () => {
    if (SafePathState.isTrackingActive) {
      // Toggle button acts as Stop tracking
      cancelJourney();
      return;
    }
    
    // Identify which route card is active
    const activeRouteCard = document.querySelector(".route-option-card.active-route");
    const routeId = activeRouteCard ? activeRouteCard.getAttribute("data-route-id") : 'safest';
    
    // Set simulator path coordinates
    SafePathState.gpsSimulationPath = ROUTE_PATHS[routeId] || ROUTE_PATHS.safest;
    SafePathState.isTrackingActive = true;

    // UI modifications
    startTrackingBtn.textContent = "Stop Monitoring";
    startTrackingBtn.className = "btn btn-danger btn-sm";
    document.getElementById("btn-simulate-gps-step").removeAttribute("disabled");
    document.getElementById("btn-cancel-journey").removeAttribute("disabled");
    document.getElementById("journey-state-badge").className = "badge badge-pulse bg-danger-soft text-danger";
    document.getElementById("journey-state-badge").innerHTML = "<span class=\"pulse-dot\" style=\"background-color:var(--color-danger)\"></span> Tracking Active";

    startGpsSimulation();
  });

  document.getElementById("btn-simulate-gps-step").addEventListener("click", stepTrackingSimulation);
  document.getElementById("btn-cancel-journey").addEventListener("click", () => {
    if (confirm("Are you sure you want to cancel the tracking session?")) {
      cancelJourney();
    }
  });
}

function startGpsSimulation() {
  const map = SafePathState.currentMap;
  if (!map) return;

  // Clear existing simulation elements
  if (SafePathState.trackingMarker) map.removeLayer(SafePathState.trackingMarker);
  if (SafePathState.trackingPathLine) map.removeLayer(SafePathState.trackingPathLine);

  SafePathState.trackingProgressStep = 0;
  const coords = SafePathState.gpsSimulationPath.length > 0 ? SafePathState.gpsSimulationPath : ROUTE_PATHS.safest;

  // Draw active path guide line
  SafePathState.trackingPathLine = L.polyline(coords, { color: "var(--color-secondary)", weight: 8, opacity: 0.8 }).addTo(map);

  // Dynamic user tracking pin
  const userPinIcon = L.divIcon({
    html: '<div style="background-color:var(--color-secondary); border:3px solid #FFF; width:18px; height:18px; border-radius:50%; box-shadow:0 0 10px rgba(37,99,235,0.6); position:relative"><div style="position:absolute; width:100%; height:100%; border-radius:50%; background-color:rgba(37,99,235,0.3); animation:hazard-wave 1.5s infinite"></div></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  const startCoords = coords[0];
  SafePathState.trackingMarker = L.marker(startCoords, { icon: userPinIcon }).addTo(map);
  map.setView(startCoords, 16);

  // Setup timeline logger
  const timelineLogs = document.getElementById("tracking-timeline-logs");
  timelineLogs.innerHTML = `
    <div style="font-size:0.75rem; color:var(--color-text); margin-bottom:0.25rem;">
      <strong>Just Now:</strong> Journey tracking initialized. Safety index optimal.
    </div>
  `;

  updateTrackingMetrics(0, coords.length);
}

function stepTrackingSimulation() {
  const coords = SafePathState.gpsSimulationPath.length > 0 ? SafePathState.gpsSimulationPath : ROUTE_PATHS.safest;
  let currentStep = SafePathState.trackingProgressStep + 1;

  if (currentStep >= coords.length) {
    alert("You have reached your destination safely!");
    
    const timelineLogs = document.getElementById("tracking-timeline-logs");
    timelineLogs.insertAdjacentHTML('afterbegin', `
      <div style="font-size:0.75rem; color:var(--color-accent); margin-bottom:0.25rem;">
        <strong>Completed:</strong> Destination reached. Journey completed safely.
      </div>
    `);
    
    document.getElementById("journey-progress-fill").style.width = "100%";
    document.getElementById("tracking-percentage").textContent = "100%";
    document.getElementById("tracking-eta").textContent = "0 mins";
    document.getElementById("tracking-distance").textContent = "0.0 km";

    // Disable step button
    document.getElementById("btn-simulate-gps-step").setAttribute("disabled", "true");
    return;
  }

  SafePathState.trackingProgressStep = currentStep;
  const nextCoords = coords[currentStep];

  // Move marker pin on map
  if (SafePathState.trackingMarker) {
    SafePathState.trackingMarker.setLatLng(nextCoords);
    SafePathState.currentMap.panTo(nextCoords);
  }

  // Update metrics
  updateTrackingMetrics(currentStep, coords.length);

  // Add timeline logs
  const timelineLogs = document.getElementById("tracking-timeline-logs");
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  let checkpointMsg = `Passed waypoint segment ${currentStep}. Lighting stable.`;
  if (currentStep === coords.length - 1) {
    checkpointMsg = "Arrived at destination zone. Access checkpoints verified.";
  }

  timelineLogs.insertAdjacentHTML('afterbegin', `
    <div style="font-size:0.75rem; color:var(--color-text); margin-bottom:0.25rem;">
      <strong>${timeStr}:</strong> ${checkpointMsg}
    </div>
  `);
}

function updateTrackingMetrics(step, totalSteps) {
  const ratio = (step / (totalSteps - 1)) * 100;
  document.getElementById("journey-progress-fill").style.width = `${ratio}%`;
  document.getElementById("tracking-percentage").textContent = `${Math.round(ratio)}%`;

  // Estimate decreasing ETA
  const baseEta = 12; // mins
  const etaRemaining = Math.max(0, Math.round(baseEta * (1 - step / (totalSteps - 1))));
  document.getElementById("tracking-eta").textContent = `${etaRemaining} mins`;

  // Distance decreasing
  const baseDist = 3.4; // km
  const distRemaining = Math.max(0, (baseDist * (1 - step / (totalSteps - 1)))).toFixed(1);
  document.getElementById("tracking-distance").textContent = `${distRemaining} km`;
  
  // Risk indicator
  const riskElement = document.getElementById("tracking-risk");
  if (step === 0) {
    riskElement.textContent = "Optimal";
    riskElement.className = "metric-value font-weight-700 text-lg text-green";
  } else if (step === 1) {
    riskElement.textContent = "Moderate";
    riskElement.className = "metric-value font-weight-700 text-lg text-warning";
  } else {
    riskElement.textContent = "Secure";
    riskElement.className = "metric-value font-weight-700 text-lg text-green";
  }
}

function resetTrackingState() {
  document.getElementById("journey-progress-fill").style.width = "0%";
  document.getElementById("tracking-percentage").textContent = "0%";
  document.getElementById("tracking-eta").textContent = "-- min";
  document.getElementById("tracking-distance").textContent = "-- km";
  document.getElementById("tracking-risk").textContent = "Optimal";
  document.getElementById("tracking-risk").className = "metric-value font-weight-700 text-lg text-green";
  document.getElementById("tracking-timeline-logs").innerHTML = `
    <div class="p-2 text-center text-xs text-secondary">No active journey. Calculate route and click "Start Monitoring" above.</div>
  `;
  
  const startBtn = document.getElementById("btn-start-tracking-from-map");
  startBtn.textContent = "Start Monitoring";
  startBtn.className = "btn btn-secondary btn-sm";
  
  document.getElementById("btn-simulate-gps-step").setAttribute("disabled", "true");
  document.getElementById("btn-cancel-journey").setAttribute("disabled", "true");
  
  document.getElementById("journey-state-badge").className = "badge badge-pulse bg-green-soft text-green";
  document.getElementById("journey-state-badge").innerHTML = "<span class=\"pulse-dot\"></span> Monitor Ready";
}

function cancelJourney() {
  SafePathState.isTrackingActive = false;
  resetTrackingState();
  if (SafePathState.currentMap) {
    renderPoisAndRoutes();
  }
}

/* ==================== COMMUNITY REPORTING HAZARDS ==================== */
function initReportingPanel() {
  const form = document.getElementById("incident-report-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const type = document.getElementById("report-incident-type").value;
    const locationName = document.getElementById("report-location-select").value;
    const description = document.getElementById("report-description").value;

    let lat = 28.6280;
    let lng = 77.2250;
    if (locationName === "Connaught Lane Crossing") { lat = 28.6265; lng = 77.2200; }
    else if (locationName === "Middle Circle Alleyway") { lat = 28.6290; lng = 77.2215; }
    else if (locationName === "Barakhamba Crossroad") { lat = 28.6280; lng = 77.2255; }
    else if (locationName === "Janpath Metro Gate 2") { lat = 28.6250; lng = 77.2210; }
    else if (locationName === "KG Marg Boulevard") { lat = 28.6272; lng = 77.2235; }

    const newReport = {
      id: SafePathState.reports.length + 1,
      type,
      location: locationName,
      description,
      status: "Pending",
      timestamp: "Just Now",
      lat,
      lng
    };

    SafePathState.reports.push(newReport);
    localStorage.setItem("safepath_reports", JSON.stringify(SafePathState.reports));

    form.reset();
    alert("Report submitted successfully! The AI engine has queued the warning for verification. Your update will display as Pending.");

    renderVerifiedNeighborhoodReports();
    updateLocalSafetyScore();
    if (SafePathState.currentMap) renderPoisAndRoutes();
  });

  renderVerifiedNeighborhoodReports();
  updateLocalSafetyScore();
}

function renderVerifiedNeighborhoodReports() {
  const container = document.getElementById("reports-main-list");
  if (!container) return;

  container.innerHTML = '';

  // Render only verified/resolved reports in commuter feed
  const visibleReports = SafePathState.reports.filter(r => r.status === "Verified" || r.status === "Resolved" || r.status === "Pending");

  if (visibleReports.length === 0) {
    container.innerHTML = `<div class="p-2 text-center text-xs text-secondary">No recent safety hazards reported.</div>`;
    return;
  }

  [...visibleReports].reverse().forEach(report => {
    const div = document.createElement("div");
    div.style.padding = "0.5rem";
    div.style.borderBottom = "1px solid var(--color-border)";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.gap = "0.15rem";
    
    let statusColor = "var(--color-warning)";
    if (report.status === "Verified") statusColor = "var(--color-accent)";
    if (report.status === "Resolved") statusColor = "var(--color-secondary)";

    div.innerHTML = `
      <div class="flex-between">
        <span style="font-weight:600; font-size:0.75rem; color:var(--color-primary);">${report.type}</span>
        <span style="font-size:0.65rem; padding:0.1rem 0.3rem; border-radius:4px; background-color:rgba(0,0,0,0.05); color:${statusColor}; font-weight:700">${report.status}</span>
      </div>
      <p style="font-size:0.7rem; color:var(--color-text-secondary); margin:0">${report.description}</p>
      <div class="flex-between" style="font-size:0.65rem; color:var(--color-text-secondary); opacity:0.8">
        <span><i class="fa-solid fa-location-dot" style="font-size:0.6rem"></i> ${report.location}</span>
        <span>${report.timestamp}</span>
      </div>
    `;
    container.appendChild(div);
  });
}

function updateLocalSafetyScore() {
  const scoreElement = document.getElementById("overview-safety-score");
  if (!scoreElement) return;

  const pendingCount = SafePathState.reports.filter(r => r.status !== 'Resolved').length;
  let baseScore = 9.8;
  let deduction = pendingCount * 0.4;
  let finalScore = Math.max(1.0, (baseScore - deduction)).toFixed(1);

  scoreElement.textContent = finalScore;

  const circle = document.querySelector(".score-circle");
  const label = document.querySelector(".score-label");
  if (!circle || !label) return;

  if (finalScore >= 8.5) {
    circle.style.background = `conic-gradient(var(--color-accent) ${finalScore * 10}%, #E2E8F0 ${finalScore * 10}%)`;
    label.textContent = "Safe Zone";
    label.style.color = "var(--color-accent)";
  } else if (finalScore >= 6.0) {
    circle.style.background = `conic-gradient(var(--color-warning) ${finalScore * 10}%, #E2E8F0 ${finalScore * 10}%)`;
    label.textContent = "Caution";
    label.style.color = "var(--color-warning)";
  } else {
    circle.style.background = `conic-gradient(var(--color-danger) ${finalScore * 10}%, #E2E8F0 ${finalScore * 10}%)`;
    label.textContent = "High Risk";
    label.style.color = "var(--color-danger)";
  }
}

/* ==================== EMERGENCY SOS PANIC SHIELD ==================== */
function initSOSPanel() {
  const massiveSosBtn = document.getElementById("btn-massive-sos");
  const sosBanner = document.getElementById("sos-active-banner");
  const deactivateBtn = document.getElementById("btn-deactivate-sos");

  if (!massiveSosBtn) return;

  massiveSosBtn.addEventListener("click", () => {
    SafePathState.isSOSActive = true;
    sosBanner.classList.add("active");
    
    // Change top status indicator to RED
    document.querySelector(".status-dot").style.backgroundColor = "var(--color-danger)";
    document.querySelector(".status-text").textContent = "EMERGENCY BROADCAST ACTIVE";
    
    alert("SOS TRIGGERED! Coordinates and live emergency feeds are streaming to nearby dispatch centers.");
  });

  deactivateBtn.addEventListener("click", () => {
    SafePathState.isSOSActive = false;
    sosBanner.classList.remove("active");
    
    document.querySelector(".status-dot").style.backgroundColor = "var(--color-accent)";
    document.querySelector(".status-text").textContent = "AI Systems Online";
    alert("Emergency SOS broadcast deactivated. Live feed ended.");
  });

  document.getElementById("btn-emergency-family").addEventListener("click", () => {
    alert("Dialing family contact: +91 98765 43210...");
  });

  document.getElementById("btn-emergency-share-gps").addEventListener("click", () => {
    alert("Live GPS coordinates shared: Lat: 28.6304, Lng: 77.2177. Web tracking link copied to clipboard.");
  });
}

/* ==================== AI SAFETY CHATBOT ==================== */
function initChatbot() {
  const chatForm = document.getElementById("chat-input-form");
  const chatContainer = document.getElementById("chat-messages-container");
  const chatInput = document.getElementById("chat-text-input");

  if (!chatForm) return;

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const question = chatInput.value.trim();
    if (!question) return;

    appendChatMessage("user", question);
    chatInput.value = '';

    setTimeout(() => {
      const reply = generateBotReply(question);
      appendChatMessage("bot", reply);
    }, 700);
  });

  const chips = document.querySelectorAll(".query-chip");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const question = chip.getAttribute("data-question");
      appendChatMessage("user", question);
      setTimeout(() => {
        const reply = generateBotReply(question);
        appendChatMessage("bot", reply);
      }, 700);
    });
  });

  document.getElementById("btn-clear-chat").addEventListener("click", () => {
    chatContainer.innerHTML = '';
    appendChatMessage("bot", "Hello! I am your SafePath AI helper. Ask me about routes, nearest safe havens, or night travel tips.");
  });
}

function appendChatMessage(sender, text) {
  const container = document.getElementById("chat-messages-container");
  if (!container) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-message ${sender}`;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  msgDiv.innerHTML = `
    <div class="message-content">
      <p>${text}</p>
    </div>
    <span class="message-time">${timeStr}</span>
  `;

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function generateBotReply(userInput) {
  const text = userInput.toLowerCase();

  if (text.includes("route") && (text.includes("mandi") || text.includes("house") || text.includes("library"))) {
    return "Checking route safety to Mandi House Metro Station... I recommend taking **KG Marg Boulevard** (Safety: 9.8/10). The shortest route via Middle Circle Alleyway has active reports of poor lighting and loitering.";
  }
  
  if (text.includes("police") || text.includes("precinct") || text.includes("cops")) {
    return "The nearest police station is **Connaught Place Police Station** at [28.6295, 77.2185], just 150m from Rajiv Chowk Metro Station. Dial 100 for police assistance.";
  }

  if (text.includes("lighting") || text.includes("light") || text.includes("connaught")) {
    return "Connaught Lane Crossing lighting is resolved. However, **Middle Circle Alleyway** is marked as poorly illuminated. Commuters are routed around it.";
  }

  if (text.includes("night") || text.includes("tips") || text.includes("advice")) {
    return "💡 **Night Travel Safety Tips:**<br>1. Stick to green-highlighted routes on the map.<br>2. Enable live GPS sharing in the SOS shield.<br>3. Keep your phone in hand and stay alert.<br>4. Avoid dark, empty alleyways.";
  }

  if (text.includes("emergency") || text.includes("help") || text.includes("danger")) {
    return "Emergency Services: Police (100), Ambulance (102), Women's Helpline (1091). Nearest medical facility is **Mandi House First Aid Clinic** at [28.6250, 77.2310].";
  }

  return "I have cataloged your safety query. Stick to lit paths, check local safety scores, and use the Emergency SOS Panic button in the left panel if you feel in danger.";
}
