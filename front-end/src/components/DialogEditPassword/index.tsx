import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';

interface DialogEditPasswordProps {
    editPasswordOpen: boolean;
    setEditPasswordOpen: (open: boolean) => void;
    currentPassword: string;
    setCurrentPassword: (password: string) => void;
    newPassword: string;
    setNewPassword: (password: string) => void;
    confirmNewPassword: string;
    setConfirmNewPassword: (password: string) => void;
    handleEditPassword: () => void;
}

const DialogEditPassword: React.FC<DialogEditPasswordProps> = ({
    editPasswordOpen,
    setEditPasswordOpen,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    handleEditPassword
}) => {
    return (
        <Dialog open={editPasswordOpen} onClose={() => setEditPasswordOpen(false)}>
            <DialogTitle>Editar Senha</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Atualize sua senha.
                </DialogContentText>
                <TextField
                    margin="dense"
                    label="Senha Atual"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Nova Senha"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Confirmar Nova Senha"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setEditPasswordOpen(false)}>Cancelar</Button>
                <Button onClick={handleEditPassword}>Salvar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogEditPassword;
