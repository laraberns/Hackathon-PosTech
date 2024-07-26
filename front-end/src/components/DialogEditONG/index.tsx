import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, Button, MenuItem, DialogActions } from '@mui/material';
import { State } from '../DialogAddONG';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ONG } from '../AllONGs';

interface DialogEditONGProps {
    open: boolean;
    onClose: () => void;
    newOng: ONG;
    setNewOng: (ong: ONG) => void;
    handleEditOng: (ong: ONG, imageUrl: string | null) => void;
    states: State[];
    areaOptions: string[];
}

const DialogEditONG: React.FC<DialogEditONGProps> = ({ open, onClose, newOng, setNewOng, handleEditOng, states, areaOptions }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return null;

        setUploading(true);
        const fileName = `${newOng.name.replace(/\s+/g, '_')}`;
        const storageRef = ref(storage, `images/${fileName}`);

        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            return url;
        } catch (error) {
            console.error('Error uploading the file', error);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSaveClick = async () => {
        let imageUrl: string | null = null;

        if (file) {
            imageUrl = await handleUpload();
            if (!imageUrl) {
                toast.error('Erro ao enviar a foto. ONG não editada.');
                return;
            }
        }

        try {
            handleEditOng(newOng, imageUrl);
            setFile(null);
            onClose();
        } catch (error) {
            console.error('Error editing ONG', error);
            toast.error('Erro ao editar ONG.');
        }
    };

    const handleInputChange = (field: keyof ONG) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewOng({ ...newOng, [field]: e.target.value });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Editar ONG</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Atualize as informações da ONG.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Nome"
                    fullWidth
                    variant="outlined"
                    value={newOng.name}
                    onChange={handleInputChange('name')}
                    sx={{ my: 1 }}
                />
                <TextField
                    margin="dense"
                    label="Descrição"
                    fullWidth
                    variant="outlined"
                    value={newOng.description}
                    onChange={handleInputChange('description')}
                    sx={{ mb: 1 }}
                />
                <TextField
                    margin="dense"
                    label="Cidade"
                    fullWidth
                    variant="outlined"
                    value={newOng.city}
                    onChange={handleInputChange('city')}
                    sx={{ mb: 1 }}
                />
                <TextField
                    margin="dense"
                    label="Estado"
                    fullWidth
                    variant="outlined"
                    value={newOng.state}
                    onChange={handleInputChange('state')}
                    select
                    sx={{ mb: 1 }}
                >
                    {states.map((estado) => (
                        <MenuItem key={estado.code} value={estado.code}>
                            {estado.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    margin="dense"
                    label="Área de atuação"
                    fullWidth
                    variant="outlined"
                    value={newOng.area}
                    onChange={handleInputChange('area')}
                    select
                    sx={{ mb: 1 }}
                >
                    {areaOptions.map((area) => (
                        <MenuItem key={area} value={area}>
                            {area}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    margin="dense"
                    label="Contato"
                    fullWidth
                    variant="outlined"
                    value={newOng.contact}
                    onChange={handleInputChange('contact')}
                />
                <DialogContentText sx={{ my: 1 }}>
                    Foto da ONG
                </DialogContentText>
                <input type="file" onChange={handleFileChange} />
                <ToastContainer />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    onClick={handleSaveClick}
                    disabled={uploading}
                >
                    {uploading ? 'Enviando...' : 'Salvar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogEditONG;
