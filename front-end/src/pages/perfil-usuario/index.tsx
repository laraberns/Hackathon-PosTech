import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, GlobalStyles } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logoImg from '../../assets/logo.png';
import Image from 'next/image';
import Nav from '@/components/Nav';
import axios from 'axios';
import { ONG } from '@/components/Modal';
import InformacoesPessoais from '@/components/InformacoesPessoais';
import FavOngs from '@/components/FavONGs';
import DialogEditProfile from '@/components/DialogEditProfile';
import DialogEditPassword from '@/components/DialogEditPassword';

export default function ProfileUser() {
    const [user, setUser] = useState({
        displayName: '',
        email: '',
        typeUser: ''
    });
    const [ongs, setOngs] = useState<ONG[]>([]);
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [editPasswordOpen, setEditPasswordOpen] = useState(false);
    const [newName, setNewName] = useState(user.displayName);
    const [newEmail, setNewEmail] = useState(user.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [allOngs, setAllOngs] = useState<ONG[]>([]);
    const [selectedOng, setSelectedOng] = useState('');
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

    const fetchFavOngs = async (token: string) => {
        try {
            const response = await axios.get(`${process.env.BD_API}/auth/fav-ongs`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setOngs(response.data.favOngs);
        } catch (err) {
            toast.error("Erro ao carregar ONGs favoritas.");
        }
    };

    const fetchOngs = async (token: string) => {
        try {
            const response = await axios.get(`${process.env.BD_API}/ongs/allongs`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setAllOngs(response.data);
        } catch (err) {
            toast.error("Erro ao carregar lista de ONGs.");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserDetails(token);
            fetchFavOngs(token)
            fetchOngs(token);
        }

        const checkAuthentication = async () => {
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
                    setAuthenticated(true)
                }
            } catch (error) {
                setAuthenticated(false);
            }
        };
        checkAuthentication();
    }, []);

    if (authenticated === null) {
        return
    }

    if (!authenticated) {
        window.location.href = '/login';
        return null;
    }

    const handleRemoveFavOng = async (ongName: string) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(
                `${process.env.BD_API}/auth/delete-fav-ong`,
                { ongName },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            toast.success("ONG removida com sucesso!");
            token && fetchFavOngs(token);
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error("Erro ao remover ONG.");
            }
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
                            <InformacoesPessoais
                                user={user}
                                setEditProfileOpen={setEditProfileOpen}
                                setEditPasswordOpen={setEditPasswordOpen}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FavOngs
                                ongs={ongs}
                                allOngs={allOngs}
                                handleRemoveFavOng={handleRemoveFavOng}
                                handleAddFavOng={handleAddFavOng}
                                selectedOng={selectedOng}
                                setSelectedOng={setSelectedOng}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
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
        </>
    );
}
