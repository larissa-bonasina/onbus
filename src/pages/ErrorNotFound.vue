<template>
  <q-page class="nf">
    <div class="nf__inner">
      <OnbusLogo class="nf__logo" />
      <p class="nf__code">404</p>
      <h1>Essa parada não existe</h1>
      <p class="ob-muted">O endereço pode ter mudado ou estar digitado errado.</p>
      <q-btn unelevated no-caps color="primary" label="Voltar ao início" to="/" class="nf__btn" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import OnbusLogo from 'components/OnbusLogo.vue';

defineOptions({ name: 'ErrorNotFound' });
</script>

<style scoped>
.nf {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  background: var(--ob-surface);
}

.nf__inner {
  display: grid;
  justify-items: center;
  gap: 8px;
  max-width: 360px;
}

.nf__logo {
  font-size: 26px;
  color: var(--ob-ink);
  margin-bottom: 20px;
}

.nf__code {
  margin: 0;
  font-family: var(--ob-font-display);
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
  color: var(--ob-blue-500);
}

.nf__btn {
  height: 48px;
  margin-top: 16px;
  padding: 0 24px;
}
</style>
