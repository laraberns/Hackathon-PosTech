import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Grid, Collapse, GlobalStyles } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import logoImg from '../../assets/logo.png';
import Image from 'next/image';
import Nav from '@/components/Nav';
import axios from 'axios';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function ProfileUser() {
    const [user, setUser] = useState({
        displayName: '',
        email: '',
        typeUser: ''
    });
    const [ongs, setOngs] = useState([]);
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [editPasswordOpen, setEditPasswordOpen] = useState(false);
    const [newName, setNewName] = useState(user.displayName);
    const [newEmail, setNewEmail] = useState(user.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [expandedOng, setExpandedOng] = useState<number | null>(null);
    const [allOngs, setAllOngs] = useState([]);
    const [selectedOng, setSelectedOng] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserDetails(token);
            fetchFavOngs(token)
            fetchOngs(token);
        }
    }, []);

    const fetchOngs = async (token: string) => {
        try {
            const response = await axios.get(`${process.env.BD_API}/ongs/allongs`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response)
            setAllOngs(response.data);
        } catch (err) {
            console.error('Erro ao buscar ONGs:', err);
            toast.error("Erro ao carregar lista de ONGs.");
        }
    };

    const fetchUserDetails = async (token: string) => {
        try {
            const response = await axios.get(`${process.env.BD_API}/auth/user-details`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const userDetails = response.data;
            setUser(userDetails);
            setNewName(userDetails.displayName);
            setNewEmail(userDetails.email);
        } catch (err) {
            console.error('Erro ao buscar os detalhes do usuário:', err);
            toast.error("Erro ao carregar dados do usuário.");
        }
    };

    const handleRemoveFavOng = async (ongName: number) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(
                `${process.env.BD_API}/auth/delete-fav-ong`,
                { ongName },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            toast.success("ONG removida com sucesso!");
            token && fetchFavOngs(token); // Atualiza a lista de ONGs favoritas
        } catch (err: any) {
            console.error('Erro ao remover ONG:', err);
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error("Erro ao remover ONG.");
            }
        }
    };


    const fetchFavOngs = async (token: string) => {
        try {
            const response = await axios.get(`${process.env.BD_API}/auth/fav-ongs`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setOngs(response.data.favOngs);
        } catch (err) {
            console.error('Erro ao buscar ONGs favoritas:', err);
            toast.error("Erro ao carregar ONGs favoritas.");
        }
    };

    const handleEditProfile = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(
                `${process.env.BD_API}/auth/edit-profile`,
                { email: newEmail, displayName: newName },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setUser({ ...user, displayName: newName, email: newEmail });
            setEditProfileOpen(false);
            toast.success("Perfil atualizado com sucesso!");
        } catch (err: any) {
            console.error('Erro ao atualizar perfil:', err);
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error("Erro ao atualizar perfil.");
            }
        }
    };

    const handleEditPassword = async () => {
        if (newPassword !== confirmNewPassword) {
            toast.error("As senhas não coincidem.");
            return;
        }

        const token = localStorage.getItem('token');
        try {
            await axios.post(
                `${process.env.BD_API}/auth/change-password`,
                { currentPassword, newPassword },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            console.log(currentPassword, newPassword)
            setEditPasswordOpen(false);
            toast.success("Senha atualizada com sucesso!");
        } catch (err: any) {
            console.error('Erro ao atualizar senha:', err);
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error("Erro ao atualizar senha.");
            }
        }
    };

    const handleAddFavOng = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(
                `${process.env.BD_API}/auth/add-fav-ong`,
                { ongName: selectedOng },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            toast.success("ONG favoritada com sucesso!");
            token && fetchFavOngs(token);
        } catch (err: any) {
            console.error('Erro ao favoritar ONG:', err);
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error("Erro ao favoritar ONG.");
            }
        }
    };

    return (
        <>
            <GlobalStyles
                styles={{
                    html: {
                        height: '100%',
                        width: '100%',
                        overflow: 'scroll',
                    },
                    body: {
                        height: '100%',
                        width: '100%',
                        overflow: 'auto',
                        margin: 0,
                        padding: 0,
                        boxSizing: 'border-box',
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    },
                }}
            />
            <Nav />
            <Container maxWidth="md">
                <ToastContainer />
                <Box sx={{ mt: 1, backgroundColor: "white", padding: "20px", borderRadius: "20px" }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Image src={logoImg} alt="Workflow" width={150} />
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Meu Perfil
                        </Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{ backgroundColor: "#EEEEEE", padding: "20px", borderRadius: "20px" }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Informações Pessoais
                                </Typography>
                                <Typography variant="body1">
                                    Nome: <span style={{ fontWeight: 'bold' }}>{user.displayName}</span>
                                </Typography>
                                <Typography variant="body1">
                                    E-mail: <span style={{ fontWeight: 'bold' }}>{user.email}</span>
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{ my: 2, mr: 2 }}
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
                                            sx={{ mt: 2 }}
                                            onClick={handleAddFavOng}
                                            disabled={!selectedOng}
                                        >
                                            Favoritar ONG
                                        </Button>
                                    </Box>
                                </Grid>
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
