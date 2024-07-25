import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, CircularProgress, Box } from '@mui/material';

interface DialogLoginProps {
  open: boolean;
  step: string;
  email: string;
  recoveryCode: string;
  newPassword: string;
  confirmNewPassword: string;
  handleCloseModal: () => void;
  handleSendRecoveryCode: () => void;
  handleVerifyCode: () => void;
  setRecoveryCode: React.Dispatch<React.SetStateAction<string>>;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  setConfirmNewPassword: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
}

const DialogLogin: React.FC<DialogLoginProps> = ({
  open,
  step,
  email,
  handleCloseModal,
  handleSendRecoveryCode,
  handleVerifyCode,
  setRecoveryCode,
  setNewPassword,
  setConfirmNewPassword,
  loading
}) => {
  return (
    <Dialog open={open} onClose={handleCloseModal}>
      {step === 'initial' ? (
        <>
          <DialogTitle>{"Esqueceu sua senha?"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Deseja enviar um código de recuperação para o e-mail:
            </DialogContentText>
            <DialogContentText>{email}?</DialogContentText>
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Não</Button>
            <Button
              onClick={handleSendRecoveryCode}
              autoFocus
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Sim'}
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle>{"Digite o código de recuperação e a nova senha"}</DialogTitle>
          <DialogContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="recovery-code"
                  label="Código de Recuperação"
                  name="recovery-code"
                  autoComplete="off"
                  variant="outlined"
                  onChange={(e) => setRecoveryCode(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="new-password"
                  label="Nova Senha"
                  type="password"
                  id="new-password"
                  autoComplete="new-password"
                  placeholder="********************"
                  variant="outlined"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirm-new-password"
                  label="Confirmar Nova Senha"
                  type="password"
                  id="confirm-new-password"
                  autoComplete="new-password"
                  placeholder="********************"
                  variant="outlined"
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button onClick={handleVerifyCode} autoFocus disabled={loading}>
              {loading ? 'Aguarde...' : 'Verificar Código e Redefinir Senha'}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default DialogLogin;
