const admin = require('firebase-admin');
const db = admin.firestore();
const { dataLocal, rotaDoAluno, viagemRef } = require('../services/viagens');

const iso = (ts) => (ts?.toDate ? ts.toDate().toISOString() : null);

// Aluno só mexe na própria presença; o admin pode informar o CPF de qualquer aluno.
const cpfAlvo = (req) => (req.user?.role === 'admin' ? req.body.cpf : req.user?.cpf);

// Confirma presença do aluno na viagem de hoje da rota dele.
exports.checkin = async (req, res) => {
  const cpf = cpfAlvo(req);
  if (!cpf) return res.status(400).json({ message: 'CPF não informado.' });

  try {
    const alunoDoc = await db.collection('alunos').doc(cpf).get();
    if (!alunoDoc.exists) return res.status(404).json({ message: 'Aluno não encontrado.' });

    const rota = await rotaDoAluno(cpf);
    if (!rota) {
      return res.status(409).json({ message: 'Você ainda não está vinculado a uma rota. Fale com a associação.' });
    }

    const data = dataLocal();
    const viagem = viagemRef(rota.id, data);
    const batch = db.batch();
    batch.set(viagem, { rotaId: rota.id, rotaNome: rota.nome, data }, { merge: true });
    batch.set(viagem.collection('presencas').doc(cpf), {
      cpf,
      nome: alunoDoc.data().nome,
      checkinEm: admin.firestore.FieldValue.serverTimestamp(),
    });
    await batch.commit();

    res.status(200).json({ message: 'Presença confirmada.', data, rotaId: rota.id });
  } catch (err) {
    console.error('Erro no check-in:', err);
    res.status(500).json({ message: 'Erro ao confirmar presença.' });
  }
};

// Desfaz a confirmação de hoje.
exports.checkout = async (req, res) => {
  const cpf = cpfAlvo(req);
  if (!cpf) return res.status(400).json({ message: 'CPF não informado.' });

  try {
    const rota = await rotaDoAluno(cpf);
    if (rota) await viagemRef(rota.id, dataLocal()).collection('presencas').doc(cpf).delete();
    res.status(200).json({ message: 'Presença desfeita.' });
  } catch (err) {
    console.error('Erro ao desfazer presença:', err);
    res.status(500).json({ message: 'Erro ao desfazer presença.' });
  }
};

// Situação do aluno logado na viagem de hoje.
exports.minhaHoje = async (req, res) => {
  const cpf = req.user?.cpf;
  if (!cpf) return res.status(400).json({ message: 'Disponível apenas para alunos.' });

  try {
    const data = dataLocal();
    const rota = await rotaDoAluno(cpf);
    const doc = rota ? await viagemRef(rota.id, data).collection('presencas').doc(cpf).get() : null;
    res.json({ data, rotaId: rota?.id ?? null, checkinEm: doc?.exists ? iso(doc.data().checkinEm) : null });
  } catch (err) {
    console.error('Erro ao obter presença de hoje:', err);
    res.status(500).json({ message: 'Erro ao carregar sua presença.' });
  }
};

// Presenças de um dia (padrão: hoje), de todas as rotas. Uso do admin.
exports.presencasDoDia = async (req, res) => {
  const data = req.query.data || dataLocal();
  try {
    const viagens = await db.collection('viagens').where('data', '==', data).get();
    const porViagem = await Promise.all(
      viagens.docs.map(async (v) => {
        const presencas = await v.ref.collection('presencas').get();
        return presencas.docs.map((p) => ({
          cpf: p.id,
          nome: p.data().nome,
          rotaId: v.data().rotaId,
          rotaNome: v.data().rotaNome,
          checkinEm: iso(p.data().checkinEm),
        }));
      })
    );
    res.json({ data, presencas: porViagem.flat() });
  } catch (err) {
    console.error('Erro ao listar presenças:', err);
    res.status(500).json({ message: 'Erro ao carregar as presenças.' });
  }
};
