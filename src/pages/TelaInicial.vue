<template>
  <q-page class="welcome">
    <svg class="welcome__pattern" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="rgba(255,255,255,.13)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M-20 210 H170 Q195 210 195 235 V350 Q195 375 220 375 H420" />
        <path d="M85 -20 V125 Q85 150 110 150 H290 Q315 150 315 175 V460" />
        <path d="M-20 460 H95 Q120 460 120 435 V280" />
      </g>
      <g fill="#354aff" stroke="rgba(255,255,255,.35)" stroke-width="3">
        <circle cx="195" cy="280" r="6" />
        <circle cx="315" cy="320" r="6" />
        <circle cx="85" cy="55" r="6" />
        <circle cx="120" cy="350" r="6" />
      </g>
      <circle cx="315" cy="150" r="28" fill="rgba(255,255,255,.14)" class="welcome__pulse" />
      <circle cx="315" cy="150" r="12" fill="#fff" />
    </svg>

    <div class="welcome__content">
      <OnbusLogo class="welcome__logo" dot="#fff" />

      <div class="welcome__bottom">
        <h1 class="welcome__headline">Seu ônibus da faculdade, sem complicação.</h1>
        <p class="welcome__sub">
          Confirme presença, acompanhe sua rota e pague a mensalidade da associação — tudo num app só.
        </p>

        <div class="welcome__ctas">
          <q-btn unelevated no-caps class="cta cta--white" label="Entrar" to="/login" />
          <q-btn outline no-caps class="cta cta--ghost" label="Criar conta" to="/signup" />
        </div>

        <router-link to="/ValidaAdm" class="welcome__assoc">
          Sou da associação <q-icon name="sym_r_arrow_forward" size="18px" />
        </router-link>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import OnbusLogo from 'components/OnbusLogo.vue';
</script>

<style scoped>
.welcome {
  position: relative;
  overflow: hidden;
  background: var(--ob-blue-500);
  color: #fff;
}

.welcome__pattern {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.welcome__pulse {
  transform-origin: 315px 150px;
  animation: pulse 2.6s ease-out infinite;
}

@keyframes pulse {
  0% { transform: scale(0.6); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.welcome__content {
  position: relative;
  min-height: inherit;
  max-width: 480px;
  margin: 0 auto;
  padding: calc(40px + env(safe-area-inset-top, 0px)) 24px calc(28px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
}

.welcome__logo {
  font-size: 34px;
  color: #fff;
}

.welcome__bottom {
  margin-top: auto;
  padding-top: 48px;
}

.welcome__headline {
  font-size: clamp(2rem, 9vw, 2.6rem);
  line-height: 1.04;
  letter-spacing: -0.035em;
  color: #fff;
}

.welcome__sub {
  margin: 14px 0 0;
  font-size: 1rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
}

.welcome__ctas {
  display: grid;
  gap: 12px;
  margin-top: 30px;
}

.cta {
  height: 54px;
  font-size: 16px;
}

.cta--white {
  background: #fff;
  color: var(--ob-blue-600);
}

.cta--ghost {
  color: #fff;
}

.cta--ghost::before {
  border-color: rgba(255, 255, 255, 0.6);
  border-width: 1.5px;
}

.welcome__assoc {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 20px;
  padding: 8px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
}

.welcome__assoc:focus-visible {
  outline: 2px solid #fff;
  border-radius: 8px;
}

@media (prefers-reduced-motion: reduce) {
  .welcome__pulse { animation: none; }
}
</style>
