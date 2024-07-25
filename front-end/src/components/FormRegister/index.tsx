import React from 'react';
import { Box, TextField, Button, ToggleButtonGroup, ToggleButton, Typography, Link } from '@mui/material';

interface FormRegisterProps {
  handleRegister: (e: React.FormEvent) => void;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleAdminUserChange: (event: React.MouseEvent<HTMLElement>, newAlignment: string) => void;
  isNameValid: boolean;
  isEmailValid: boolean;
  isPasswordValid: boolean;
  isConfirmPasswordValid: boolean;
  alignment: string;
  isFormValid: boolean;
}

const FormRegister: React.FC<FormRegisterProps> = ({
  handleRegister,
  handleNameChange,
  handleEmailChange,
  handlePasswordChange,
  handleConfirmPasswordChange,
  handleToggleAdminUserChange,
  isNameValid,
  isEmailValid,
  isPasswordValid,
  isConfirmPasswordValid,
  alignment,
  isFormValid,
}) => {
  return (
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
        sx={{ mt: 2 }}
        exclusive
        onChange={handleToggleAdminUserChange}
      >
        <ToggleButton value="User">Usuário</ToggleButton>
        <ToggleButton value="Admin">Admin</ToggleButton>
      </ToggleButtonGroup>
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={!isFormValid}
        >
          Registrar
        </Button>
      </Box>
    </Box>
  );
};

export default FormRegister;
