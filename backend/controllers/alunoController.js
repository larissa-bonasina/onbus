const bcrypt = require('bcrypt');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const db = admin.firestore();

const JWT_SECRET = process.env.JWT_SECRET;

// Listar todos os alunos
exports.listarAlunos = async (req, res) => {
  try {
    const snapshot = await db.collection('alunos').get();
    const alunos = snapshot.docs.map(doc => doc.data());
    res.status(200).json(alunos);
  } catch (error) {
    res.status(500).send('Erro ao listar alunos: ' + error.message);
  }
};

// Obter aluno pelo CPF
exports.obterAluno = async (req, res) => {
  const { cpf } = req.params;
  try {
    const alunoDoc = await db.collection('alunos').doc(cpf).get();
    if (!alunoDoc.exists) {
      return res.status(404).send('Aluno não encontrado.');
    }
    res.status(200).json(alunoDoc.data());
  } catch (error) {
    res.status(500).send('Erro ao obter aluno: ' + error.message);
  }
};

// Atualizar aluno pelo CPF
exports.atualizarAluno = async (req, res) => {
  const { cpf } = req.params;
  const novosDados = req.body;

  try {
    await db.collection('alunos').doc(cpf).update(novosDados);
    res.status(200).send('Aluno atualizado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao atualizar aluno: ' + error.message);
  }
};

// Deletar aluno
exports.deletarAluno = async (req, res) => {
  const { cpf } = req.params;
  try {
    await db.collection('alunos').doc(cpf).delete();
    res.status(200).send('Aluno deletado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao deletar aluno: ' + error.message);
  }
};

// Cadastrar aluno
exports.cadastrarAluno = async (req, res) => {
  const { email, senha, nome, curso, cpf, numero, endereco } = req.body;

  if (!email || !senha || !nome || !curso || !cpf || !numero || !endereco) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  try {
    // Verifica se o CPF já está cadastrado
    const docExiste = await db.collection('alunos').doc(cpf).get();
    if (docExiste.exists) {
      return res.status(400).send('Aluno com esse CPF já cadastrado.');
    }

    // Verifica se o email já está em uso
    const emailSnapshot = await db.collection('alunos').where('email', '==', email).get();
    if (!emailSnapshot.empty) {
      return res.status(400).send('Email já está em uso.');
    }

    const hash = await bcrypt.hash(senha, 10);

    await db.collection('alunos').doc(cpf).set({
      email,
      senha: hash,
      nome,
      curso,
      cpf,
      numero,
      endereco,
    });

    res.status(200).send('Aluno cadastrado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao cadastrar aluno: ' + error.message);
  }
};

// Login
exports.loginAluno = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  try {
    const alunosSnapshot = await db.collection('alunos').where('email', '==', email).get();

    if (alunosSnapshot.empty) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    const alunoDoc = alunosSnapshot.docs[0];
    const alunoData = alunoDoc.data();

    const senhaValida = await bcrypt.compare(senha, alunoData.senha);

    if (!senhaValida) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    const token = jwt.sign(
      { email: alunoData.email, cpf: alunoData.cpf, numero: alunoData.numero },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      aluno: {
        nome: alunoData.nome,
        email: alunoData.email,
        cpf: alunoData.cpf,
        numero: alunoData.numero
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor: ' + error.message });
  }
};
