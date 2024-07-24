
const { db } = require('../firebase.js');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key';

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

    const token = jwt.sign(
      { userId: user.userId, email: user.email, displayName: user.displayName, typeUser: user.typeUser },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controlador para registro de usuário
exports.register = async (req, res) => {
  const { email, password, displayName, typeUser, userType } = req.body;

  const validTypes = ['Admin', 'User'];
  if (!validTypes.includes(typeUser)) {
    return res.status(400).json({ error: 'O tipo de usuário deve ser "Admin" ou "User"' });
  }

  const validUserTypes = ['Bronze', 'Prata', 'Ouro'];
  const finalUserType = validUserTypes.includes(userType) ? userType : 'Bronze';

  try {
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
      typeUser,
      userType: finalUserType
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

//PRECISA VALIDAR
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

//PRECISA VALIDAR
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

// Rota protegida para obter detalhes do usuário
exports.getUserDetails = async (req, res) => {
  try {
    const userSnapshot = await db.collection('users').where('userId', '==', req.user.userId).get();

    if (userSnapshot.empty) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const user = userSnapshot.docs[0].data();
    res.status(200).json({ email: user.email, displayName: user.displayName });
  } catch (error) {
    console.error('Erro ao obter detalhes do usuário:', error);
    res.status(400).json({ error: error.message });
  }
};

// Controlador para listar ONGs favoritas do usuário
exports.listFavOngs = async (req, res) => {
  try {
    const userSnapshot = await db.collection('users').where('userId', '==', req.user.userId).get();

    if (userSnapshot.empty) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const user = userSnapshot.docs[0].data();
    res.status(200).json({ favOngs: user.favOngs });
  } catch (error) {
    console.error('Erro ao obter ONGs favoritas do usuário:', error);
    res.status(400).json({ error: error.message });
  }
};

// Controlador para editar o perfil do usuário
exports.editProfile = async (req, res) => {
  const { displayName, email, password } = req.body;
  
  try {
    const userSnapshot = await db.collection('users').where('userId', '==', req.user.userId).get();

    if (userSnapshot.empty) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const userRef = userSnapshot.docs[0].ref;
    const currentUser = userSnapshot.docs[0].data();

    if (email && email !== currentUser.email) {
      const emailSnapshot = await db.collection('users').where('email', '==', email).get();
      if (!emailSnapshot.empty) {
        return res.status(400).json({ error: 'Email já está em uso' });
      }
    }

    const updateFields = {};
    if (displayName) updateFields.displayName = displayName;
    if (email) updateFields.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    await userRef.update(updateFields);

    res.status(200).json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(400).json({ error: error.message });
  }
};

// Controlador para promover ou rebaixar usuários
exports.updateUserType = async (req, res) => {
  const { userId, newUserType } = req.body;

  const validUserTypes = ['Bronze', 'Prata', 'Ouro'];
  if (!validUserTypes.includes(newUserType)) {
    return res.status(400).json({ error: 'O rótulo do usuário deve ser "Bronze", "Prata" ou "Ouro"' });
  }

  try {
    const userSnapshot = await db.collection('users').where('userId', '==', userId).get();

    if (userSnapshot.empty) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const userRef = userSnapshot.docs[0].ref;
    await userRef.update({ userType: newUserType });

    res.status(200).json({ message: 'Rótulo do usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar rótulo do usuário:', error);
    res.status(400).json({ error: error.message });
  }
};




