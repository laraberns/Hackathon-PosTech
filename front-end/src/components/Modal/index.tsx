import * as React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { styled } from '@mui/material';


interface ONG {
  name: string;
  description: string;
  city: string;
  state: string;
  areaOfExpertise: string;
  contact: string;
  logoUrl?: string;
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
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400 }}>
        <Card sx={{ maxWidth: 400 }}>
          <CardContent>
            <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
              Detalhes da ONG
            </Typography>
            {ong && (
              <>
                {ong.logoUrl ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={ong.logoUrl}
                    alt={`${ong.name} Logo`}
                    style={{ objectFit: 'contain', marginBottom: 10 }}
                  />
                ) : (
                  <CardMedia
                    component="img"
                    height="200"
                    image="https://img.freepik.com/vetores-gratis/design-plano-sem-sinal-de-foto_23-2149272417.jpg?t=st=1721795238~exp=1721798838~hmac=ec142c37308d1ca1b6b23a4aa17a18cbe638aee063e23f9327170cee5ca747fd&w=740"
                    alt="Logo Placeholder"
                    style={{ objectFit: 'contain', marginBottom: 10 }}
                  />
                )}
                <Typography variant="body1" component="p">
                  <strong>Nome:</strong> {ong.name}<br />
                  <strong>Descrição:</strong> {ong.description}<br />
                  <strong>Cidade:</strong> {ong.city}<br />
                  <strong>Estado:</strong> {ong.state}<br />
                  <strong>Área de Atuação:</strong> {ong.areaOfExpertise}<br />
                  <strong>Contato:</strong> {ong.contact}<br />
                </Typography>
              </>
            )}
            <Button onClick={handleClose} sx={{ mt: 2 }}>Fechar</Button>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default CustomModal;
