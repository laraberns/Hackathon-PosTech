import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Collapse, TextField, Grid } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

interface Ong {
    name: string;
    description: string;
    city: string;
    state: string;
    area: string;
    contact: string;
}

interface FavOngsProps {
    ongs: Ong[];
    allOngs: Ong[];
    handleRemoveFavOng: (name: string) => void;
    handleAddFavOng: () => void;
    selectedOng: string;
    setSelectedOng: (name: string) => void;
}

const FavOngs: React.FC<FavOngsProps> = ({ ongs, allOngs, handleRemoveFavOng, handleAddFavOng, selectedOng, setSelectedOng }) => {
    const [expandedOng, setExpandedOng] = useState<number | null>(null);

    return (
        <Box sx={{ backgroundColor: "#EEEEEE", padding: "20px", borderRadius: "20px" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                ONGs Favoritadas
            </Typography>
            {ongs.length > 0 ? (
                <List>
                    {ongs.map((ong, index) => (
                        <ListItem key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', border: '1px solid grey', borderRadius: 3, mb: 2, padding: '10px' }}>
                            <ListItemText
                                primary={ong.name}
                                secondary={ong.description}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                <Button
                                    onClick={() => setExpandedOng(expandedOng === index ? null : index)}
                                >
                                    {expandedOng === index ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineIcon />}
                                </Button>
                                <Button
                                    onClick={() => handleRemoveFavOng(ong.name)}
                                >
                                    <DeleteOutlineIcon />
                                </Button>
                            </Box>
                            <Collapse in={expandedOng === index}>
                                <Typography variant="body2" sx={{ my: 1 }}><strong>Cidade:</strong> {ong.city}</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Estado:</strong> {ong.state}</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Área de Atuação:</strong> {ong.area}</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Contato:</strong> {ong.contact}</Typography>
                            </Collapse>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body1" sx={{ mb: 2 }}>Não há ONGs favoritadas.</Typography>
            )}
            <Grid item xs={12}>
                <Box sx={{ backgroundColor: "white", padding: "20px", borderRadius: "20px" }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Favoritar Nova ONG
                    </Typography>
                    <TextField
                        select
                        label="Selecione uma ONG"
                        fullWidth
                        variant="outlined"
                        value={selectedOng}
                        onChange={e => setSelectedOng(e.target.value)}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">Selecione uma ONG</option>
                        {allOngs.map((ong) => (
                            <option key={ong.name} value={ong.name}>
                                {ong.name}
                            </option>
                        ))}
                    </TextField>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#ffb7d1',
                            mt: 2,
                            '&:hover': {
                                backgroundColor: '#d48f9a',
                            },
                            fontWeight: 'bold', color: '#fff'
                        }}
                        onClick={handleAddFavOng}
                        disabled={!selectedOng}
                    >
                        Favoritar ONG
                    </Button>
                </Box>
            </Grid>
        </Box>
    );
};

export default FavOngs;
