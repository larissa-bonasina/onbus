const admin = require('firebase-admin');
const db = admin.firestore();

const paraJson = (doc) => {
  const d = doc.data();
  return {
    id: doc.id,
    titulo: d.titulo,
    mensagem: d.mensagem,
    criadoEm: d.criadoEm?.toDate ? d.criadoEm.toDate().toISOString() : null,
  };
};

exports.listar = async (req, res) => {
  try {
    const snap = await db.collection('avisos').orderBy('criadoEm', 'desc').limit(100).get();
    res.json(snap.docs.map(paraJson));
  } catch (err) {
    console.error('Erro ao listar avisos:', err);
    res.status(500).json({ message: 'Erro ao carregar avisos.' });
  }
};

exports.criar = async (req, res) => {
  const { titulo, mensagem } = req.body;
  try {
    const ref = await db.collection('avisos').add({
      titulo,
      mensagem,
      criadoEm: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json(paraJson(await ref.get()));
  } catch (err) {
    console.error('Erro ao criar aviso:', err);
    res.status(500).json({ message: 'Erro ao publicar aviso.' });
  }
};

exports.remover = async (req, res) => {
  try {
    await db.collection('avisos').doc(req.params.id).delete();
    res.status(204).end();
  } catch (err) {
    console.error('Erro ao remover aviso:', err);
    res.status(500).json({ message: 'Erro ao remover aviso.' });
  }
};
