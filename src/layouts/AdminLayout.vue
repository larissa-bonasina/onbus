<template>
  <q-layout view="lHh LpR lFf">
    <q-header class="adm-topbar lt-md">
      <q-toolbar>
        <q-btn flat round dense icon="sym_r_menu" aria-label="Abrir menu" @click="aberto = !aberto" />
        <OnbusLogo class="adm-topbar__logo" dot="#7083ff" />
        <span class="adm-topbar__tag">Associação</span>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="aberto" show-if-above :width="252" :breakpoint="1024" class="adm-drawer">
      <div class="adm-drawer__inner">
        <div class="adm-drawer__brand">
          <OnbusLogo class="adm-drawer__logo" dot="#7083ff" />
          <span>Painel da associação</span>
        </div>

        <nav class="adm-nav" aria-label="Seções do painel">
          <router-link
            v-for="item in itens"
            :key="item.to"
            :to="item.to"
            class="adm-nav__item"
            :exact-active-class="item.exato ? 'adm-nav__item--on' : ''"
            :active-class="item.exato ? '' : 'adm-nav__item--on'"
          >
            <q-icon :name="item.icon" size="21px" />
            {{ item.label }}
          </router-link>
        </nav>

        <button type="button" class="adm-nav__item adm-nav__exit" @click="sair">
          <q-icon name="sym_r_logout" size="21px" />
          Sair
        </button>
      </div>
    </q-drawer>

    <q-page-container class="adm-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import OnbusLogo from 'components/OnbusLogo.vue';
import { logout } from 'src/utils/auth';

const router = useRouter();
const aberto = ref(false);

const itens = [
  { to: '/admin', label: 'Visão geral', icon: 'sym_r_space_dashboard', exato: true },
  { to: '/admin/presenca', label: 'Presença', icon: 'sym_r_how_to_reg' },
  { to: '/admin/rotas', label: 'Rotas', icon: 'sym_r_route' },
  { to: '/admin/alunos', label: 'Alunos', icon: 'sym_r_group' },
  { to: '/admin/mensalidades', label: 'Mensalidades', icon: 'sym_r_payments' },
  { to: '/admin/avisos', label: 'Avisos', icon: 'sym_r_campaign' },
  { to: '/admin/contas', label: 'Prestação de contas', icon: 'sym_r_account_balance' },
];

function sair() {
  logout();
  router.push('/ValidaAdm');
}
</script>

<style scoped>
.adm-container {
  background: var(--ob-bg);
}

.adm-topbar {
  background: var(--ob-ink);
}

.adm-topbar__logo {
  font-size: 20px;
  color: #fff;
  margin-left: 8px;
}

.adm-topbar__tag {
  margin-left: 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.adm-drawer__inner {
  min-height: 100%;
  background: var(--ob-ink);
  display: flex;
  flex-direction: column;
  padding: 24px 14px 18px;
  color: #fff;
}

.adm-drawer__brand {
  display: grid;
  gap: 6px;
  padding: 0 10px 26px;
}

.adm-drawer__logo {
  font-size: 26px;
  color: #fff;
}

.adm-drawer__brand span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.02em;
}

.adm-nav {
  display: grid;
  gap: 2px;
}

.adm-nav__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: rgba(255, 255, 255, 0.72);
  font: inherit;
  font-size: 14.5px;
  font-weight: 500;
  text-decoration: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
}

.adm-nav__item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.adm-nav__item--on {
  background: rgba(112, 131, 255, 0.18);
  color: #fff;
  font-weight: 600;
}

.adm-nav__item--on .q-icon {
  color: #aab5ff;
  font-variation-settings: 'FILL' 1;
}

.adm-nav__item:focus-visible {
  outline: 2px solid #7083ff;
}

.adm-nav__exit {
  margin-top: auto;
}
</style>
