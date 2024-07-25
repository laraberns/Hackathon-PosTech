import React, { useEffect, useState } from 'react';
import { Typography, Button, Box, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Grid, Collapse, IconButton, MenuItem, GlobalStyles, Container } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';
import logoImg from '../../assets/logo.png';
import Nav from '@/components/Nav';
import axios from 'axios';
import { states } from '@/utils/states';
import { areaOptions } from '@/utils/areas';
import { ONG } from '@/components/Modal';

interface User {
    userId: string;
    email: string;
    displayName: string;
    typeUser: string;
    userType: string;
}

export default function AdminProfile() {
    const [user, setUser] = useState({
        displayName: '',
        email: '',
        typeUser: ''
    });
    const [users, setUsers] = useState<User[]>([]);
    const userTypes = ['Bronze', 'Prata', 'Ouro'];
    const [ongs, setOngs] = useState<ONG[]>([]);
    const [newOng, setNewOng] = useState<ONG>({
        id: '',
        name: '',
        description: '',
        city: '',
        state: '',
        area: '',
        contact: '',
        logoUrl: ''
    });
    const [selectedOng, setSelectedOng] = useState<ONG | null>(null);
    const [expandedOng, setExpandedOng] = useState<number | null>(null);
    const [addOngOpen, setAddOngOpen] = useState(false);
    const [editOngOpen, setEditOngOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [ongToDelete, setOngToDelete] = useState<string | null>(null);
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [editPasswordOpen, setEditPasswordOpen] = useState(false);
    const [newName, setNewName] = useState(user.displayName);
    const [newEmail, setNewEmail] = useState(user.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [updateUserOpen, setUpdateUserOpen] = useState(false);
    const [authenticated, setAuthenticated] = React.useState<boolean | null>(null);

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

    const fetchUsers = async (token: string) => {
        try {
            const response = await axios.get(`${process.env.BD_API}/auth/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(response.data.users);
        } catch (err) {
            console.error('Erro ao buscar usuários:', err);
            toast.error("Erro ao carregar lista de usuários.");
        }
    }

    const fetchOngs = async (token: string) => {
        try {
            const response = await axios.get(`${process.env.BD_API}/ongs/allongs`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setOngs(response.data);
        } catch (err) {
            console.error('Erro ao buscar ONGs:', err);
            toast.error("Erro ao carregar lista de ONGs.");
        }
    }

    const deleteOng = async (id: string, token: string) => {
        try {
            await axios.delete(`${process.env.BD_API}/ongs/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('ONG deletada com sucesso!');
        } catch (err) {
            toast.error('Erro ao deletar ONG.');
        }
    };

    const editOng = async (id: string, updatedOng: ONG, token: string) => {
        try {
            await axios.patch(`${process.env.BD_API}/ongs/changeong`, { ...updatedOng }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            toast.success('ONG atualizada com sucesso!');
        } catch (err) {
            console.error('Erro ao atualizar ONG:', err);
            toast.error('Erro ao atualizar ONG.');
        }
    };

    const addOng = async (newOng: ONG) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Token de autenticação não encontrado.');
            return;
        }

        try {
            await axios.post(`${process.env.BD_API}/ongs/addong`, newOng, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            toast.success('ONG adicionada com sucesso!');
        } catch (err) {
            console.error('Erro ao adicionar ONG:', err);
            toast.error('Erro ao adicionar ONG.');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserDetails(token);
            fetchUsers(token);
        }

        const checkAuthentication = async () => {
            const token = localStorage.getItem('token');
        
            try {
                if (!token) {
                    setAuthenticated(false);
                    return;
                }
        
                const response = await axios.get(`${process.env.BD_API}/auth/validate`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
        
                if (response.status === 200) {
                    const userData = response.data;
    
                    if (userData.user.typeUser === 'Admin') {
                        setAuthenticated(true);
                    } else {
                        setAuthenticated(false);
                    }
                } else {
                    setAuthenticated(false);
                }
            } catch (error) {
                setAuthenticated(false);
            }
        };
        

        checkAuthentication();
        token && fetchOngs(token);
    }, []);

    if (authenticated === null) {
        return <p>Verificando autenticação...</p>;
    }

    if (!authenticated) {
        window.location.href = '/login';
        return null;
    }

    const handleUpdateButtonClick = () => {
        selectedUser && handleUpdateUserType(
            selectedUser,
            setUsers,
            users,
            setUpdateUserOpen,
            setSelectedUser
        );
    };

    const updateUserType = async (userId: string, newUserType: string, token: string) => {
        try {
            await axios.put(`${process.env.BD_API}/auth/update-user-type`, {
                userId,
                newUserType
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            toast.success('Tipo de usuário atualizado com sucesso!');
        } catch (err) {
            console.error('Erro ao atualizar tipo de usuário:', err);
            toast.error('Erro ao atualizar tipo de usuário.');
        }
    };

    const handleUpdateUserType = async (selectedUser: User, setUsers: React.Dispatch<React.SetStateAction<User[]>>, users: User[], setUpdateUserOpen: React.Dispatch<React.SetStateAction<boolean>>, setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>) => {
        const token = localStorage.getItem('token');

        try {
            token && await updateUserType(selectedUser?.userId, selectedUser.userType, token);
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.userId === selectedUser.userId ? { ...user, userType: selectedUser.userType } : user
                )
            );
            setUpdateUserOpen(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('Erro ao processar a atualização do tipo de usuário:', error);
            toast.error('Erro ao atualizar tipo de usuário.');
        }
    };

    function openUpdateUserDialog(user: User) {
        setSelectedUser(user);
        setUpdateUserOpen(true);
    }

    const handleAddOng = async () => {
        try {
            newOng && await addOng(newOng);
            setOngs([...ongs, { ...newOng }]);
            setAddOngOpen(false);
            setNewOng({ id: '', name: '', description: '', city: '', state: '', area: '', contact: '' });
        } catch (error) {
            console.error('Erro ao processar a adição da ONG:', error);
            toast.error('Erro ao adicionar ONG.');
        }
    };

    async function handleEditOng() {
        if (selectedOng) {
            const token = localStorage.getItem('token');

            if (!token) {
                toast.error('Token de autenticação não encontrado.');
                return;
            }

            try {
                newOng && await editOng(selectedOng.id, newOng, token);

                setOngs(ongs.map(ong =>
                    ong.id === selectedOng.id ? { ...selectedOng, ...newOng } : ong
                ));
                setEditOngOpen(false);
                setSelectedOng(null);
                setNewOng({ id: '', name: '', description: '', city: '', state: '', area: '', contact: '' });
            } catch (error) {
                console.error('Erro ao processar a atualização da ONG:', error);
                toast.error('Erro ao atualizar ONG.');
            }
        }
    }

    function handleDeleteOng(id: string) {
        const token = localStorage.getItem('token');
        token && deleteOng(id, token);
        setOngs(ongs.filter(ong => ong.id !== id));
        setConfirmDeleteOpen(false);
    }

    function openConfirmDeleteDialog(id: string) {
        setOngToDelete(id);
        setConfirmDeleteOpen(true);
    }

    function closeConfirmDeleteDialog() {
        setConfirmDeleteOpen(false);
        setOngToDelete(null);
    }

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
                        <Image src={logoImg} alt="Image of logo" width={150} />
                    </Box>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <Box sx={{ backgroundColor: "#EEEEEE", padding: "20px", borderRadius: "20px", mb: 2 }}>
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
                                    sx={{ my: 3, mr: 2, backgroundColor: '#ffb7d1' }}
                                    onClick={() => setEditProfileOpen(true)}
                                >
                                    Editar Perfil
                                </Button>
                                <Button
                                    sx={{backgroundColor: '#ffb7d1' }}
                                    variant="contained"
                                    onClick={() => setEditPasswordOpen(true)}
                                >
                                    Editar Senha
                                </Button>
                            </Box>
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
                                                    sx={{backgroundColor: '#transparent', color: '#grey' }}
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
                                                    <IconButton 
                                                    sx={{backgroundColor: '#transparent', color: '#grey' }}
                                                    onClick={() => openConfirmDeleteDialog(ong.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        sx={{backgroundColor: 'transparent', color: '#grey' }}
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
                                        sx={{backgroundColor: '#ffb7d1' }}
                                    >
                                        Adicionar ONG
                                    </Button>
                                </Box>
                            </Box>

                        </Grid>
                    </Grid>
                    <Box sx={{ backgroundColor: "#EEEEEE", padding: "20px", borderRadius: "20px" }}>
                        <Typography variant="h6">Gerenciamento de Usuários</Typography>
                        <List>
                            {users.map(user => (
                                <ListItem key={user.userId} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid grey', borderRadius: 3, mb: 2, padding: '10px' }}>
                                    <ListItemText
                                        primary={user.displayName}
                                        secondary={`Tipo: ${user.userType}`}
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton
                                            sx={{backgroundColor: '#ffb7d1', color:'#fff' }}
                                            onClick={() => openUpdateUserDialog(user)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Box>
            </Container>

            {/* Modal de Adição de ONG */}
            <Dialog open={addOngOpen} onClose={() => setAddOngOpen(false)}>
                <DialogTitle>Adicionar ONG</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Preencha os detalhes da nova ONG.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nome"
                        fullWidth
                        variant="outlined"
                        value={newOng?.name}
                        onChange={e => setNewOng({ ...newOng, name: e.target.value })}
                        sx={{ my: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Descrição"
                        fullWidth
                        variant="outlined"
                        value={newOng?.description}
                        onChange={e => setNewOng({ ...newOng, description: e.target.value })}
                        sx={{ mb: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Cidade"
                        fullWidth
                        variant="outlined"
                        value={newOng?.city}
                        onChange={e => setNewOng({ ...newOng, city: e.target.value })}
                        sx={{ mb: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Estado"
                        fullWidth
                        variant="outlined"
                        value={newOng?.state}
                        onChange={e => setNewOng({ ...newOng, state: e.target.value })}
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
                        value={newOng?.area}
                        onChange={e => setNewOng({ ...newOng, area: e.target.value })}
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
                        value={newOng?.contact}
                        onChange={e => setNewOng({ ...newOng, contact: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddOngOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAddOng}>Adicionar</Button>
                </DialogActions>
            </Dialog>

            {/* Modal de Edição de ONG */}
            <Dialog open={editOngOpen} onClose={() => setEditOngOpen(false)}>
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
                        value={newOng?.name}
                        onChange={e => setNewOng({ ...newOng, name: e.target.value })}
                        sx={{ my: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Descrição"
                        fullWidth
                        variant="outlined"
                        value={newOng?.description}
                        onChange={e => setNewOng({ ...newOng, description: e.target.value })}
                        sx={{ mb: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Cidade"
                        fullWidth
                        variant="outlined"
                        value={newOng?.city}
                        onChange={e => setNewOng({ ...newOng, city: e.target.value })}
                        sx={{ mb: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Estado"
                        fullWidth
                        variant="outlined"
                        value={newOng?.state}
                        onChange={e => setNewOng({ ...newOng, state: e.target.value })}
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
                        value={newOng?.area}
                        onChange={e => setNewOng({ ...newOng, area: e.target.value })}
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
                        value={newOng?.contact}
                        onChange={e => setNewOng({ ...newOng, contact: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOngOpen(false)}>Cancelar</Button>
                    <Button onClick={handleEditOng}>Salvar</Button>
                </DialogActions>
            </Dialog>

            {/* Modal de Confirmação de Exclusão */}
            <Dialog
                open={confirmDeleteOpen}
                onClose={closeConfirmDeleteDialog}
            >
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza de que deseja remover a ONG? Esta ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmDeleteDialog}>Cancelar</Button>
                    <Button
                        color="error"
                        onClick={() => {
                            if (ongToDelete !== null) {
                                handleDeleteOng(ongToDelete);
                            }
                        }}
                    >
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>

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

            {/* Modal de Atualização de Tipo de Usuário */}
            <Dialog open={updateUserOpen} onClose={() => setUpdateUserOpen(false)}>
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
                        onChange={e => setSelectedUser({ ...selectedUser!, userType: e.target.value })}
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
                    <Button onClick={() => setUpdateUserOpen(false)}>Cancelar</Button>
                    <Button onClick={handleUpdateButtonClick}>Salvar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}