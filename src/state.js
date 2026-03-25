import { reactive, watch } from "vue";
import { ZONES } from "./constants";

const KEYS = {
    entries: 'boluslab_entries',
    settings: 'boluslab_settings',
}

function load(key, fallback) {
    try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : fallback
    } catch {
        return fallback
    }
}

const defaultSettings = {
    userName: '',
    targetBG: 5.5,
    goodDelta: 0.5,
    okDelta: 1.2,
    defaultDuration: 120,
    defaultZone: ZONES[0].id,
}

const loadedSettings = load(KEYS.settings, defaultSettings)

// Valider at defaultZone er en kjent sone-id, ellers tilbakestill
if (!ZONES.find(z => z.id === loadedSettings.defaultZone)) {
    loadedSettings.defaultZone = ZONES[0].id
}

export const entries = reactive(load(KEYS.entries, []))

export const settings = reactive({ ...defaultSettings, ...loadedSettings })

watch(
    () => [...entries],
    (val) => localStorage.setItem(KEYS.entries, JSON.stringify(val)),
    { deep: true }
)

watch(
    settings,
    (val) => localStorage.setItem(KEYS.settings, JSON.stringify(val)),
    { deep: true }
)
