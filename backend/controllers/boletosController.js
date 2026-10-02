const admin = require('firebase-admin');
const db = admin.firestore();

exports.atualizarStatusBoleto = async (req, res) => {
  const { id } = req.params; // id do boleto
  const { status } = req.body; // novo status

  if (!id || !status) {
    return res.status(400).json({ mensagem: 'ID do boleto e status são obrigatórios' });
  }

  try {
    const boletoRef = db.collection('boletos').doc(id);
    const boletoDoc = await boletoRef.get();

    if (!boletoDoc.exists) {
      return res.status(404).json({ mensagem: 'Boleto não encontrado' });
    }

    await boletoRef.update({ status });
    return res.status(200).json({ mensagem: 'Status atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status do boleto:', error);
    return res.status(500).json({ mensagem: 'Erro interno ao atualizar status' });
  }
};


// Função para formatar a data
const formatarData = (data) => {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

exports.getTodosBoletos = async (req, res) => {
  try {
    const boletosSnapshot = await db.collection('boletos').get();
    const boletos = [];

    boletosSnapshot.forEach(doc => {
      const data = doc.data();
      const vencimentoFormatado = data.vencimento?.toDate
        ? formatarData(data.vencimento.toDate())
        : null;

      boletos.push({
        id: doc.id,
        ...data,
        vencimento: vencimentoFormatado
      });
    });

    res.json(boletos);
  } catch (error) {
    console.error('Erro ao buscar boletos:', error);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};

exports.getBoletosPorCpf = async (req, res) => {
  const { cpf } = req.params;

  if (!cpf) {
    return res.status(400).json({ mensagem: 'CPF não fornecido' });
  }

  try {
    const snapshot = await db.collection('boletos').where('aluno', '==', cpf).get();

    if (snapshot.empty) {
      return res.status(200).json([]); // Nenhum boleto encontrado
    }

    const boletos = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const vencimentoFormatado = data.vencimento?.toDate
        ? formatarData(data.vencimento.toDate())
        : null;

      boletos.push({
        id: doc.id,
        ...data,
        vencimento: vencimentoFormatado
      });
    });

    return res.status(200).json(boletos);
  } catch (err) {
    console.error('Erro ao buscar boletos:', err);
    return res.status(500).send('Erro ao buscar boletos.');

    
  }

  
};

