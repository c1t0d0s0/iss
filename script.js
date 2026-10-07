// Language Detection & i18n Dictionary
const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
const isJapanese = browserLang.startsWith('ja');
document.documentElement.lang = isJapanese ? 'ja' : 'en';

const I18N = {
    ja: {
        headerTitle: 'ISS & 衛星軌道トラッカー',
        labelLat: '緯度 (LAT)',
        labelLng: '経度 (LNG)',
        labelAlt: '高度 (ALT)',
        labelVel: '速度 (VEL)',
        simTitle: '軌道シミュレーション',
        simRealtime: 'リアルタイム動作中',
        simSimulating: 'シミュレーション表示中',
        btnJump: '日時移動',
        btnReset: '現在時刻に戻る',
        btnRecenterTemplate: '📍 {name}の位置を中心に表示',
        legendFuture: '未来1時間の予測軌道 (実線)',
        legendPast: '過去1時間の飛行軌跡 (破線)',
        legendFootprint: '地上可視領域 (Footprint)',
        popupCalculating: '位置情報を計算中...',
        popupLat: '緯度:',
        popupLng: '経度:',
        popupAlt: '高度:',
        popupSpeed: '時速:',
        popupTime: '計算時刻:',
        satSelectorTitle: '衛星選択 / 表示切替',
        satSelectorHint: 'クリックで追跡',
        telemetryTargetLabel: '追跡中:',
        activeBadge: '追跡中',
        minuteSuffix: '分',
        locale: 'ja-JP'
    },
    en: {
        headerTitle: 'ISS & ORBIT TRACKER',
        labelLat: 'LATITUDE (LAT)',
        labelLng: 'LONGITUDE (LNG)',
        labelAlt: 'ALTITUDE (ALT)',
        labelVel: 'VELOCITY (VEL)',
        simTitle: 'Orbit Simulation',
        simRealtime: 'Live Tracking',
        simSimulating: 'Simulation Mode',
        btnJump: 'Jump',
        btnReset: 'Back to Now',
        btnRecenterTemplate: '📍 Center on {name}',
        legendFuture: 'Next 1h Predicted Orbit (Solid)',
        legendPast: 'Past 1h Flight Path (Dashed)',
        legendFootprint: 'Ground Visibility Footprint',
        popupCalculating: 'Calculating position...',
        popupLat: 'Latitude:',
        popupLng: 'Longitude:',
        popupAlt: 'Altitude:',
        popupSpeed: 'Speed:',
        popupTime: 'Calculated at:',
        satSelectorTitle: 'Satellite Selection / Display',
        satSelectorHint: 'Click row to track',
        telemetryTargetLabel: 'TRACKING:',
        activeBadge: 'TRACKING',
        minuteSuffix: 'm',
        locale: 'en-US'
    }
};
const L10N = isJapanese ? I18N.ja : I18N.en;

// Satellite Configurations & Fallback TLE Datasets
const SATELLITE_CONFIGS = {
    '25544': {
        id: '25544',
        noradId: 25544,
        name: {
            ja: '国際宇宙ステーション (ISS)',
            en: 'International Space Station (ISS)'
        },
        shortName: 'ISS',
        color: '#00ffff',
        pastColor: '#ff007f',
        glowClass: 'sat-glow-25544',
        enabled: true,   // Enabled by default (matches ISS baseline)
        fallbackTle: {
            line1: "1 25544U 98067A   26279.85327349  .00004482  00000+0  90204-4 0  9993",
            line2: "2 25544  51.6312 107.4774 0006843 231.4060 128.6316 15.48755863589064"
        },
        iconSvg: `
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="rgba(0, 255, 255, 0.22)" stroke="#00ffff" stroke-width="2" stroke-dasharray="4 2"/>
                <circle cx="32" cy="32" r="6" fill="#ffffff"/>
                <path d="M12 32H52" stroke="#00ffff" stroke-width="3.5" stroke-linecap="round"/>
                <path d="M18 18V46M24 18V46M40 18V46M46 18V46" stroke="#00ffff" stroke-width="3"/>
                <circle cx="32" cy="32" r="13" stroke="#ffffff" stroke-width="1.5" opacity="0.9"/>
            </svg>
        `
    },
    '48274': {
        id: '48274',
        noradId: 48274,
        name: {
            ja: '中国宇宙ステーション (天宮)',
            en: 'Tiangong Space Station (CSS)'
        },
        shortName: 'Tiangong (CSS)',
        color: '#f59e0b',
        pastColor: '#ef4444',
        glowClass: 'sat-glow-48274',
        enabled: false,  // Disabled by default
        fallbackTle: {
            line1: "1 48274U 21035A   26279.66863779  .00016881  00000+0  20358-3 0  9998",
            line2: "2 48274  41.4703   4.9680 0001458 342.2236  17.8551 15.60381928310579"
        },
        iconSvg: `
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="rgba(245, 158, 11, 0.22)" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 2"/>
                <circle cx="32" cy="32" r="6" fill="#ffffff"/>
                <path d="M32 16V48" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
                <path d="M16 28H48" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
                <rect x="8" y="24" width="8" height="8" rx="1" fill="#f59e0b" stroke="#ffffff" stroke-width="1"/>
                <rect x="48" y="24" width="8" height="8" rx="1" fill="#f59e0b" stroke="#ffffff" stroke-width="1"/>
                <rect x="28" y="48" width="8" height="6" rx="1" fill="#f59e0b" stroke="#ffffff" stroke-width="1"/>
            </svg>
        `
    },
    '53807': {
        id: '53807',
        noradId: 53807,
        name: {
            ja: 'BlueWalker 3',
            en: 'BlueWalker 3'
        },
        shortName: 'BlueWalker 3',
        color: '#c084fc',
        pastColor: '#9333ea',
        glowClass: 'sat-glow-53807',
        enabled: false,  // Disabled by default
        fallbackTle: {
            line1: "1 53807U 22111AL  26279.88583194  .00005232  00000+0  14140-3 0  9996",
            line2: "2 53807  53.2272 229.0800 0006290 147.8672 212.2718 15.39465627227405"
        },
        iconSvg: `
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="rgba(192, 132, 252, 0.22)" stroke="#c084fc" stroke-width="2" stroke-dasharray="4 2"/>
                <rect x="20" y="20" width="24" height="24" rx="2" fill="rgba(192, 132, 252, 0.45)" stroke="#c084fc" stroke-width="2"/>
                <path d="M20 28H44M20 36H44" stroke="#ffffff" stroke-width="1" stroke-dasharray="2 2"/>
                <path d="M28 20V44M36 20V44" stroke="#ffffff" stroke-width="1" stroke-dasharray="2 2"/>
                <circle cx="32" cy="32" r="4.5" fill="#ffffff"/>
            </svg>
        `
    },
    '27386': {
        id: '27386',
        noradId: 27386, // Official catalog ID for Envisat (COSPAR 2002-009A)
        name: {
            ja: 'Envisat (環境観測衛星)',
            en: 'Envisat (Earth Observation)'
        },
        shortName: 'Envisat',
        color: '#10b981',
        pastColor: '#059669',
        glowClass: 'sat-glow-27386',
        enabled: false,  // Disabled by default
        fallbackTle: {
            line1: "1 27386U 02009A   26279.83669916  .00000039  00000+0  26556-4 0  9990",
            line2: "2 27386  98.3964 228.7253 0001282  89.3282 295.7244 14.39085869289545"
        },
        iconSvg: `
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="rgba(16, 185, 129, 0.22)" stroke="#10b981" stroke-width="2" stroke-dasharray="4 2"/>
                <rect x="28" y="22" width="8" height="20" rx="2" fill="#ffffff" stroke="#10b981" stroke-width="1.5"/>
                <rect x="10" y="26" width="16" height="12" rx="1" fill="#10b981" stroke="#ffffff" stroke-width="1"/>
                <path d="M14 26V38M18 26V38M22 26V38" stroke="#ffffff" stroke-width="0.8"/>
                <path d="M36 29L48 23M36 35L48 41" stroke="#10b981" stroke-width="2"/>
                <circle cx="32" cy="32" r="3.5" fill="#ffffff"/>
            </svg>
        `
    }
};

// Application State
let map = null;
let terminator = null;
let activeSatelliteId = '25544'; // Defaults to ISS
let targetDate = new Date();
let isRealTime = true;
let isAutoRecenter = true;
let updateTimer = null;

// Initialize Satellite Runtime Structures
for (const key of Object.keys(SATELLITE_CONFIGS)) {
    const sat = SATELLITE_CONFIGS[key];
    try {
        sat.satrec = satellite.twoline2satrec(sat.fallbackTle.line1, sat.fallbackTle.line2);
    } catch(e) {
        console.warn(`Initial satrec error for ${sat.shortName}:`, e);
    }
    sat.marker = null;
    sat.footprintCircle = null;
    sat.pastPolylineGlow = null;
    sat.pastPolylineCore = null;
    sat.futurePolylineGlow = null;
    sat.futurePolylineCore = null;
    sat.timeBadgeMarkers = [];
}

// Mobile Viewport Detection (matches CSS breakpoint)
function isMobileView() {
    return window.matchMedia('(max-width: 640px)').matches;
}

// Get Localized Satellite Name
function getSatName(sat) {
    if (!sat) return '';
    return isJapanese ? sat.name.ja : sat.name.en;
}

// Apply Static UI Translations
function applyStaticTranslations() {
    const headerTitleElem = document.getElementById('header-title');
    if (headerTitleElem) headerTitleElem.textContent = L10N.headerTitle;

    document.getElementById('label-lat').textContent = L10N.labelLat;
    document.getElementById('label-lng').textContent = L10N.labelLng;
    document.getElementById('label-alt').textContent = L10N.labelAlt;
    document.getElementById('label-vel').textContent = L10N.labelVel;
    document.getElementById('sim-title-text').textContent = L10N.simTitle;
    document.getElementById('sim-status').textContent = L10N.simRealtime;
    document.getElementById('btn-jump').textContent = L10N.btnJump;
    document.getElementById('btn-reset').textContent = L10N.btnReset;
    document.getElementById('legend-future').textContent = L10N.legendFuture;
    document.getElementById('legend-past').textContent = L10N.legendPast;
    document.getElementById('legend-footprint').textContent = L10N.legendFootprint;

    const satSelectorTitleElem = document.getElementById('sat-selector-title');
    if (satSelectorTitleElem) satSelectorTitleElem.textContent = L10N.satSelectorTitle;

    const satSelectorHintElem = document.getElementById('sat-selector-hint');
    if (satSelectorHintElem) satSelectorHintElem.textContent = L10N.satSelectorHint;

    const targetLabelElem = document.getElementById('telemetry-target-label');
    if (targetLabelElem) targetLabelElem.textContent = L10N.telemetryTargetLabel;

    updateActiveSatelliteUI();
}

// Calculate Position & Velocity for Given Satellite at Given Date
function getSatelliteStateAt(sat, date) {
    if (!sat || !sat.satrec) return null;
    const pv = satellite.propagate(sat.satrec, date);
    if (!pv || !pv.position) return null;

    const gstime = satellite.gstime(date);
    const gd = satellite.eciToGeodetic(pv.position, gstime);

    const lat = satellite.degreesLat(gd.latitude);
    let lng = satellite.degreesLong(gd.longitude);
    const alt = gd.height; // km

    // Normalize longitude to -180 .. +180
    while (lng > 180) lng -= 360;
    while (lng < -180) lng -= 360;

    let speedKmH = 0;
    if (pv.velocity) {
        const v = pv.velocity;
        const vMag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        speedKmH = vMag * 3600; // km/s to km/h
    }

    return { lat, lng, alt, speedKmH };
}

// Calculate Accurate Horizon Footprint Radius in Meters
function calculateFootprintRadiusMeters(altKm) {
    const R_EARTH = 6371; // Earth radius in km
    if (!altKm || altKm <= 0) return 2200000;
    const cosTheta = R_EARTH / (R_EARTH + altKm);
    const theta = Math.acos(Math.max(-1, Math.min(1, cosTheta)));
    return R_EARTH * theta * 1000; // convert to meters
}

// Generate Anchored Orbit Points (unwrapping forward & backward)
function generateAnchoredOrbit(sat, startDate, minutesOffsetStart, minutesOffsetEnd, stepMinutes = 0.5) {
    const rawPoints = [];
    for (let m = minutesOffsetStart; m <= minutesOffsetEnd; m += stepMinutes) {
        const d = new Date(startDate.getTime() + m * 60000);
        const state = getSatelliteStateAt(sat, d);
        if (!state) continue;
        rawPoints.push({ m, lat: state.lat, lng: state.lng });
    }

    if (rawPoints.length === 0) return [];

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

    for (let i = anchorIdx + 1; i < rawPoints.length; i++) {
        const prevLng = res[i - 1][1];
        let lng = rawPoints[i].lng;
        let diff = lng - prevLng;
        while (diff > 180) { lng -= 360; diff -= 360; }
        while (diff < -180) { lng += 360; diff += 360; }
        res[i] = [rawPoints[i].lat, lng];
    }

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

// Initialize Map & Layers for all satellites
function initMap() {
    const defaultSat = SATELLITE_CONFIGS[activeSatelliteId];
    let initialCenter = [0, 0];
    const initialSt = getSatelliteStateAt(defaultSat, new Date());
    if (initialSt) {
        initialCenter = isMobileView() ? [initialSt.lat, initialSt.lng] : [0, initialSt.lng];
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

    // 2. Day/Night Terminator Shadow Layer
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

    // 3. Initialize Map Layer Objects for each satellite
    for (const key of Object.keys(SATELLITE_CONFIGS)) {
        const sat = SATELLITE_CONFIGS[key];

        // Orbit Polylines
        sat.pastPolylineGlow = L.polyline([], {
            color: sat.pastColor,
            weight: 10,
            opacity: 0.35
        });
        sat.pastPolylineCore = L.polyline([], {
            color: sat.pastColor,
            weight: 4.5,
            opacity: 1.0,
            dashArray: '10, 8'
        });

        sat.futurePolylineGlow = L.polyline([], {
            color: sat.color,
            weight: 10,
            opacity: 0.45
        });
        sat.futurePolylineCore = L.polyline([], {
            color: sat.color,
            weight: 5.5,
            opacity: 1.0
        });

        // Dynamic Footprint Circle
        sat.footprintCircle = L.circle([0, 0], {
            radius: 2200000,
            color: sat.color,
            fillColor: sat.color,
            fillOpacity: 0.12,
            weight: 1.8,
            dashArray: '6, 6'
        });

        // Satellite Marker
        const icon = L.divIcon({
            className: `sat-icon-glow ${sat.glowClass}`,
            html: sat.iconSvg,
            iconSize: [48, 48],
            iconAnchor: [24, 24],
            popupAnchor: [0, -24]
        });

        sat.marker = L.marker([0, 0], { icon });

        // Satellite Marker Popup
        sat.marker.bindPopup(`
            <div style="font-family:'Inter',sans-serif; padding:4px; min-width:180px;">
                <div style="font-family:'Orbitron'; font-weight:700; color:${sat.color}; margin-bottom:4px; font-size:0.9rem;">
                    ${getSatName(sat)}
                </div>
                <div id="popup-content-${sat.id}" style="font-size:0.8rem; line-height:1.4;">
                    ${L10N.popupCalculating}
                </div>
            </div>
        `);

        // Clicking a satellite marker switches active focus to that satellite
        sat.marker.on('click', () => {
            setActiveSatellite(sat.id);
        });

        // Add layers to map if enabled by default
        if (sat.enabled) {
            sat.pastPolylineGlow.addTo(map);
            sat.pastPolylineCore.addTo(map);
            sat.futurePolylineGlow.addTo(map);
            sat.futurePolylineCore.addTo(map);
            sat.footprintCircle.addTo(map);
            sat.marker.addTo(map);
        }
    }
}

// Build and Render Satellite Selector in Dashboard
function renderSatelliteSelector() {
    const listContainer = document.getElementById('sat-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    for (const key of Object.keys(SATELLITE_CONFIGS)) {
        const sat = SATELLITE_CONFIGS[key];
        const isActive = (sat.id === activeSatelliteId);

        const item = document.createElement('div');
        item.className = `sat-item ${isActive ? 'active' : ''}`;
        item.style.setProperty('--sat-color', sat.color);
        item.dataset.satId = sat.id;

        item.innerHTML = `
            <div class="sat-item-left">
                <label class="sat-checkbox-wrapper" onclick="event.stopPropagation();">
                    <input type="checkbox" class="sat-checkbox" data-sat-id="${sat.id}" ${sat.enabled ? 'checked' : ''}>
                </label>
                <div class="sat-color-dot" style="background:${sat.color}; color:${sat.color};"></div>
                <div class="sat-meta">
                    <div class="sat-name">${getSatName(sat)}</div>
                    <div class="sat-sub">NORAD #${sat.noradId}</div>
                </div>
            </div>
            <div class="sat-badge">${L10N.activeBadge}</div>
        `;

        // Row click sets satellite as active target & enables visibility
        item.addEventListener('click', () => {
            if (!sat.enabled) {
                sat.enabled = true;
                const checkbox = item.querySelector('.sat-checkbox');
                if (checkbox) checkbox.checked = true;
                toggleSatelliteVisibility(sat.id, true);
            }
            setActiveSatellite(sat.id);
        });

        // Checkbox click toggles visibility
        const checkbox = item.querySelector('.sat-checkbox');
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            const checked = e.target.checked;
            toggleSatelliteVisibility(sat.id, checked);
        });

        listContainer.appendChild(item);
    }
}

// Toggle Visibility of Satellite on Map
function toggleSatelliteVisibility(satId, isVisible) {
    const sat = SATELLITE_CONFIGS[satId];
    if (!sat || !map) return;
    sat.enabled = isVisible;

    if (isVisible) {
        if (!map.hasLayer(sat.pastPolylineGlow)) sat.pastPolylineGlow.addTo(map);
        if (!map.hasLayer(sat.pastPolylineCore)) sat.pastPolylineCore.addTo(map);
        if (!map.hasLayer(sat.futurePolylineGlow)) sat.futurePolylineGlow.addTo(map);
        if (!map.hasLayer(sat.futurePolylineCore)) sat.futurePolylineCore.addTo(map);
        if (!map.hasLayer(sat.footprintCircle)) sat.footprintCircle.addTo(map);
        if (!map.hasLayer(sat.marker)) sat.marker.addTo(map);
    } else {
        if (map.hasLayer(sat.pastPolylineGlow)) map.removeLayer(sat.pastPolylineGlow);
        if (map.hasLayer(sat.pastPolylineCore)) map.removeLayer(sat.pastPolylineCore);
        if (map.hasLayer(sat.futurePolylineGlow)) map.removeLayer(sat.futurePolylineGlow);
        if (map.hasLayer(sat.futurePolylineCore)) map.removeLayer(sat.futurePolylineCore);
        if (map.hasLayer(sat.footprintCircle)) map.removeLayer(sat.footprintCircle);
        if (map.hasLayer(sat.marker)) map.removeLayer(sat.marker);

        sat.timeBadgeMarkers.forEach(m => {
            if (map.hasLayer(m)) map.removeLayer(m);
        });
        sat.timeBadgeMarkers = [];
    }

    updateSimulation();
}

// Switch Active Satellite Target
function setActiveSatellite(satId) {
    if (!SATELLITE_CONFIGS[satId]) return;
    activeSatelliteId = satId;

    // Update active class on list items
    document.querySelectorAll('.sat-item').forEach(item => {
        if (item.dataset.satId === satId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    updateActiveSatelliteUI();
    updateSimulation();

    // Auto-recenter to newly active satellite if enabled
    if (isAutoRecenter && map) {
        const sat = SATELLITE_CONFIGS[satId];
        const now = isRealTime ? new Date() : targetDate;
        const st = getSatelliteStateAt(sat, now);
        if (st) {
            map.panTo(isMobileView() ? [st.lat, st.lng] : [0, st.lng]);
        }
    }
}

// Update Active Satellite Labels in HUD & Recenter Button
function updateActiveSatelliteUI() {
    const activeSat = SATELLITE_CONFIGS[activeSatelliteId];
    if (!activeSat) return;

    const targetNameElem = document.getElementById('telemetry-target-name');
    if (targetNameElem) {
        targetNameElem.textContent = getSatName(activeSat);
        targetNameElem.style.color = activeSat.color;
    }

    const btnRecenter = document.getElementById('btn-recenter');
    if (btnRecenter) {
        btnRecenter.textContent = L10N.btnRecenterTemplate.replace('{name}', activeSat.shortName);
    }
}

// Render Satellite Orbit Polylines & Time Badges
function renderSatelliteOrbit(sat, now) {
    if (!sat.enabled || !map) return;

    const pastPoints = generateAnchoredOrbit(sat, now, -60, 0, 0.5);
    const futurePoints = generateAnchoredOrbit(sat, now, 0, 60, 0.5);

    sat.pastPolylineGlow.setLatLngs(pastPoints);
    sat.pastPolylineCore.setLatLngs(pastPoints);

    sat.futurePolylineGlow.setLatLngs(futurePoints);
    sat.futurePolylineCore.setLatLngs(futurePoints);

    // Bring persistent polylines safely to front
    try {
        sat.pastPolylineGlow.bringToFront();
        sat.pastPolylineCore.bringToFront();
        sat.futurePolylineGlow.bringToFront();
        sat.futurePolylineCore.bringToFront();
    } catch (e) {
        console.warn('bringToFront warning:', e);
    }

    // Render Trajectory Time Badges (+15m, +30m, +45m, +60m)
    sat.timeBadgeMarkers.forEach(m => {
        if (map.hasLayer(m)) map.removeLayer(m);
    });
    sat.timeBadgeMarkers = [];

    [15, 30, 45, 60].forEach(min => {
        const idx = Math.min(Math.round(min * 2), futurePoints.length - 1);
        if (futurePoints[idx]) {
            const pt = futurePoints[idx];
            const badgeIcon = L.divIcon({
                className: 'orbit-marker-badge-wrapper',
                html: `
                    <div style="background:${sat.color}; color:#0b0e14; font-family:'Orbitron',sans-serif; font-weight:700; font-size:10px; padding:2px 6px; border-radius:10px; box-shadow:0 0 10px ${sat.color}; border:1px solid #ffffff; white-space:nowrap; display:flex; align-items:center; justify-content:center;">
                        +${min}${L10N.minuteSuffix}
                    </div>
                `,
                iconSize: [40, 20],
                iconAnchor: [20, 10]
            });
            const marker = L.marker(pt, { icon: badgeIcon }).addTo(map);
            sat.timeBadgeMarkers.push(marker);
        }
    });
}

// Update Map & Dashboard UI for all enabled satellites
function updateSimulation() {
    const now = isRealTime ? new Date() : targetDate;

    // Update each satellite
    for (const key of Object.keys(SATELLITE_CONFIGS)) {
        const sat = SATELLITE_CONFIGS[key];
        if (!sat.enabled) continue;

        const state = getSatelliteStateAt(sat, now);
        if (!state) continue;

        const { lat, lng, alt, speedKmH } = state;
        const latLng = [lat, lng];

        // Update Marker & Footprint
        sat.marker.setLatLng(latLng);
        const radiusMeters = calculateFootprintRadiusMeters(alt);
        sat.footprintCircle.setLatLng(latLng);
        sat.footprintCircle.setRadius(radiusMeters);

        // Update Popup Content
        const popupElem = document.getElementById(`popup-content-${sat.id}`);
        if (popupElem) {
            popupElem.innerHTML = `
                <b>${L10N.popupLat}</b> ${lat.toFixed(4)}°<br>
                <b>${L10N.popupLng}</b> ${lng.toFixed(4)}°<br>
                <b>${L10N.popupAlt}</b> ${Math.round(alt)} km<br>
                <b>${L10N.popupSpeed}</b> ${Math.round(speedKmH).toLocaleString()} km/h<br>
                <b>${L10N.popupTime}</b> ${now.toLocaleTimeString(L10N.locale)}
            `;
        }

        // Render Orbit Lines & Badges
        renderSatelliteOrbit(sat, now);

        // Update Telemetry Panel if this is the active satellite
        if (sat.id === activeSatelliteId) {
            document.getElementById('val-lat').textContent = `${lat.toFixed(4)}°`;
            document.getElementById('val-lng').textContent = `${lng.toFixed(4)}°`;
            document.getElementById('val-alt').innerHTML = `${Math.round(alt)} <span class="card-unit">km</span>`;
            document.getElementById('val-speed').innerHTML = `${Math.round(speedKmH).toLocaleString()} <span class="card-unit">km/h</span>`;

            // Auto-recenter map
            if (isAutoRecenter && map) {
                map.panTo(isMobileView() ? [lat, lng] : [0, lng]);
            }
        }
    }

    // Update Terminator Shadow
    if (terminator && typeof terminator.setTime === 'function') {
        terminator.setTime(now);
    }
}

// Fetch Live TLE Data for a Single Satellite with 4s timeout
async function fetchSatelliteTLE(sat) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
        const url = `https://celestrak.org/NORAD/elements/gp.php?CATNR=${sat.noradId}&FORMAT=tle`;
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const text = await response.text();

        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        let l1 = '', l2 = '';
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith(`1 ${sat.noradId}`)) {
                l1 = lines[i];
                l2 = lines[i + 1];
                break;
            }
        }

        if (l1 && l2) {
            const freshSatrec = satellite.twoline2satrec(l1, l2);
            if (freshSatrec && !freshSatrec.error) {
                sat.satrec = freshSatrec;
                console.log(`Updated fresh TLE for ${sat.shortName} (#${sat.noradId}).`);
                return true;
            }
        }
    } catch (err) {
        console.warn(`TLE fetch for ${sat.shortName} fallback used (${err.message}).`);
    } finally {
        clearTimeout(timeoutId);
    }
    return false;
}

// Fetch Live TLE Data for all satellites in parallel
async function loadAllTLEData() {
    const promises = Object.values(SATELLITE_CONFIGS).map(sat => fetchSatelliteTLE(sat));
    const results = await Promise.allSettled(promises);
    const anyUpdated = results.some(r => r.status === 'fulfilled' && r.value === true);
    if (anyUpdated) {
        updateSimulation();
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

    if (isMobileView() && dashboard) {
        dashboard.classList.add('collapsed');
    }

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

    // Toggle Auto-Recenter for active satellite
    btnRecenter.addEventListener('click', () => {
        isAutoRecenter = !isAutoRecenter;
        if (isAutoRecenter) {
            btnRecenter.classList.add('btn-active');
            const activeSat = SATELLITE_CONFIGS[activeSatelliteId];
            if (activeSat && activeSat.marker) {
                const latLng = activeSat.marker.getLatLng();
                map.panTo(isMobileView() ? [latLng.lat, latLng.lng] : [0, latLng.lng]);
            }
        } else {
            btnRecenter.classList.remove('btn-active');
        }
    });

    // Mobile Dashboard Toggle
    if (toggleDashboardBtn && dashboard) {
        toggleDashboardBtn.addEventListener('click', () => {
            dashboard.classList.toggle('collapsed');
        });
    }
}

// Main Initialization Process
window.addEventListener('DOMContentLoaded', () => {
    applyStaticTranslations();
    initMap();
    renderSatelliteSelector();
    setupEventListeners();

    // Run Simulation immediately with synchronous fallback satrecs
    updateSimulation();

    // Fetch live TLEs asynchronously in background
    loadAllTLEData();

    // Real-time Update Loop (1 FPS)
    updateTimer = setInterval(() => {
        if (isRealTime) {
            updateSimulation();
        }
    }, 1000);
});
