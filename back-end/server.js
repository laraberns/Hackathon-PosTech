const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const authRouter = require('./routes/authRoute');
const ongsRouter = require('./routes/ongsRoute');

const port = 8383;

// Configuração do CORS
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/ongs', ongsRouter);

app.listen(port, () => console.log(`Server has started on port: ${port}`));
