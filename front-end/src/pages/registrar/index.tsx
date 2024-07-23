import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import { Container, Typography, TextField, Button, Link, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Box } from '@mui/system';
import logoImg from '../../assets/logo.png';
import { toast, ToastContainer } from 'react-toastify';
import { globalStyles } from '../../styles/backgroundStyle';
import { Global } from '@emotion/react';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const [alignment, setAlignment] = React.useState('web');

  const handleToggleAdminUserChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  function handleRegister(e: FormEvent) {
    e.preventDefault();
    const isFormValid = isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && password === confirmPassword;
    if (isFormValid) {
      toast.success("Registrado com sucesso!");
    }
  }

  function validateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validatePassword(password: string) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setName(name);
    setIsNameValid(name.length >= 3);
  };

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(validateEmail(newEmail) || newEmail === '');
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsPasswordValid(validatePassword(newPassword) || newPassword === '');
  }

  function handleConfirmPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setIsConfirmPasswordValid(newConfirmPassword === password);
  }

  return (
    <>
      <Global styles={globalStyles} />
      <Container maxWidth="sm">
        <ToastContainer />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5, backgroundColor: "white", padding: "20px", borderRadius: "20px" }}>
          <Image src={logoImg} alt="Workflow" width={200} />
          <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
            Crie sua conta
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
            Comece sua jornada conosco! Preencha os campos abaixo para criar sua conta.
          </Typography>
          <Box component="form" noValidate sx={{ mt: 2 }} onSubmit={handleRegister}>
            <TextField
              error={!isNameValid}
              helperText={!isNameValid && "Por favor, insira um nome com no mínimo 3 caracteres."}
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nome Completo"
              name="name"
              autoComplete="name"
              placeholder="John Doe"
              variant="outlined"
              onChange={handleNameChange}
            />
            <TextField
              error={!isEmailValid}
              helperText={!isEmailValid && "Por favor, insira um email válido."}
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              placeholder="johndoe@gmail.com"
              variant="outlined"
              onChange={handleEmailChange}
            />
            <TextField
              error={!isPasswordValid}
              helperText={!isPasswordValid && "A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial."}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="new-password"
              placeholder="*************"
              variant="outlined"
              onChange={handlePasswordChange}
            />
            <TextField
              error={!isConfirmPasswordValid}
              helperText={!isConfirmPasswordValid && "As senhas não coincidem."}
              margin="normal"
              required
              fullWidth
              name="confirm-password"
              label="Confirme a Senha"
              type="password"
              id="confirm-password"
              autoComplete="new-password"
              placeholder="*************"
              variant="outlined"
              onChange={handleConfirmPasswordChange}
            />
            <ToggleButtonGroup
              color="primary"
              value={alignment}
              sx={{mt: 2}}
              exclusive
              onChange={handleToggleAdminUserChange}
            >
              <ToggleButton value="user">Usuário</ToggleButton>
              <ToggleButton value="admin">Admin</ToggleButton>
            </ToggleButtonGroup>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ width: '50%' }}
              >
                Registrar
              </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Typography variant="body1">
                Já tem uma conta?{' '}
                <Link href="/login" sx={{ mt: 2, fontSize: '16px' }} underline='none'>
                  Faça login aqui
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
