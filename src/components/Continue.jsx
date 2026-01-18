import { Modal, Button } from "react-bootstrap";

const Continue = ({ 
  show,          // Estado de visibilidad
  onClose,       // Función para cerrar el modal
  modalTitle = "Información",
  modalBody = "Mensaje aquí",
  onContinue     // Función que se ejecuta al hacer clic en continuar
}) => {

  const handleContinue = () => {
    if (onContinue) onContinue();
    if (onClose) onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalBody}</Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleContinue}>
          Continuar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Continue;
