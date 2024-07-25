import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions } from '@mui/material';

interface DialogConfirmDeleteONGProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onCancel: () => void;
    ongToDelete: string | null
}

const DialogConfirmDeleteONG: React.FC<DialogConfirmDeleteONGProps> = ({ open, onClose, onConfirm, onCancel, ongToDelete }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Tem certeza de que deseja remover a ONG? Esta ação não pode ser desfeita.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancelar</Button>
                <Button
                    color="error"
                    onClick={() => {
                        if (ongToDelete !== null) {
                            onConfirm();
                        }
                    }}
                >
                    Excluir
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogConfirmDeleteONG;
