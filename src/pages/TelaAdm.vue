<template>
  <div class="admin-container">
    <aside class="sidebar">
      <div class="profile">
        <q-avatar size="60px" class="q-mb-sm">
          <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" />
        </q-avatar>
        <div class="username">Administrador</div>
      </div>

      <q-list class="menu-list">
        <q-item
          clickable
          v-ripple
          @click="selectSection('attendance')"
          :active="currentSection === 'attendance'"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Presença</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          @click="selectSection('students')"
          :active="currentSection === 'students'"
        >
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>Alunos</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          @click="selectSection('monthlyfees')"
          :active="currentSection === 'monthlyfees'"
        >
          <q-item-section avatar>
            <q-icon name="receipt_long" />
          </q-item-section>
          <q-item-section>Mensalidades</q-item-section>
        </q-item>
      </q-list>
    </aside>

    <main class="content-area">
      <div class="content-card">
        <component :is="currentSectionComponent" />
      </div>
    </main>
  </div>
</template>

<script>
import AttendanceList from './AttendanceList.vue';
import StudentsList from './StudentsList.vue';

const MonthlyFees = {
  name: 'MonthlyFees',
  data() {
    return {
      currentMonth: new Date().toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      }),
      studentsOnibusPreto: [
        { name: 'Aluno 1', status: 'não pago' },
        { name: 'Aluno 2', status: 'em andamento' },
      ],
      studentsOnibusAmarelo: [
        { name: 'Aluno 3', status: 'pago' },
        { name: 'Aluno 4', status: 'não pago' },
      ],
    };
  },
  methods: {
    addStudent(bus) {
      const newStudent = {
        name: `Aluno ${
          bus === 'preto'
            ? this.studentsOnibusPreto.length + 1
            : this.studentsOnibusAmarelo.length + 1
        }`,
        status: 'não pago',
      };
      if (bus === 'preto') {
        this.studentsOnibusPreto.push(newStudent);
      } else {
        this.studentsOnibusAmarelo.push(newStudent);
      }
    },
    changeStatus(student, status) {
      student.status = status;
    },
    registerCompetence() {
      this.currentMonth = new Date().toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      this.$q.notify({
        color: 'green',
        message: 'Competência registrada com sucesso!',
        icon: 'check_circle',
      });
    },
  },
  template: `
    <div>
      <h1 class="text-h5 q-mb-md">Mensalidades - {{ currentMonth }}</h1>
      <q-btn label="Registrar Competência" color="primary" @click="registerCompetence" class="q-mb-md" />

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row items-center">
            <div class="col"><h2>Ônibus Preto</h2></div>
            <div class="col-auto">
              <q-btn round icon="add" @click="addStudent('preto')" color="primary" />
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div v-for="(student, index) in studentsOnibusPreto" :key="index" class="q-mb-sm row items-center">
            <div class="col">{{ student.name }}</div>
            <div class="col-auto">
              <q-select
                v-model="student.status"
                :options="['pago', 'não pago', 'em andamento']"
                @input="changeStatus(student, student.status)"
                dense
                hide-dropdown-icon
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="row items-center">
            <div class="col"><h2>Ônibus Amarelo</h2></div>
            <div class="col-auto">
              <q-btn round icon="add" @click="addStudent('amarelo')" color="primary" />
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div v-for="(student, index) in studentsOnibusAmarelo" :key="index" class="q-mb-sm row items-center">
            <div class="col">{{ student.name }}</div>
            <div class="col-auto">
              <q-select
                v-model="student.status"
                :options="['pago', 'não pago', 'em andamento']"
                @input="changeStatus(student, student.status)"
                dense
                hide-dropdown-icon
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  `,
};

export default {
  name: 'AdminPage',
  components: {
    AttendanceList,
    StudentsList,
  },
  data() {
    return {
      currentSection: 'attendance',
    };
  },
  computed: {
    currentSectionComponent() {
      return {
        attendance: AttendanceList,
        students: StudentsList,
        monthlyfees: MonthlyFees,
      }[this.currentSection];
    },
  },
  methods: {
    selectSection(section) {
      this.currentSection = section;
    },
  },
};
</script>

<style scoped>
.admin-container {
  display: flex;
  min-height: 100vh;
  background: #f3f7fc;
  font-family: 'Roboto', sans-serif;
}

.sidebar {
  width: 250px;
  background: #2b3d63;
  color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.profile {
  text-align: center;
  margin-bottom: 30px;
}

.username {
  font-size: 1.1rem;
  font-weight: bold;
}

.menu-list {
  width: 100%;
}

.q-item {
  color: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background 0.3s;
}

.q-item:hover,
.q-item--active {
  background: #3f5588 !important;
  font-weight: bold;
}

.content-area {
  flex: 1;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #f3f7fc;
}

.content-card {
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 1000px;
  transition: all 0.3s ease;
  min-height: 500px;
}

h1 {
  font-weight: bold;
  color: #2b3d63;
  margin-bottom: 20px;
}

.q-card {
  margin-bottom: 20px;
}

.q-card-section {
  padding: 20px;
}

.q-btn {
  margin-top: 10px;
}

.row {
  display: flex;
  align-items: center;
}

.col {
  flex: 1;
}

.col-auto {
  margin-left: 10px;
}

.q-select {
  width: 150px;
}
</style>
