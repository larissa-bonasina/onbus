<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="tabbar">
      <nav class="tabbar__nav" aria-label="Navegação principal">
        <router-link
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="tab"
          active-class="tab--on"
        >
          <span class="tab__ico">
            <q-icon :name="tab.icon" size="22px" />
          </span>
          {{ tab.label }}
        </router-link>
      </nav>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
const tabs = [
  { to: '/principal', label: 'Início', icon: 'sym_r_home' },
  { to: '/boletos', label: 'Boletos', icon: 'sym_r_receipt_long' },
  { to: '/avisos', label: 'Avisos', icon: 'sym_r_campaign' },
  { to: '/perfil', label: 'Perfil', icon: 'sym_r_person' },
];
</script>

<style scoped>
.tabbar {
  background: var(--ob-surface);
  border-top: 1px solid var(--ob-subtle);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.tabbar__nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 560px;
  margin: 0 auto;
  padding: 7px 6px 6px;
}

.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 600;
  color: var(--ob-muted);
  text-decoration: none;
  border-radius: 12px;
}

.tab__ico {
  width: 52px;
  height: 30px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.tab--on {
  color: var(--ob-blue-700);
}

.tab--on .tab__ico {
  background: var(--ob-blue-50);
}

.tab--on .q-icon {
  font-variation-settings: 'FILL' 1;
}

.tab:focus-visible {
  outline: 2px solid var(--ob-blue-500);
  outline-offset: 2px;
}
</style>
