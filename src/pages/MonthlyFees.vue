<template>
  <div>
    <!-- Título -->
    <div class="header-row">
      <h1 class="title">Lista de Mensalidades</h1>

      <!-- Seletor de Data -->
      <q-input
        filled
        v-model="selectedDate"
        label="Selecionar Data"
        readonly
        dense
        style="min-width: 200px"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date
                v-model="selectedDate"
                mask="DD/MM/YYYY"
                default-view="Calendar"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>

    <!-- Card com lista -->
    <q-card>
      <q-card-section>
        <q-list bordered separator>
          <q-expansion-item
            v-for="(student, index) in students"
            :key="index"
            expand-separator
            header-class="student-header"
          >
            <template #header>
              <q-item-section avatar>
                <div
                  class="status-dot"
                  :style="{ backgroundColor: getStatusColor(student.status) }"
                />
              </q-item-section>
              <q-item-section>
                {{ student.name }}
              </q-item-section>
            </template>

            <q-card class="q-pa-md">
              <div>
                <strong>Email:</strong>
                {{
                  student.email.includes('gabrielialencar')
                    ? student.email
                    : '*****'
                }}
              </div>
            </q-card>

            <q-item>
              <q-item-section>
                <q-select
                  v-model="student.status"
                  :options="statusOptions"
                  dense
                  outlined
                  label="Status"
                  style="min-width: 160px"
                />
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="white"
          text-color="#2b3d63"
          outline
          icon="notifications"
          label="Notificar"
          @click="notifyStudents"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import emailjs from 'emailjs-com';

export default {
  name: 'MonthlyFees',
  data() {
    return {
      selectedDate: '',
      statusOptions: ['Pago', 'Processando', 'Não Pago'],
      students: [
        { name: 'João Silva', email: 'joao@email.com', status: 'Processando' },
        {
          name: 'Maria Oliveira',
          email: 'maria@email.com',
          status: 'Processando',
        },
        {
          name: 'Carlos Souza',
          email: 'carlos@email.com',
          status: 'Processando',
        },
        {
          name: 'Gabrieli Alencar',
          email: 'gabrielialencar84@gmail.com',
          status: 'Processando',
        },
      ],
    };
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case 'Pago':
          return 'green';
        case 'Processando':
          return 'gold';
        case 'Não Pago':
          return 'red';
        default:
          return 'gray';
      }
    },
    notifyStudents() {
      this.students.forEach((student) => {
        if (student.status === 'Processando') {
          return;
        }

        let subject = '';
        let message = '';

        if (student.status === 'Pago') {
          subject = '⚠️ Mensalidade Vencida – Regularize e evite encargos!';
          message = `Olá, ${student.name}!\n\nVerificamos que sua mensalidade no valor de R$ 165,67, com vencimento em 12/XX, ainda não foi paga.\n\n⚠️ Atenção: Após 5 dias úteis do vencimento, seu boleto será encaminhado para cartório, gerando custos adicionais.\n\nPor favor, regularize o pagamento o quanto antes para evitar transtornos.\n\nSe você já realizou o pagamento, por favor, desconsidere este aviso. Em caso de dúvidas, entre em contato conosco.\n\nAtenciosamente,\nAssociação dos Acadêmicos – Transporte Universitário`;
        }

        if (student.status === 'Não Pago') {
          subject = '🚫 Aviso de Protesto – Mensalidade Não Paga';
          message = `Olá, ${student.name},\n\nInformamos que, infelizmente, sua mensalidade no valor de R$ 165,67, com vencimento em 12/XX, não foi quitada dentro do prazo, e o boleto foi encaminhado para protesto em cartório, conforme previsto em nosso regulamento.\n\nPara regularizar sua situação, é necessário procurar diretamente o cartório, onde poderão ser aplicadas taxas adicionais referentes ao protesto.\n\nCaso haja algum erro ou você deseje resolver essa situação diretamente conosco, pedimos que entre em contato imediatamente.\n\nAtenciosamente,\nAssociação dos Acadêmicos – Transporte Universitário`;
        }

        if (subject && message) {
          emailjs
            .send(
              'service_0kvblay',
              'template_2s0qjee',
              {
                to_name: student.name,
                to_email: student.email,
                subject: subject,
                message: message,
                from_email: 'gab541341@gmail.com',
              },
              'V6evAzqbvFb1CWlwr'
            )
            .then(() => {
              this.$q.notify({
                type: 'positive',
                message: `Email enviado para ${student.name} (${student.email})`,
              });
            })
            .catch((error) => {
              this.$q.notify({
                type: 'negative',
                message: `Erro ao enviar email para ${student.name}: ${
                  error.text || error
                }`,
              });
            });
        }
      });
    },
  },
};
</script>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.title {
  font-size: 36px;
  color: #2b2b2b;
  margin: 0;
  font-weight: 700;
}

.student-header {
  font-weight: bold;
  color: #2b3d63;
  font-size: 16px;
}

.status-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: 8px;
}
</style>
