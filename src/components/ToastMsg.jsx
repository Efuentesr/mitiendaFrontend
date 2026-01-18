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

const ToastMsg = ({showToast, setShowToast, delay, bg, strong, small, body}) => {
  return (
    <>

      <ToastContainer position="top_end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={delay}
          autohide
          bg={bg} // Opcional: "primary", "danger", 'Secondary', 'Danger', 'Warning', 'Info', 'Light', 'Dark'
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

export default ToastMsg