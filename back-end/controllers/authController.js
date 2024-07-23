const { auth } = require('../firebase.js');

// Controlador para login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(`Tentando obter usuário pelo email: ${email}`);
    const userRecord = await auth.getUserByEmail(email);
    console.log(`Registro do usuário obtido: ${JSON.stringify(userRecord)}`);
    const token = await auth.createCustomToken(userRecord.uid);
    console.log(`Token gerado: ${token}`);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro:', error);
    res.status(400).json({ error: error.message });
  }
};

// Controlador para registro de usuário
exports.register = async (req, res) => {
  const { email, password, displayName } = req.body;
  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
    });
    console.log(`Usuário criado com sucesso: ${userRecord.uid}`);
    res.status(201).json({ message: 'Usuário registrado com sucesso', user: userRecord });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(400).json({ error: error.message });
  }
};

// Controlador para recuperação de senha
exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await auth.generatePasswordResetLink(email);
    res.status(200).json({ message: 'Link de recuperação de senha enviado' });
  } catch (error) {
    console.error('Erro ao enviar link de recuperação de senha:', error);
    res.status(400).json({ error: error.message });
  }
};
