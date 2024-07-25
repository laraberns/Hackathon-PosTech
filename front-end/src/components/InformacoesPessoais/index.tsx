import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface InformacoesPessoaisProps {
    user: {
        displayName: string;
        email: string;
    };
    setEditProfileOpen: (open: boolean) => void;
    setEditPasswordOpen: (open: boolean) => void;
}

const InformacoesPessoais: React.FC<InformacoesPessoaisProps> = ({ user, setEditProfileOpen, setEditPasswordOpen }) => {
    return (
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
    );
};

export default InformacoesPessoais;
