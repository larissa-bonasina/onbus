<template>
  <div>
    <!-- Cabeçalho -->
    <header class="header">
      <q-avatar size="50px" class="profile-icon bg-white text-primary">
        <img src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png" alt="admin fofo" />
      </q-avatar>
      <a href="/perfil" class="username-link">Perfil do Estudante</a>
    </header>

    <!-- Botão de menu (mobile) -->
    <div class="nav-toggle" @click="toggleNav">
      <q-icon name="menu" size="24px" color="white" />
    </div>

    <!-- Fundo escuro ao abrir nav -->
    <div class="nav-backdrop" :class="{ 'nav-backdrop-open': isNavOpen }" @click="toggleNav"></div>

    <!-- Menu lateral -->
    <nav class="nav-bar" :class="{ 'nav-bar-open': isNavOpen }">
      <div class="nav-buttons">
        <q-btn
          v-for="button in navButtons"
          :key="button.id"
          :label="button.label"
          class="nav-button"
          @click="navigateTo(button.route)"
          rounded
          unelevated
        />
      </div>
    </nav>

    <!-- Conteúdo principal -->
    <section class="content-container">
      <!-- Google Maps -->
      <div class="maps-container">
        <iframe
          src="https://www.google.com/maps?q=Vera,+MT&output=embed"
          width="100%"
          height="400"
          style="border-radius: 10px"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>

      <!-- Status -->
      <div class="status-container">
        <p class="status-text">Status: {{ status }}</p>
      </div>

      <!-- Slider interativo -->
      <div
        class="slider-container"
        @mousedown="startDrag"
        @mousemove="drag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        ref="sliderContainer"
      >
        <q-btn
          class="slide-button"
          :style="buttonStyle"
          unelevated
           @click="confirmarPresenca"
        >
        </q-btn>
      </div>

      <!-- Link contato -->
      <a class="contact-link" href="https://wa.me/" target="_blank">
        ENTRAR EM CONTATO COM A ASSOCIAÇÃO
      </a>
    </section>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default defineComponent({
  name: 'TelaPrincipal',
  setup() {
    const router = useRouter();

    const isNavOpen = ref(false);
    const status = ref('INDEFINIDO');
    const aluno = ref(null);

    const sliderPosition = ref(0);
    const isDragging = ref(false);
    const sliderContainer = ref(null);

    const navButtons = [
      { id: 1, label: 'Prestação de contas', route: '/prestacao' },
      { id: 2, label: 'Notificações', route: '/route2' },
      { id: 3, label: 'Boletos', route: '/boletos' },
      { id: 4, label: 'Avisos da associação', route: '/avisos' },
    ];

    const toggleNav = () => {
      isNavOpen.value = !isNavOpen.value;
    };

    const navigateTo = (route) => {
      router.push(route);
    };

    onMounted(() => {
      const alunoStorage = localStorage.getItem('aluno');
      if (alunoStorage) {
        aluno.value = JSON.parse(alunoStorage);
      }
    });

    const startDrag = () => {
      isDragging.value = true;
    };

    const drag = (event) => {
      if (!isDragging.value) return;

      const container = sliderContainer.value;
      const containerRect = container.getBoundingClientRect();
      let newX = event.clientX - containerRect.left;

      newX = Math.max(0, Math.min(newX, containerRect.width - 40));
      sliderPosition.value = newX;
    };

   const confirmarPresenca = async () => {
  if (!aluno.value || !aluno.value.cpf) {
    alert('Aluno não identificado!');
    return;
  }

  try {
    const response = await axios.post('http://localhost:3000/checkin/checkin', {
      cpf: aluno.value.cpf,  // usa cpf aqui
    });

     if (response.status === 200) {
      status.value = 'PRESENTE';
      sliderPosition.value = sliderContainer.value.offsetWidth - 40;
      alert('Check-in realizado com sucesso!');
    } else {
      alert('Erro ao registrar presença. Tente novamente.');
      sliderPosition.value = 0;
    }
  } catch (err) {
    console.error(err);
    alert('Erro na conexão com o servidor. Tente novamente mais tarde.');
    sliderPosition.value = 0;
  }
};

const stopDrag = async () => {
  if (!isDragging.value) return;
  isDragging.value = false;

  const container = sliderContainer.value;
  const limiar = container.offsetWidth * 0.7;

  if (sliderPosition.value >= limiar) {
    // Confirma presença pelo backend
    await confirmarPresenca();
  } else {
    sliderPosition.value = 0; // Volta pro início
  }
};



    const buttonStyle = computed(() => ({
      transform: `translateX(${sliderPosition.value}px)`,
    }));



    return {
      isNavOpen,
      navButtons,
      status,
      toggleNav,
      navigateTo,
      sliderContainer,
      sliderPosition,
      isDragging,
      startDrag,
      drag,
      stopDrag,
      confirmarPresenca,
      buttonStyle,
    };
  },
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #354aff;
  padding: 16px;
  margin-bottom: 20px;
}

.profile-icon {
  margin-right: 10px;
  border-radius: 50%;
  overflow: hidden;
}

.username-link {
  color: #ffffff;
  font-size: 18px;
  text-decoration: none;
  font-weight: bold;
}

.nav-toggle {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 3;
}

.nav-backdrop {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.nav-backdrop-open {
  display: block;
}

.nav-bar {
  position: fixed;
  top: 0;
  right: -250px;
  width: 250px;
  height: 100%;
  background-color: #354aff;
  transition: right 0.3s ease-in-out;
  z-index: 2;
}

.nav-bar-open {
  right: 0;
}

.nav-buttons {
  padding: 20px;
}

.nav-button {
  margin-bottom: 12px;
  width: 100%;
  background-color: #fff;
}

.content-container {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.maps-container {
  width: 100%;
  height: 400px;
  border-radius: 10px;
  position: relative;
  z-index: 0;
}

.status-container {
  margin-bottom: 20px;
}

.status-text {
  font-size: 16px;
  font-weight: 500;
  color: #0d1132;
}

.slider-container {
  width: 200px;
  height: 40px;
  background-color: #e2e2e2;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
  user-select: none;
  cursor: grab;
}

.slide-button {
  width: 40px;
  height: 40px;
  background-color: #354aff;
  color: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.1s ease;
}

.contact-link {
  display: block;
  text-align: center;
  margin-top: 30px;
  color: #354aff;
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
}
</style>
