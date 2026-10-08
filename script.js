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
        popupTleEpoch: 'TLE元期:',
        satSelectorTitle: '衛星選択 / 表示切替',
        satSelectorHint: 'クリックで追跡',
        telemetryTargetLabel: '追跡中:',
        activeBadge: '追跡中',
        btnTleRefresh: 'TLE更新',
        labelTleEpoch: 'TLE元期:',
        tleStatusSuccess: '最新確認済',
        tleStatusUpdating: '更新中...',
        tleStatusError: '取得失敗 (キャッシュ使用)',
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
        popupTleEpoch: 'TLE Epoch:',
        satSelectorTitle: 'Satellite Selection / Display',
        satSelectorHint: 'Click row to track',
        telemetryTargetLabel: 'TRACKING:',
        activeBadge: 'TRACKING',
        btnTleRefresh: 'Update TLE',
        labelTleEpoch: 'TLE EPOCH:',
        tleStatusSuccess: 'Up to date',
        tleStatusUpdating: 'Updating...',
        tleStatusError: 'Failed (using cache)',
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
    },
    '20580': {
        id: '20580',
        noradId: 20580,
        name: {
            ja: 'ハッブル宇宙望遠鏡 (HST)',
            en: 'Hubble Space Telescope (HST)'
        },
        shortName: 'Hubble (HST)',
        color: '#38bdf8',
        pastColor: '#0284c7',
        glowClass: 'sat-glow-20580',
        enabled: false,
        fallbackTle: {
            line1: "1 20580U 90037B   26280.56374465  .00004531  00000+0  13576-3 0  9999",
            line2: "2 20580  28.4733  31.8546 0001508 335.5663  24.4861 15.31851452805818"
        },
        iconSvg: `
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="rgba(56, 189, 248, 0.22)" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 2"/>
                <rect x="27" y="16" width="10" height="32" rx="3" fill="#ffffff" stroke="#38bdf8" stroke-width="1.5"/>
                <path d="M27 16L22 10" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
                <rect x="10" y="26" width="14" height="12" rx="1" fill="#38bdf8" stroke="#ffffff" stroke-width="1"/>
                <rect x="40" y="26" width="14" height="12" rx="1" fill="#38bdf8" stroke="#ffffff" stroke-width="1"/>
                <circle cx="32" cy="32" r="3" fill="#ffffff"/>
            </svg>
        `
    },
    '25994': {
        id: '25994',
        noradId: 25994,
        name: {
            ja: 'Terra (EOS AM-1)',
            en: 'Terra (EOS AM-1)'
        },
        shortName: 'Terra',
        color: '#84cc16',
        pastColor: '#65a30d',
        glowClass: 'sat-glow-25994',
        enabled: false,
        fallbackTle: {
            line1: "1 25994U 99068A   26280.61696211  .00000188  00000+0  47189-4 0  9990",
            line2: "2 25994  97.9331 325.6368 0001437 199.5368 312.2094 14.61171007426025"
        },
        iconSvg: `
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="rgba(132, 204, 22, 0.22)" stroke="#84cc16" stroke-width="2" stroke-dasharray="4 2"/>
                <rect x="25" y="20" width="14" height="24" rx="2" fill="#ffffff" stroke="#84cc16" stroke-width="1.5"/>
                <rect x="8" y="24" width="14" height="16" rx="1" fill="#84cc16" stroke="#ffffff" stroke-width="1"/>
                <path d="M12 24V40M16 24V40" stroke="#ffffff" stroke-width="0.8"/>
                <rect x="42" y="28" width="6" height="8" rx="1" fill="#84cc16" stroke="#ffffff" stroke-width="1"/>
                <circle cx="32" cy="32" r="3" fill="#ffffff"/>
            </svg>
        `
    },
    '39084': {
        id: '39084',
        noradId: 39084,
        name: {
            ja: 'Landsat 8',
            en: 'Landsat 8'
        },
        shortName: 'Landsat 8',
        color: '#fb7185',
        pastColor: '#e11d48',
        glowClass: 'sat-glow-39084',
        enabled: false,
        fallbackTle: {
            line1: "1 39084U 13008A   26280.57467548  .00000158  00000+0  45045-4 0  9995",
            line2: "2 39084  98.2193 349.3079 0001305  94.7849 265.3499 14.57109285714263"
        },
        iconSvg: `
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="rgba(251, 113, 133, 0.22)" stroke="#fb7185" stroke-width="2" stroke-dasharray="4 2"/>
                <rect x="26" y="22" width="12" height="20" rx="2" fill="#ffffff" stroke="#fb7185" stroke-width="1.5"/>
                <rect x="41" y="24" width="15" height="16" rx="1" fill="#fb7185" stroke="#ffffff" stroke-width="1"/>
                <path d="M46 24V40M51 24V40" stroke="#ffffff" stroke-width="0.8"/>
                <circle cx="21" cy="32" r="4" fill="#fb7185" stroke="#ffffff" stroke-width="1"/>
                <circle cx="32" cy="32" r="2.5" fill="#ffffff"/>
            </svg>
        `
    },
    '49260': {
        id: '49260',
        noradId: 49260,
        name: {
            ja: 'Landsat 9',
            en: 'Landsat 9'
        },
        shortName: 'Landsat 9',
        color: '#e879f9',
        pastColor: '#c026d3',
        glowClass: 'sat-glow-49260',
        enabled: false,
        fallbackTle: {
            line1: "1 49260U 21088A   26280.19705414  .00000193  00000+0  52816-4 0  9997",
            line2: "2 49260  98.2173 348.9525 0001402  88.6281 271.5079 14.57107910267314"
        },
        iconSvg: `
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="rgba(232, 121, 249, 0.22)" stroke="#e879f9" stroke-width="2" stroke-dasharray="4 2"/>
                <rect x="26" y="22" width="12" height="20" rx="2" fill="#ffffff" stroke="#e879f9" stroke-width="1.5"/>
                <rect x="41" y="24" width="15" height="16" rx="1" fill="#e879f9" stroke="#ffffff" stroke-width="1"/>
                <path d="M46 24V40M51 24V40" stroke="#ffffff" stroke-width="0.8"/>
                <circle cx="21" cy="32" r="4" fill="#e879f9" stroke="#ffffff" stroke-width="1"/>
                <circle cx="32" cy="32" r="2.5" fill="#ffffff"/>
            </svg>
        `
    },
    // Soviet Zenit-2 Rocket Second Stage (SL-16 R/B) Debris Group
    '19650': {
        id: '19650',
        noradId: 19650,
        groupId: 'sl16_rb',
        name: { ja: 'SL-16 R/B (Cosmos 1980 残骸)', en: 'SL-16 R/B (#19650 Cosmos 1980)' },
        shortName: 'SL-16 #19650',
        color: '#ff3b30',
        pastColor: '#ff9500',
        glowClass: 'sat-glow-sl16',
        enabled: false,
        fallbackTle: {
            line1: "1 19650U 88102B   26280.45473211  .00000155  00000+0  10253-3 0  9999",
            line2: "2 19650  70.9987  65.9105 0012706  41.4142 318.7942 14.16173741956875"
        },
        iconSvg: `
            <svg width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="rgba(255, 59, 48, 0.22)" stroke="#ff3b30" stroke-width="2" stroke-dasharray="3 3"/>
                <rect x="27" y="16" width="10" height="28" rx="2" fill="#ffffff" stroke="#ff3b30" stroke-width="1.5"/>
                <path d="M27 23H37M27 30H37M27 37H37" stroke="#ff3b30" stroke-width="0.8"/>
                <path d="M29 44L26 50H38L35 44Z" fill="#ff3b30" stroke="#ffffff" stroke-width="1"/>
                <circle cx="32" cy="30" r="2.5" fill="#ff3b30"/>
            </svg>
        `
    },
    '25407': {
        id: '25407',
        noradId: 25407,
        groupId: 'sl16_rb',
        name: { ja: 'SL-16 R/B (Cosmos 2360 残骸)', en: 'SL-16 R/B (#25407 Cosmos 2360)' },
        shortName: 'SL-16 #25407',
        color: '#ff3b30',
        pastColor: '#ff9500',
        glowClass: 'sat-glow-sl16',
        enabled: false,
        fallbackTle: {
            line1: "1 25407U 98045B   26280.47045178  .00000100  00000+0  74355-4 0  9996",
            line2: "2 25407  71.0086  96.1938 0005621  51.7771 308.3857 14.16212145457085"
        },
        iconSvg: `
            <svg width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="rgba(255, 59, 48, 0.22)" stroke="#ff3b30" stroke-width="2" stroke-dasharray="3 3"/>
                <rect x="27" y="16" width="10" height="28" rx="2" fill="#ffffff" stroke="#ff3b30" stroke-width="1.5"/>
                <path d="M27 23H37M27 30H37M27 37H37" stroke="#ff3b30" stroke-width="0.8"/>
                <path d="M29 44L26 50H38L35 44Z" fill="#ff3b30" stroke="#ffffff" stroke-width="1"/>
                <circle cx="32" cy="30" r="2.5" fill="#ff3b30"/>
            </svg>
        `
    },
    '23405': {
        id: '23405',
        noradId: 23405,
        groupId: 'sl16_rb',
        name: { ja: 'SL-16 R/B (Cosmos 2297 残骸)', en: 'SL-16 R/B (#23405 Cosmos 2297)' },
        shortName: 'SL-16 #23405',
        color: '#ff3b30',
        pastColor: '#ff9500',
        glowClass: 'sat-glow-sl16',
        enabled: false,
        fallbackTle: {
            line1: "1 23405U 94077B   26280.40503933 -.00000196  00000+0 -75884-4 0  9999",
            line2: "2 23405  70.9813 267.0677 0004225 237.5342 122.5372 14.15584961646190"
        },
        iconSvg: `
            <svg width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="rgba(255, 59, 48, 0.22)" stroke="#ff3b30" stroke-width="2" stroke-dasharray="3 3"/>
                <rect x="27" y="16" width="10" height="28" rx="2" fill="#ffffff" stroke="#ff3b30" stroke-width="1.5"/>
                <path d="M27 23H37M27 30H37M27 37H37" stroke="#ff3b30" stroke-width="0.8"/>
                <path d="M29 44L26 50H38L35 44Z" fill="#ff3b30" stroke="#ffffff" stroke-width="1"/>
                <circle cx="32" cy="30" r="2.5" fill="#ff3b30"/>
            </svg>
        `
    },
    '24298': {
        id: '24298',
        noradId: 24298,
        groupId: 'sl16_rb',
        name: { ja: 'SL-16 R/B (Cosmos 2333 残骸)', en: 'SL-16 R/B (#24298 Cosmos 2333)' },
        shortName: 'SL-16 #24298',
        color: '#ff3b30',
        pastColor: '#ff9500',
        glowClass: 'sat-glow-sl16',
        enabled: false,
        fallbackTle: {
            line1: "1 24298U 96051B   26280.49133069  .00000055  00000+0  56550-4 0  9993",
            line2: "2 24298  70.7668  87.0059 0017724 193.1162 166.9499 14.12486978551559"
        },
        iconSvg: `
            <svg width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="rgba(255, 59, 48, 0.22)" stroke="#ff3b30" stroke-width="2" stroke-dasharray="3 3"/>
                <rect x="27" y="16" width="10" height="28" rx="2" fill="#ffffff" stroke="#ff3b30" stroke-width="1.5"/>
                <path d="M27 23H37M27 30H37M27 37H37" stroke="#ff3b30" stroke-width="0.8"/>
                <path d="M29 44L26 50H38L35 44Z" fill="#ff3b30" stroke="#ffffff" stroke-width="1"/>
                <circle cx="32" cy="30" r="2.5" fill="#ff3b30"/>
            </svg>
        `
    },
    '20625': {
        id: '20625',
        noradId: 20625,
        groupId: 'sl16_rb',
        name: { ja: 'SL-16 R/B (Cosmos 2082 残骸)', en: 'SL-16 R/B (#20625 Cosmos 2082)' },
        shortName: 'SL-16 #20625',
        color: '#ff3b30',
        pastColor: '#ff9500',
        glowClass: 'sat-glow-sl16',
        enabled: false,
        fallbackTle: {
            line1: "1 20625U 90046B   26280.20543802  .00000220  00000+0  13796-3 0  9998",
            line2: "2 20625  70.9995 213.6786 0015066 334.8831  25.1557 14.15037954878318"
        },
        iconSvg: `
            <svg width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="rgba(255, 59, 48, 0.22)" stroke="#ff3b30" stroke-width="2" stroke-dasharray="3 3"/>
                <rect x="27" y="16" width="10" height="28" rx="2" fill="#ffffff" stroke="#ff3b30" stroke-width="1.5"/>
                <path d="M27 23H37M27 30H37M27 37H37" stroke="#ff3b30" stroke-width="0.8"/>
                <path d="M29 44L26 50H38L35 44Z" fill="#ff3b30" stroke="#ffffff" stroke-width="1"/>
                <circle cx="32" cy="30" r="2.5" fill="#ff3b30"/>
            </svg>
        `
    },
    '22566': {
        id: '22566',
        noradId: 22566,
        groupId: 'sl16_rb',
        name: { ja: 'SL-16 R/B (Cosmos 2237 残骸)', en: 'SL-16 R/B (#22566 Cosmos 2237)' },
        shortName: 'SL-16 #22566',
        color: '#ff3b30',
        pastColor: '#ff9500',
        glowClass: 'sat-glow-sl16',
        enabled: false,
        fallbackTle: {
            line1: "1 22566U 93016B   26280.03301126 -.00000063  00000+0 -80017-5 0  9995",
            line2: "2 22566  71.0062 131.2955 0010652 348.5723  11.5156 14.15323992732078"
        },
        iconSvg: `
            <svg width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="rgba(255, 59, 48, 0.22)" stroke="#ff3b30" stroke-width="2" stroke-dasharray="3 3"/>
                <rect x="27" y="16" width="10" height="28" rx="2" fill="#ffffff" stroke="#ff3b30" stroke-width="1.5"/>
                <path d="M27 23H37M27 30H37M27 37H37" stroke="#ff3b30" stroke-width="0.8"/>
                <path d="M29 44L26 50H38L35 44Z" fill="#ff3b30" stroke="#ffffff" stroke-width="1"/>
                <circle cx="32" cy="30" r="2.5" fill="#ff3b30"/>
            </svg>
        `
    },
    '23088': {
        id: '23088',
        noradId: 23088,
        groupId: 'sl16_rb',
        name: { ja: 'SL-16 R/B (Cosmos 2278 残骸)', en: 'SL-16 R/B (#23088 Cosmos 2278)' },
        shortName: 'SL-16 #23088',
        color: '#ff3b30',
        pastColor: '#ff9500',
        glowClass: 'sat-glow-sl16',
        enabled: false,
        fallbackTle: {
            line1: "1 23088U 94023B   26280.43526478  .00000299  00000+0  17897-3 0  9990",
            line2: "2 23088  71.0021 346.1970 0004663 310.1726  49.8988 14.15033451676049"
        },
        iconSvg: `
            <svg width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="rgba(255, 59, 48, 0.22)" stroke="#ff3b30" stroke-width="2" stroke-dasharray="3 3"/>
                <rect x="27" y="16" width="10" height="28" rx="2" fill="#ffffff" stroke="#ff3b30" stroke-width="1.5"/>
                <path d="M27 23H37M27 30H37M27 37H37" stroke="#ff3b30" stroke-width="0.8"/>
                <path d="M29 44L26 50H38L35 44Z" fill="#ff3b30" stroke="#ffffff" stroke-width="1"/>
                <circle cx="32" cy="30" r="2.5" fill="#ff3b30"/>
            </svg>
        `
    },
    '23705': {
        id: '23705',
        noradId: 23705,
        groupId: 'sl16_rb',
        name: { ja: 'SL-16 R/B (Cosmos 2322 残骸)', en: 'SL-16 R/B (#23705 Cosmos 2322)' },
        shortName: 'SL-16 #23705',
        color: '#ff3b30',
        pastColor: '#ff9500',
        glowClass: 'sat-glow-sl16',
        enabled: false,
        fallbackTle: {
            line1: "1 23705U 95058B   26280.49285459 -.00000251  00000+0 -10374-3 0  9995",
            line2: "2 23705  71.0192  95.5677 0011716 167.1600 192.9824 14.15518678597827"
        },
        iconSvg: `
            <svg width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="rgba(255, 59, 48, 0.22)" stroke="#ff3b30" stroke-width="2" stroke-dasharray="3 3"/>
                <rect x="27" y="16" width="10" height="28" rx="2" fill="#ffffff" stroke="#ff3b30" stroke-width="1.5"/>
                <path d="M27 23H37M27 30H37M27 37H37" stroke="#ff3b30" stroke-width="0.8"/>
                <path d="M29 44L26 50H38L35 44Z" fill="#ff3b30" stroke="#ffffff" stroke-width="1"/>
                <circle cx="32" cy="30" r="2.5" fill="#ff3b30"/>
            </svg>
        `
    },
    '31793': {
        id: '31793',
        noradId: 31793,
        groupId: 'sl16_rb',
        name: { ja: 'SL-16 R/B (Cosmos 2428 残骸)', en: 'SL-16 R/B (#31793 Cosmos 2428)' },
        shortName: 'SL-16 #31793',
        color: '#ff3b30',
        pastColor: '#ff9500',
        glowClass: 'sat-glow-sl16',
        enabled: false,
        fallbackTle: {
            line1: "1 31793U 07029B   26280.52086557  .00000317  00000+0  18876-3 0  9990",
            line2: "2 31793  70.9732  87.0862 0001911 278.8663 138.1629 14.14862671995335"
        },
        iconSvg: `
            <svg width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="rgba(255, 59, 48, 0.22)" stroke="#ff3b30" stroke-width="2" stroke-dasharray="3 3"/>
                <rect x="27" y="16" width="10" height="28" rx="2" fill="#ffffff" stroke="#ff3b30" stroke-width="1.5"/>
                <path d="M27 23H37M27 30H37M27 37H37" stroke="#ff3b30" stroke-width="0.8"/>
                <path d="M29 44L26 50H38L35 44Z" fill="#ff3b30" stroke="#ffffff" stroke-width="1"/>
                <circle cx="32" cy="30" r="2.5" fill="#ff3b30"/>
            </svg>
        `
    }
};

// Satellite Group Definitions (Allows batch toggling in the UI)
const SATELLITE_GROUPS = {
    'sl16_rb': {
        id: 'sl16_rb',
        name: {
            ja: 'SL-16 R/B (Zenit残骸 9機)',
            en: 'SL-16 R/B (Zenit Debris 9 bodies)'
        },
        shortName: 'SL-16 R/B Group',
        color: '#ff3b30',
        pastColor: '#ff9500',
        noradIds: [19650, 25407, 23405, 24298, 20625, 22566, 23088, 23705, 31793],
        primaryId: '19650'
    }
};

// TLE Cache & Epoch Parsing Helpers
const TLE_CACHE_KEY = 'SATELLITE_TLE_CACHE_V2';

function parseTLEEpoch(line1) {
    if (!line1 || line1.length < 32) return null;
    const yearStr = line1.substring(18, 20).trim();
    const dayStr = line1.substring(20, 32).trim();
    let year = parseInt(yearStr, 10);
    year = year < 57 ? 2000 + year : 1900 + year;
    const day = parseFloat(dayStr);
    if (isNaN(year) || isNaN(day)) return null;

    const date = new Date(Date.UTC(year, 0, 1));
    date.setUTCMilliseconds((day - 1) * 86400 * 1000);
    return date;
}

function formatEpochDate(date) {
    if (!date || isNaN(date.getTime())) return '--';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${y}/${m}/${d} ${hh}:${mm}`;
}

function getStoredTLECache() {
    try {
        const raw = localStorage.getItem(TLE_CACHE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}

function saveTLEToCache(satId, line1, line2, epochDate) {
    try {
        const cache = getStoredTLECache();
        cache[satId] = {
            line1,
            line2,
            epoch: epochDate ? epochDate.toISOString() : null,
            fetchedAt: Date.now()
        };
        localStorage.setItem(TLE_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
        console.warn('LocalStorage save error:', e);
    }
}

// Application State
let map = null;
let terminator = null;
let activeSatelliteId = '25544'; // Defaults to ISS
let targetDate = new Date();
let isRealTime = true;
let isAutoRecenter = true;
let updateTimer = null;

// Initialize Satellite Runtime Structures with LocalStorage Cache
const cachedTLEs = getStoredTLECache();

for (const key of Object.keys(SATELLITE_CONFIGS)) {
    const sat = SATELLITE_CONFIGS[key];
    sat.marker = null;
    sat.footprintCircle = null;
    sat.pastPolylineGlow = null;
    sat.pastPolylineCore = null;
    sat.futurePolylineGlow = null;
    sat.futurePolylineCore = null;
    sat.timeBadgeMarkers = [];

    // Use cached TLE if available, otherwise fallback
    let activeLine1 = sat.fallbackTle.line1;
    let activeLine2 = sat.fallbackTle.line2;
    let cachedEpoch = null;
    let cachedFetchedAt = null;

    if (cachedTLEs[sat.id] && cachedTLEs[sat.id].line1 && cachedTLEs[sat.id].line2) {
        activeLine1 = cachedTLEs[sat.id].line1;
        activeLine2 = cachedTLEs[sat.id].line2;
        if (cachedTLEs[sat.id].epoch) {
            cachedEpoch = new Date(cachedTLEs[sat.id].epoch);
        }
        cachedFetchedAt = cachedTLEs[sat.id].fetchedAt || null;
    }

    sat.currentTle = {
        line1: activeLine1,
        line2: activeLine2,
        epoch: cachedEpoch || parseTLEEpoch(activeLine1),
        fetchedAt: cachedFetchedAt
    };

    try {
        sat.satrec = satellite.twoline2satrec(activeLine1, activeLine2);
    } catch(e) {
        console.warn(`Initial satrec error for ${sat.shortName}:`, e);
    }
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

    const targetLabelElem = document.getElementById('telemetry-target-label');
    if (targetLabelElem) targetLabelElem.textContent = L10N.telemetryTargetLabel;

    const tleBtnText = document.getElementById('tle-refresh-btn-text');
    if (tleBtnText) tleBtnText.textContent = L10N.btnTleRefresh;

    const labelTleEpoch = document.getElementById('label-tle-epoch');
    if (labelTleEpoch) labelTleEpoch.textContent = L10N.labelTleEpoch;

    const statusText = document.getElementById('tle-status-text');
    if (statusText) statusText.textContent = L10N.tleStatusSuccess;

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

// Build and Render Satellite Selector in Dashboard (Supports single satellites & debris groups)
function renderSatelliteSelector() {
    const listContainer = document.getElementById('sat-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    // 1. Render Individual Satellites (not part of any group)
    for (const key of Object.keys(SATELLITE_CONFIGS)) {
        const sat = SATELLITE_CONFIGS[key];
        if (sat.groupId) continue; // Skip grouped satellites here

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

    // 2. Render Groups (e.g., SL-16 R/B Debris Group)
    for (const grpKey of Object.keys(SATELLITE_GROUPS)) {
        const group = SATELLITE_GROUPS[grpKey];
        const groupSats = group.noradIds.map(id => SATELLITE_CONFIGS[String(id)]).filter(Boolean);
        const isAnyEnabled = groupSats.some(s => s.enabled);
        const isGroupActive = groupSats.some(s => s.id === activeSatelliteId);

        const groupItem = document.createElement('div');
        groupItem.className = `sat-item ${isGroupActive ? 'active' : ''}`;
        groupItem.style.setProperty('--sat-color', group.color);
        groupItem.dataset.groupId = group.id;

        const groupLabel = isJapanese ? group.name.ja : group.name.en;
        const tagText = isJapanese ? `${group.noradIds.length}機` : `${group.noradIds.length} obj`;

        groupItem.innerHTML = `
            <div class="sat-item-left">
                <label class="sat-checkbox-wrapper" onclick="event.stopPropagation();">
                    <input type="checkbox" class="sat-checkbox group-checkbox" data-group-id="${group.id}" ${isAnyEnabled ? 'checked' : ''}>
                </label>
                <div class="sat-color-dot" style="background:${group.color}; color:${group.color};"></div>
                <div class="sat-meta">
                    <div class="sat-name">${groupLabel} <span class="sat-group-tag">${tagText}</span></div>
                    <div class="sat-sub">NORAD #${group.noradIds[0]} ~ #${group.noradIds[group.noradIds.length - 1]}</div>
                </div>
            </div>
            <div class="sat-badge">${L10N.activeBadge}</div>
        `;

        // Group row click: batch-enables group if disabled, and focuses primary debris
        groupItem.addEventListener('click', () => {
            const checkbox = groupItem.querySelector('.group-checkbox');
            if (!groupSats.some(s => s.enabled)) {
                if (checkbox) checkbox.checked = true;
                toggleSatelliteGroupVisibility(group.id, true);
            }
            setActiveSatellite(group.primaryId);
        });

        // Group checkbox change: batch toggles all satellites in group
        const groupCheckbox = groupItem.querySelector('.group-checkbox');
        groupCheckbox.addEventListener('change', (e) => {
            e.stopPropagation();
            const checked = e.target.checked;
            toggleSatelliteGroupVisibility(group.id, checked);
        });

        listContainer.appendChild(groupItem);
    }
}

// Toggle Visibility of an entire Satellite Group (e.g. SL-16 Debris)
function toggleSatelliteGroupVisibility(groupId, isVisible) {
    const group = SATELLITE_GROUPS[groupId];
    if (!group) return;

    for (const noradId of group.noradIds) {
        toggleSatelliteVisibility(String(noradId), isVisible, false);
    }
    updateSimulation();
}

// Toggle Visibility of a Single Satellite on Map
function toggleSatelliteVisibility(satId, isVisible, shouldUpdateSim = true) {
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

    if (shouldUpdateSim) {
        updateSimulation();
    }
}

// Switch Active Satellite Target
function setActiveSatellite(satId) {
    if (!SATELLITE_CONFIGS[satId]) return;
    activeSatelliteId = satId;
    const targetSat = SATELLITE_CONFIGS[satId];

    // Update active class on list items (matches either individual satellite or group)
    document.querySelectorAll('.sat-item').forEach(item => {
        if (item.dataset.satId === satId) {
            item.classList.add('active');
        } else if (item.dataset.groupId && targetSat.groupId === item.dataset.groupId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    updateActiveSatelliteUI();
    updateSimulation();

    // Auto-recenter to newly active satellite if enabled
    if (isAutoRecenter && map) {
        const now = isRealTime ? new Date() : targetDate;
        const st = getSatelliteStateAt(targetSat, now);
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

    const epochElem = document.getElementById('val-tle-epoch');
    if (epochElem) {
        epochElem.textContent = (activeSat.currentTle && activeSat.currentTle.epoch)
            ? formatEpochDate(activeSat.currentTle.epoch)
            : '--';
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

        // Update Popup Content with TLE Epoch
        const popupElem = document.getElementById(`popup-content-${sat.id}`);
        if (popupElem) {
            const epochStr = (sat.currentTle && sat.currentTle.epoch)
                ? formatEpochDate(sat.currentTle.epoch)
                : '--';
            popupElem.innerHTML = `
                <b>${L10N.popupLat}</b> ${lat.toFixed(4)}°<br>
                <b>${L10N.popupLng}</b> ${lng.toFixed(4)}°<br>
                <b>${L10N.popupAlt}</b> ${Math.round(alt)} km<br>
                <b>${L10N.popupSpeed}</b> ${Math.round(speedKmH).toLocaleString()} km/h<br>
                <b>${L10N.popupTime}</b> ${now.toLocaleTimeString(L10N.locale)}<br>
                <b>${L10N.popupTleEpoch}</b> ${epochStr}
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

// TLE Refresh Engine States
let isRefreshingTLE = false;
let lastRefreshTimestamp = 0;
const TLE_COOLDOWN_MS = 5000; // 5s debounce for manual button
const AUTO_REFRESH_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

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
                const newEpoch = parseTLEEpoch(l1);
                sat.satrec = freshSatrec;
                sat.currentTle = {
                    line1: l1,
                    line2: l2,
                    epoch: newEpoch,
                    fetchedAt: Date.now()
                };
                saveTLEToCache(sat.id, l1, l2, newEpoch);
                console.log(`Updated fresh TLE for ${sat.shortName} (#${sat.noradId}). Epoch: ${newEpoch ? newEpoch.toISOString() : 'unknown'}`);
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

// Refresh Live TLE Data for all satellites in parallel (supports manual or auto)
async function refreshAllTLEs(isManual = false) {
    if (isRefreshingTLE) return;
    const now = Date.now();
    if (isManual && (now - lastRefreshTimestamp < TLE_COOLDOWN_MS)) {
        return;
    }
    isRefreshingTLE = true;
    lastRefreshTimestamp = now;

    const btnRefresh = document.getElementById('btn-tle-refresh');
    const refreshIcon = document.getElementById('tle-refresh-icon');
    const statusContainer = document.getElementById('tle-fetch-status');
    const statusText = document.getElementById('tle-status-text');

    if (btnRefresh) btnRefresh.disabled = true;
    if (refreshIcon) refreshIcon.classList.add('spinning');
    if (statusContainer) statusContainer.className = 'tle-info-status updating';
    if (statusText) statusText.textContent = L10N.tleStatusUpdating;

    const promises = Object.values(SATELLITE_CONFIGS).map(sat => fetchSatelliteTLE(sat));
    const results = await Promise.allSettled(promises);
    const updatedCount = results.filter(r => r.status === 'fulfilled' && r.value === true).length;

    if (refreshIcon) refreshIcon.classList.remove('spinning');
    if (statusContainer) {
        statusContainer.className = (updatedCount > 0 || !isManual) ? 'tle-info-status' : 'tle-info-status error';
    }

    const timeStr = new Date().toLocaleTimeString(L10N.locale, { hour: '2-digit', minute: '2-digit' });
    if (statusText) {
        statusText.textContent = `${L10N.tleStatusSuccess} (${timeStr})`;
    }

    updateActiveSatelliteUI();
    updateSimulation();

    // Re-enable button after cooldown
    setTimeout(() => {
        isRefreshingTLE = false;
        if (btnRefresh) btnRefresh.disabled = false;
    }, isManual ? TLE_COOLDOWN_MS : 500);
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
    const btnTleRefresh = document.getElementById('btn-tle-refresh');

    if (isMobileView() && dashboard) {
        dashboard.classList.add('collapsed');
    }

    const nowISO = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    datetimePicker.value = nowISO;

    // Manual TLE Refresh Click
    if (btnTleRefresh) {
        btnTleRefresh.addEventListener('click', () => {
            refreshAllTLEs(true);
        });
    }

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

    // Periodic Background TLE Refresh (every 30 mins)
    setInterval(() => {
        refreshAllTLEs(false);
    }, AUTO_REFRESH_INTERVAL_MS);

    // Refresh when tab becomes visible if over 30 mins elapsed
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && (Date.now() - lastRefreshTimestamp > AUTO_REFRESH_INTERVAL_MS)) {
            refreshAllTLEs(false);
        }
    });
}

// Main Initialization Process
window.addEventListener('DOMContentLoaded', () => {
    applyStaticTranslations();
    initMap();
    renderSatelliteSelector();
    setupEventListeners();

    // Run Simulation immediately with synchronous (or cached) satrecs
    updateSimulation();

    // Fetch live TLEs asynchronously in background
    refreshAllTLEs(false);

    // Real-time Update Loop (1 FPS)
    updateTimer = setInterval(() => {
        if (isRealTime) {
            updateSimulation();
        }
    }, 1000);
});

