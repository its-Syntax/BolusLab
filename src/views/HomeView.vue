<script setup>
import { computed } from 'vue';
import { entries } from '../state';
import { ZONES, TEST_TYPES } from '../constants';
import ZoneBadge from '../components/ZoneBadge.vue';

const total = computed(() => entries.length)
const recent = computed(() => entries.slice(0, 3))

const byType = computed(() =>
    TEST_TYPES.reduce((acc, t) => ({ ...acc, [t]: entries.filter(e => e.testType === t).length }), {})
)

const typeColor = t => t === 'Basal' ? '#60a5fa' : t === 'ISF' ? '#c084fc' : '#34d399'
const typeLabelColor = t => t === 'Basal' ? '#93c5fd' : t === 'ISF' ? '#c084fc' : '#6ee7b7'

function deltaBG(e) {
    const s = parseFloat(e.startBG), en = parseFloat(e.endBG)
    return (!isNaN(s) && !isNaN(en)) ? en - s : null
}

function deltaBGStr(e) {
    const d = deltaBG(e)
    return d === null ? '' : `Δ ${d > 0 ? '+' : ''}${d.toFixed(1)} mmol/L`
}

function deltaColor(d) {
    if (d === null) return '#64748b'
    if (Math.abs(d) <= 0.5) return '#34d399'
    if (Math.abs(d) <= 1.2) return '#fbbf24'
    return '#f87171'
}

const infoCards = [
    {
        title: 'Basaltest',
        color: '#60a5fa',
        icon: '〰',
        desc: 'Tester om basaldosen holder blodsukkeret stabilt uten maten i bildet. Målet er at BG ikke beveger seg mer enn ±0.5 mmol/L i løpet av 2–4 timer.',
    },
    {
        title: 'ISF — Insulinsensitivitet',
        color: '#c084fc',
        icon: '↓',
        desc: 'Måler hvor mye blodsukkeret synker per enhet insulin. Brukes til å beregne korreksjonsdoser ved høyt blodsukker.',
    },
    {
        title: 'CR — Karbohydratforhold',
        color: '#34d399',
        icon: '÷',
        desc: 'Måler hvor mange gram karbohydrat som dekkes av én enhet insulin. Brukes ved måltidsdosering.',
    },
]

const steps = [
    { n: '1', t: 'Still inn parametere', d: 'Gå til Innstillinger og sett inn dine nåværende insulinverdier som referanse.' },
    { n: '2', t: 'Logg din første test', d: 'Gå til Logg og registrer en test. Fyll inn blodsukker ved start og slutt.' },
    { n: '3', t: 'Se analyse', d: 'Etter noen tester viser Analyse-siden statistikk og anbefaling per sone og testtype.' },
]
</script>

<template>
    <div>
        <!-- Velkomst -->
        <div class="welcome">
            <h2 class="welcome-title">Velkommen til BolusLab</h2>
            <p class="welcome-desc">
                Et verktøy for systematisk testing og optimalisering av insulininnstillinger i et lukket sløyfesystem.
                Logg tester, analyser resultater og finn de beste innstillingene for din kropp.
            </p>
        </div>

        <!-- Statistikk -->
        <div v-if="total > 0" class="stat-grid">
            <div class="stat-card">
                <div class="stat-value" style="color: #38bdf8">{{ total }}</div>
                <div class="stat-label">Totalt antall tester</div>
            </div>
            <div v-for="t in TEST_TYPES" :key="t" class="stat-card">
                <div class="stat-value" :style="{ color: typeColor(t) }">{{ byType[t] }}</div>
                <div class="stat-label">{{ t }}-tester</div>
            </div>
        </div>

        <!-- Om testtypene -->
        <div class="section">
            <h3 class="section-title">Testtypene</h3>
            <div class="info-grid">
                <div
                    v-for="card in infoCards"
                    :key="card.title"
                    class="info-card"
                    :style="{
                        borderColor: card.color + '25',
                        borderTopColor: card.color,
                    }"
                >
                    <div class="info-card-header">
                        <span class="info-icon" :style="{ color: card.color }">{{ card.icon }}</span>
                        <span class="info-card-title">{{ card.title }}</span>
                    </div>
                    <p class="info-card-desc">{{ card.desc }}</p>
                </div>
            </div>
        </div>

        <!-- Siste aktivitet -->
        <div v-if="recent.length > 0" class="section">
            <h3 class="section-title">Siste aktivitet</h3>
            <div class="activity-list">
                <div
                    v-for="e in recent"
                    :key="e.id"
                    class="activity-item"
                    :style="{ borderLeftColor: (ZONES.find(z => z.id === e.zone) ?? ZONES[0]).color }"
                >
                    <span class="activity-date">{{ e.date }}</span>
                    <ZoneBadge :zone="ZONES.find(z => z.id === e.zone) ?? ZONES[0]" />
                    <span class="activity-type" :style="{ color: typeLabelColor(e.testType) }">{{ e.testType }}</span>
                    <span
                        v-if="deltaBG(e) !== null && e.testType !== 'ISF'"
                        class="activity-delta"
                        :style="{ color: deltaColor(deltaBG(e)) }"
                    >{{ deltaBGStr(e) }}</span>
                </div>
            </div>
        </div>

        <!-- Kom i gang -->
        <div v-if="total === 0" class="onboarding">
            <h3 class="onboarding-title">Kom i gang</h3>
            <div v-for="step in steps" :key="step.n" class="step">
                <div class="step-number">{{ step.n }}</div>
                <div>
                    <div class="step-title">{{ step.t }}</div>
                    <div class="step-desc">{{ step.d }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ─── VELKOMST ─── */
.welcome {
    margin-bottom: 28px;
}

.welcome-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0 0 6px;
    letter-spacing: -0.02em;
}

.welcome-desc {
    font-size: 14px;
    color: #94a3b8;
    line-height: 1.7;
    margin: 0;
    max-width: 600px;
}

/* ─── STATISTIKK ─── */
.stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    margin-bottom: 28px;
}

.stat-card {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 16px 18px;
}

.stat-value {
    font-size: 28px;
    font-weight: 700;
    font-family: var(--font-mono);
}

.stat-label {
    font-size: 12px;
    color: var(--color-text-muted);
    margin-top: 2px;
}

/* ─── SEKSJONER ─── */
.section {
    margin-bottom: 28px;
}

.section-title {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin: 0 0 14px;
}

/* ─── INFO CARDS ─── */
.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 12px;
}

.info-card {
    background: var(--color-bg-secondary);
    border: 1px solid;
    border-top-width: 3px;
    border-radius: 12px;
    padding: 18px 20px;
}

.info-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.info-icon {
    font-size: 22px;
    font-family: var(--font-mono);
}

.info-card-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--color-text-primary);
}

.info-card-desc {
    font-size: 13px;
    color: #94a3b8;
    line-height: 1.65;
    margin: 0;
}

/* ─── SISTE AKTIVITET ─── */
.activity-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.activity-item {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-left: 3px solid;
    border-radius: 10px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.activity-date {
    font-size: 11px;
    color: #475569;
    font-family: var(--font-mono);
    min-width: 88px;
}

.activity-type {
    font-size: 12px;
    font-weight: 600;
}

.activity-delta {
    font-size: 12px;
    font-weight: 600;
    font-family: var(--font-mono);
    margin-left: auto;
}

/* ─── KOM I GANG ─── */
.onboarding {
    margin-top: 28px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 14px;
    padding: 24px 28px;
}

.onboarding-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0 0 16px;
}

.step {
    display: flex;
    gap: 14px;
    margin-bottom: 16px;
}

.step:last-child {
    margin-bottom: 0;
}

.step-number {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: rgba(56, 189, 248, 0.15);
    border: 1px solid rgba(56, 189, 248, 0.3);
    color: #38bdf8;
    font-size: 12px;
    font-weight: 700;
    font-family: var(--font-mono);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.step-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 2px;
}

.step-desc {
    font-size: 12px;
    color: var(--color-text-muted);
    line-height: 1.6;
}
</style>
