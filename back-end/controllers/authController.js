const { getApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } = require('firebase/auth');
const { getFirestore, Timestamp, doc, setDoc, getDoc, collection, getDocs, updateDoc, arrayUnion, query, where, deleteDoc } = require('firebase/firestore');

const firebase = getApp();
const db = getFirestore(firebase);

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
};