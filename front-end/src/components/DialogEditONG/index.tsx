import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, Button, MenuItem, DialogActions } from '@mui/material';
import { ONG } from '../Modal';
import { State } from '../DialogAddONG';

interface DialogEditONGProps {
    open: boolean;
    onClose: () => void;
    newOng: ONG;
    setNewOng: (ong: ONG) => void;
    handleEditOng: () => void;
    states: State[];
    areaOptions: string[];
}

const DialogEditONG: React.FC<DialogEditONGProps> = ({ open, onClose, newOng, setNewOng, handleEditOng, states, areaOptions }) => {
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
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleEditOng}>Salvar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogEditONG;
