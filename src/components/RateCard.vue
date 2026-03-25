<script setup>
import Sparkline from './Sparkline.vue';

defineProps({
    label: String,                // "1.30 U/t" eller "1:15"
    deltas: { type: Array, default: () => [] },  // [0.3, -0.1, 0.2]
    avg: Number,                  // Gjennomsnittlig delta
    dev: Number,                  // Standardavvik
    count: Number,                // Antall tester
    isBest: Boolean,              // Fremhevet hvis beste
    color: String                 // Farge basert på avg-delta
})
</script>

<template>
    <div class="rate-card" :class="{ 'is-best': isBest }">
        <!-- ANBEFALT badge -->
        <div v-if="isBest" class="badge">ANBEFALT</div>

        <!-- Rate label -->
        <div class="rate-label">{{ label }}</div>

        <!-- Sparkline graph -->
        <Sparkline
            v-if="deltas.length >= 2"
            :values="deltas"
            :color="color"
            width="120"
            height="32"
        />

        <!-- Stats -->
        <div v-if="avg !== null" class="stat">
            <span class="value" :style="{ color }">{{ avg > 0 ? '+' : '' }}{{ avg.toFixed(2) }}</span>
            <span class="unit">mmol/L</span>
        </div>

        <div v-if="dev !== null" class="stat-small">±{{ dev.toFixed(2) }}</div>
        <div class="stat-small">{{ count }} test{{ count !== 1 ? 'er' : '' }}</div>
    </div>

</template>

<style scoped>
.rate-card {
    position: relative;
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    min-width: 155px;
    flex: 0 0 auto;
}

.rate-card.is-best {
    background: rgba(56, 189, 248, 0.08);
    border-color: rgba(56, 189, 248, 0.3);
} 

.badge {
    position: absolute;
    top: -9px;
    left: 12px;
    background: var(--color-accent);
    color: var(--color-bg-primary);
    padding: 1px 9px;
    border-radius: 10px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
}

.rate-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-accent);
    margin-bottom: 8px;
    font-family: var(--font-mono);
}

.stat {
    margin-top: 8px;
    display: flex;
    align-items: baseline;
    gap: 5px;
}

.value {
    font-size: 20px;
    font-weight: 600;
    font-family: var(--font-mono);
}

.unit {
    font-size: 11px;
    color: var(--color-text-muted);
    font-family: var(--font-ui);
}

.stat-small {
    font-size: 11px;
    color: var(--color-text-muted);
    margin-top: 2px;
    font-family: var(--font-mono);
}
</style>