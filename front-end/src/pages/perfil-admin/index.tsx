import React, { useState } from 'react';
import { Typography, Button, Box, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Grid, Collapse, IconButton, MenuItem, styled, GlobalStyles, Container } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';
import logoImg from '../../assets/logo.png';
import Nav from '@/components/Nav';

export default function AdminProfile() {
    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
    });
    const [users, setUsers] = useState([
        { id: 1, name: 'Usuário 1', type: 'Bronze' },
        { id: 2, name: 'Usuário 2', type: 'Prata' },
        { id: 3, name: 'Usuário 3', type: 'Ouro' },
    ]);
    const userTypes = ['Bronze', 'Prata', 'Ouro'];
    const [ongs, setOngs] = useState([
        {
            id: 1,
            name: 'ONG 1',
            description: 'Descrição da ONG 1',
            location: 'Localização da ONG 1',
            area: 'Área de Atuação da ONG 1',
            contact: 'Contato da ONG 1'
        },
        {
            id: 2,
            name: 'ONG 2',
            description: 'Descrição da ONG 2',
            location: 'Localização da ONG 2',
            area: 'Área de Atuação da ONG 2',
            contact: 'Contato da ONG 2'
        },
    ]);
    const [newOng, setNewOng] = useState({ name: '', description: '', location: '', area: '', contact: '' });
    const [selectedOng, setSelectedOng] = useState<{ id: number; name: string; description: string; location: string; area: string; contact: string } | null>(null);
    const [expandedOng, setExpandedOng] = useState<number | null>(null);
    const [addOngOpen, setAddOngOpen] = useState(false);
    const [editOngOpen, setEditOngOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [ongToDelete, setOngToDelete] = useState<number | null>(null);
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [editPasswordOpen, setEditPasswordOpen] = useState(false);
    const [newName, setNewName] = useState(user.name);
    const [newEmail, setNewEmail] = useState(user.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [selectedUser, setSelectedUser] = useState<{ id: number; name: string; type: string } | null>(null);
    const [updateUserOpen, setUpdateUserOpen] = useState(false);

    function handleUpdateUserType() {
        if (selectedUser) {
            setUsers(users.map(user =>
                user.id === selectedUser.id ? { ...user, type: selectedUser.type } : user
            ));
            setUpdateUserOpen(false);
            setSelectedUser(null);
            toast.success("Tipo de usuário atualizado com sucesso!");
        }
    }

    function openUpdateUserDialog(user: { id: number; name: string; type: string }) {
        setSelectedUser(user);
        setUpdateUserOpen(true);
    }

    function handleAddOng() {
        setOngs([...ongs, { ...newOng, id: Date.now() }]);
        setAddOngOpen(false);
        setNewOng({ name: '', description: '', location: '', area: '', contact: '' });
        toast.success("ONG adicionada com sucesso!");
    }

    function handleEditOng() {
        if (selectedOng) {
            setOngs(ongs.map(ong =>
                ong.id === selectedOng.id ? { ...selectedOng, ...newOng } : ong
            ));
            setEditOngOpen(false);
            setSelectedOng(null);
            setNewOng({ name: '', description: '', location: '', area: '', contact: '' });
            toast.success("ONG atualizada com sucesso!");
        }
    }

    function handleDeleteOng(id: number) {
        setOngs(ongs.filter(ong => ong.id !== id));
        setConfirmDeleteOpen(false);
        toast.success("ONG removida com sucesso!");
    }

    function openConfirmDeleteDialog(id: number) {
        setOngToDelete(id);
        setConfirmDeleteOpen(true);
    }

    function closeConfirmDeleteDialog() {
        setConfirmDeleteOpen(false);
        setOngToDelete(null);
    }

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
                        <Typography variant="h5" >
                            Meu Perfil
                        </Typography>
                    </Box>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <Box sx={{ backgroundColor: "#EEEEEE", padding: "20px", borderRadius: "20px", mb: 2 }}>
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
                            <Box sx={{ backgroundColor: "#EEEEEE", padding: "20px", borderRadius: "20px", my: 2 }}>
                                <Typography variant="h6">
                                    ONGs Cadastradas
                                </Typography>
                                <List>
                                    {ongs.map((ong, index) => (
                                        <ListItem key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', border: '1px solid grey', borderRadius: 3, mb: 2, padding: '10px 0 0 10px' }}>
                                            <ListItemText
                                                primary={ong.name}
                                                secondary={ong.description}
                                            />
                                            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                                                <IconButton onClick={() => {
                                                    setSelectedOng(ong);
                                                    setNewOng({
                                                        name: ong.name,
                                                        description: ong.description,
                                                        location: ong.location,
                                                        area: ong.area,
                                                        contact: ong.contact
                                                    });
                                                    setEditOngOpen(true);
                                                }}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={() => openConfirmDeleteDialog(ong.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => setExpandedOng(expandedOng === index ? null : index)}
                                                >
                                                    {expandedOng === index ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineIcon />}
                                                </IconButton>
                                            </Box>
                                            <Collapse in={expandedOng === index}>
                                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Localização:</strong> {ong.location}</Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Área de Atuação:</strong> {ong.area}</Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Contato:</strong> {ong.contact}</Typography>
                                            </Collapse>
                                        </ListItem>
                                    ))}
                                </List>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', my: 2 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddCircleOutlineIcon />}
                                        onClick={() => setAddOngOpen(true)}
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
                                <ListItem key={user.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid grey', borderRadius: 3, mb: 2, padding: '10px' }}>
                                    <ListItemText
                                        primary={user.name}
                                        secondary={`Tipo: ${user.type}`}
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton
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
                        value={newOng.name}
                        onChange={e => setNewOng({ ...newOng, name: e.target.value })}
                        sx={{ my: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Descrição"
                        fullWidth
                        variant="outlined"
                        value={newOng.description}
                        onChange={e => setNewOng({ ...newOng, description: e.target.value })}
                        sx={{ mb: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Localização"
                        fullWidth
                        variant="outlined"
                        value={newOng.location}
                        onChange={e => setNewOng({ ...newOng, location: e.target.value })}
                        sx={{ mb: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Área de Atuação"
                        fullWidth
                        variant="outlined"
                        value={newOng.area}
                        onChange={e => setNewOng({ ...newOng, area: e.target.value })}
                        sx={{ mb: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Contato"
                        fullWidth
                        variant="outlined"
                        value={newOng.contact}
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
                        value={newOng.name}
                        onChange={e => setNewOng({ ...newOng, name: e.target.value })}
                        sx={{ my: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Descrição"
                        fullWidth
                        variant="outlined"
                        value={newOng.description}
                        onChange={e => setNewOng({ ...newOng, description: e.target.value })}
                        sx={{ mb: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Localização"
                        fullWidth
                        variant="outlined"
                        value={newOng.location}
                        onChange={e => setNewOng({ ...newOng, location: e.target.value })}
                        sx={{ mb: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Área de Atuação"
                        fullWidth
                        variant="outlined"
                        value={newOng.area}
                        onChange={e => setNewOng({ ...newOng, area: e.target.value })}
                        sx={{ mb: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Contato"
                        fullWidth
                        variant="outlined"
                        value={newOng.contact}
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
                        value={selectedUser?.type || ''}
                        onChange={e => setSelectedUser({ ...selectedUser!, type: e.target.value })}
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
                    <Button onClick={handleUpdateUserType}>Salvar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}