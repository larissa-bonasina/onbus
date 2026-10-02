<template>
  <q-page class="auth">
    <div class="auth__inner">
      <header class="auth__top">
        <q-btn flat round dense icon="sym_r_arrow_back" aria-label="Voltar" @click="voltar" />
        <OnbusLogo class="auth__logo" />
        <span class="auth__spacer" />
      </header>

      <p v-if="eyebrow" class="auth__eyebrow">{{ eyebrow }}</p>
      <h1 class="auth__title">{{ title }}</h1>
      <p v-if="subtitle" class="auth__sub">{{ subtitle }}</p>

      <div class="auth__body">
        <slot />
      </div>

      <footer v-if="$slots.footer" class="auth__footer">
        <slot name="footer" />
      </footer>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import OnbusLogo from 'components/OnbusLogo.vue';

const props = defineProps<{ title: string; subtitle?: string; eyebrow?: string; backTo?: string }>();
const router = useRouter();

function voltar() {
  if (props.backTo) router.push(props.backTo);
  else if (window.history.length > 1) router.back();
  else router.push('/');
}
</script>

<style scoped>
.auth {
  background: var(--ob-surface);
}

.auth__inner {
  min-height: inherit;
  max-width: 440px;
  margin: 0 auto;
  padding: calc(12px + env(safe-area-inset-top, 0px)) 24px calc(24px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
}

.auth__top {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  margin: 0 -8px 36px;
}

.auth__logo {
  font-size: 22px;
  justify-self: center;
  color: var(--ob-ink);
}

.auth__eyebrow {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ob-blue-500);
}

.auth__title {
  font-size: 2rem;
  letter-spacing: -0.035em;
}

.auth__sub {
  margin: 8px 0 0;
  color: var(--ob-muted);
  font-size: 15px;
}

.auth__body {
  margin-top: 28px;
}

.auth__footer {
  margin-top: auto;
  padding-top: 28px;
  text-align: center;
  font-size: 14px;
  color: var(--ob-muted);
}
</style>
