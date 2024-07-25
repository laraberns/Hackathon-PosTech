import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton, Button, Collapse } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

interface Ong {
    id: string;
    name: string;
    description: string;
    city: string;
    state: string;
    area: string;
    contact: string;
}

interface AllONGsProps {
    ongs: Ong[];
    setSelectedOng: (ong: Ong) => void;
    setNewOng: (ong: Ong) => void;
    setEditOngOpen: (open: boolean) => void;
    setAddOngOpen: (open: boolean) => void;
    openConfirmDeleteDialog: (ongId: string) => void;
}

const AllONGs: React.FC<AllONGsProps> = ({
    ongs,
    setSelectedOng,
    setNewOng,
    setEditOngOpen,
    setAddOngOpen,
    openConfirmDeleteDialog
}) => {
    const [expandedOng, setExpandedOng] = useState<number | null>(null);

    return (
        <Box sx={{ backgroundColor: "#EEEEEE", padding: "20px", borderRadius: "20px", my: 2 }}>
            <Typography variant="h6">
                ONGs Cadastradas
            </Typography>
            {ongs.length === 0 ? (
                <Typography variant="body1" sx={{ my: 2 }}>
                    Não há ONGs cadastradas.
                </Typography>
            ) : (
                <List>
                    {ongs.map((ong, index) => (
                        <ListItem key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', border: '1px solid grey', borderRadius: 3, mb: 2, padding: '10px 0 0 10px' }}>
                            <ListItemText
                                primary={ong.name}
                                secondary={ong.description}
                            />
                            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                                <IconButton
                                    sx={{ backgroundColor: '#transparent', color: '#grey' }}
                                    onClick={() => {
                                        setSelectedOng(ong);
                                        setNewOng({
                                            id: ong.id,
                                            name: ong.name,
                                            description: ong.description,
                                            city: ong.city,
                                            state: ong.state,
                                            area: ong.area,
                                            contact: ong.contact
                                        });
                                        setEditOngOpen(true);
                                    }}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton sx={{ backgroundColor: 'transparent', color: '#grey' }}
                                    onClick={() => openConfirmDeleteDialog(ong.id)}>
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => setExpandedOng(expandedOng === index ? null : index)}
                                >
                                    {expandedOng === index ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineIcon />}
                                </IconButton>
                            </Box>
                            <Collapse in={expandedOng === index}>
                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Cidade:</strong> {ong.city}</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Estado:</strong> {ong.state}</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Área de Atuação:</strong> {ong.area}</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Contato:</strong> {ong.contact}</Typography>
                            </Collapse>
                        </ListItem>
                    ))}
                </List>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', my: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => setAddOngOpen(true)}
                    sx={{
                        backgroundColor: '#ffb7d1',
                        '&:hover': {
                            backgroundColor: '#d48f9a',
                        },
                        fontWeight: 'bold'
                    }}
                >
                    Adicionar ONG
                </Button>
            </Box>
        </Box>
    );
};

export default AllONGs;
