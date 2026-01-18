import { Modal, Button } from "react-bootstrap";

const ConfirmButton = ({ show, onClose, onConfirm, title, message }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Confirmación"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message || "¿Estás seguro?"}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmButton;
