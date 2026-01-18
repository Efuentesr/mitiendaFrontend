import { Toast, ToastContainer, Button } from 'react-bootstrap';

const positions = [
            'top-start',
            'top-center',
            'top-end',
            'middle-start',
            'middle-center',
            'middle-end',
            'bottom-start',
            'bottom-center',
            'bottom-end',
]

const ToastAlert = ({showToast, setShowToast, msg}) => {
  return (
    <>

      <ToastContainer position="middle-center" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={8000}
          autohide
          bg="success" // Opcional: "primary", "danger", 'Secondary', 'Danger', 'Warning', 'Info', 'Light', 'Dark'
        >
          <Toast.Header >
            <strong className="me-auto">{msg["strong"]}</strong>
            <small>{msg["small"]}</small>
          </Toast.Header>
          <Toast.Body className="text-white">{msg["body"]}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  )
}

export default ToastAlert