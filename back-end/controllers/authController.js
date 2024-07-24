const { getApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } = require('firebase/auth');
const { getFirestore, Timestamp, doc, setDoc, getDoc, collection, getDocs, updateDoc, arrayUnion, query, where, deleteDoc } = require('firebase/firestore');

const firebase = getApp();
const db = getFirestore(firebase);
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const isStrongPassword = require('../utils/strongPassword.js');

exports.register = async (req, res) => {
    const { email, password, displayName, isAdmin } = req.body;

    try {
        createUserWithEmailAndPassword(getAuth(), email, password)
            .then((userCredential) => {
                updateProfile(getAuth().currentUser, {displayName:displayName});
                const typeUser = 'Bronze'; // Todos novos usuários recebem o título Bronze ao cadastrar
                const createdAt = Timestamp.now();
                setDoc(doc(db, 'users', userCredential.user.uid), {
                    email,
                    displayName,
                    typeUser,
                    isAdmin,
                    createdAt
                });
                console.log('Cadastro realizado com sucesso: ', userCredential.user.uid);
                res.status(200).json({ message: 'Cadastro realizado com sucesso' });
            })
            .catch((error) => {
                let statusCode = 500;

                if (error.code === 'auth/email-already-in-use') {
                    statusCode = 409;
                }
                res.status(statusCode).json({ error: error.message });
            })
    } catch (error) {
        console.error('Erro:', error);
        res.status(400).json({ error: error.message });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        signInWithEmailAndPassword(getAuth(), email, password)
            .then((userCredential) => {
                //Signed in
                userUid = userCredential.user.uid;
                console.log(userCredential.user);
                getDoc(doc(db, 'users', userUid))
                    .then((userSnap) => {
                        if (userSnap.exists()) {
                            userData = userSnap.data();
                            userData.uid = userUid;
                            req.session.userInfo = userData;
                            console.log('Sessão iniciada para usuário: ', req.session.userInfo.displayName)
                            res.status(200).json({ message: 'Login realizado com sucesso!', userData: req.session.userInfo })
                        } else {
                            res.status(404).json({ error: 'Dados do usuário não encontrado' });
                        }
                    });
            })
            .catch((error) => {
                let statusCode = 500;

                if (error.code === 'auth/invalid-credential') {
                    statusCode = 401;
                }
                res.status(statusCode).json({ error: error.message })
            })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Erro interno' });
    }
}

exports.logout = async (req, res) => {
    try {
        await signOut(getAuth());

        req.session.destroy((error) => {
            if (error) {
                console.error('Erro ao destruir sessão:', error);
                res.status(500).send('Não foi possível sair');
            } else {
                res.status(200).json({ message: 'Log out realizado com sucesso' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao sair' });
    }
};

exports.resetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Send password reset email using Firebase Auth API
        await sendPasswordResetEmail(getAuth(), email);

        // Email sent successfully
        res.status(200).json({ message: 'E-mail para definição de senha enviado' });
    } catch (error) {
        res.status(500).json({ error: 'Falha ao enviar e-mail' });
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

// Controlador para listar todos os usuários do tipo 'User'
exports.listAllUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').where('typeUser', '==', 'User').get();

    if (usersSnapshot.empty) {
      return res.status(404).json({ message: 'Nenhum usuário encontrado.' });
    }

    const users = usersSnapshot.docs.map(doc => doc.data());

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
  }
};