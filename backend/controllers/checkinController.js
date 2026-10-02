const admin = require('firebase-admin');
const db = admin.firestore();


// Check-in de aluno
exports.checkin = (req, res) => {
  const { cpf } = req.body;
  const time = new Date();

  db.collection('alunos').doc(cpf).set({
    checkinTime: time,
    checkedIn: true
  }, { merge: true })
  .then(() => res.status(200).send('Check-in realizado com sucesso!'))
  .catch(err => res.status(500).send('Erro no check-in: ' + err));
};

// Check-out de aluno
exports.checkout = (req, res) => {
  const { cpf } = req.body;
  const time = new Date();

  db.collection('alunos').doc(cpf).set({
    checkoutTime: time,
    checkedIn: false
  }, { merge: true })
  .then(() => res.status(200).send('Check-out realizado com sucesso!'))
  .catch(err => res.status(500).send('Erro no check-out: ' + err));
};

// Listar alunos presentes no ônibus
exports.listarPresentes = (req, res) => {
  db.collection('alunos').where('checkedIn', '==', true).get()
  .then(snapshot => {
    if (snapshot.empty) {
      return res.status(200).send('Nenhum aluno presente no ônibus.');
    }

    const alunosPresentes = [];
    snapshot.forEach(doc => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { senha, ...aluno } = doc.data();
      alunosPresentes.push(aluno);
    });

    res.status(200).json(alunosPresentes);
  })
  .catch(err => res.status(500).send('Erro ao listar alunos presentes: ' + err));
};
