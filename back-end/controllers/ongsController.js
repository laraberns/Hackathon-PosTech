const { db } = require('../firebase.js');

const areaOptions = [
    'Educação',
    'Saúde',
    'Meio Ambiente',
    'Direitos Humanos',
    'Animais',
    'Assistência Social',
    'Cultura',
    'Desenvolvimento Comunitário',
    'Outros'
];

exports.getONGs = async (req, res) => {
    try {
        const ongsRef = db.collection('ongs');
        const snapshot = await ongsRef.get();

        if (snapshot.empty) {
            return res.status(404).send('Nenhuma ONG registrada');
        }

        let ongs = [];
        snapshot.forEach(doc => {
            ongs.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).send(ongs);
    } catch (error) {
        res.status(500).send('Erro interno');
    }
};

exports.getONGById = async (req, res) => {
    const { id } = req.params;

    try {
        const ongRef = db.collection('ongs').doc(id);
        const doc = await ongRef.get();

        if (!doc.exists) {
            return res.status(404).send('ONG não encontrada');
        }

        res.status(200).send({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).send('Erro interno');
    }
};

exports.addONG = async (req, res) => {
    const { name, description, city, state, area, contact} = req.body;

    if (!name || !description || !city || !state || !area || !contact) {
        return res.status(400).send('Nome, descrição, cidade, estado, área de atuação e contato são requeridos.');
    }

    if (!areaOptions.includes(area)) {
        return res.status(400).send('Área de atuação inválida. As opções válidas são: ' + areaOptions.join(', '));
    }

    try {
        const ongsRef = db.collection('ongs');
        const querySnapshot = await ongsRef.where('name', '==', name).get();

        if (!querySnapshot.empty) {
            return res.status(400).send('Nome da ONG já está em uso.');
        }

        const newONGRef = await ongsRef.add({
            name,
            description,
            city,
            state,
            area,
            contact,
        });

        res.status(200).send({ id: newONGRef.id, message: 'ONG adicionada com sucesso' });
    } catch (error) {
        res.status(500).send('Erro interno');
    }
};

exports.changeONG = async (req, res) => {
    const { id, name, description, city, state, area, contact} = req.body;

    if (!id || !name || !description || !city || !state || !area || !contact) {
        return res.status(400).send('ID, nome, descrição, cidade, estado, área de atuação e contato são requeridos.');
    }

    if (!areaOptions.includes(area)) {
        return res.status(400).send('Área de atuação inválida. As opções válidas são: ' + areaOptions.join(', '));
    }

    try {
        const ongRef = db.collection('ongs').doc(id);
        const doc = await ongRef.get();
        if (!doc.exists) {
            return res.status(404).send('ONG não encontrada');
        }

        const existingNameSnapshot = await db.collection('ongs').where('name', '==', name).get();

        if (!existingNameSnapshot.empty && existingNameSnapshot.docs[0].id !== id) {
            return res.status(400).send('Nome da ONG já está em uso.');
        }

        await ongRef.update({
            name,
            description,
            city,
            state,
            area,
            contact,
        });

        res.status(200).send('ONG atualizada com sucesso');
    } catch (error) {
        res.status(500).send('Erro interno');
    }
};

exports.deleteONG = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send('ID é necessário');
    }

    try {
        const ongRef = db.collection('ongs').doc(id);
        const doc = await ongRef.get();

        if (!doc.exists) {
            return res.status(404).send('ONG não encontrada');
        }

        await ongRef.delete();
        res.status(200).send('ONG deletada com sucesso');
    } catch (error) {
        res.status(500).send('Erro interno');
    }
};
