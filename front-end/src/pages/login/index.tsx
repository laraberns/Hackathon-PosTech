import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import { Container, Typography, Link, Box } from '@mui/material';
import logoImg from '../../assets/logo.png';
import { Global } from '@emotion/react';
import { globalStyles } from '@/styles/backgroundStyle';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormLogin from '@/components/FormLogin';
import DialogLogin from '@/components/DialogLogin';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState('initial');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false)

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch(`${process.env.BD_API}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/home'
      } else {
        toast.error(`Erro: ${data.error}`);
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao tentar fazer login.');
    }
  }

  function handleOpenModal() {
    if (!email) {
      toast.error("Por favor, preencha o campo de e-mail para enviar o código de recuperação.");
      return;
    }
    setStep('initial');
    setOpen(true);
  }

  function handleCloseModal() {
    setOpen(false);
  }

  async function handleSendRecoveryCode() {
    setLoading(true); 
    try {
      const response = await fetch(`${process.env.BD_API}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Código de recuperação enviado com sucesso!");
        setStep('verifyCode');
      } else {
        toast.error(`Erro: ${data.error}`);
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao tentar enviar o código de recuperação.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode() {
    if (!recoveryCode || !newPassword || !confirmNewPassword) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch(`${process.env.BD_API}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token: recoveryCode, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Senha redefinida com sucesso!");
        handleCloseModal();
      } else {
        toast.error(`Erro: ${data.error}`);
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao tentar redefinir a senha.');
    }
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
          <FormLogin
            handleSignIn={handleSignIn}
            setEmail={setEmail}
            setPassword={setPassword}
            handleOpenModal={handleOpenModal}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="body1">
              Você não tem uma conta?{' '}
              <Link href="/registrar" sx={{ mt: 2, fontSize: '16px' }} underline='none'>
                Crie a sua conta aqui
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>

      <DialogLogin
        open={open}
        step={step}
        email={email}
        recoveryCode={recoveryCode}
        newPassword={newPassword}
        confirmNewPassword={confirmNewPassword}
        handleCloseModal={handleCloseModal}
        handleSendRecoveryCode={handleSendRecoveryCode}
        handleVerifyCode={handleVerifyCode}
        setRecoveryCode={setRecoveryCode}
        setNewPassword={setNewPassword}
        setConfirmNewPassword={setConfirmNewPassword}
        loading={loading}
      />
    </>
  );
}
