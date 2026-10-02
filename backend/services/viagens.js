const admin = require('firebase-admin');
const db = admin.firestore();

// A associação opera em Mato Grosso: "hoje" é o dia em Cuiabá, não o do servidor.
const FUSO = 'America/Cuiaba';

// Data no formato AAAA-MM-DD (o locale en-CA já formata assim).
function dataLocal(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: FUSO, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

// Rota do aluno: a vinculada (alunos.rotaId) ou, sem vínculo, a única rota da associação.
// Devolve { id, ...dados } ou null.
async function rotaDoAluno(cpf) {
  const alunoDoc = cpf ? await db.collection('alunos').doc(cpf).get() : null;
  const rotaId = alunoDoc?.exists ? alunoDoc.data().rotaId : null;

  if (rotaId) {
    const rotaDoc = await db.collection('rotas').doc(rotaId).get();
    if (rotaDoc.exists) return { id: rotaDoc.id, ...rotaDoc.data() };
  }

  const snap = await db.collection('rotas').limit(2).get();
  return snap.size === 1 ? { id: snap.docs[0].id, ...snap.docs[0].data() } : null;
}

// Uma viagem por rota por dia; as presenças ficam em viagens/{id}/presencas/{cpf}.
const viagemRef = (rotaId, data) => db.collection('viagens').doc(`${rotaId}_${data}`);

module.exports = { dataLocal, rotaDoAluno, viagemRef };
