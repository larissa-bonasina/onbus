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


function gerarIdBoleto() {
    return `boleto-${Math.random().toString(36).substr(2, 9)}`;
}


exports.gerarBoleto = (req, res) => {
    const { aluno, valor, vencimento } = req.body;

    
    // "aaaa-mm-dd" vira meia-noite UTC com new Date(), que no Brasil cai no dia anterior;
    // montar a data local ao meio-dia mantém o dia certo em qualquer fuso.
    const [ano_, mes_, dia_] = String(vencimento).slice(0, 10).split('-').map(Number);
    const vencimentoDate = new Date(ano_, mes_ - 1, dia_, 12);
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
