const admin = require('firebase-admin');
const db = admin.firestore();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminHash = process.env.ADMIN_PASSWORD_HASH;

    const emailConfere = email === adminEmail;
    // Compara sempre para não vazar, pelo tempo de resposta, se o email existe
    const senhaConfere = await bcrypt.compare(password, adminHash || '');

    if (!emailConfere || !senhaConfere) {
        return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    const token = jwt.sign({ email: adminEmail, role: 'admin' }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login realizado com sucesso!', token });
};


exports.visualizarContas = (req, res) => {
    db.collection('contas').get()
        .then(snapshot => {
            const contas = [];
            snapshot.forEach(doc => {
                contas.push({ id: doc.id, ...doc.data() });
            });
            res.status(200).json(contas);
        })
        .catch(err => res.status(500).send('Erro ao visualizar contas: ' + err));
};


exports.atualizarContas = (req, res) => {
    const { id } = req.params;
    const novosDados = req.body;

    db.collection('contas').doc(id).update(novosDados)
        .then(() => res.status(200).send('Prestação de contas atualizada com sucesso!'))
        .catch(err => res.status(500).send('Erro ao atualizar contas: ' + err));
};


function gerarIdBoleto() {
    return `boleto-${Math.random().toString(36).substr(2, 9)}`;
}


exports.gerarBoleto = (req, res) => {
    const { aluno, valor, vencimento } = req.body;

    
    const vencimentoDate = new Date(vencimento);
    const mes = vencimentoDate.getMonth() + 1; 
    const ano = vencimentoDate.getFullYear();

   
    db.collection('boletos')
        .where('aluno', '==', aluno.cpf)
        .where('mes', '==', mes)
        .where('ano', '==', ano)
        .get()
        .then(snapshot => {
            if (!snapshot.empty) {
             
                return res.status(400).send('Boleto já gerado para este aluno no mês e ano fornecidos.');
            } else {
                
                const novoBoleto = {
                    id: gerarIdBoleto(),
                    aluno: aluno.cpf,
                    valor: valor,
                    vencimento: vencimentoDate,
                    mes: mes, 
                    ano: ano, 
                    status: 'Em aberto',
                    codigo_barras: Math.floor(Math.random() * 100000000000) + '.' + Math.floor(Math.random() * 100000000000, 10)
                };
               
                db.collection('boletos').doc(novoBoleto.id).set(novoBoleto)
                    .then(() => res.status(200).send('Boleto gerado com sucesso!'))
                    .catch(err => res.status(500).send('Erro ao gerar boleto: ' + err));
            }
        })
        .catch(err => res.status(500).send('Erro ao verificar boletos existentes: ' + err));
};
