
const { db } = require('../firebase.js');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key'; // Substitua pela sua chave secreta

// Controlador para login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userSnapshot = await db.collection('users').where('email', '==', email).get();

    if (userSnapshot.empty) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const user = userSnapshot.docs[0].data();

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.userId, email: user.email, displayName: user.displayName, typeUser: user.typeUser },
      SECRET_KEY,
      { expiresIn: '1h' } // O token expira em 1 hora
    );

    console.log(`Token gerado: ${token}`);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro:', error);
    res.status(400).json({ error: error.message });
  }
};


// Controlador para registro de usuário
exports.register = async (req, res) => {
  const { email, password, displayName, typeUser } = req.body;

  // Verificação do tipo de usuário
  const validTypes = ['Admin', 'User'];
  if (!validTypes.includes(typeUser)) {
    return res.status(400).json({ error: 'O tipo de usuário deve ser "Admin" ou "User"' });
  }

  try {
    // Verificação se o usuário já está registrado
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (!userSnapshot.empty) {
      return res.status(400).json({ error: 'Usuário já registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const usersRef = db.collection('users');
    const userId = uuidv4();

    const newUserRef = await usersRef.add({
      userId,
      email,
      password: hashedPassword,
      displayName,
      typeUser
    });

    res.status(201).json({ message: 'Usuário registrado com sucesso', user: newUserRef.id });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(400).json({ error: error.message });
  }
};

//PRECISA VALIDAR
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


// Configuração do transporte de email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'seuemail@gmail.com',
    pass: 'suasenha'
  }
});

//PRECISA VALIDAR
// Função para enviar email de recuperação de senha
const sendPasswordResetEmail = (email, resetToken) => {
  const resetUrl = `http://seusite.com/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: 'seuemail@gmail.com',
    to: email,
    subject: 'Redefinição de senha',
    text: `Clique no link para redefinir sua senha: ${resetUrl}`
  };

  return transporter.sendMail(mailOptions);
};

// Controlador para solicitar redefinição de senha
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const userSnapshot = await db.collection('users').where('email', '==', email).get();

    if (userSnapshot.empty) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const resetToken = uuidv4();
    const userRef = userSnapshot.docs[0].ref;
    await userRef.update({ resetToken });

    await sendPasswordResetEmail(email, resetToken);
    res.status(200).json({ message: 'Email de redefinição de senha enviado' });
  } catch (error) {
    console.error('Erro ao solicitar redefinição de senha:', error);
    res.status(400).json({ error: error.message });
  }
};

// Controlador para redefinir senha
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const userSnapshot = await db.collection('users').where('resetToken', '==', token).get();

    if (userSnapshot.empty) {
      return res.status(400).json({ error: 'Token inválido' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const userRef = userSnapshot.docs[0].ref;
    await userRef.update({
      password: hashedPassword,
      resetToken: null // Remova o token de redefinição após o uso
    });

    res.status(200).json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(400).json({ error: error.message });
  }
};
