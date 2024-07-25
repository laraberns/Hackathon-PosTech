import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, Button, MenuItem, DialogActions } from '@mui/material';
import { User } from '@/pages/perfil-admin';

interface DialogEditUserProfileTypeProps {
    open: boolean;
    onClose: () => void;
    selectedUser: User | null;
    setSelectedUser: (user: User) => void;
    handleUpdateButtonClick: () => void;
    userTypes: string[];
}

const DialogEditUserProfileType: React.FC<DialogEditUserProfileTypeProps> = ({
    open,
    onClose,
    selectedUser,
    setSelectedUser,
    handleUpdateButtonClick,
    userTypes
}) => {
    const handleUserTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedUser) {
            const updatedUser = { ...selectedUser, userType: e.target.value };
            setSelectedUser(updatedUser);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Atualizar Tipo de Usuário</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Selecione o novo tipo de usuário.
                </DialogContentText>
                <TextField
                    select
                    label="Tipo"
                    fullWidth
                    value={selectedUser?.userType || ''}
                    onChange={handleUserTypeChange}
                    variant="outlined"
                    sx={{ mt: 2 }}
                >
                    {userTypes.map(type => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleUpdateButtonClick}>Salvar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogEditUserProfileType;
