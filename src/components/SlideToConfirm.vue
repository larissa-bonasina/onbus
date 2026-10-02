<template>
  <div ref="track" class="slide" :class="{ 'slide--busy': loading }">
    <span class="slide__label" :style="{ opacity: labelOpacity }">
      {{ label }}
      <q-icon name="sym_r_chevron_right" size="18px" />
    </span>
    <button
      type="button"
      class="slide__knob"
      :style="{ transform: `translateX(${x}px)` }"
      :class="{ 'slide__knob--dragging': dragging }"
      :disabled="loading"
      :aria-label="`${label} (ou pressione Enter)`"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="reset"
      @keydown.enter.prevent="confirmByKey"
      @keydown.space.prevent="confirmByKey"
    >
      <q-spinner v-if="loading" size="22px" color="white" />
      <q-icon v-else name="sym_r_arrow_forward" size="24px" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

// Deslizar (em vez de tocar) evita confirmar presença por toque acidental no bolso.
const props = withDefaults(defineProps<{ label?: string; loading?: boolean }>(), {
  label: 'Deslize para confirmar',
  loading: false,
});
const emit = defineEmits<{ confirm: [] }>();

const KNOB = 48;
const PAD = 4;
const THRESHOLD = 0.85;

const track = ref<HTMLElement | null>(null);
const x = ref(0);
const dragging = ref(false);
let startX = 0;

const max = () => (track.value ? track.value.clientWidth - KNOB - PAD * 2 : 0);
const labelOpacity = computed(() => {
  const m = max();
  return m > 0 ? Math.max(0, 1 - (x.value / m) * 1.6) : 1;
});

function onDown(e: PointerEvent) {
  if (props.loading) return;
  dragging.value = true;
  startX = e.clientX - x.value;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}

function onMove(e: PointerEvent) {
  if (!dragging.value) return;
  x.value = Math.min(Math.max(e.clientX - startX, 0), max());
}

function onUp() {
  if (!dragging.value) return;
  dragging.value = false;
  if (x.value >= max() * THRESHOLD) {
    x.value = max();
    emit('confirm');
  } else {
    x.value = 0;
  }
}

function confirmByKey() {
  if (props.loading) return;
  x.value = max();
  emit('confirm');
}

function reset() {
  dragging.value = false;
  x.value = 0;
}

defineExpose({ reset });
</script>

<style scoped>
.slide {
  position: relative;
  height: 56px;
  border-radius: 999px;
  background: var(--ob-blue-50);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  touch-action: pan-y;
}

.slide__label {
  display: flex;
  align-items: center;
  gap: 2px;
  padding-left: 40px;
  font-weight: 700;
  font-size: 14px;
  color: var(--ob-blue-700);
  pointer-events: none;
}

.slide__label .q-icon {
  opacity: 0.55;
}

.slide__knob {
  position: absolute;
  left: 4px;
  top: 4px;
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 50%;
  background: var(--ob-blue-500);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  touch-action: none;
  box-shadow: 0 4px 12px rgba(53, 74, 255, 0.35);
  transition: transform 0.25s cubic-bezier(0.3, 0.7, 0.4, 1);
}

.slide__knob--dragging {
  cursor: grabbing;
  transition: none;
}

.slide__knob:focus-visible {
  outline: 3px solid var(--ob-blue-200);
  outline-offset: 2px;
}

.slide--busy .slide__knob {
  cursor: progress;
}

@media (prefers-reduced-motion: reduce) {
  .slide__knob {
    transition: none;
  }
}
</style>
