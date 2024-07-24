const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { firebaseStart } = require('./firebase');

dotenv.config()

// Iniciar firebase
firebaseStart();

const port = process.env.PORT || 8383;

// Configuração do CORS
app.use(cors());

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(require('./middleware/sessionMiddleware'));

// Routes
const authRouter = require('./routes/authRoute');
// const ongsRouter = require('./routes/ongsRoute');
app.use('/auth', authRouter);
// app.use('/ongs', ongsRouter);
app.use((req, res) => {
    res.status(404).send('<h1>Página não encontrada</h1>');
  });

app.listen(port, () => console.log(`Server has started on port: ${port}`));