/* ==================== GLOBAL ADMIN STATE ==================== */
const AdminState = {
  activeTab: 'overview',
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
  users: [
    { name: "Pooja Sharma", email: "pooja.sharma@safepath.in", role: "Commuter", access: "Standard", status: "Active" },
    { name: "Inspector Rawat", email: "k.rawat@delhipolice.gov.in", role: "Police Dispatch", access: "Regional Operator", status: "Active" },
    { name: "Meera Sen", email: "meera.sen@ndmc.gov.in", role: "Municipal Inspector", access: "Regional Operator", status: "Active" },
    { name: "Admin SAKTHI", email: "sakthi@safepath.in", role: "Admin", access: "Super Administrator", status: "Active" }
  ],
  trendsChart: null,
  incidentChart: null
};

/* ==================== INITIALIZATION ==================== */
document.addEventListener("DOMContentLoaded", () => {
  loadReportsFromStorage();
  initNavigation();
  initReportAudits();
  initUserManagement();
  initTelemetryLoop();
  initAIControls();
  initSettingsForm();
});

function loadReportsFromStorage() {
  const saved = localStorage.getItem("safepath_reports");
  if (saved) {
    AdminState.reports = JSON.parse(saved);
  } else {
    localStorage.setItem("safepath_reports", JSON.stringify(AdminState.reports));
  }
}

function syncReportsToStorage() {
  localStorage.setItem("safepath_reports", JSON.stringify(AdminState.reports));
}

/* ==================== SIDEBAR TAB NAVIGATION ==================== */
function initNavigation() {
  const sidebarItems = document.querySelectorAll(".sidebar-item");
  sidebarItems.forEach(item => {
    item.addEventListener("click", () => {
      sidebarItems.forEach(el => el.classList.remove("active"));
      item.classList.add("active");
      
      const tabName = item.getAttribute("data-tab");
      switchTab(tabName);
    });
  });

  // Mobile sidebar drawer
  const sidebarToggleBtn = document.querySelector(".sidebar-toggle");
  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener("click", () => {
      document.querySelector(".app-sidebar").classList.toggle("active");
    });
  }
}

function switchTab(tabId) {
  AdminState.activeTab = tabId;
  
  const tabTitles = {
    'overview': 'Dashboard Overview',
    'analytics': 'Analytics Suite',
    'audits': 'Incident Audits',
    'users': 'User Management',
    'monitoring': 'System Monitoring',
    'ai-controls': 'AI Model Controls',
    'settings': 'Settings & Config'
  };
  
  document.getElementById("current-tab-title").textContent = tabTitles[tabId] || 'SafePath Admin';

  document.querySelectorAll(".tab-pane").forEach(pane => {
    pane.classList.remove("active");
  });
  
  const activePane = document.getElementById(`tab-${tabId}`);
  if (activePane) activePane.classList.add("active");

  // Close sidebar on mobile drawer
  const sidebar = document.querySelector(".app-sidebar");
  if (sidebar) sidebar.classList.remove("active");

  // Specific initializations
  if (tabId === 'analytics') {
    setTimeout(initAnalyticsTab, 100);
  }
}

/* ==================== TAB 1 & 3: INCIDENT AUDITING ==================== */
function initReportAudits() {
  renderReportsFeed();
  
  // Audits dispatch submission form
  const dispatchForm = document.getElementById("admin-dispatch-form");
  if (dispatchForm) {
    dispatchForm.onsubmit = (e) => {
      e.preventDefault();
      const type = document.getElementById("dispatch-type").value;
      const desc = document.getElementById("dispatch-description").value;

      if (!desc.trim()) return;

      const historyFeed = document.getElementById("admin-dispatch-history");
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="disp-meta">${type} &bull; Just Now</span>
        <p>${desc}</p>
      `;

      historyFeed.insertBefore(li, historyFeed.firstChild);
      dispatchForm.reset();
      alert(`Directive broadcasted to: "${type}". Dispatch unit acknowledged.`);
    };
  }
}

function renderReportsFeed() {
  const pendingReports = AdminState.reports.filter(r => r.status === "Pending");
  
  // Update Overview counter badges
  document.getElementById("admin-pending-count").textContent = pendingReports.length;
  
  // Update flag count (verified + unresolved)
  const unresolvedFlags = AdminState.reports.filter(r => r.status === "Verified").length;
  document.getElementById("admin-flags-count").textContent = unresolvedFlags;

  // Render main list in Audits tab
  const listContainer = document.getElementById("admin-pending-reports-list");
  if (listContainer) {
    listContainer.innerHTML = '';
    if (pendingReports.length === 0) {
      listContainer.innerHTML = '<div class="p-6 text-center text-secondary text-sm">No community reports requiring approval. All reports processed.</div>';
    } else {
      pendingReports.forEach(report => {
        const card = document.createElement("div");
        card.className = "pending-item";
        card.innerHTML = `
          <div class="pending-header">
            <span class="pending-type text-red">${report.type}</span>
            <span class="text-secondary text-sm">${report.location} &bull; ${report.timestamp}</span>
          </div>
          <p class="pending-desc">${report.description}</p>
          <div class="pending-actions">
            <button class="btn btn-primary btn-sm btn-admin-approve" data-id="${report.id}">Approve & Map Alert</button>
            <button class="btn btn-text btn-sm text-danger btn-admin-reject" data-id="${report.id}">Dismiss</button>
          </div>
        `;
        listContainer.appendChild(card);
      });
      setupAuditActionButtons();
    }
  }

  // Render quick list in Overview tab
  const quickContainer = document.getElementById("admin-pending-reports-quick-list");
  if (quickContainer) {
    quickContainer.innerHTML = '';
    if (pendingReports.length === 0) {
      quickContainer.innerHTML = '<div class="p-4 text-center text-secondary text-xs">No pending audits.</div>';
    } else {
      pendingReports.slice(0, 2).forEach(report => {
        const item = document.createElement("div");
        item.style.padding = "0.75rem";
        item.style.borderBottom = "1px solid var(--color-border)";
        item.innerHTML = `
          <div class="flex-between mb-1">
            <strong class="text-sm text-red">${report.type}</strong>
            <span class="text-xs text-secondary">${report.location}</span>
          </div>
          <p class="text-xs text-secondary m-0" style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap">${report.description}</p>
        `;
        quickContainer.appendChild(item);
      });
    }
  }
}

function setupAuditActionButtons() {
  document.querySelectorAll(".btn-admin-approve").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      const index = AdminState.reports.findIndex(r => r.id === id);
      if (index !== -1) {
        AdminState.reports[index].status = "Verified";
        syncReportsToStorage();
        alert("Report verified! Incident is now live for safety route computations.");
        renderReportsFeed();
      }
    });
  });

  document.querySelectorAll(".btn-admin-reject").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      const index = AdminState.reports.findIndex(r => r.id === id);
      if (index !== -1) {
        AdminState.reports.splice(index, 1);
        syncReportsToStorage();
        alert("Report dismissed and removed from analytics queue.");
        renderReportsFeed();
      }
    });
  });
}

/* ==================== TAB 2: ANALYTICS GRAPHS ==================== */
function initAnalyticsTab() {
  const safetyCanvas = document.getElementById("chart-safety-trends");
  const incidentCanvas = document.getElementById("chart-incident-distribution");

  if (!safetyCanvas || !incidentCanvas) return;

  // Chart 1: Safety score trends
  if (AdminState.trendsChart) AdminState.trendsChart.destroy();
  AdminState.trendsChart = new Chart(safetyCanvas, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Safety Index Score',
          data: [9.2, 9.4, 9.1, 7.8, 8.4, 9.6, 9.8],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.3,
          borderWidth: 3
        },
        {
          label: 'Local Incident Density',
          data: [1, 0, 2, 4, 3, 0, 0],
          borderColor: '#EF4444',
          backgroundColor: 'transparent',
          tension: 0.3,
          borderWidth: 2,
          borderDash: [5, 5]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 10
        }
      }
    }
  });

  // Chart 2: Category distribution
  if (AdminState.incidentChart) AdminState.incidentChart.destroy();
  
  const categories = {};
  AdminState.reports.forEach(r => {
    categories[r.type] = (categories[r.type] || 0) + 1;
  });

  AdminState.incidentChart = new Chart(incidentCanvas, {
    type: 'doughnut',
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: [
          '#F59E0B', // Amber
          '#EF4444', // Red
          '#2563EB', // Blue
          '#10B981', // Green
          '#6B7280'  // Grey
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // Time range filtering
  const filterButtons = document.querySelectorAll(".btn-time-filter");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(f => f.classList.remove("active"));
      btn.classList.add("active");
      
      const range = btn.getAttribute("data-range");
      if (range === '24h') {
        AdminState.trendsChart.data.datasets[0].data = [9.5, 9.6, 9.2, 9.0, 9.5, 9.8, 9.7];
        AdminState.trendsChart.update();
      } else if (range === '7d') {
        AdminState.trendsChart.data.datasets[0].data = [9.2, 9.4, 9.1, 7.8, 8.4, 9.6, 9.8];
        AdminState.trendsChart.update();
      } else {
        AdminState.trendsChart.data.datasets[0].data = [8.5, 8.8, 9.1, 9.3, 8.9, 9.5, 9.6];
        AdminState.trendsChart.update();
      }
    });
  });
}

/* ==================== TAB 4: USER ROLE MANAGEMENT ==================== */
function initUserManagement() {
  renderUserTable();

  // Add User button listener
  document.getElementById("btn-add-mock-user").addEventListener("click", () => {
    const name = prompt("Enter new user full name:");
    if (!name || !name.trim()) return;
    
    const email = name.toLowerCase().replace(/ /g, ".") + "@safepath.in";
    const role = "Commuter";
    const access = "Standard";
    
    AdminState.users.push({ name, email, role, access, status: "Active" });
    alert("New user account registered.");
    renderUserTable();
  });
}

function renderUserTable() {
  const tbody = document.getElementById("admin-user-table-body");
  if (!tbody) return;

  tbody.innerHTML = '';
  AdminState.users.forEach((user, idx) => {
    const tr = document.createElement("tr");
    
    let roleSelectOptions = `
      <option value="Admin" ${user.role === 'Admin' ? 'selected' : ''}>Admin</option>
      <option value="Municipal Inspector" ${user.role === 'Municipal Inspector' ? 'selected' : ''}>Municipal Inspector</option>
      <option value="Police Dispatch" ${user.role === 'Police Dispatch' ? 'selected' : ''}>Police Dispatch</option>
      <option value="Commuter" ${user.role === 'Commuter' ? 'selected' : ''}>Commuter</option>
    `;

    let statusPill = user.status === 'Active' 
      ? `<span class="status-badge verified">Active</span>`
      : `<span class="status-badge pending" style="color:var(--color-danger)">Suspended</span>`;

    tr.innerHTML = `
      <td><strong>${user.name}</strong></td>
      <td>${user.email}</td>
      <td>
        <select class="form-control user-role-select" data-index="${idx}" style="height:32px; padding:0.15rem 0.5rem; font-size:0.8rem">
          ${roleSelectOptions}
        </select>
      </td>
      <td><span class="text-sm font-weight-500">${user.access}</span></td>
      <td>${statusPill}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-secondary btn-sm btn-user-suspend" data-index="${idx}" style="padding:0.25rem 0.5rem; font-size:0.75rem">
            ${user.status === 'Active' ? 'Suspend' : 'Activate'}
          </button>
          <button class="btn btn-text btn-sm text-danger btn-user-delete" data-index="${idx}" style="padding:0.25rem 0.5rem; font-size:0.75rem">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Role select changes
  document.querySelectorAll(".user-role-select").forEach(select => {
    select.addEventListener("change", (e) => {
      const index = parseInt(e.target.getAttribute("data-index"));
      const newRole = e.target.value;
      
      AdminState.users[index].role = newRole;
      if (newRole === 'Admin') {
        AdminState.users[index].access = "Super Administrator";
      } else if (newRole === 'Commuter') {
        AdminState.users[index].access = "Standard";
      } else {
        AdminState.users[index].access = "Regional Operator";
      }
      alert(`Updated role for ${AdminState.users[index].name} to: ${newRole}`);
      renderUserTable();
    });
  });

  // Account suspension toggle
  document.querySelectorAll(".btn-user-suspend").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.getAttribute("data-index"));
      const isCurrentlyActive = AdminState.users[index].status === "Active";
      AdminState.users[index].status = isCurrentlyActive ? "Suspended" : "Active";
      alert(`User account ${isCurrentlyActive ? 'suspended' : 'activated'}.`);
      renderUserTable();
    });
  });

  // Account delete
  document.querySelectorAll(".btn-user-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.getAttribute("data-index"));
      if (confirm(`Delete account for ${AdminState.users[index].name}?`)) {
        AdminState.users.splice(index, 1);
        renderUserTable();
      }
    });
  });
}

/* ==================== TAB 5: SYSTEM HEALTH MONITORING ==================== */
function initTelemetryLoop() {
  // Simulate fluctuating CPU, RAM, and Latency
  setInterval(() => {
    if (AdminState.activeTab !== 'monitoring') return;
    
    // CPU load fluctuation (30% to 75%)
    const cpuVal = Math.floor(Math.random() * (75 - 30) + 30);
    document.getElementById("txt-cpu-load").textContent = `${cpuVal}%`;
    document.getElementById("fill-cpu-load").style.width = `${cpuVal}%`;
    
    // RAM load fluctuation (64% to 71%)
    const ramVal = Math.floor(Math.random() * (71 - 64) + 64);
    document.getElementById("txt-ram-load").textContent = `${ramVal}%`;
    document.getElementById("fill-ram-load").style.width = `${ramVal}%`;

    // Latency load (18ms to 32ms)
    const latVal = Math.floor(Math.random() * (32 - 18) + 18);
    document.getElementById("txt-latency").textContent = `${latVal}ms`;
    // Percentage width mapping
    const latRatio = Math.min(100, Math.round((latVal / 200) * 100));
    document.getElementById("fill-latency").style.width = `${latRatio}%`;
  }, 2000);
}

/* ==================== TAB 6: AI PARAMETERS & RETRAINING ==================== */
function initAIControls() {
  // Slider listeners
  const sliderCrime = document.getElementById("slider-crime-weight");
  const sliderLight = document.getElementById("slider-light-weight");
  const sliderCrowd = document.getElementById("slider-crowd-weight");

  sliderCrime.addEventListener("input", (e) => {
    document.getElementById("val-crime-weight").textContent = parseFloat(e.target.value).toFixed(2);
  });
  sliderLight.addEventListener("input", (e) => {
    document.getElementById("val-light-weight").textContent = parseFloat(e.target.value).toFixed(2);
  });
  sliderCrowd.addEventListener("input", (e) => {
    document.getElementById("val-crowd-weight").textContent = parseFloat(e.target.value).toFixed(2);
  });

  // Retrain button click
  const retrainBtn = document.getElementById("btn-retrain-ai");
  const retrainProgressContainer = document.getElementById("training-progress-container");
  const retrainProgressBar = document.getElementById("training-progress-fill");
  const statusTxt = document.getElementById("txt-training-status");

  retrainBtn.addEventListener("click", () => {
    retrainBtn.setAttribute("disabled", "true");
    retrainProgressContainer.style.display = "block";
    statusTxt.textContent = "Connecting pipeline and parsing training datasets...";
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      retrainProgressBar.style.width = `${progress}%`;
      
      if (progress === 30) {
        statusTxt.textContent = "Recalculating Dijkstra spatial edge weights...";
      } else if (progress === 60) {
        statusTxt.textContent = "Validating route accuracy against historical incidents...";
      } else if (progress === 85) {
        statusTxt.textContent = "Deploying updated weights into production caches...";
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          retrainProgressContainer.style.display = "none";
          retrainProgressBar.style.width = "0%";
          retrainBtn.removeAttribute("disabled");
          
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          statusTxt.textContent = `Model successfully retrained at ${nowStr}. Accuracy: 98.6%.`;
          alert("Safety predictive weights successfully refreshed.");
        }, 500);
      }
    }, 150);
  });
}

/* ==================== TAB 7: SETTINGS FORM ==================== */
function initSettingsForm() {
  const settingsForm = document.getElementById("admin-settings-form");
  settingsForm.onsubmit = (e) => {
    e.preventDefault();
    alert("System configurations updated successfully.");
  };

  document.getElementById("btn-export-reports").addEventListener("click", () => {
    const rawData = JSON.stringify(AdminState.reports, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(rawData);
    
    const exportFileDefaultName = 'safepath_reports_backup.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  });
}
