const admin = require('firebase-admin');
const db = admin.firestore();
const { dataLocal, rotaDoAluno } = require('../services/viagens');

const ponto = (p) => ({ nome: p.nome, lat: Number(p.lat), lng: Number(p.lng) });

const paraJson = (doc) => rotaJson(doc.id, doc.data());

// O alerta vale só no dia em que foi publicado; depois some sozinho.
function alertaAtivo(a) {
  if (!a || a.data !== dataLocal()) return null;
  return {
    tipo: a.tipo,
    mensagem: a.mensagem,
    atrasoMin: a.atrasoMin ?? null,
    criadoEm: a.criadoEm?.toDate ? a.criadoEm.toDate().toISOString() : null,
  };
}

function rotaJson(id, d) {
  return {
    id,
    nome: d.nome,
    embarque: d.embarque,
    destino: d.destino,
    horarioIda: d.horarioIda,
    horarioVolta: d.horarioVolta || null,
    dias: d.dias || [],
    alerta: alertaAtivo(d.alerta),
  };
}

// Só os campos conhecidos entram no banco, já normalizados.
function dadosDaRota(body) {
  return {
    nome: body.nome.trim(),
    embarque: ponto(body.embarque),
    destino: ponto(body.destino),
    horarioIda: body.horarioIda,
    horarioVolta: body.horarioVolta || null,
    dias: [...new Set(body.dias.map(Number))].sort(),
  };
}

exports.listar = async (req, res) => {
  try {
    const snap = await db.collection('rotas').orderBy('nome').get();
    res.json(snap.docs.map(paraJson));
  } catch (err) {
    console.error('Erro ao listar rotas:', err);
    res.status(500).json({ message: 'Erro ao carregar rotas.' });
  }
};

// Rota do aluno logado. Sem rotaId definido, vale a única rota da associação (se houver só uma).
exports.minha = async (req, res) => {
  try {
    const rota = await rotaDoAluno(req.user?.cpf);
    res.json(rota ? rotaJson(rota.id, rota) : null);
  } catch (err) {
    console.error('Erro ao obter rota do aluno:', err);
    res.status(500).json({ message: 'Erro ao carregar sua rota.' });
  }
};

exports.criar = async (req, res) => {
  try {
    const ref = await db.collection('rotas').add({
      ...dadosDaRota(req.body),
      criadoEm: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json(paraJson(await ref.get()));
  } catch (err) {
    console.error('Erro ao criar rota:', err);
    res.status(500).json({ message: 'Erro ao salvar a rota.' });
  }
};

exports.atualizar = async (req, res) => {
  const ref = db.collection('rotas').doc(req.params.id);
  try {
    if (!(await ref.get()).exists) {
      return res.status(404).json({ message: 'Rota não encontrada.' });
    }
    await ref.update(dadosDaRota(req.body));
    res.json(paraJson(await ref.get()));
  } catch (err) {
    console.error('Erro ao atualizar rota:', err);
    res.status(500).json({ message: 'Erro ao salvar a rota.' });
  }
};

// Não remove rota com alunos vinculados: eles ficariam sem rota sem ninguém perceber.
exports.remover = async (req, res) => {
  try {
    const vinculados = await db.collection('alunos').where('rotaId', '==', req.params.id).limit(1).get();
    if (!vinculados.empty) {
      return res.status(409).json({ message: 'Há alunos nesta rota. Mova-os para outra rota antes de remover.' });
    }
    await db.collection('rotas').doc(req.params.id).delete();
    res.status(204).end();
  } catch (err) {
    console.error('Erro ao remover rota:', err);
    res.status(500).json({ message: 'Erro ao remover a rota.' });
  }
};

// Vincula (ou desvincula, com rotaId null) um aluno a uma rota.
exports.vincularAluno = async (req, res) => {
  const { cpf } = req.params;
  const rotaId = req.body.rotaId || null;
  try {
    const alunoRef = db.collection('alunos').doc(cpf);
    if (!(await alunoRef.get()).exists) {
      return res.status(404).json({ message: 'Aluno não encontrado.' });
    }
    if (rotaId && !(await db.collection('rotas').doc(rotaId).get()).exists) {
      return res.status(404).json({ message: 'Rota não encontrada.' });
    }
    await alunoRef.update({ rotaId });
    res.json({ cpf, rotaId });
  } catch (err) {
    console.error('Erro ao vincular aluno à rota:', err);
    res.status(500).json({ message: 'Erro ao vincular o aluno à rota.' });
  }
};

// Publica (ou substitui) o alerta de hoje da rota: atraso, desvio ou viagem cancelada.
exports.publicarAlerta = async (req, res) => {
  const ref = db.collection('rotas').doc(req.params.id);
  const { tipo, mensagem } = req.body;
  try {
    if (!(await ref.get()).exists) {
      return res.status(404).json({ message: 'Rota não encontrada.' });
    }
    await ref.update({
      alerta: {
        tipo,
        mensagem: mensagem.trim(),
        atrasoMin: tipo === 'atraso' && req.body.atrasoMin ? Number(req.body.atrasoMin) : null,
        data: dataLocal(),
        criadoEm: admin.firestore.FieldValue.serverTimestamp(),
      },
    });
    res.json(paraJson(await ref.get()));
  } catch (err) {
    console.error('Erro ao publicar alerta:', err);
    res.status(500).json({ message: 'Erro ao publicar o alerta.' });
  }
};

exports.encerrarAlerta = async (req, res) => {
  const ref = db.collection('rotas').doc(req.params.id);
  try {
    if (!(await ref.get()).exists) {
      return res.status(404).json({ message: 'Rota não encontrada.' });
    }
    await ref.update({ alerta: null });
    res.json(paraJson(await ref.get()));
  } catch (err) {
    console.error('Erro ao encerrar alerta:', err);
    res.status(500).json({ message: 'Erro ao encerrar o alerta.' });
  }
};
