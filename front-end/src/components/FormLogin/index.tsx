import React, { FormEvent } from 'react';
import { Box, TextField, Typography, Link, Button } from '@mui/material';

interface FormLoginProps {
  handleSignIn: (e: FormEvent) => Promise<void>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleOpenModal: () => void;
}

const FormLogin: React.FC<FormLoginProps> = ({ handleSignIn, setEmail, setPassword, handleOpenModal }) => {
  return (
    <Box component="form" noValidate sx={{ mt: 2 }} onSubmit={handleSignIn}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="E-mail"
        name="email"
        autoComplete="email"
        autoFocus
        placeholder="johndoe@gmail.com"
        variant="outlined"
        onChange={e => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Senha"
        type="password"
        id="password"
        autoComplete="current-password"
        placeholder="********************"
        variant="outlined"
        onChange={e => setPassword(e.target.value)}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Typography variant="body1">
          <Link onClick={handleOpenModal} sx={{ fontSize: '14px', cursor: 'pointer' }} underline='none'>
            Esqueceu sua senha?
          </Link>
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ width: '50%' }}
        >
          Entrar
        </Button>
      </Box>
    </Box>
  );
}

export default FormLogin;
