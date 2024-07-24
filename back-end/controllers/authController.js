
const { db } = require('../firebase.js');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const isStrongPassword = require('../utils/strongPassword.js');
require("dotenv").config()

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

    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.' });
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
    res.status(400).json({ error: error.message });
  }
};

// Controlador para solicitar redefinição de senha
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const userSnapshot = await db.collection('users').where('email', '==', email).get();

    if (userSnapshot.empty) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const user = userSnapshot.docs[0];
    const token = uuidv4();

    await db.collection('users').doc(user.id).update({ resetToken: token });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.SENHAEMAIL1 + ' ' + process.env.SENHAEMAIL2 + ' ' + process.env.SENHAEMAIL3 + ' ' + process.env.SENHAEMAIL4
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Redefinir Senha',
      text: `Seu token de definição é: ${token}`,
    };

    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        return res.json({ message: "Erro ao enviar email", error });
      } else {
        return res.json({ status: true, message: "Email enviado" });
      }
    });

  } catch (error) {
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Controlador para recuperação de senha
exports.resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    const userSnapshot = await db.collection('users').where('email', '==', email).get();

    if (userSnapshot.empty) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const user = userSnapshot.docs[0].data();

    if (user.resetToken !== token) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await db.collection('users').doc(userSnapshot.docs[0].id).update({ 
      password: hashedPassword,
    });

    return res.json({ status: true, message: 'Senha redefinida com sucesso' });

  } catch (error) {
    return res.status(500).json({ error: 'Erro no servidor' });
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
    res.status(200).json({ email: user.email, displayName: user.displayName, typeUser: user.typeUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controlador para listar ONGs favoritas do usuário com todas as características
exports.listFavOngs = async (req, res) => {
  try {
    // Recupera o usuário
    const userSnapshot = await db.collection('users').where('userId', '==', req.user.userId).get();

    if (userSnapshot.empty) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const user = userSnapshot.docs[0].data();
    const favOngsNames = user.favOngs || [];

    // Se não houver ONGs favoritas, retorna uma lista vazia
    if (favOngsNames.length === 0) {
      return res.status(200).json({ favOngs: [] });
    }

    // Recupera todas as ONGs favoritas pelo nome
    const ongsSnapshot = await db.collection('ongs').where('name', 'in', favOngsNames).get();

    if (ongsSnapshot.empty) {
      return res.status(400).json({ error: 'Nenhuma ONG encontrada' });
    }

    const favOngs = ongsSnapshot.docs.map(doc => doc.data());

    res.status(200).json({ favOngs });
  } catch (error) {
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
    res.status(400).json({ error: error.message });
  }
};

// Controlador para validar token
exports.validateToken = (req, res) => {
  res.status(200).json({ message: 'Token é válido', user: req.user });
};

// Controlador para alterar a senha do usuário autenticado
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const userSnapshot = await db.collection('users').where('userId', '==', req.user.userId).get();

    if (userSnapshot.empty) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const user = userSnapshot.docs[0].data();

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.collection('users').doc(userSnapshot.docs[0].id).update({ 
      password: hashedPassword,
    });

    res.status(200).json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Controlador para adicionar ONG como favoritada pelo nome
exports.addFavOng = async (req, res) => {
  const { ongName } = req.body; // Alterado de ongId para ongName

  try {
    // Recupera o usuário
    const userSnapshot = await db.collection('users').where('userId', '==', req.user.userId).get();

    if (userSnapshot.empty) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const userRef = userSnapshot.docs[0].ref;
    const userData = userSnapshot.docs[0].data();
    const favOngs = userData.favOngs || [];

    // Verifica se a ONG já está favoritada
    if (favOngs.includes(ongName)) {
      return res.status(400).json({ error: 'ONG já está favoritada' });
    }

    // Adiciona o nome da ONG à lista de ONGs favoritas
    favOngs.push(ongName);
    await userRef.update({ favOngs });

    res.status(200).json({ message: 'ONG favoritada com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Controlador para deletar ONG favoritada
exports.deleteFavOng = async (req, res) => {
  const { ongName } = req.body;

  try {
    // Obter a referência do usuário
    const userSnapshot = await db.collection('users').where('userId', '==', req.user.userId).get();

    if (userSnapshot.empty) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const userRef = userSnapshot.docs[0].ref;
    const userData = userSnapshot.docs[0].data();
    const favOngs = userData.favOngs || [];

    // Verifica se a ONG está favoritada
    if (!favOngs.includes(ongName)) {
      return res.status(400).json({ error: 'ONG não está favoritada' });
    }

    // Remove o nome da ONG da lista de ONGs favoritas
    const updatedFavOngs = favOngs.filter(name => name !== ongName);
    await userRef.update({ favOngs: updatedFavOngs });

    res.status(200).json({ message: 'ONG desfavoritada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};







