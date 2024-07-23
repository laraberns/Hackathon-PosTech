const express = require('express');
const app = express();
const cors = require('cors');

const port = 8383;
const bodyParser = require('body-parser');
const ongsRouter = require('./routes/ongsRoute');

// Configuração do CORS
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());

app.use('/ongs', ongsRouter);

app.listen(port, () => console.log(`Server has started on port: ${port}`));
