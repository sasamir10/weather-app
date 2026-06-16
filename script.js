"use strict";

/* 1.State */
const state = {
    city: "Dhaka",
    lat: 23.8103,
    lon: 90.4125,
    tempUnit: "C", // 'C' | 'F'
    windUnit: "kmh", // 'kmh' | 'mph'
    dynamicBg: true,
    lightningFx: true,
    currentWeather: null,
    recentCities: JSON.parse(localStorage.getItem("nimbus_recent") || "[]"),
};

/* 2. Element Refs */
const $ = (id) => document.getElementById(id);

const el = {
    // screens
    screenLoading: $("screenLoading"),
    screenHome: $("screenHome"),
    screenSearch: $("screenSearch"),
    screenForecast: $("screenForecast"),
    screenSettings: $("screenSettings"),

    // home
    statusTime: $("statusTime"),
    cityName: $("cityName"),
    locationPill: $("locationPill"),
    heroIllustration: $("heroIllustration"),
    heroTemp: $("heroTemp"),
    heroCondition: $("heroCondition"),
    statusDateBlock: $("statusDateBlock"),
    statusDateDay: $("statusDateDay"),
    statusDateNum: $("statusDateNum"),
    tempHigh: $("tempHigh"),
    tempLow: $("tempLow"),
    statPrecip: $("statPrecip"),
    statHumidity: $("statHumidity"),
    statWind: $("statWind"),
    statFeelsLike: $("statFeelsLike"),
    hourlyList: $("hourlyList"),
    forecastList: $("forecastList"),
    uvBarFill: $("uvBarFill"),
    uvValue: $("uvValue"),
    lightningFlash: $("lightningFlash"),

    // search
    searchInput: $("searchInput"),
    searchLabel: $("searchLabel"),
    cityResults: $("cityResults"),
    searchBackBtn: $("searchBackBtn"),

    // forecast screen
    extForecastGrid: $("extForecastGrid"),

    // settings
    toggleBg: $("toggleBg"),
    toggleLightning: $("toggleLightning"),
};

/* 3. WMO Weather Code → Label + Mood */
function decodeWMO(code) {
    const map = {
        0: { label: "Clear Sky", mood: "sunny", icon: "sun" },
        1: { label: "Mainly Clear", mood: "sunny", icon: "sun" },
        2: { label: "Partly Cloudy", mood: "cloudy", icon: "cloud-sun" },
        3: { label: "Overcast", mood: "cloudy", icon: "cloud" },
        45: { label: "Foggy", mood: "cloudy", icon: "cloud" },
        48: { label: "Icy Fog", mood: "cloudy", icon: "cloud" },
        51: { label: "Light Drizzle", mood: "rainy", icon: "rain" },
        53: { label: "Drizzle", mood: "rainy", icon: "rain" },
        55: { label: "Heavy Drizzle", mood: "rainy", icon: "rain" },
        61: { label: "Light Rain", mood: "rainy", icon: "rain" },
        63: { label: "Rain", mood: "rainy", icon: "rain" },
        65: { label: "Heavy Rain", mood: "rainy", icon: "rain" },
        71: { label: "Light Snow", mood: "snowy", icon: "snow" },
        73: { label: "Snow", mood: "snowy", icon: "snow" },
        75: { label: "Heavy Snow", mood: "snowy", icon: "snow" },
        77: { label: "Snow Grains", mood: "snowy", icon: "snow" },
        80: { label: "Rain Showers", mood: "rainy", icon: "rain" },
        81: { label: "Rain Showers", mood: "rainy", icon: "rain" },
        82: { label: "Heavy Showers", mood: "rainy", icon: "rain" },
        85: { label: "Snow Showers", mood: "snowy", icon: "snow" },
        86: { label: "Heavy Snow Showers", mood: "snowy", icon: "snow" },
        95: { label: "Thunderstorm", mood: "stormy", icon: "storm" },
        96: { label: "Thunderstorm", mood: "stormy", icon: "storm" },
        99: { label: "Severe Thunderstorm", mood: "stormy", icon: "storm" },
    };
    return map[code] || { label: "Unknown", mood: "cloudy", icon: "cloud" };
}

/* 4. SVG Weather Illustrations */
const illustrations = {
    sun: `
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="28" fill="#FDB97D" opacity="0.95"/>
      <circle cx="60" cy="60" r="22" fill="#FBBF24"/>
      <g stroke="#FDB97D" stroke-width="3.5" stroke-linecap="round" opacity="0.7">
        <line x1="60" y1="10" x2="60" y2="20"/>
        <line x1="60" y1="100" x2="60" y2="110"/>
        <line x1="10" y1="60" x2="20" y2="60"/>
        <line x1="100" y1="60" x2="110" y2="60"/>
        <line x1="24" y1="24" x2="31" y2="31"/>
        <line x1="89" y1="89" x2="96" y2="96"/>
        <line x1="96" y1="24" x2="89" y2="31"/>
        <line x1="31" y1="89" x2="24" y2="96"/>
      </g>
    </svg>`,

    "cloud-sun": `
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="75" cy="38" r="18" fill="#FDB97D" opacity="0.9"/>
      <g stroke="#FDB97D" stroke-width="2.5" stroke-linecap="round" opacity="0.6">
        <line x1="75" y1="12" x2="75" y2="18"/>
        <line x1="75" y1="58" x2="75" y2="64"/>
        <line x1="49" y1="38" x2="55" y2="38"/>
        <line x1="95" y1="38" x2="101" y2="38"/>
        <line x1="57" y1="20" x2="61" y2="24"/>
        <line x1="89" y1="52" x2="93" y2="56"/>
        <line x1="93" y1="20" x2="89" y2="24"/>
        <line x1="61" y1="52" x2="57" y2="56"/>
      </g>
      <ellipse cx="52" cy="74" rx="26" ry="18" fill="rgba(255,255,255,0.18)"/>
      <ellipse cx="68" cy="68" rx="22" ry="16" fill="rgba(255,255,255,0.22)"/>
      <ellipse cx="80" cy="74" rx="18" ry="14" fill="rgba(255,255,255,0.18)"/>
      <ellipse cx="62" cy="78" rx="34" ry="14" fill="rgba(255,255,255,0.28)"/>
    </svg>`,

    cloud: `
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="44" cy="65" rx="26" ry="20" fill="rgba(255,255,255,0.15)"/>
      <ellipse cx="62" cy="58" rx="24" ry="18" fill="rgba(255,255,255,0.2)"/>
      <ellipse cx="80" cy="65" rx="22" ry="17" fill="rgba(255,255,255,0.15)"/>
      <ellipse cx="62" cy="72" rx="38" ry="16" fill="rgba(255,255,255,0.25)"/>
    </svg>`,

    rain: `
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="44" cy="52" rx="24" ry="17" fill="rgba(255,255,255,0.14)"/>
      <ellipse cx="62" cy="46" rx="22" ry="16" fill="rgba(255,255,255,0.18)"/>
      <ellipse cx="78" cy="52" rx="20" ry="15" fill="rgba(255,255,255,0.14)"/>
      <ellipse cx="60" cy="58" rx="36" ry="14" fill="rgba(255,255,255,0.22)"/>
      <g stroke="#93C5FD" stroke-width="2.5" stroke-linecap="round" opacity="0.8">
        <line x1="44" y1="76" x2="38" y2="90"/>
        <line x1="56" y1="80" x2="50" y2="94"/>
        <line x1="68" y1="76" x2="62" y2="90"/>
        <line x1="80" y1="80" x2="74" y2="94"/>
      </g>
    </svg>`,

    storm: `
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="44" cy="48" rx="24" ry="17" fill="rgba(255,255,255,0.10)"/>
      <ellipse cx="62" cy="42" rx="22" ry="16" fill="rgba(255,255,255,0.14)"/>
      <ellipse cx="78" cy="48" rx="20" ry="15" fill="rgba(255,255,255,0.10)"/>
      <ellipse cx="60" cy="54" rx="36" ry="14" fill="rgba(255,255,255,0.18)"/>
      <g stroke="#94A3B8" stroke-width="2" stroke-linecap="round" opacity="0.7">
        <line x1="42" y1="70" x2="36" y2="82"/>
        <line x1="80" y1="70" x2="74" y2="82"/>
      </g>
      <polyline points="66,62 56,80 64,80 54,98" stroke="#FCD34D" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.95"/>
    </svg>`,

    snow: `
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="44" cy="52" rx="24" ry="17" fill="rgba(255,255,255,0.16)"/>
      <ellipse cx="62" cy="46" rx="22" ry="16" fill="rgba(255,255,255,0.20)"/>
      <ellipse cx="78" cy="52" rx="20" ry="15" fill="rgba(255,255,255,0.16)"/>
      <ellipse cx="60" cy="58" rx="36" ry="14" fill="rgba(255,255,255,0.24)"/>
      <g fill="#BAE6FD" opacity="0.85">
        <circle cx="44" cy="80" r="3"/>
        <circle cx="60" cy="86" r="3"/>
        <circle cx="76" cy="80" r="3"/>
        <circle cx="52" cy="94" r="2.5"/>
        <circle cx="68" cy="94" r="2.5"/>
      </g>
    </svg>`,
};

/* 5. Utility Helpers */
function formatTemp(c) {
    if (state.tempUnit === "F") return `${Math.round((c * 9) / 5 + 32)}°`;
    return `${Math.round(c)}°`;
}

function formatWind(kmh) {
    if (state.windUnit === "mph") return `${Math.round(kmh * 0.621371)} mph`;
    return `${Math.round(kmh)} km/h`;
}

function toUvLabel(uv) {
    if (uv <= 2) return "Low";
    if (uv <= 5) return "Moderate";
    if (uv <= 7) return "High";
    if (uv <= 10) return "Very High";
    return "Extreme";
}

function dayName(dateStr, short = false) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { weekday: short ? "short" : "long" });
}

function hourLabel(isoStr) {
    const d = new Date(isoStr);
    let h = d.getHours();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h} ${ampm}`;
}

function liveTime() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    el.statusTime.textContent = `${h}:${m}`;
}

function updateStatusDate() {
    const now = new Date();
    el.statusDateDay.textContent = now.toLocaleDateString("en-US", {
        weekday: "long",
    });
    el.statusDateNum.textContent = now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
    });
    el.statusDateBlock.setAttribute("datetime", now.toISOString().slice(0, 10));
}

/* 6. BG / Mood */
const moodClasses = [
    "mood-sunny",
    "mood-cloudy",
    "mood-rainy",
    "mood-snowy",
    "mood-stormy",
];

function applyMood(mood) {
    if (!state.dynamicBg) return;
    document.body.classList.remove(...moodClasses);
    document.body.classList.add(`mood-${mood}`);
}

/* 7. Lightning Effect */
let lightningTimer = null;

function triggerLightning() {
    if (!state.lightningFx) return;
    const flash = el.lightningFlash;
    flash.style.opacity = "1";
    setTimeout(() => {
        flash.style.opacity = "0";
    }, 120);
    setTimeout(() => {
        flash.style.opacity = "0.6";
    }, 200);
    setTimeout(() => {
        flash.style.opacity = "0";
    }, 320);
}

function scheduleLightning(mood) {
    clearInterval(lightningTimer);
    if (mood === "stormy" && state.lightningFx) {
        lightningTimer = setInterval(
            triggerLightning,
            4000 + Math.random() * 6000,
        );
    }
}

/* 8. Fetch Weather  (Open-Meteo — free, no key) */
async function fetchWeather(lat, lon) {
    const url =
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,apparent_temperature,precipitation_probability,` +
        `relative_humidity_2m,wind_speed_10m,weather_code,uv_index` +
        `&hourly=temperature_2m,weather_code,precipitation_probability` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,` +
        `precipitation_probability_max,uv_index_max,sunrise,sunset` +
        `&timezone=auto&forecast_days=7`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather fetch failed");
    return res.json();
}

/* 9. Geocoding  (Open-Meteo geocoding) */
async function geocodeCity(name) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=5&language=en&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    return data.results || [];
}

/* 10. Auto-Locate (ip-api — no key) */
async function autoLocate() {
    try {
        const res = await fetch(
            "https://ip-api.com/json/?fields=city,lat,lon,status",
        );
        const data = await res.json();
        if (data.status === "success") {
            state.city = data.city;
            state.lat = data.lat;
            state.lon = data.lon;
        }
    } catch (_) {
        /* fall back to Dhaka */
    }
}

/* 11. Render UI
───────────────────────────────────────── */
function renderHome(data) {
    const c = data.current;
    const day = data.daily;
    const wmo = decodeWMO(c.weather_code);

    state.currentWeather = data;

    // Hero
    el.heroIllustration.innerHTML =
        illustrations[wmo.icon] || illustrations.cloud;
    el.heroTemp.textContent = formatTemp(c.temperature_2m);
    el.heroCondition.textContent = wmo.label;
    updateStatusDate();
    el.cityName.textContent = state.city;

    // High / Low
    el.tempHigh.textContent = formatTemp(day.temperature_2m_max[0]);
    el.tempLow.textContent = formatTemp(day.temperature_2m_min[0]);

    // Stats card
    el.statPrecip.textContent = `${c.precipitation_probability}%`;
    el.statHumidity.textContent = `${c.relative_humidity_2m}%`;
    el.statWind.textContent = formatWind(c.wind_speed_10m);
    el.statFeelsLike.textContent = formatTemp(c.apparent_temperature);

    // UV
    const uv = c.uv_index || day.uv_index_max[0] || 0;
    const uvPct = Math.min(Math.round((uv / 11) * 100), 100);
    el.uvBarFill.style.width = `${uvPct}%`;
    el.uvValue.textContent = `${toUvLabel(uv)} · ${Math.round(uv)}`;

    // Sunrise / Sunset (already static in HTML — update if elements exist)
    const sunriseEl = document.querySelector(".sun-times span:first-child");
    const sunsetEl = document.querySelector(".sun-times span:last-child");
    if (sunriseEl && day.sunrise) {
        const sr = new Date(day.sunrise[0]);
        sunriseEl.textContent = `↑ ${sr.getHours().toString().padStart(2, "0")}:${sr.getMinutes().toString().padStart(2, "0")}`;
    }
    if (sunsetEl && day.sunset) {
        const ss = new Date(day.sunset[0]);
        sunsetEl.textContent = `↓ ${ss.getHours().toString().padStart(2, "0")}:${ss.getMinutes().toString().padStart(2, "0")}`;
    }

    // Mood & lightning
    applyMood(wmo.mood);
    scheduleLightning(wmo.mood);

    // Hourly list
    renderHourly(data.hourly);

    // 7-day forecast
    renderForecast(data.daily);
}

function renderHourly(hourly) {
    const now = new Date();
    const nowH = now.getHours();
    const times = hourly.time;
    const temps = hourly.temperature_2m;
    const codes = hourly.weather_code;
    const precip = hourly.precipitation_probability;

    // Show next 24 hours starting from current hour
    const start = times.findIndex(
        (t) =>
            new Date(t).getHours() >= nowH &&
            new Date(t).toDateString() === now.toDateString(),
    );
    const slice =
        start >= 0 ? times.slice(start, start + 24) : times.slice(0, 24);

    el.hourlyList.innerHTML = slice
        .map((t, i) => {
            const idx = start + i;
            const wmo = decodeWMO(codes[idx] ?? 0);
            const isNow = i === 0;
            return `
      <div class="hourly-item glass-card" role="listitem">
        <span class="hourly-time">${isNow ? "Now" : hourLabel(t)}</span>
        <div class="hourly-icon" aria-hidden="true">${miniIcon(wmo.icon)}</div>
        <span class="hourly-precip">${precip[idx] ?? 0}%</span>
        <span class="hourly-temp">${formatTemp(temps[idx] ?? 0)}</span>
      </div>`;
        })
        .join("");
}

function renderForecast(daily) {
    const {
        time,
        weather_code,
        temperature_2m_max,
        temperature_2m_min,
        precipitation_probability_max,
    } = daily;

    el.forecastList.innerHTML = time
        .map((d, i) => {
            const wmo = decodeWMO(weather_code[i]);
            const isToday = i === 0;
            return `
      <div class="forecast-row" role="listitem">
        <span class="forecast-day">${isToday ? "Today" : dayName(d, true)}</span>
        <div class="forecast-icon" aria-hidden="true">${miniIcon(wmo.icon)}</div>
        <span class="forecast-precip">${precipitation_probability_max[i]}%</span>
        <div class="forecast-range">
          <span class="f-high">${formatTemp(temperature_2m_max[i])}</span>
          <span class="f-low">${formatTemp(temperature_2m_min[i])}</span>
        </div>
      </div>`;
        })
        .join("");
}

function renderExtForecast(daily, mode = "daily") {
    const {
        time,
        weather_code,
        temperature_2m_max,
        temperature_2m_min,
        precipitation_probability_max,
    } = daily;

    if (mode === "daily") {
        el.extForecastGrid.innerHTML = time
            .map((d, i) => {
                const wmo = decodeWMO(weather_code[i]);
                return `
        <div class="ext-forecast-card glass-card" role="listitem">
          <span class="efc-day">${i === 0 ? "Today" : dayName(d)}</span>
          <div class="efc-icon" aria-hidden="true">${miniIcon(wmo.icon)}</div>
          <span class="efc-condition">${wmo.label}</span>
          <div class="efc-temps">
            <span class="efc-high">${formatTemp(temperature_2m_max[i])}</span>
            <span class="efc-low">${formatTemp(temperature_2m_min[i])}</span>
          </div>
          <span class="efc-precip">💧 ${precipitation_probability_max[i]}%</span>
        </div>`;
            })
            .join("");
    } else {
        // Hourly mode
        if (!state.currentWeather) return;
        const h = state.currentWeather.hourly;
        el.extForecastGrid.innerHTML = h.time
            .slice(0, 48)
            .map((t, i) => {
                const wmo = decodeWMO(h.weather_code[i]);
                return `
        <div class="ext-forecast-card glass-card" role="listitem">
          <span class="efc-day">${hourLabel(t)}</span>
          <div class="efc-icon" aria-hidden="true">${miniIcon(wmo.icon)}</div>
          <span class="efc-condition">${wmo.label}</span>
          <span class="efc-high">${formatTemp(h.temperature_2m[i])}</span>
          <span class="efc-precip">💧 ${h.precipitation_probability[i]}%</span>
        </div>`;
            })
            .join("");
    }
}

/* Small inline SVG icon for lists */
function miniIcon(type) {
    const icons = {
        sun: `<svg viewBox="0 0 24 24" fill="#FBBF24" width="20" height="20"><circle cx="12" cy="12" r="5"/><g stroke="#FBBF24" stroke-width="1.8" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="7.1" y2="7.1"/><line x1="16.9" y1="16.9" x2="19.1" y2="19.1"/><line x1="19.1" y1="4.9" x2="16.9" y2="7.1"/><line x1="7.1" y1="16.9" x2="4.9" y2="19.1"/></g></svg>`,
        "cloud-sun": `<svg viewBox="0 0 24 24" fill="none" width="20" height="20"><circle cx="14" cy="8" r="4" fill="#FBBF24"/><ellipse cx="10" cy="16" rx="7" ry="5" fill="rgba(255,255,255,0.7)"/><ellipse cx="15" cy="16" rx="5" ry="4" fill="rgba(255,255,255,0.7)"/></svg>`,
        cloud: `<svg viewBox="0 0 24 24" fill="none" width="20" height="20"><ellipse cx="9" cy="15" rx="7" ry="5" fill="rgba(255,255,255,0.6)"/><ellipse cx="15" cy="15" rx="5" ry="4" fill="rgba(255,255,255,0.6)"/></svg>`,
        rain: `<svg viewBox="0 0 24 24" fill="none" width="20" height="20"><ellipse cx="9" cy="11" rx="7" ry="5" fill="rgba(255,255,255,0.55)"/><ellipse cx="15" cy="11" rx="5" ry="4" fill="rgba(255,255,255,0.55)"/><g stroke="#93C5FD" stroke-width="1.8" stroke-linecap="round"><line x1="8" y1="17" x2="6" y2="21"/><line x1="12" y1="17" x2="10" y2="21"/><line x1="16" y1="17" x2="14" y2="21"/></g></svg>`,
        storm: `<svg viewBox="0 0 24 24" fill="none" width="20" height="20"><ellipse cx="9" cy="10" rx="7" ry="5" fill="rgba(255,255,255,0.45)"/><ellipse cx="15" cy="10" rx="5" ry="4" fill="rgba(255,255,255,0.45)"/><polyline points="13,14 9,20 13,20 9,26" stroke="#FCD34D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
        snow: `<svg viewBox="0 0 24 24" fill="none" width="20" height="20"><ellipse cx="9" cy="11" rx="7" ry="5" fill="rgba(255,255,255,0.55)"/><ellipse cx="15" cy="11" rx="5" ry="4" fill="rgba(255,255,255,0.55)"/><g fill="#BAE6FD"><circle cx="8" cy="18" r="1.5"/><circle cx="12" cy="20" r="1.5"/><circle cx="16" cy="18" r="1.5"/></g></svg>`,
    };
    return icons[type] || icons.cloud;
}

/* 12. Screen Navigation */
const screens = {
    home: el.screenHome,
    search: el.screenSearch,
    forecast: el.screenForecast,
    settings: el.screenSettings,
};

function showScreen(name) {
    Object.entries(screens).forEach(([key, scr]) => {
        scr.classList.toggle("active", key === name);
        scr.setAttribute("aria-hidden", key !== name ? "true" : "false");
    });

    // Update nav active state
    document.querySelectorAll(".nav-item").forEach((btn) => {
        const active = btn.dataset.screen === name;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-current", active ? "page" : "false");
    });

    // Populate forecast screen when switching to it
    if (name === "forecast" && state.currentWeather) {
        renderExtForecast(state.currentWeather.daily, "daily");
    }
}

/* 13. Search */
function renderRecentCities() {
    el.searchLabel.textContent = "Recent";
    el.cityResults.innerHTML = state.recentCities
        .map((c) => cityCard(c))
        .join("");
    el.cityResults.querySelectorAll(".city-card").forEach((card) => {
        card.addEventListener("click", () =>
            selectCity(
                card.dataset.name,
                parseFloat(card.dataset.lat),
                parseFloat(card.dataset.lon),
            ),
        );
    });
}

function cityCard({ name, country, lat, lon, admin1 }) {
    const sub = [admin1, country].filter(Boolean).join(", ");
    return `
    <div class="city-card glass-card" role="listitem"
         data-name="${name}" data-lat="${lat}" data-lon="${lon}" tabindex="0">
      <div class="city-card-main">
        <span class="city-card-name">${name}</span>
        <span class="city-card-sub">${sub}</span>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
    </div>`;
}

let searchDebounce = null;

async function handleSearch(query) {
    if (!query.trim()) {
        renderRecentCities();
        return;
    }

    el.searchLabel.textContent = "Results";
    el.cityResults.innerHTML =
        '<p class="search-hint" style="opacity:0.5;padding:1rem">Searching…</p>';

    try {
        const results = await geocodeCity(query);
        if (!results.length) {
            el.cityResults.innerHTML =
                '<p class="search-hint" style="opacity:0.5;padding:1rem">No cities found.</p>';
            return;
        }
        el.cityResults.innerHTML = results
            .map((r) =>
                cityCard({
                    name: r.name,
                    country: r.country,
                    lat: r.latitude,
                    lon: r.longitude,
                    admin1: r.admin1,
                }),
            )
            .join("");
        el.cityResults.querySelectorAll(".city-card").forEach((card) => {
            card.addEventListener("click", () =>
                selectCity(
                    card.dataset.name,
                    parseFloat(card.dataset.lat),
                    parseFloat(card.dataset.lon),
                ),
            );
        });
    } catch (_) {
        el.cityResults.innerHTML =
            '<p class="search-hint" style="opacity:0.5;padding:1rem">Failed to load results.</p>';
    }
}

async function selectCity(name, lat, lon) {
    state.city = name;
    state.lat = lat;
    state.lon = lon;

    // Add to recent (deduplicate by name)
    state.recentCities = [
        { name, lat, lon },
        ...state.recentCities.filter((c) => c.name !== name),
    ].slice(0, 6);
    localStorage.setItem("nimbus_recent", JSON.stringify(state.recentCities));

    showScreen("home");
    await loadAndRender();
}

/* 14. Settings */
function initSettings() {
    // Temperature toggle
    document.querySelectorAll("[data-unit]").forEach((btn) => {
        btn.addEventListener("click", () => {
            document
                .querySelectorAll("[data-unit]")
                .forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            state.tempUnit = btn.dataset.unit;
            if (state.currentWeather) renderHome(state.currentWeather);
        });
    });

    // Wind toggle
    document.querySelectorAll("[data-wind]").forEach((btn) => {
        btn.addEventListener("click", () => {
            document
                .querySelectorAll("[data-wind]")
                .forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            state.windUnit = btn.dataset.wind;
            if (state.currentWeather) renderHome(state.currentWeather);
        });
    });

    // Dynamic background
    el.toggleBg.addEventListener("change", () => {
        state.dynamicBg = el.toggleBg.checked;
        if (!state.dynamicBg) {
            document.body.classList.remove(...moodClasses);
        } else if (state.currentWeather) {
            const wmo = decodeWMO(state.currentWeather.current.weather_code);
            applyMood(wmo.mood);
        }
    });

    // Lightning effect
    el.toggleLightning.addEventListener("change", () => {
        state.lightningFx = el.toggleLightning.checked;
        if (!state.lightningFx) {
            clearInterval(lightningTimer);
        } else if (state.currentWeather) {
            const wmo = decodeWMO(state.currentWeather.current.weather_code);
            scheduleLightning(wmo.mood);
        }
    });
}

/* 15. Forecast Tabs */
function initForecastTabs() {
    document.querySelectorAll(".ftab").forEach((tab) => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".ftab").forEach((t) => {
                t.classList.remove("active");
                t.setAttribute("aria-selected", "false");
            });
            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");
            if (state.currentWeather) {
                renderExtForecast(
                    state.currentWeather.daily,
                    tab.dataset.tab === "hourly" ? "hourly" : "daily",
                );
            }
        });
    });
}

/* 16. Load & Render */
async function loadAndRender() {
    // Show loading
    el.screenLoading.style.display = "flex";
    el.screenHome.classList.remove("active");

    try {
        const data = await fetchWeather(state.lat, state.lon);
        renderHome(data);
    } catch (err) {
        console.error("Weather load error:", err);
        el.heroCondition.textContent = "Failed to load weather";
    } finally {
        el.screenLoading.style.display = "none";
        el.screenHome.classList.add("active");
    }
}

/* 17. Boot */
async function init() {
    liveTime();
    setInterval(liveTime, 30_000);

    updateStatusDate();

    // Nav bar
    document.querySelectorAll(".nav-item").forEach((btn) => {
        btn.addEventListener("click", () => showScreen(btn.dataset.screen));
    });

    // Location pill → go to search
    el.locationPill.addEventListener("click", () => showScreen("search"));

    // Search back button
    el.searchBackBtn.addEventListener("click", () => showScreen("home"));

    // Search input
    el.searchInput.addEventListener("input", (e) => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => handleSearch(e.target.value), 400);
    });

    // Init settings & tabs
    initSettings();
    initForecastTabs();

    // Render recent cities on search screen open
    renderRecentCities();

    // Auto-locate then fetch
    await autoLocate();
    el.cityName.textContent = state.city;
    await loadAndRender();

    // Refresh every 10 minutes
    setInterval(loadAndRender, 10 * 60 * 1000);
}

document.addEventListener("DOMContentLoaded", init);
