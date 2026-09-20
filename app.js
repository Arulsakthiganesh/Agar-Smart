/**
 * Smart Solar-Powered Agarbatti Drying & Packaging System
 * Web Management & IoT Portal Engine
 */

// ==========================================
// 1. VIEW SWITCHER ROUTER
// ==========================================
function switchView(viewId, navElement) {
  // Hide all view sections
  const sections = document.querySelectorAll('.view-section');
  sections.forEach(sec => sec.classList.remove('active'));

  // Show target section
  const targetSec = document.getElementById(`view-${viewId}`);
  if (targetSec) targetSec.classList.add('active');

  // Update navigation highlighting
  const navItems = document.querySelectorAll('.sidebar-menu .nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  const activeNav = navElement || document.querySelector(`.sidebar-menu [data-view="${viewId}"]`);
  if (activeNav) activeNav.classList.add('active');

  // Update page header title
  const titles = {
    dashboard: 'Real-Time Monitoring Dashboard',
    machines: 'Registered IoT Agarbatti Dryers',
    batches: 'Batch Drying & Packaging History',
    analytics: 'Production & Solar Energy Analytics',
    alerts: 'System Security & Alert Logs',
    settings: 'SHG Artisan Profile & System Settings'
  };

  const titleElem = document.getElementById('page-title');
  if (titleElem) titleElem.innerText = titles[viewId] || 'Solar Agarbatti Hub';
}

// ==========================================
// 2. LOCALIZATION DICTIONARY (EN, TA, HI)
// ==========================================
const translations = {
  en: {
    title: "Solar Agarbatti Hub",
    subtitle: "Smart Solar Drying & Packaging System",
    connected: "ESP32 BLE Connected",
    drying: "1. Drying Phase",
    start: "START DRYING",
    pause: "PAUSE",
    stop: "STOP",
    emergency: "EMERGENCY STOP",
  },
  ta: {
    title: "சூரிய ஒளி அகர்பத்தி மையம்",
    subtitle: "சூரிய மின்சார உலர்த்தல் & பேக்கிங் அமைப்பு",
    connected: "ESP32 புளூடூத் இணைக்கப்பட்டது",
    drying: "1. உலர்த்தும் நிலை",
    start: "உலர்த்தலைத் தொடங்கு",
    pause: "இடைநிறுத்து",
    stop: "நிறுத்து",
    emergency: "அவசர நிறுத்தம்",
  },
  hi: {
    title: "सोलर अगरबत्ती हब",
    subtitle: "स्मार्ट सोलर सुखाने और पैकिंग प्रणाली",
    connected: "ESP32 ब्लूटूथ कनेक्टेड",
    drying: "1. सुखाने का चरण",
    start: "सुखाना शुरू करें",
    pause: "विराम लें",
    stop: "रोकें",
    emergency: "आपातकालीन रोक",
  }
};

function changeLanguage(lang) {
  const t = translations[lang] || translations.en;

  document.getElementById('status-text').innerText = t.connected;
  document.getElementById('current-stage-badge').innerText = t.drying;
  document.getElementById('btn-start').innerHTML = `<i class="fa-solid fa-play"></i> ${t.start}`;
  document.getElementById('btn-pause').innerHTML = `<i class="fa-solid fa-pause"></i> ${t.pause}`;
  document.getElementById('btn-stop').innerHTML = `<i class="fa-solid fa-stop"></i> ${t.stop}`;
  document.getElementById('btn-emergency').innerHTML = `<i class="fa-solid fa-power-off"></i> ${t.emergency}`;
}

// ==========================================
// 3. ACCESSIBILITY & THEME TOGGLE
// ==========================================
function toggleTheme() {
  document.body.classList.toggle('light-theme');
  const btn = document.getElementById('theme-toggle');
  if (document.body.classList.contains('light-theme')) {
    btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
}

// ==========================================
// 4. TELEMETRY & SYSTEM STATE
// ==========================================
let systemState = {
  isRunning: true,
  isPaused: false,
  currentStage: 'drying',
  targetTemp: 45,
  targetHumidity: 20,
  temperature: 38.5,
  humidity: 24.2,
  batteryPct: 88,
  batteryVolts: 25.4,
  solarVolts: 34.2,
  solarWatts: 180,
  smokeDetected: false,
  smokeVal: 0,
  fanSpeed: 80,
};

let liveChart = null;
let pieChart = null;
const maxDataPoints = 15;
const chartTimeLabels = [];
const tempChartData = [];
const humChartData = [];

function initCharts() {
  const ctxLine = document.getElementById('liveTelemetryChart')?.getContext('2d');
  if (!ctxLine) return;
  
  const now = new Date();
  for (let i = maxDataPoints - 1; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 5000);
    chartTimeLabels.push(t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tempChartData.push(+(32 + Math.sin(i) * 3).toFixed(1));
    humChartData.push(+(30 - i * 0.4).toFixed(1));
  }

  liveChart = new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: chartTimeLabels,
      datasets: [
        {
          label: 'Chamber Temp (°C)',
          data: tempChartData,
          borderColor: '#f57c00',
          backgroundColor: 'rgba(245, 124, 0, 0.15)',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
        },
        {
          label: 'Moisture (%)',
          data: humChartData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
      },
      plugins: { legend: { display: false } }
    }
  });

  const ctxPie = document.getElementById('energySplitChart')?.getContext('2d');
  if (ctxPie) {
    pieChart = new Chart(ctxPie, {
      type: 'doughnut',
      data: {
        labels: ['Solar Panel', 'Battery Storage', 'Grid Backup'],
        datasets: [{
          data: [78, 18, 4],
          backgroundColor: ['#ffd54f', '#10b981', '#64748b'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { color: '#94a3b8', font: { size: 11 } } }
        }
      }
    });
  }
}

function updateGauges() {
  const tempGaugeCircle = document.getElementById('temp-gauge-circle');
  if (tempGaugeCircle) {
    document.getElementById('temp-value').innerText = systemState.temperature.toFixed(1);
    const tempNorm = Math.min(1.0, Math.max(0.0, (systemState.temperature - 10) / 60));
    tempGaugeCircle.style.strokeDashoffset = 251.2 * (1 - tempNorm);
  }

  const humGaugeCircle = document.getElementById('hum-gauge-circle');
  if (humGaugeCircle) {
    document.getElementById('hum-value').innerText = systemState.humidity.toFixed(1);
    const humNorm = Math.min(1.0, Math.max(0.0, systemState.humidity / 100));
    humGaugeCircle.style.strokeDashoffset = 251.2 * (1 - humNorm);
  }

  if (document.getElementById('battery-pct')) {
    document.getElementById('battery-pct').innerText = `${systemState.batteryPct.toFixed(0)} %`;
    document.getElementById('battery-voltage').innerText = `${systemState.batteryVolts.toFixed(1)} V LiFePO4`;
    document.getElementById('battery-bar').style.width = `${systemState.batteryPct}%`;

    document.getElementById('solar-wattage').innerText = `${systemState.solarWatts.toFixed(0)} W`;
    document.getElementById('solar-voltage').innerText = `${systemState.solarVolts.toFixed(1)} V Direct`;

    document.getElementById('smoke-val').innerText = `${systemState.smokeVal} (Safe)`;
    document.getElementById('fan-speed').innerText = `${systemState.fanSpeed}% Speed`;
    document.getElementById('last-updated-time').innerText = `Last update: ${new Date().toLocaleTimeString()}`;
  }
}

function runRealtimeSimulationLoop() {
  setInterval(() => {
    if (systemState.isRunning && !systemState.isPaused) {
      if (systemState.temperature < systemState.targetTemp) {
        systemState.temperature += (Math.random() * 0.4);
      } else {
        systemState.temperature -= (Math.random() * 0.3);
      }

      if (systemState.humidity > systemState.targetHumidity) {
        systemState.humidity -= (Math.random() * 0.3);
      } else {
        if (systemState.currentStage === 'drying') {
          setStage('cooling');
        }
      }
    }

    systemState.solarVolts = +(32.0 + Math.random() * 4.0).toFixed(1);
    systemState.solarWatts = +(systemState.solarVolts * 5.2).toFixed(0);

    updateGauges();

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    chartTimeLabels.shift();
    chartTimeLabels.push(timeStr);
    tempChartData.shift();
    tempChartData.push(+systemState.temperature.toFixed(1));
    humChartData.shift();
    humChartData.push(+systemState.humidity.toFixed(1));

    if (liveChart) liveChart.update('none');

    if (systemState.temperature > 60.0) {
      triggerHighTempAlert();
    }
  }, 3000);
}

// ==========================================
// 5. CONTROLS & MACHINE REGISTRATION
// ==========================================
function setStage(stage) {
  systemState.currentStage = stage;
  const stages = ['drying', 'cooling', 'fragrance', 'packing'];
  const stageLabels = {
    drying: '1. Drying Phase',
    cooling: '2. Cooling Phase',
    fragrance: '3. Fragrance Spray',
    packing: '4. Packaging Phase'
  };

  const badge = document.getElementById('current-stage-badge');
  if (badge) badge.innerText = stageLabels[stage];

  stages.forEach((s) => {
    const el = document.getElementById(`step-${s}`);
    if (el) el.classList.remove('active');
  });

  const activeEl = document.getElementById(`step-${stage}`);
  if (activeEl) activeEl.classList.add('active');

  const idx = stages.indexOf(stage);
  const fillPct = ((idx + 1) / 4) * 100;
  const fillBar = document.getElementById('stage-progress-fill');
  if (fillBar) fillBar.style.width = `${fillPct}%`;
}

function startDryingCycle() {
  systemState.isRunning = true;
  systemState.isPaused = false;
  setStage('drying');

  const banner = document.getElementById('main-status-banner');
  banner.className = 'status-banner active';
  document.getElementById('status-icon').className = 'fa-solid fa-circle-play';
  document.getElementById('banner-state-title').innerText = 'SYSTEM ACTIVE — DRYING BATCH';
  document.getElementById('banner-state-desc').innerText = `Target Temp: ${systemState.targetTemp}°C • Target Humidity: ${systemState.targetHumidity}%`;
}

function pauseCycle() {
  systemState.isPaused = true;
  const banner = document.getElementById('main-status-banner');
  banner.className = 'status-banner';
  document.getElementById('banner-state-title').innerText = 'SYSTEM PAUSED';
}

function stopCycle() {
  systemState.isRunning = false;
  systemState.isPaused = false;
  const banner = document.getElementById('main-status-banner');
  banner.className = 'status-banner';
  document.getElementById('status-icon').className = 'fa-solid fa-circle-stop';
  document.getElementById('banner-state-title').innerText = 'SYSTEM IDLE / READY';
}

function updateTempSliderValue(val) {
  systemState.targetTemp = parseFloat(val);
  document.getElementById('temp-slider-val').innerText = `${val}°C`;
}

function updateHumSliderValue(val) {
  systemState.targetHumidity = parseFloat(val);
  document.getElementById('hum-slider-val').innerText = `${val}%`;
}

// Machine Registration
function openRegisterMachineModal() {
  document.getElementById('register-machine-modal').classList.remove('hidden');
}

function closeRegisterMachineModal() {
  document.getElementById('register-machine-modal').classList.add('hidden');
}

function saveNewMachine() {
  const name = document.getElementById('reg-mch-name').value || 'SHG Solar Dryer';
  const serial = document.getElementById('reg-mch-serial').value || 'AGAR-2026-NEW';
  const loc = document.getElementById('reg-mch-loc').value || 'SHG Center';

  const container = document.getElementById('machines-container');
  const cardHtml = `
    <div class="card machine-card">
      <div class="machine-head">
        <div class="machine-icon"><i class="fa-solid fa-solar-panel"></i></div>
        <div>
          <h4>${name} (${loc})</h4>
          <small>Serial: ${serial}</small>
        </div>
        <span class="tag-status green">ACTIVE</span>
      </div>
      <div class="machine-metrics">
        <div><span>Chamber Temp</span><strong>35.0°C</strong></div>
        <div><span>Moisture</span><strong>30.0%</strong></div>
        <div><span>Power</span><strong>Solar 150W</strong></div>
      </div>
      <div class="machine-actions">
        <button class="btn btn-secondary btn-sm" onclick="switchView('dashboard', document.querySelector('[data-view=dashboard]'))">Monitor Live</button>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', cardHtml);
  closeRegisterMachineModal();
  alert(`Registered machine "${name}" successfully!`);
}

// Export CSV Batches Report
function exportBatchesCSV() {
  const csvContent = "data:text/csv;charset=utf-8," 
    + "Batch ID,Machine,Duration,Packets Produced,Final Moisture,Quality Score,Energy Source,Date\n"
    + "#BATCH-401,Madurai Hub #1,42 min,450,18.5%,9.5/10,Solar (82%),2026-09-04\n"
    + "#BATCH-400,Madurai Hub #1,45 min,420,19.0%,9.2/10,Solar (78%),2026-09-03\n"
    + "#BATCH-399,Dindigul Unit #2,50 min,380,20.0%,8.8/10,Solar (70%),2026-09-03\n";

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "agarbatti_batches_report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Emergency Modal
function openEmergencyModal() {
  document.getElementById('emergency-modal').classList.remove('hidden');
}

function closeEmergencyModal() {
  document.getElementById('emergency-modal').classList.add('hidden');
}

function confirmEmergencyShutdown() {
  closeEmergencyModal();
  stopCycle();
  const alertBanner = document.getElementById('critical-alert-banner');
  if (alertBanner) alertBanner.classList.remove('hidden');
}

function triggerHighTempAlert() {
  const alertBanner = document.getElementById('critical-alert-banner');
  if (alertBanner) alertBanner.classList.remove('hidden');
}

function acknowledgeAlert() {
  const alertBanner = document.getElementById('critical-alert-banner');
  if (alertBanner) alertBanner.classList.add('hidden');
}

function triggerManualSync() {
  alert('Offline SQLite database synced successfully to Node.js backend!');
  document.getElementById('offline-badge').classList.add('hidden');
}

function handleHashRoute() {
  const hash = window.location.hash.replace('#', '') || 'dashboard';
  const validViews = ['dashboard', 'machines', 'batches', 'analytics', 'alerts', 'settings'];
  const viewId = validViews.includes(hash) ? hash : 'dashboard';
  const navElem = document.querySelector(`.sidebar-menu [data-view="${viewId}"]`);
  switchView(viewId, navElem);
}

window.addEventListener('hashchange', handleHashRoute);

window.addEventListener('DOMContentLoaded', () => {
  initCharts();
  updateGauges();
  runRealtimeSimulationLoop();
  handleHashRoute();

  // Close modals on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.add('hidden');
      }
    });
  });
});

