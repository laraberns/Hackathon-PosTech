import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';

interface DialogEditProfileProps {
    editProfileOpen: boolean;
    setEditProfileOpen: (open: boolean) => void;
    newName: string;
    setNewName: (name: string) => void;
    newEmail: string;
    setNewEmail: (email: string) => void;
    handleEditProfile: () => void;
}

const DialogEditProfile: React.FC<DialogEditProfileProps> = ({
    editProfileOpen,
    setEditProfileOpen,
    newName,
    setNewName,
    newEmail,
    setNewEmail,
    handleEditProfile
}) => {
    return (
        <Dialog open={editProfileOpen} onClose={() => setEditProfileOpen(false)}>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Atualize suas informações de perfil.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Nome"
                    fullWidth
                    variant="outlined"
                    value={newName}
                    sx={{ my: 2 }}
                    onChange={e => setNewName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="E-mail"
                    fullWidth
                    variant="outlined"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setEditProfileOpen(false)}>Cancelar</Button>
                <Button onClick={handleEditProfile}>Salvar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogEditProfile;
