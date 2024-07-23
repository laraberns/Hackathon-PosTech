import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import { Container, Typography, TextField, Button, Link, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Box } from '@mui/system';
import logoImg from '../../assets/logo.png';
import { Global } from '@emotion/react';
import { globalStyles } from '@/styles/backgroundStyle';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);

  function handleSignIn(e: FormEvent) {
    e.preventDefault();

    //remover com conexao ao back
    if (email === 'lara@email.com' && password === '123') {
      toast.success("Login com sucesso!");
    } else {
      toast.error("Usuário inválido");
    }
  }

  function handleOpenModal() {
    if (!email) {
      toast.error("Por favor, preencha o campo de e-mail para enviar o código de recuperação.");
      return;
    }
    setOpen(true);
  }

  function handleCloseModal() {
    setOpen(false);
  }

  function handleSendRecoveryCode() {
    toast.success("Código de recuperação enviado com sucesso!");
    handleCloseModal();
  }

  return (
    <>
      <Global styles={globalStyles} />
      <Container maxWidth="sm">
        <ToastContainer />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5, backgroundColor: "white", padding: "20px", borderRadius: "20px" }}>
          <Image src={logoImg} alt="Workflow" width={200} />
          <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
            Bem-vindo de volta!
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
            Entre com suas credenciais abaixo para acessar sua conta.
          </Typography>
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Typography variant="body1">
                Você não tem uma conta?{' '}
                <Link href="/registrar" sx={{ mt: 2, fontSize: '16px' }} underline='none'>
                  Crie a sua conta aqui
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>

      <Dialog
        open={open}
        onClose={handleCloseModal}
      >
        <DialogTitle>
          {"Esqueceu sua senha?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja enviar um código de recuperação para o e-mail:
          </DialogContentText>
          <DialogContentText>
            {email}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Não</Button>
          <Button onClick={handleSendRecoveryCode} autoFocus>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
