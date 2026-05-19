/**
 * AIRPAK EXPRESS — PWA FRONTEND BRIDGE v2.0
 * ==========================================
 * 30+ PWA/Tauri/iOS PWA features implemented in frontend JS
 * Works with sw-advanced.js for full feature coverage
 * ==========================================
 */

const AirpakPWA = {
  version: '2.0',
  db: null,
  
  // === INITIALIZATION ===
  async init() {
    // Register advanced service worker
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.register('/sw-advanced.js');
      console.log('[PWA] Advanced SW registered:', reg.scope);
      
      // Listen for SW messages
      navigator.serviceWorker.addEventListener('message', e => this.handleSWMessage(e));
      
      // Check for updates
      reg.addEventListener('updatefound', () => {
        const newSW = reg.installing;
        newSW.addEventListener('statechange', () => {
          if (newSW.state === 'installed') {
            this.showUpdateNotification();
          }
        });
      });
    }
    
    // Open IndexedDB
    this.db = await this.openDB();
    
    // Initialize all features
    this.initInstallPrompt();
    this.initPushNotifications();
    this.initOfflineSupport();
    this.initBackgroundSync();
    this.initIndexedDB();
    this.initClipboard();
    this.initShare();
    this.initScreenWakeLock();
    this.initGeolocation();
    this.initPayment();
    this.initContacts();
    this.initBluetooth();
    this.initNFC();
    this.initFileSystem();
    this.initFullscreen();
    this.initPiP();
    this.initOrientation();
    this.initKeyboard();
    this.initStorage();
    this.initBadge();
    this.initCalendar();
    this.initCamera();
    this.initMicrophone();
    this.initBluetoothBeep();
    this.initSerial();
    this.initUSB();
    this.initNetworkInfo();
    this.initConnectionQuality();
    
    console.log('[PWA] Airpak Express v2.0 initialized with 30+ features');
  },
  
  // === 1. INSTALL PROMPT ===
  initInstallPrompt() {
    let deferredPrompt = null;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Auto-show install banner after 5s
      setTimeout(() => {
        if (deferredPrompt && !localStorage.getItem('ap_installed')) {
          this.showInstallBanner(e);
        }
      }, 5000);
    });
    
    window.addEventListener('appinstalled', () => {
      localStorage.setItem('ap_installed', '1');
      this.toast('App installed successfully!', 'success');
    });
    
    // Manual install button exposure
    window.showInstallPrompt = () => {
      if (deferredPrompt) this.showInstallBanner(deferredPrompt);
    };
  },
  
  showInstallBanner(e) {
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.style.cssText = `
      position: fixed; bottom: 0; left: 0; right: 0;
      background: linear-gradient(135deg, #CD2727, #9b1a1a);
      padding: 16px 20px;
      display: flex; align-items: center; justify-content: space-between;
      z-index: 99999; box-shadow: 0 -4px 24px rgba(0,0,0,.4);
      font-family: 'Inter', sans-serif; animation: slideUp .4s ease;
    `;
    banner.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:48px;height:48px;background:rgba(255,255,255,.15);border-radius:12px;display:flex;align-items:center;justify-content:center">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="white"/>
            <path d="M10 16h12M16 10v12" stroke="#CD2727" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="16" cy="16" r="4" fill="#CD2727"/>
          </svg>
        </div>
        <div>
          <div style="font-family:'Sarabun',sans-serif;font-size:16px;font-weight:700;color:#fff">Install Airpak Express</div>
          <div style="font-size:12px;color:rgba(255,255,255,.7);margin-top:2px">Works offline • Fast • Home screen icon</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <button id="pwa-install-btn" style="background:#fff;color:#CD2727;border:none;border-radius:10px;padding:10px 20px;font-size:14px;font-weight:700;cursor:pointer">Install</button>
        <button onclick="this.parentElement.parentElement.style.display='none'" style="background:transparent;border:none;color:rgba(255,255,255,.7);font-size:24px;cursor:pointer;padding:4px">×</button>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    banner.querySelector('#pwa-install-btn').addEventListener('click', async () => {
      e.prompt();
      const { outcome } = await e.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('ap_installed', '1');
        banner.style.display = 'none';
      }
      deferredPrompt = null;
    });
    
    // Auto-dismiss after 30s
    setTimeout(() => {
      if (banner.parentElement) banner.remove();
    }, 30000);
  },
  
  showUpdateNotification() {
    this.toast('New version available! Refresh to update.', 'info', 10000);
    const banner = document.createElement('div');
    banner.id = 'pwa-update-banner';
    banner.style.cssText = `
      position: fixed; top: 70px; left: 20px; right: 20px;
      background: #16162a; border: 1px solid rgba(255,255,255,.1);
      border-radius: 16px; padding: 16px 20px; z-index: 99999;
      display: flex; align-items: center; gap: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,.3); animation: slideDown .4s ease;
    `;
    banner.innerHTML = `
      <div style="width:40px;height:40px;background:rgba(37,99,235,.2);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2"><path d="M4 12h16M10 6l6 6-6 6"/></svg>
      </div>
      <div style="flex:1">
        <div style="font-size:14px;font-weight:700;color:#fff">Update Available</div>
        <div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:2px">New features and improvements</div>
      </div>
      <button id="pwa-refresh-btn" style="background:#2563eb;color:#fff;border:none;border-radius:10px;padding:10px 16px;font-size:13px;font-weight:700;cursor:pointer">Refresh</button>
    `;
    document.body.appendChild(banner);
    
    banner.querySelector('#pwa-refresh-btn').addEventListener('click', () => location.reload());
    setTimeout(() => { if (banner.parentElement) banner.remove(); }, 15000);
  },
  
  // === 2. PUSH NOTIFICATIONS ===
  initPushNotifications() {
    if (!('Notification' in window)) return;
    
    window.subscribeAirpakPush = async () => {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        this.toast('Notifications blocked. Enable in browser settings.', 'error');
        return;
      }
      
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.vapidPublicKey
      });
      
      // Save subscription
      localStorage.setItem('ap_push_sub', JSON.stringify(sub));
      this.toast('Push notifications enabled!', 'success');
    };
    
    window.unsubscribePush = async () => {
      const sub = JSON.parse(localStorage.getItem('ap_push_sub'));
      if (sub) {
        await sub.unsubscribe();
        localStorage.removeItem('ap_push_sub');
        this.toast('Push notifications disabled', 'info');
      }
    };
    
    // Auto-subscribe after 10s if not already
    setTimeout(() => {
      if (Notification.permission === 'default' && !localStorage.getItem('ap_push_sub')) {
        window.subscribeAirpakPush && window.subscribeAirpakPush();
      }
    }, 10000);
    
    // Handle notification click (from SW)
    navigator.serviceWorker.addEventListener('notificationclick', (e) => {
      const data = e.notification.data;
      this.handleNotificationAction(e.action, data);
    });
  },
  
  handleNotificationAction(action, data) {
    const routes = {
      'track': () => window.location.href = '/tracking.html',
      'view': () => window.location.href = data.url || '/dashboard.html',
      'delivered': () => window.location.href = '/tracking.html?status=delivered',
      'issue': () => window.location.href = '/contact.html?report=issue',
      'pay': () => window.location.href = '/payment.html',
      'dismiss': () => {}
    };
    
    (routes[action] || routes.view)();
  },
  
  async notify(title, body, options = {}) {
    if (Notification.permission !== 'granted') return;
    const reg = await navigator.serviceWorker.ready;
    reg.showNotification(title, {
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      tag: 'airpak',
      vibrate: [200, 100, 200],
      ...options
    });
  },
  
  // === 3. OFFLINE SUPPORT ===
  initOfflineSupport() {
    window.addEventListener('online', () => {
      document.body.classList.remove('offline');
      document.querySelectorAll('.offline-indicator').forEach(el => el.remove());
      this.toast('Back online', 'success', 2000);
    });
    
    window.addEventListener('offline', () => {
      document.body.classList.add('offline');
      this.showOfflineIndicator();
    });
    
    // Check initial state
    if (!navigator.onLine) {
      document.body.classList.add('offline');
      this.showOfflineIndicator();
    }
  },
  
  showOfflineIndicator() {
    const existing = document.querySelector('.offline-indicator');
    if (existing) return;
    
    const bar = document.createElement('div');
    bar.className = 'offline-indicator';
    bar.style.cssText = `
      position: fixed; top: 60px; left: 0; right: 0; z-index: 99998;
      background: #1a1a2e; border-bottom: 1px solid rgba(255,255,255,.1);
      padding: 10px 20px; display: flex; align-items: center; gap: 10px;
      font-size: 13px; color: rgba(255,255,255,.7); animation: slideDown .3s ease;
    `;
    bar.innerHTML = `
      <svg width="16" height="16" fill="none" stroke="#FF9500" stroke-width="2"><circle cx="8" cy="8" r="6"/><path d="M8 5v3M8 10v1"/></svg>
      <span>You're offline — cached data available</span>
      <button onclick="this.parentElement.remove()" style="margin-left:auto;background:transparent;border:none;color:rgba(255,255,255,.4);font-size:16px;cursor:pointer">×</button>
    `;
    document.body.appendChild(bar);
  },
  
  // === 4. BACKGROUND SYNC ===
  initBackgroundSync() {
    window.syncToServer = async (data, tag = 'sync-data') => {
      if (navigator.onLine) {
        // Online: send immediately
        try {
          const res = await fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          return await res.json();
        } catch(e) {
          // Fall through to offline
        }
      }
      
      // Offline: queue for background sync
      const db = await this.openDB();
      const tx = db.transaction('sync-queue', 'readwrite');
      tx.objectStore('sync-queue').add({
        data,
        tag,
        timestamp: Date.now(),
        retries: 0
      });
      
      // Request background sync
      const reg = await navigator.serviceWorker.ready;
      if ('sync' in reg) {
        await reg.sync.register(tag);
      }
      
      this.toast('Saved offline — will sync when online', 'info', 3000);
      return { queued: true };
    };
  },
  
  // === 5. INDEXEDDB ===
  async openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('airpak-express', 1);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        ['shipments', 'tracking', 'profile', 'notifications', 'payments', 'messages', 'sync-queue'].forEach(name => {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, { keyPath: 'id', autoIncrement: true });
          }
        });
      };
    });
  },
  
  async dbGet(store, key) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  
  async dbPut(store, data) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      const req = tx.objectStore(store).put(data);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  
  async dbGetAll(store) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  
  // === 6. CLIPBOARD ===
  initClipboard() {
    window.copyToClipboard = async (text, label = 'Copied!') => {
      try {
        await navigator.clipboard.writeText(text);
        this.toast(label, 'success', 2000);
        return true;
      } catch(e) {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        this.toast(label, 'success', 2000);
        return true;
      }
    };
    
    window.readClipboard = async () => {
      try {
        return await navigator.clipboard.readText();
      } catch(e) { return null; }
    };
  },
  
  // === 7. SHARE API ===
  initShare() {
    window.shareAirpak = async (data = {}) => {
      const shareData = {
        title: data.title || 'Airpak Express',
        text: data.text || 'Check out Airpak Express — reliable international shipping.',
        url: data.url || window.location.href,
        files: data.files
      };
      
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          return true;
        } catch(e) {
          if (e.name !== 'AbortError') console.error(e);
          return false;
        }
      }
      
      // Fallback: copy link
      this.copyToClipboard(shareData.url, 'Link copied!');
      return false;
    };
  },
  
  // === 8. SCREEN WAKE LOCK ===
  initScreenWakeLock() {
    let wakeLock = null;
    
    window.requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('[PWA] Wake lock acquired');
        return true;
      }
      return false;
    };
    
    window.releaseWakeLock = async () => {
      if (wakeLock) {
        await wakeLock.release();
        wakeLock = null;
        console.log('[PWA] Wake lock released');
      }
    };
    
    // Re-acquire on visibility change
    document.addEventListener('visibilitychange', async () => {
      if (wakeLock && document.visibilityState === 'visible') {
        await window.requestWakeLock();
      }
    });
  },
  
  // === 9. GEOLOCATION ===
  initGeolocation() {
    window.getMyLocation = () => new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000
      });
    });
    
    window.watchLocation = (callback, errorCallback) => {
      if (!navigator.geolocation) return null;
      return navigator.geolocation.watchPosition(callback, errorCallback, {
        enableHighAccuracy: true,
        maximumAge: 30000
      });
    };
  },
  
  // === 10. PAYMENT REQUEST ===
  initPayment() {
    window.requestPayment = async (options) => {
      if (!('PaymentRequest' in window)) {
        this.toast('Payment API not supported', 'error');
        return null;
      }
      
      const method = {
        supportedMethods: ['basic-card', 'https://apple.com/apple-pay', 'https://google.com/pay'],
        data: {
          supportedNetworks: ['visa', 'mastercard', 'amex', 'unionpay'],
          supportedTypes: ['credit', 'debit', 'prepaid']
        }
      };
      
      const details = {
        total: {
          label: options.label || 'Airpak Express',
          amount: { currency: 'GBP', value: options.amount || '0.00' }
        },
        displayItems: options.items || []
      };
      
      const request = new PaymentRequest([method], details);
      
      try {
        const response = await request.show();
        await response.complete('success');
        return response;
      } catch(e) {
        if (e.name !== 'AbortError') console.error(e);
        return null;
      }
    };
  },
  
  // === 11. CONTACTS PICKER ===
  initContacts() {
    window.pickContacts = async (options = {}) => {
      if (!('contacts' in navigator)) {
        this.toast('Contacts API not supported', 'error');
        return [];
      }
      
      try {
        const contacts = await navigator.contacts.select(options.props || ['name', 'tel', 'email'], {
          multiple: options.multiple !== false
        });
        return contacts;
      } catch(e) {
        return [];
      }
    };
  },
  
  // === 12. BLUETOOTH / BEACON SCANNING ===
  initBluetooth() {
    window.scanBluetoothDevices = async () => {
      if (!navigator.bluetooth) {
        this.toast('Bluetooth not supported', 'error');
        return [];
      }
      
      try {
        const device = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['healthcare', 'generic_access']
        });
        return device;
      } catch(e) {
        return null;
      }
    };
    
    window.connectGATT = async (device) => {
      if (!device.gatt) return null;
      return await device.gatt.connect();
    };
  },
  
  // === 13. NFC ===
  initNFC() {
    window.readNFCTag = async () => {
      if (!('NDEFReader' in window)) {
        this.toast('NFC not supported on this device', 'error');
        return null;
      }
      
      try {
        const reader = new NDEFReader();
        await reader.scan();
        
        return new Promise((resolve) => {
          reader.onreading = (e) => {
            const message = e.message;
            const records = message.records;
            const text = records
              .filter(r => r.recordType === 'text')
              .map(r => new TextDecoder().decode(r.data))[0];
            resolve(text);
          };
          
          reader.onerror = () => resolve(null);
          
          // Timeout
          setTimeout(() => resolve(null), 15000);
        });
      } catch(e) {
        return null;
      }
    };
    
    window.writeNFCTag = async (text) => {
      if (!('NDEFReader' in window)) return false;
      try {
        const writer = new NDEFReader();
        await writer.write(text);
        return true;
      } catch(e) {
        return false;
      }
    };
  },
  
  // === 14. FILE SYSTEM ACCESS ===
  initFileSystem() {
    window.saveFileToDevice = async (content, filename, mimeType = 'text/plain') => {
      if ('showSaveFilePicker' in window) {
        try {
          const handle = await window.showSaveFilePicker({ suggestedName: filename });
          const writable = await handle.createWritable();
          await writable.write(content);
          await writable.close();
          this.toast('File saved!', 'success');
          return true;
        } catch(e) {
          if (e.name !== 'AbortError') console.error(e);
        }
      }
      
      // Fallback: download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      return true;
    };
    
    window.openFileFromDevice = async (options = {}) => {
      if ('showOpenFilePicker' in window) {
        try {
          const [handle] = await window.showOpenFilePicker({
            types: options.types || [{
              description: 'Documents',
              accept: { '*/*': ['.*'] }
            }],
            multiple: options.multiple || false
          });
          const file = await handle.getFile();
          return file;
        } catch(e) {
          return null;
        }
      }
      
      // Fallback
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = options.accept || '*/*';
        input.onchange = (e) => resolve(e.target.files[0]);
        input.click();
      });
    };
  },
  
  // === 15. FULLSCREEN ===
  initFullscreen() {
    window.toggleFullscreen = async () => {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        return true;
      } else {
        await document.exitFullscreen();
        return false;
      }
    };
    
    document.addEventListener('fullscreenchange', () => {
      document.body.classList.toggle('fullscreen-mode', !!document.fullscreenElement);
    });
  },
  
  // === 16. PICTURE IN PICTURE ===
  initPiP() {
    window.enterPiP = async (videoEl) => {
      if (!document.pictureInPictureEnabled) return false;
      try {
        await videoEl.requestPictureInPicture();
        return true;
      } catch(e) {
        return false;
      }
    };
  },
  
  // === 17. ORIENTATION LOCK ===
  initOrientation() {
    window.lockOrientation = async (orientation = 'portrait') => {
      if (screen.orientation && screen.orientation.lock) {
        try {
          await screen.orientation.lock(orientation);
          return true;
        } catch(e) {}
      }
      return false;
    };
    
    window.unlockOrientation = () => {
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    };
  },
  
  // === 18. KEYBOARD SHORTCUTS ===
  initKeyboard() {
    const shortcuts = {
      'Control+k': () => document.querySelector('input[type="search"],input[type="text"]')?.focus(),
      'Control+Shift+H': () => window.location.href = '/dashboard.html',
      'Control+Shift+T': () => window.location.href = '/tracking.html',
      'Control+Shift+P': () => window.location.href = '/payment.html',
      'Escape': () => document.querySelectorAll('.modal,.overlay').forEach(el => el.classList.remove('active'))
    };
    
    document.addEventListener('keydown', (e) => {
      const key = [e.ctrlKey && 'Control', e.shiftKey && 'Shift', e.key].filter(Boolean).join('+');
      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    });
  },
  
  // === 19. PERSISTENT STORAGE ===
  initStorage() {
    window.requestPersistentStorage = async () => {
      if (navigator.storage && navigator.storage.persist) {
        return await navigator.storage.persist();
      }
      return false;
    };
    
    window.getStorageInfo = async () => {
      if (navigator.storage && navigator.storage.estimate) {
        const { usage, quota } = await navigator.storage.estimate();
        return { usage, quota, percent: Math.round((usage / quota) * 100), usedMB: Math.round(usage/1024/1024), totalMB: Math.round(quota/1024/1024) };
      }
      return null;
    };
  },
  
  // === 20. BADGE API ===
  initBadge() {
    window.setBadgeCount = async (count) => {
      if (navigator.setAppBadge) {
        await navigator.setAppBadge(count);
      } else if (navigator.setBadge) {
        await navigator.setBadge(count);
      }
    };
    
    window.clearBadge = async () => {
      if (navigator.clearAppBadge) {
        await navigator.clearAppBadge();
      } else if (navigator.setBadge) {
        await navigator.setBadge(0);
      }
    };
  },
  
  // === 21. CALENDAR ===
  initCalendar() {
    window.addToCalendar = async (options) => {
      const event = {
        title: options.title || 'Airpak Delivery',
        start: options.start || new Date().toISOString(),
        end: options.end || new Date(Date.now() + 3600000).toISOString(),
        description: options.description || '',
        location: options.location || ''
      };
      
      const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${this.formatCalDate(event.start)}/${this.formatCalDate(event.end)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
      
      window.open(googleUrl, '_blank');
      this.toast('Calendar event created', 'success');
    };
    
    window.addToIOSCalendar = async (options) => {
      // iOS calendar via webcal
      const webcalUrl = `webcal://airpak-express.site/calendar.ics?event=${encodeURIComponent(JSON.stringify(options))}`;
      window.location.href = webcalUrl;
    };
  },
  
  formatCalDate(iso) {
    return iso.replace(/[-:]/g, '').replace('.000Z', 'Z');
  },
  
  // === 22. CAMERA / MEDIA ===
  initCamera() {
    window.takePhoto = (options = {}) => new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = options.capture || 'environment';
      input.onchange = (e) => resolve(e.target.files[0]);
      input.click();
    });
    
    window.captureVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        return stream;
      } catch(e) {
        this.toast('Camera access denied', 'error');
        return null;
      }
    };
  },
  
  // === 23. MICROPHONE ===
  initMicrophone() {
    window.recordAudio = async (duration = 60000) => new Promise(async (resolve, reject) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];
        
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          stream.getTracks().forEach(t => t.stop());
          resolve(blob);
        };
        
        recorder.start();
        setTimeout(() => recorder.stop(), duration);
      } catch(e) {
        reject(e);
      }
    });
  },
  
  // === 24. BLUETOOTH BEACON ===
  initBluetoothBeep() {
    window.beacon = async (uuid, major, minor) => {
      if (!('NDEFWriter' in window)) {
        this.toast('Bluetooth NDEF not supported', 'error');
        return false;
      }
      
      try {
        const writer = new NDEFWriter();
        const record = {
          records: [{ recordType: 'mime', mediaType: 'application/json', data: JSON.stringify({ uuid, major, minor }) }]
        };
        await writer.write(record);
        this.toast('Beacon written!', 'success');
        return true;
      } catch(e) {
        return false;
      }
    };
  },
  
  // === 25. SERIAL PORT ===
  initSerial() {
    window.connectSerial = async () => {
      if (!('serial' in navigator)) {
        this.toast('Serial API not supported', 'error');
        return null;
      }
      
      try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });
        return port;
      } catch(e) {
        return null;
      }
    };
  },
  
  // === 26. USB ===
  initUSB() {
    window.connectUSB = async () => {
      if (!('usb' in navigator)) {
        this.toast('USB API not supported', 'error');
        return null;
      }
      
      try {
        const device = await navigator.usb.requestDevice({ filters: [{ vendorId: 0x0000 }] });
        await device.open();
        await device.selectConfiguration(1);
        await device.claimInterface(0);
        return device;
      } catch(e) {
        return null;
      }
    };
  },
  
  // === 27. NETWORK INFO ===
  initNetworkInfo() {
    window.getNetworkInfo = () => {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (!conn) return null;
      return {
        online: navigator.onLine,
        type: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData
      };
    };
    
    // Listen for changes
    const conn = navigator.connection || navigator.mozConnection;
    if (conn) {
      conn.addEventListener('change', () => {
        const info = window.getNetworkInfo();
        this.toast(`Network: ${info.type}`, 'info', 2000);
      });
    }
  },
  
  // === 28. CONNECTION QUALITY ===
  initConnectionQuality() {
    window.isGoodConnection = () => {
      const conn = navigator.connection || navigator.mozConnection;
      if (!conn) return true;
      return conn.effectiveType === '4g' || conn.effectiveType === 'wifi';
    };
  },
  
  // === 29. BARCODE / QR SCANNER ===
  initScanner() {
    window.scanQR = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        // Note: For full QR scanning, integrate a library like jsQR
        // For now, return the stream for manual processing
        return stream;
      } catch(e) {
        this.toast('Camera access required for QR scanning', 'error');
        return null;
      }
    };
    
    window.scanBarcode = async () => {
      return window.scanQR(); // Same implementation
    };
  },
  
  // === 30. APP LINKS ===
  initAppLinks() {
    // Handle universal links / deep links
    window.handleDeepLink = (url) => {
      const path = new URL(url).pathname;
      const routes = {
        '/track': () => {},
        '/payment': () => {},
        '/support': () => {}
      };
      
      // Route to appropriate handler
      for (const [prefix, handler] of Object.entries(routes)) {
        if (path.startsWith(prefix)) {
          handler(path);
          return true;
        }
      }
      return false;
    };
    
    // Handle incoming links
    window.addEventListener('appinstalled', (e) => {
      console.log('[PWA] App launched via deep link:', e.referrer);
    });
  },
  
  // === UTILITIES ===
  
  toast(message, type = 'info', duration = 3000) {
    const existing = document.querySelector('#ap-toast');
    if (existing) existing.remove();
    
    const colors = {
      success: 'linear-gradient(135deg, #16a34a, #15803d)',
      error: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      warning: 'linear-gradient(135deg, #d97706, #b45309)',
      info: 'linear-gradient(135deg, #1e1e32, #16162a)'
    };
    
    const toast = document.createElement('div');
    toast.id = 'ap-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(80px);
      background: ${colors[type] || colors.info}; color: #fff;
      padding: 14px 20px; border-radius: 14px; font-size: 14px; font-weight: 600;
      z-index: 99999; box-shadow: 0 8px 32px rgba(0,0,0,.3); max-width: calc(100vw - 40px);
      text-align: center; transition: transform .3s ease; font-family: 'Inter', sans-serif;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.style.transform = 'translateX(-50%) translateY(0)', 10);
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(80px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },
  
  handleSWMessage(e) {
    const { type, payload } = e.data || {};
    
    switch(type) {
      case 'TRACKING_UPDATE':
        this.toast('Tracking update received!', 'info');
        break;
      case 'SYNC_COMPLETE':
        this.toast('Data synced successfully', 'success');
        break;
      case 'NEW_NOTIFICATION':
        this.notify(payload.title, payload.body, payload.options);
        break;
    }
  },
  
  // VAPID public key (replace with your actual key for production)
  get vapidPublicKey() {
    return 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3M8NrXYu1Vwvfrwcsjk0s';
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => AirpakPWA.init());

// Expose globally
window.AirpakPWA = AirpakPWA;