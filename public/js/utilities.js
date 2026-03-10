// ============================================
// UTILITIES - Dark Mode, PDF Export, Keyboard Shortcuts, Loading
// ============================================

// ============================================
// 1. DARK MODE
// ============================================

function initDarkMode() {
  // Check saved preference
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Create toggle button
  const toggleButton = document.createElement('button');
  toggleButton.className = 'theme-toggle no-print';
  toggleButton.innerHTML = `<ion-icon name="${savedTheme === 'dark' ? 'sunny' : 'moon'}"></ion-icon>`;
  toggleButton.onclick = toggleDarkMode;
  document.body.appendChild(toggleButton);
}

function toggleDarkMode() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Update button icon
  const button = document.querySelector('.theme-toggle ion-icon');
  button.setAttribute('name', newTheme === 'dark' ? 'sunny' : 'moon');
}

// ============================================
// 2. LOADING INDICATOR
// ============================================

function createLoadingOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.id = 'loadingOverlay';
  overlay.innerHTML = '<div class="loading-spinner"></div>';
  document.body.appendChild(overlay);
}

function showLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.add('active');
  }
}

function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

// Auto-hide loading after API calls
function fetchWithLoading(url, options = {}) {
  showLoading();
  return fetch(url, options)
    .finally(() => hideLoading());
}

// ============================================
// 3. EXPORT TO PDF
// ============================================

function exportToPDF(elementId, filename = 'document.pdf') {
  showLoading();
  
  // Use html2pdf library
  const element = document.getElementById(elementId);
  
  const opt = {
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save().then(() => {
    hideLoading();
    showNotification('PDF exported successfully!', 'success');
  }).catch(error => {
    hideLoading();
    showNotification('Failed to export PDF', 'error');
    console.error('PDF export error:', error);
  });
}

// Export current page
function exportCurrentPage() {
  const pageName = document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filename = `${pageName}_${new Date().toISOString().split('T')[0]}.pdf`;
  exportToPDF('main', filename);
}

// ============================================
// 4. PRINT FUNCTIONALITY
// ============================================

function printPage() {
  window.print();
}

function printElement(elementId) {
  const element = document.getElementById(elementId);
  const printWindow = window.open('', '', 'height=600,width=800');
  
  printWindow.document.write('<html><head><title>Print</title>');
  printWindow.document.write('<link rel="stylesheet" href="css/dark-mode.css">');
  printWindow.document.write('</head><body>');
  printWindow.document.write(element.innerHTML);
  printWindow.document.write('</body></html>');
  
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

// ============================================
// 5. KEYBOARD SHORTCUTS
// ============================================

const keyboardShortcuts = {
  'Ctrl+D': { action: toggleDarkMode, description: 'Toggle Dark Mode' },
  'Ctrl+P': { action: printPage, description: 'Print Page' },
  'Ctrl+E': { action: exportCurrentPage, description: 'Export to PDF' },
  'Ctrl+S': { action: (e) => { e.preventDefault(); saveData(); }, description: 'Save Data' },
  'Ctrl+F': { action: (e) => { e.preventDefault(); focusSearch(); }, description: 'Focus Search' },
  'Ctrl+H': { action: (e) => { e.preventDefault(); goHome(); }, description: 'Go Home' },
  'Escape': { action: closeModals, description: 'Close Modals' },
  '?': { action: toggleShortcutsHelp, description: 'Show Shortcuts' }
};

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const key = [];
    if (e.ctrlKey) key.push('Ctrl');
    if (e.altKey) key.push('Alt');
    if (e.shiftKey) key.push('Shift');
    key.push(e.key.toUpperCase());
    
    const shortcut = key.join('+');
    
    if (keyboardShortcuts[shortcut] || keyboardShortcuts[e.key]) {
      const handler = keyboardShortcuts[shortcut] || keyboardShortcuts[e.key];
      handler.action(e);
    }
  });
  
  // Create shortcuts help panel
  createShortcutsPanel();
}

function createShortcutsPanel() {
  const panel = document.createElement('div');
  panel.className = 'keyboard-shortcuts no-print';
  panel.id = 'keyboardShortcuts';
  
  let html = '<h4>Keyboard Shortcuts</h4><ul>';
  for (const [key, value] of Object.entries(keyboardShortcuts)) {
    html += `<li><span>${value.description}</span><kbd>${key}</kbd></li>`;
  }
  html += '</ul>';
  
  panel.innerHTML = html;
  document.body.appendChild(panel);
}

function toggleShortcutsHelp() {
  const panel = document.getElementById('keyboardShortcuts');
  if (panel) {
    panel.classList.toggle('active');
    setTimeout(() => {
      if (panel.classList.contains('active')) {
        panel.classList.remove('active');
      }
    }, 5000);
  }
}

function focusSearch() {
  const searchInput = document.getElementById('globalSearch') || 
                     document.querySelector('input[type="search"]') ||
                     document.querySelector('input[placeholder*="Search"]');
  if (searchInput) {
    searchInput.focus();
  }
}

function goHome() {
  window.location.href = 'index.html';
}

function closeModals() {
  document.querySelectorAll('.modal.active').forEach(modal => {
    modal.classList.remove('active');
  });
}

function saveData() {
  // Implement save functionality based on current page
  showNotification('Data saved!', 'success');
}

// ============================================
// 6. NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

// ============================================
// 7. DASHBOARD CUSTOMIZATION
// ============================================

function initDashboardCustomization() {
  const savedLayout = localStorage.getItem('dashboardLayout');
  if (savedLayout) {
    applyDashboardLayout(JSON.parse(savedLayout));
  }
}

function saveDashboardLayout() {
  const layout = {
    widgets: [],
    preferences: {
      compactMode: document.body.classList.contains('compact-mode'),
      sidebarCollapsed: document.querySelector('.sidebar')?.classList.contains('collapsed')
    }
  };
  
  localStorage.setItem('dashboardLayout', JSON.stringify(layout));
  showNotification('Layout saved!', 'success');
}

function applyDashboardLayout(layout) {
  if (layout.preferences.compactMode) {
    document.body.classList.add('compact-mode');
  }
  if (layout.preferences.sidebarCollapsed) {
    document.querySelector('.sidebar')?.classList.add('collapsed');
  }
}

function resetDashboardLayout() {
  localStorage.removeItem('dashboardLayout');
  location.reload();
}

// ============================================
// 8. OFFLINE SUPPORT (PWA)
// ============================================

function initOfflineSupport() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  }
  
  // Handle online/offline status
  window.addEventListener('online', () => {
    showNotification('Back online!', 'success');
  });
  
  window.addEventListener('offline', () => {
    showNotification('You are offline', 'info');
  });
}

// ============================================
// 9. DATA EXPORT UTILITIES
// ============================================

function exportToCSV(data, filename = 'export.csv') {
  const csv = convertToCSV(data);
  downloadFile(csv, filename, 'text/csv');
}

function convertToCSV(data) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const rows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value;
    }).join(',')
  );
  
  return [headers.join(','), ...rows].join('\n');
}

function exportToJSON(data, filename = 'export.json') {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================
// 10. RESPONSIVE UTILITIES
// ============================================

function isMobile() {
  return window.innerWidth <= 768;
}

function isTablet() {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
}

function isDesktop() {
  return window.innerWidth > 1024;
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  createLoadingOverlay();
  initKeyboardShortcuts();
  initDashboardCustomization();
  initOfflineSupport();
  
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
});

// Export functions for use in other scripts
window.utilities = {
  showLoading,
  hideLoading,
  fetchWithLoading,
  exportToPDF,
  exportToCSV,
  exportToJSON,
  printPage,
  printElement,
  showNotification,
  toggleDarkMode,
  saveDashboardLayout,
  resetDashboardLayout,
  isMobile,
  isTablet,
  isDesktop
};
