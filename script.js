// Language Detection & i18n Dictionary
const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
const isJapanese = browserLang.startsWith('ja');
document.documentElement.lang = isJapanese ? 'ja' : 'en';

const I18N = {
    ja: {
        labelLat: '緯度 (LAT)',
        labelLng: '経度 (LNG)',
        labelAlt: '高度 (ALT)',
        labelVel: '速度 (VEL)',
        simTitle: '軌道シミュレーション',
        simRealtime: 'リアルタイム動作中',
        simSimulating: 'シミュレーション表示中',
        btnJump: '日時移動',
        btnReset: '現在時刻に戻る',
        btnRecenter: '📍 ISSの位置を中心に表示',
        legendFuture: '未来1時間の予測軌道 (水色)',
        legendPast: '過去1時間の飛行軌跡 (ピンク破線)',
        legendFootprint: 'ISSの可視領域 (Footprint)',
        popupTitle: '🛸 国際宇宙ステーション (ISS)',
        popupCalculating: '位置情報を計算中...',
        popupLat: '緯度:',
        popupLng: '経度:',
        popupAlt: '高度:',
        popupSpeed: '時速:',
        popupTime: '計算時刻:',
        minuteSuffix: '分',
        locale: 'ja-JP'
    },
    en: {
        labelLat: 'LATITUDE (LAT)',
        labelLng: 'LONGITUDE (LNG)',
        labelAlt: 'ALTITUDE (ALT)',
        labelVel: 'VELOCITY (VEL)',
        simTitle: 'Orbit Simulation',
        simRealtime: 'Live Tracking',
        simSimulating: 'Simulation Mode',
        btnJump: 'Jump',
        btnReset: 'Back to Now',
        btnRecenter: '📍 Center on ISS',
        legendFuture: 'Next 1h Predicted Orbit (Cyan)',
        legendPast: 'Past 1h Flight Path (Pink Dashed)',
        legendFootprint: 'ISS Visibility Footprint',
        popupTitle: '🛸 International Space Station (ISS)',
        popupCalculating: 'Calculating position...',
        popupLat: 'Latitude:',
        popupLng: 'Longitude:',
        popupAlt: 'Altitude:',
        popupSpeed: 'Speed:',
        popupTime: 'Calculated at:',
        minuteSuffix: 'm',
        locale: 'en-US'
    }
};
const L10N = isJapanese ? I18N.ja : I18N.en;

// Apply Static UI Translations
function applyStaticTranslations() {
    document.getElementById('label-lat').textContent = L10N.labelLat;
    document.getElementById('label-lng').textContent = L10N.labelLng;
    document.getElementById('label-alt').textContent = L10N.labelAlt;
    document.getElementById('label-vel').textContent = L10N.labelVel;
    document.getElementById('sim-title-text').textContent = L10N.simTitle;
    document.getElementById('sim-status').textContent = L10N.simRealtime;
    document.getElementById('btn-jump').textContent = L10N.btnJump;
    document.getElementById('btn-reset').textContent = L10N.btnReset;
    document.getElementById('btn-recenter').textContent = L10N.btnRecenter;
    document.getElementById('legend-future').textContent = L10N.legendFuture;
    document.getElementById('legend-past').textContent = L10N.legendPast;
    document.getElementById('legend-footprint').textContent = L10N.legendFootprint;
}

// Standard Fallback TLE Dataset
const FALLBACK_TLE = {
    line1: "1 25544U 98067A   26206.44322024  .00008631  00000+0  16367-3 0  9990",
    line2: "2 25544  51.6316 110.7757 0006908 336.1751  23.8916 15.49160253577689"
};

// Application State
let map = null;
let terminator = null;
let issMarker = null;
let footprintCircle = null;
let satrec = null;

// Synchronous initial satrec initialization guarantees 0ms readiness
try {
    satrec = satellite.twoline2satrec(FALLBACK_TLE.line1, FALLBACK_TLE.line2);
} catch(e) {
    console.warn('Initial satrec fallback error:', e);
}

// Single Unbroken Persistent Orbit Polyline Objects
let pastPolylineGlow = null;
let pastPolylineCore = null;

let futurePolylineGlow = null;
let futurePolylineCore = null;

let timeBadgeMarkers = [];

let targetDate = new Date();
let isRealTime = true;
let isAutoRecenter = true;
let updateTimer = null;

// Mobile Viewport Detection (matches CSS breakpoint)
function isMobileView() {
    return window.matchMedia('(max-width: 640px)').matches;
}

// ISS Custom SVG Icon
const issSvgIcon = L.divIcon({
    className: 'iss-icon-glow',
    html: `
        <svg width="52" height="52" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="rgba(0, 255, 255, 0.25)" stroke="#00ffff" stroke-width="2" stroke-dasharray="4 2"/>
            <circle cx="32" cy="32" r="7" fill="#ffffff"/>
            <path d="M12 32H52" stroke="#00ffff" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M18 18V46M24 18V46M40 18V46M46 18V46" stroke="#00ffff" stroke-width="3"/>
            <circle cx="32" cy="32" r="14" stroke="#ffffff" stroke-width="1.5" opacity="0.9"/>
        </svg>
    `,
    iconSize: [52, 52],
    iconAnchor: [26, 26],
    popupAnchor: [0, -26]
});

// Calculate Position & Velocity at Given Date
function getISSStateAt(date) {
    if (!satrec) return null;
    const pv = satellite.propagate(satrec, date);
    if (!pv || !pv.position) return null;

    const gstime = satellite.gstime(date);
    const gd = satellite.eciToGeodetic(pv.position, gstime);

    const lat = satellite.degreesLat(gd.latitude);
    let lng = satellite.degreesLong(gd.longitude);
    const alt = gd.height; // km

    // Normalize longitude to -180 .. +180
    while (lng > 180) lng -= 360;
    while (lng < -180) lng += 360;

    let speedKmH = 0;
    if (pv.velocity) {
        const v = pv.velocity;
        const vMag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        speedKmH = vMag * 3600; // km/s to km/h
    }

    return { lat, lng, alt, speedKmH };
}

// Initialize Map centered on ISS: full lat/lng on mobile, Equator-locked lat on desktop
function initMap() {
    let initialCenter = [0, 0];
    const st = getISSStateAt(new Date());
    if (st) {
        initialCenter = isMobileView() ? [st.lat, st.lng] : [0, st.lng];
    }

    map = L.map('map', {
        center: initialCenter,
        zoom: 3,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false
    });

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // 1. Dark Matter Base Map Layer
    L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.esri.com">Esri</a>',
        maxZoom: 16
    }).addTo(map);

    // 2. Day/Night Terminator Shadow Layer (stroke: false removes orange border line)
    try {
        terminator = L.terminator({
            fillColor: '#000000',
            fillOpacity: 0.62,
            stroke: false,
            weight: 0
        }).addTo(map);
    } catch (e) {
        console.warn('Terminator overlay error:', e);
    }

    // 3. Single Unbroken Orbit Polylines - Added AFTER Terminator
    pastPolylineGlow = L.polyline([], { color: '#ff007f', weight: 10, opacity: 0.4 }).addTo(map);
    pastPolylineCore = L.polyline([], { color: '#ff007f', weight: 5, opacity: 1.0, dashArray: '10, 8' }).addTo(map);

    futurePolylineGlow = L.polyline([], { color: '#00ffff', weight: 10, opacity: 0.45 }).addTo(map);
    futurePolylineCore = L.polyline([], { color: '#00ffff', weight: 5.5, opacity: 1.0 }).addTo(map);

    // 4. Create Footprint Circle (ISS Visibility radius ~2,200 km)
    footprintCircle = L.circle(initialCenter, {
        radius: 2200000,
        color: '#00ffff',
        fillColor: '#00ffff',
        fillOpacity: 0.12,
        weight: 2,
        dashArray: '6, 6'
    }).addTo(map);

    // 5. Create ISS Marker (Topmost element)
    issMarker = L.marker(initialCenter, { icon: issSvgIcon }).addTo(map);
    issMarker.bindPopup(`
        <div style="font-family:'Inter',sans-serif; padding:4px;">
            <div style="font-family:'Orbitron'; font-weight:700; color:var(--accent-cyan); margin-bottom:4px;">
                ${L10N.popupTitle}
            </div>
            <div id="popup-content" style="font-size:0.8rem; line-height:1.4;">
                ${L10N.popupCalculating}
            </div>
        </div>
    `);
}

// Fetch Live TLE Data with fast 3s timeout (non-blocking)
async function loadTLEData() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle', {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('CelesTrak network response error');
        const text = await response.text();

        const lines = text.split('\n').map(l => l.trim());
        let l1 = '', l2 = '';
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('1 25544')) {
                l1 = lines[i];
                l2 = lines[i + 1];
                break;
            }
        }

        if (l1 && l2) {
            const freshSatrec = satellite.twoline2satrec(l1, l2);
            if (freshSatrec && !freshSatrec.error) {
                satrec = freshSatrec;
                console.log('Successfully updated with fresh CelesTrak live TLE.');
                updateSimulation(); // Refresh simulation with fresh TLE
            }
        }
    } catch (err) {
        console.warn('Using default TLE dataset:', err.message);
    }
}

// Generate Anchored Orbit Points (unwrapping forward & backward relative to current ISS position)
function generateAnchoredOrbit(startDate, minutesOffsetStart, minutesOffsetEnd, stepMinutes = 0.5) {
    const rawPoints = [];
    for (let m = minutesOffsetStart; m <= minutesOffsetEnd; m += stepMinutes) {
        const d = new Date(startDate.getTime() + m * 60000);
        const state = getISSStateAt(d);
        if (!state) continue;
        rawPoints.push({ m, lat: state.lat, lng: state.lng });
    }

    if (rawPoints.length === 0) return [];

    // Find index closest to m = 0
    let anchorIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < rawPoints.length; i++) {
        const dist = Math.abs(rawPoints[i].m);
        if (dist < minDist) {
            minDist = dist;
            anchorIdx = i;
        }
    }

    const res = new Array(rawPoints.length);
    res[anchorIdx] = [rawPoints[anchorIdx].lat, rawPoints[anchorIdx].lng];

    // Unwrap forward from anchor point
    for (let i = anchorIdx + 1; i < rawPoints.length; i++) {
        const prevLng = res[i - 1][1];
        let lng = rawPoints[i].lng;
        let diff = lng - prevLng;
        while (diff > 180) { lng -= 360; diff -= 360; }
        while (diff < -180) { lng += 360; diff += 360; }
        res[i] = [rawPoints[i].lat, lng];
    }

    // Unwrap backward from anchor point
    for (let i = anchorIdx - 1; i >= 0; i--) {
        const nextLng = res[i + 1][1];
        let lng = rawPoints[i].lng;
        let diff = lng - nextLng;
        while (diff > 180) { lng -= 360; diff -= 360; }
        while (diff < -180) { lng += 360; diff += 360; }
        res[i] = [rawPoints[i].lat, lng];
    }

    return res;
}

// Render Single Unbroken Orbit Lines & Time Badges
function renderOrbitLines(now) {
    const pastPoints = generateAnchoredOrbit(now, -60, 0, 0.5);
    const futurePoints = generateAnchoredOrbit(now, 0, 60, 0.5);

    pastPolylineGlow.setLatLngs(pastPoints);
    pastPolylineCore.setLatLngs(pastPoints);

    futurePolylineGlow.setLatLngs(futurePoints);
    futurePolylineCore.setLatLngs(futurePoints);

    // Bring persistent polylines to front of map layers safely
    try {
        pastPolylineGlow.bringToFront();
        pastPolylineCore.bringToFront();
        futurePolylineGlow.bringToFront();
        futurePolylineCore.bringToFront();
    } catch (e) {
        console.warn('bringToFront warning:', e);
    }

    // Render Trajectory Time Badges (+15m, +30m, +45m, +60m) seamlessly along continuous future orbit line
    timeBadgeMarkers.forEach(m => map.removeLayer(m));
    timeBadgeMarkers = [];

    [15, 30, 45, 60].forEach(min => {
        // Step size is 0.5 min, so min * 2 gives exact index in futurePoints array
        const idx = Math.min(Math.round(min * 2), futurePoints.length - 1);
        if (futurePoints[idx]) {
            const pt = futurePoints[idx];
            const badgeIcon = L.divIcon({
                className: 'orbit-marker-badge',
                html: `+${min}${L10N.minuteSuffix}`,
                iconSize: [38, 20],
                iconAnchor: [19, 10]
            });
            const marker = L.marker(pt, { icon: badgeIcon }).addTo(map);
            timeBadgeMarkers.push(marker);
        }
    });
}

// Update Map & Dashboard UI
function updateSimulation() {
    const now = isRealTime ? new Date() : targetDate;
    const currentState = getISSStateAt(now);

    if (currentState) {
        const { lat, lng, alt, speedKmH } = currentState;
        const latLng = [lat, lng];

        // Update Marker & Footprint
        issMarker.setLatLng(latLng);
        footprintCircle.setLatLng(latLng);

        // Update Telemetry Panel
        document.getElementById('val-lat').textContent = `${lat.toFixed(4)}°`;
        document.getElementById('val-lng').textContent = `${lng.toFixed(4)}°`;
        document.getElementById('val-alt').innerHTML = `${Math.round(alt)} <span class="card-unit">km</span>`;
        document.getElementById('val-speed').innerHTML = `${Math.round(speedKmH).toLocaleString()} <span class="card-unit">km/h</span>`;

        // Update Popup Content safely without throwing Uncaught TypeError when popup is closed
        const popupHTML = `
            <b>${L10N.popupLat}</b> ${lat.toFixed(4)}°<br>
            <b>${L10N.popupLng}</b> ${lng.toFixed(4)}°<br>
            <b>${L10N.popupAlt}</b> ${Math.round(alt)} km<br>
            <b>${L10N.popupSpeed}</b> ${Math.round(speedKmH).toLocaleString()} km/h<br>
            <b>${L10N.popupTime}</b> ${now.toLocaleTimeString(L10N.locale)}
        `;
        const popupElem = document.getElementById('popup-content');
        if (popupElem) {
            popupElem.innerHTML = popupHTML;
        }

        // Recenter map: full lat/lng on mobile so ISS stays centered, Equator-locked lat on desktop
        if (isAutoRecenter && map) {
            map.panTo(isMobileView() ? [lat, lng] : [0, lng]);
        }

        // Render Orbit Lines
        renderOrbitLines(now);
    }

    // Update Terminator Shadow
    if (terminator && typeof terminator.setTime === 'function') {
        terminator.setTime(now);
    }
}

// Setup Event Listeners
function setupEventListeners() {
    const datetimePicker = document.getElementById('datetime-picker');
    const btnJump = document.getElementById('btn-jump');
    const btnReset = document.getElementById('btn-reset');
    const btnRecenter = document.getElementById('btn-recenter');
    const liveIndicator = document.getElementById('live-indicator');
    const simStatus = document.getElementById('sim-status');
    const toggleDashboardBtn = document.getElementById('toggle-dashboard-btn');
    const dashboard = document.getElementById('dashboard');

    // Start with the dashboard collapsed on mobile viewports
    if (isMobileView()) {
        dashboard.classList.add('collapsed');
    }

    // Initialize datetime picker with current local time
    const nowISO = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    datetimePicker.value = nowISO;

    // Jump to specified datetime
    btnJump.addEventListener('click', () => {
        if (!datetimePicker.value) return;
        targetDate = new Date(datetimePicker.value);
        isRealTime = false;

        liveIndicator.style.display = 'none';
        simStatus.textContent = L10N.simSimulating;
        simStatus.style.color = '#ff9f43';

        updateSimulation();
    });

    // Reset to Real-time
    btnReset.addEventListener('click', () => {
        isRealTime = true;
        targetDate = new Date();

        const currentISO = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        datetimePicker.value = currentISO;

        liveIndicator.style.display = 'inline-flex';
        simStatus.textContent = L10N.simRealtime;
        simStatus.style.color = 'var(--accent-cyan)';

        updateSimulation();
    });

    // Toggle Auto-Recenter (Latitude fixed at Equator 0°, Longitude following ISS)
    btnRecenter.addEventListener('click', () => {
        isAutoRecenter = !isAutoRecenter;
        if (isAutoRecenter) {
            btnRecenter.classList.add('btn-active');
            if (issMarker) {
                const issLatLng = issMarker.getLatLng();
                map.panTo(isMobileView() ? [issLatLng.lat, issLatLng.lng] : [0, issLatLng.lng]);
            }
        } else {
            btnRecenter.classList.remove('btn-active');
        }
    });

    // Mobile Dashboard Toggle
    toggleDashboardBtn.addEventListener('click', () => {
        dashboard.classList.toggle('collapsed');
    });
}

// Main Initialization Process
window.addEventListener('DOMContentLoaded', () => {
    applyStaticTranslations();
    initMap();
    setupEventListeners();

    // Run Simulation Immediately with synchronous satrec
    updateSimulation();

    // Fetch live TLE asynchronously in background
    loadTLEData();

    // Real-time Update Loop (1 FPS)
    updateTimer = setInterval(() => {
        if (isRealTime) {
            updateSimulation();
        }
    }, 1000);
});
