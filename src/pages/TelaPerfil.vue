<template>
  <div class="profile-page">
    <div class="back-button">
      <q-icon name="arrow_back" size="25px" class="back-icon" @click="goBack" />
    </div>
    <div class="profile-content">
      <div class="profile-info">
        <h2>MINHAS INFORMAÇÕES</h2>

        <!-- Nome Completo -->
        <div v-if="!isEditing" class="info-item">
          <span class="info-label">Nome Completo:</span>
          <span class="info-value">{{ profile.nome }}</span>
        </div>
        <div v-if="isEditing" class="info-item">
          <span class="info-label">Nome Completo:</span>
          <input v-model="editedProfile.nome" class="edit-input" />
        </div>

        <!-- CPF -->
        <div v-if="!isEditing" class="info-item">
          <span class="info-label">CPF:</span>
          <span class="info-value">{{ profile.cpf }}</span>
        </div>
        <div v-if="isEditing" class="info-item">
          <span class="info-label">CPF:</span>
          <input v-model="editedProfile.cpf" class="edit-input" disabled />
        </div>

        <!-- Email -->
        <div v-if="!isEditing" class="info-item">
          <span class="info-label">Email:</span>
          <span class="info-value">{{ profile.email }}</span>
        </div>
        <div v-if="isEditing" class="info-item">
          <span class="info-label">Email:</span>
          <input v-model="editedProfile.email" class="edit-input" />
        </div>

        <!-- Contato -->
        <div v-if="!isEditing" class="info-item">
          <span class="info-label">Contato:</span>
          <span class="info-value">{{ profile.numero }}</span>
        </div>
        <div v-if="isEditing" class="info-item">
          <span class="info-label">Contato:</span>
          <input v-model="editedProfile.numero" class="edit-input" />
        </div>


        <!-- Botões -->
        <div class="alterar-button-container">
          <template v-if="!isEditing">
            <q-btn
              class="alterar-button"
              color="#1B24FF"
              label="Alterar"
              @click="editProfile"
            />
          </template>
          <template v-else>
            <q-btn
              class="alterar-button"
              color="#1B24FF"
              label="Salvar"
              @click="saveProfile"
            />
            <q-btn
              class="cancelar-button"
              color="grey"
              label="Cancelar"
              @click="cancelEdit"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',
  data() {
    return {
      profile: {
        nome: '',
        cpf: '',
        email: '',
        numero: '',
      },
      editedProfile: {
        nome: '',
        cpf: '',
        email: '',
        numero: '',
      },
      isEditing: false,
    };
  },
  methods: {
    fetchProfile() {
      const aluno = JSON.parse(localStorage.getItem('aluno'));
      if (aluno) {
        this.profile = aluno;  // Carrega as informações do aluno
      }
    },
    editProfile() {
      this.isEditing = true;
      this.editedProfile = { ...this.profile };
    },
    cancelEdit() {
      this.isEditing = false;
    },
    saveProfile() {
      this.profile = { ...this.editedProfile };
      this.isEditing = false;
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.fetchProfile();  // Carrega os dados do aluno quando a página é montada
  },
};
</script>

<style scoped>
.profile-page {
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.profile-content {
  width: 80%;
  max-width: 600px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-info {
  margin-bottom: 20px;
}

.profile-info h2 {
  font-size: 24px;
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
}

.info-label {
  font-weight: bold;
  margin-right: 10px;
}

.info-value {
  flex: 1;
}

.edit-input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.alterar-button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.alterar-button {
  width: 120px;
  font-size: 14px;
  margin-right: 10px;
  background-color: #354aff;
  border-radius: 17px;
}

.cancelar-button {
  width: 120px;
  font-size: 14px;
  border-radius: 17px;
}

.back-button {
  position: absolute;
  top: 16px;
  left: 16px;
  cursor: pointer;
  z-index: 2;
}
</style>
