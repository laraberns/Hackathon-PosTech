"use client"
import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid, GlobalStyles, Container } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import logoImg from '../../assets/logo.png';
import Nav from '@/components/Nav';
import axios from 'axios';
import { states } from '@/utils/states';
import { areaOptions } from '@/utils/areas';
import InformacoesPessoais from '@/components/InformacoesPessoais';
import AllONGs, { ONG } from '@/components/AllONGs';
import ManageUsers from '@/components/ManageUsers';
import DialogAddONG from '@/components/DialogAddONG';
import DialogEditONG from '@/components/DialogEditONG';
import DialogConfirmDeleteONG from '@/components/DialogConfirmDeleteONG';
import DialogEditProfile from '@/components/DialogEditProfile';
import DialogEditPassword from '@/components/DialogEditPassword';
import DialogEditUserProfileType from '@/components/DialogEditUserProfileType';

export interface User {
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
    });
    const [selectedOng, setSelectedOng] = useState<ONG | null>(null);
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
            await axios.patch(`${process.env.BD_API}/ongs/changeong`, { ...updatedOng }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            toast.success('ONG atualizada com sucesso!');
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
            ;
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
        return
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
                        <Typography variant="h5" >
                            Meu Perfil
                        </Typography>
                    </Box>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <InformacoesPessoais
                                user={user}
                                setEditProfileOpen={setEditProfileOpen}
                                setEditPasswordOpen={setEditPasswordOpen}
                            />
                            <AllONGs
                                ongs={ongs}
                                setSelectedOng={setSelectedOng}
                                setNewOng={setNewOng}
                                setEditOngOpen={setEditOngOpen}
                                setAddOngOpen={setAddOngOpen}
                                openConfirmDeleteDialog={openConfirmDeleteDialog}
                            />
                        </Grid>
                    </Grid>
                    <ManageUsers
                        users={users}
                        openUpdateUserDialog={openUpdateUserDialog}
                    />
                </Box>
            </Container>
            <DialogAddONG
                open={addOngOpen}
                onClose={() => setAddOngOpen(false)}
                newOng={newOng}
                setNewOng={setNewOng}
                handleAddOng={handleAddOng}
                states={states}
                areaOptions={areaOptions}
            />
            <DialogEditONG
                open={editOngOpen}
                onClose={() => setEditOngOpen(false)}
                newOng={newOng}
                setNewOng={setNewOng}
                handleEditOng={handleEditOng}
                states={states}
                areaOptions={areaOptions}
            />
            <DialogConfirmDeleteONG
                open={confirmDeleteOpen}
                onClose={closeConfirmDeleteDialog}
                onConfirm={() => {
                    if (ongToDelete !== null) {
                        handleDeleteOng(ongToDelete);
                    }
                }}
                onCancel={closeConfirmDeleteDialog}
                ongToDelete={ongToDelete}
            />
            <DialogEditProfile
                editProfileOpen={editProfileOpen}
                setEditProfileOpen={setEditProfileOpen}
                newName={newName}
                setNewName={setNewName}
                newEmail={newEmail}
                setNewEmail={setNewEmail}
                handleEditProfile={handleEditProfile}
            />
            <DialogEditPassword
                editPasswordOpen={editPasswordOpen}
                setEditPasswordOpen={setEditPasswordOpen}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmNewPassword={confirmNewPassword}
                setConfirmNewPassword={setConfirmNewPassword}
                handleEditPassword={handleEditPassword}
            />
            <DialogEditUserProfileType
                open={updateUserOpen}
                onClose={() => setUpdateUserOpen(false)}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                handleUpdateButtonClick={handleUpdateButtonClick}
                userTypes={userTypes}
            />
        </>
    );
}