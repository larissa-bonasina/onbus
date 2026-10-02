const admin = require('firebase-admin');
const db = admin.firestore();

// Despesas da associação, exibidas aos alunos na prestação de contas.
const paraJson = (doc) => {
  const d = doc.data();
  return { id: doc.id, descricao: d.descricao, valor: Number(d.valor), data: d.data };
};

exports.listar = async (req, res) => {
  try {
    const snap = await db.collection('contas').orderBy('data', 'desc').limit(500).get();
    res.json(snap.docs.map(paraJson));
  } catch (err) {
    console.error('Erro ao listar despesas:', err);
    res.status(500).json({ message: 'Erro ao carregar a prestação de contas.' });
  }
};

exports.criar = async (req, res) => {
  const { descricao, valor, data } = req.body;
  try {
    const ref = await db.collection('contas').add({
      descricao,
      valor: Number(valor),
      data,
      criadoEm: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json(paraJson(await ref.get()));
  } catch (err) {
    console.error('Erro ao lançar despesa:', err);
    res.status(500).json({ message: 'Erro ao lançar despesa.' });
  }
};

exports.remover = async (req, res) => {
  try {
    await db.collection('contas').doc(req.params.id).delete();
    res.status(204).end();
  } catch (err) {
    console.error('Erro ao remover despesa:', err);
    res.status(500).json({ message: 'Erro ao remover despesa.' });
  }
};
