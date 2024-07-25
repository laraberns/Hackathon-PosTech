import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import { Container, Typography, Link } from '@mui/material';
import { Box } from '@mui/system';
import logoImg from '../../assets/logo.png';
import { toast, ToastContainer } from 'react-toastify';
import { globalStyles } from '../../styles/backgroundStyle';
import { Global } from '@emotion/react';
import 'react-toastify/dist/ReactToastify.css';
import FormRegister from '@/components/FormRegister';

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const [alignment, setAlignment] = useState('User');

  const handleToggleAdminUserChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && password === confirmPassword) {
      try {
        const response = await fetch(`${process.env.BD_API}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            displayName: name,
            typeUser: alignment,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("Registrado com sucesso!");
        } else {
          toast.error(`Erro: ${data.error}`);
        }
      } catch (error) {
        toast.error('Ocorreu um erro ao tentar registrar.');
      }
    } else {
      toast.error("Por favor, corrija os erros no formulário.");
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setName(name);
    setIsNameValid(name.length >= 3);
  };

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(regex.test(newEmail));
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsPasswordValid(regex.test(newPassword));
  }

  function handleConfirmPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setIsConfirmPasswordValid(newConfirmPassword === password);
  }

  const isFormValid: boolean = Boolean(email) && Boolean(name) && Boolean(password) && Boolean(confirmPassword) && isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;

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
          <FormRegister
            handleRegister={handleRegister}
            handleNameChange={handleNameChange}
            handleEmailChange={handleEmailChange}
            handlePasswordChange={handlePasswordChange}
            handleConfirmPasswordChange={handleConfirmPasswordChange}
            handleToggleAdminUserChange={handleToggleAdminUserChange}
            isNameValid={isNameValid}
            isEmailValid={isEmailValid}
            isPasswordValid={isPasswordValid}
            isConfirmPasswordValid={isConfirmPasswordValid}
            alignment={alignment}
            isFormValid={isFormValid}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="body1">
              Já tem uma conta?{' '}
              <Link href="/login" sx={{ mt: 2, fontSize: '16px' }} underline='none'>
                Faça login aqui
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
}
