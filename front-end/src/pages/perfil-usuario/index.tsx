import React, { useState } from 'react';
import { Container, Typography, Button, Box, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Grid, Collapse } from '@mui/material';
import { Global } from '@emotion/react';
import { globalStyles } from '@/styles/backgroundStyle';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import logoImg from '../../assets/logo.png';
import Image from 'next/image';

export default function ProfileUser() {
    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
    });
    const [ongs, setOngs] = useState([
        {
            name: 'ONG 1',
            description: 'Descrição da ONG 1',
            location: 'Localização da ONG 1',
            area: 'Área de Atuação da ONG 1',
            contact: 'Contato da ONG 1'
        },
        {
            name: 'ONG 2',
            description: 'Descrição da ONG 2',
            location: 'Localização da ONG 2',
            area: 'Área de Atuação da ONG 2',
            contact: 'Contato da ONG 2'
        },
    ]);
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [editPasswordOpen, setEditPasswordOpen] = useState(false);
    const [newName, setNewName] = useState(user.name);
    const [newEmail, setNewEmail] = useState(user.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [expandedOng, setExpandedOng] = useState<number | null>(null);

    function handleEditProfile() {
        setUser({ ...user, name: newName, email: newEmail });
        setEditProfileOpen(false);
        toast.success("Perfil atualizado com sucesso!");
    }

    function handleEditPassword() {
        if (newPassword !== confirmNewPassword) {
            toast.error("As senhas não coincidem.");
            return;
        }
        // Implementar lógica de atualização de senha aqui
        setEditPasswordOpen(false);
        toast.success("Senha atualizada com sucesso!");
    }

    return (
        <>
            <Global styles={globalStyles} />
            <Container maxWidth="md">
                <ToastContainer />
                <Box sx={{ mt: 5, backgroundColor: "white", padding: "20px", borderRadius: "20px" }}>
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap:2}}>
                    <Image src={logoImg} alt="Workflow" width={150} />
                    <Typography variant="h4" sx={{ mb: 2 }}>
                        Meu Perfil
                    </Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{ backgroundColor: "lightgrey", padding: "20px", borderRadius: "20px" }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Informações Pessoais
                                </Typography>
                                <Typography variant="body1">
                                    Nome: <span style={{ fontWeight: 'bold' }}>{user.name}</span>
                                </Typography>
                                <Typography variant="body1">
                                    E-mail: <span style={{ fontWeight: 'bold' }}>{user.email}</span>
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{ my: 3, mr: 2 }}
                                    onClick={() => setEditProfileOpen(true)}
                                >
                                    Editar Perfil
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => setEditPasswordOpen(true)}
                                >
                                    Editar Senha
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ backgroundColor: "lightgrey", padding: "20px", borderRadius: "20px" }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    ONGs Inscritas
                                </Typography>
                                <List>
                                    {ongs.map((ong, index) => (
                                        <ListItem key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', border: '1px solid grey', borderRadius: 3, mb: 2, padding: '10px 0 0 10px' }}>
                                            <ListItemText
                                                primary={ong.name}
                                                secondary={ong.description}
                                            />
                                            <Button
                                                onClick={() => setExpandedOng(expandedOng === index ? null : index)}
                                                sx={{ ml: 'auto' }}
                                            >
                                                {expandedOng === index ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineIcon />}
                                            </Button>
                                            <Collapse in={expandedOng === index}>
                                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Localização:</strong> {ong.location}</Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Área de Atuação:</strong> {ong.area}</Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Contato:</strong> {ong.contact}</Typography>
                                            </Collapse>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>

            {/* Modal de Edição de Perfil */}
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

            {/* Modal de Edição de Senha */}
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
        </>
    );
}
