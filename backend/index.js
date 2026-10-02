require('dotenv').config();

const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
    const json = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, 'base64').toString('utf8');
    return JSON.parse(json);
  }
  try {
    return require('./firebaseServiceAccount.json');
  } catch (e) {
    throw new Error(
      'Credenciais do Firebase ausentes. Defina FIREBASE_SERVICE_ACCOUNT_B64 no .env (veja o .env.example).'
    );
  }
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET ausente. Configure o .env a partir do .env.example antes de iniciar.');
}

admin.initializeApp({
  credential: admin.credential.cert(loadServiceAccount()),
});

const db = admin.firestore();
db.settings({ preferRest: true });

const app = express();

app.use(helmet());
app.use(express.json());

const origins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors({ origin: origins.length ? origins : true }));

// Limite geral de requisições por IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Limite mais rígido nas rotas de autenticação (anti brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas tentativas. Tente novamente em alguns minutos.' },
});
app.use('/alunos/login', authLimiter);
app.use('/admin/login', authLimiter);

app.use('/alunos', require('./routes/alunoRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/checkin', require('./routes/checkinRoutes'));
app.use('/boletos', require('./routes/boletosRoutes'));
app.use('/avisos', require('./routes/avisosRoutes'));
app.use('/contas', require('./routes/contasRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
