import * as React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface ONG {
  name: string;
  description: string;
  city: string;
  state: string;
  areaOfExpertise: string;
  contact: string;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  ong: ONG | null;
}

const CustomModal: React.FC<ModalProps> = ({ open, onClose, ong }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Detalhes da ONG
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <strong>Nome:</strong> {ong?.name}<br />
          <strong>Descrição:</strong> {ong?.description}<br />
          <strong>Cidade:</strong> {ong?.city}<br />
          <strong>Estado:</strong> {ong?.state}<br />
          <strong>Área de Atuação:</strong> {ong?.areaOfExpertise}<br />
          <strong>Contato:</strong> {ong?.contact}<br />
        </Typography>
        <Button onClick={handleClose} sx={{ mt: 2 }}>Fechar</Button>
      </Box>
    </Modal>
  );
};

export default CustomModal;
