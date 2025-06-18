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
                @input="filtrarPorData"
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
            v-for="(boleto) in boletosFiltrados"
            :key="boleto.id"
            expand-separator
            header-class="student-header"
          >
            <template #header>
              <q-item-section avatar>
                <div
                  class="status-dot"
                  :style="{ backgroundColor: getStatusColor(boleto.status) }"
                />
              </q-item-section>
              <q-item-section>
                {{ boleto.nome || boleto.aluno }} - Vencimento: {{ boleto.vencimento || 'N/A' }}
              </q-item-section>
            </template>

            <q-card class="q-pa-md">
              <div>
                <strong>Valor Mensalidade:</strong> R$ {{ formatValor(boleto.valor) }}
              </div>
            </q-card>

            <q-item>
              <q-item-section>
                <q-select
                  v-model="boleto.status"
                  :options="statusOptions"
                  dense
                  outlined
                  label="Status"
                  style="min-width: 160px"
                  @update:model-value="atualizarStatus(boleto)"
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
import emailjs from 'emailjs-com'
import axios from 'axios'

export default {
  name: 'MonthlyFees',
  data() {
    return {
      selectedDate: '',
      statusOptions: ['Pago', 'Não Pago', 'Em aberto'],
      boletos: [],
      boletosFiltrados: [],
      mapaAlunos: {}, // Mapa CPF -> Nome dos alunos
      isUnmounted: false,
    }
  },
  methods: {
    formatValor(valor) {
      const num = Number(valor)
      if (isNaN(num)) return '0,00'
      return num.toFixed(2).replace('.', ',')
    },

    getStatusColor(status) {
      switch (status.toLowerCase()) {
        case 'pago':
          return 'green'
       case 'em aberto':
          return 'gold'
        case 'não pago':
          return 'red'
        default:
          return 'gray'
      }
    },

    async fetchAlunos() {
      try {
        const response = await axios.get('http://localhost:3000/alunos') // Ajuste a URL para seu backend
        this.mapaAlunos = {}
        response.data.forEach(aluno => {
          this.mapaAlunos[aluno.cpf] = aluno.nome
        })
      } catch (error) {
        console.error('Erro ao buscar alunos:', error)
        this.mapaAlunos = {}
      }
    },

    async fetchBoletos() {
      try {
        const response = await axios.get('http://localhost:3000/boletos')
        if (this.isUnmounted) return

        this.boletos = response.data.map(boleto => {
          const nomeDoAluno = this.mapaAlunos[boleto.aluno] || boleto.aluno
          return {
            ...boleto,
            valor: Number(boleto.valor) || 0,
            status: boleto.status || 'Em aberto',
            vencimento: boleto.vencimento || '',
            aluno: boleto.aluno || 'Sem CPF',
            nome: nomeDoAluno
          }
        })

        this.boletosFiltrados = this.boletos
      } catch (error) {
        console.error('Erro ao buscar boletos:', error)
        if (!this.isUnmounted) this.boletos = []
      }
    },

    filtrarPorData() {
      if (!this.selectedDate) {
        this.boletosFiltrados = this.boletos
        return
      }

      this.boletosFiltrados = this.boletos.filter(
        boleto => boleto.vencimento === this.selectedDate
      )
    },

    async atualizarStatus(boleto) {
      console.log('Atualizando boleto:', boleto)
      try {
        await axios.put(`http://localhost:3000/boletos/${boleto.id}/status`, {
          status: boleto.status
        })

        this.$q.notify({
          type: 'positive',
          message: `Status do boleto de ${boleto.nome} atualizado para "${boleto.status}".`
        })
      } catch (error) {
        console.error('Erro ao atualizar status:', error)
        this.$q.notify({
          type: 'negative',
          message: `Erro ao atualizar status do boleto de ${boleto.nome}.`
        })
      }
    },

    notifyStudents() {
      this.boletos.forEach(boleto => {
        if (boleto.status.toLowerCase() === 'processando') return

        let subject = ''
        let message = ''

        if (boleto.status.toLowerCase() === 'pago') {
          subject = '✅ Confirmação de Pagamento – Obrigado!'
          message = `Olá, aluno de CPF ${boleto.aluno}!\n\nConfirmamos o recebimento da sua mensalidade no valor de R$ ${this.formatValor(boleto.valor)}.\n\nAgradecemos por estar em dia com sua contribuição.\n\nAtenciosamente,\nAssociação dos Acadêmicos – Transporte Universitário`
        }

        if (
          boleto.status.toLowerCase() === 'não pago' ||
          boleto.status.toLowerCase() === 'em aberto'
        ) {
          subject = '🚫 Aviso de Protesto – Mensalidade Não Paga'
          message = `Olá, aluno de CPF ${boleto.aluno},\n\nInformamos que sua mensalidade no valor de R$ ${this.formatValor(boleto.valor)}, com vencimento em ${boleto.vencimento}, não foi quitada dentro do prazo.\n\nPor favor, regularize a situação para evitar protesto.\n\nAtenciosamente,\nAssociação dos Acadêmicos – Transporte Universitário`
        }

        if (subject && message) {
          emailjs
            .send(
              'service_5rc8rok',
              'template_yyj8gj3',
              {
                to_name: `Aluno ${boleto.nome}`,
                to_email: boleto.email || 'email@exemplo.com',
                subject,
                message,
                from_name: 'ASSOCIAÇÃO DE ACADEMICOS',
                reply_to: 'associados@transporte.com'
              },
              'V6evAzqbvFb1CWlwr'
            )
            .then(() => {
              this.$q.notify({
                type: 'positive',
                message: `Email enviado para o aluno CPF ${boleto.aluno}`
              })
            })
            .catch(error => {
              this.$q.notify({
                type: 'negative',
                message: `Erro ao enviar email para o aluno CPF ${boleto.aluno}: ${error.text || error}`
              })
            })
        }
      })
    }
  },

  async mounted() {
    await this.fetchAlunos()
    await this.fetchBoletos()
  },

  beforeUnmount() {
    this.isUnmounted = true
  }
}
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
