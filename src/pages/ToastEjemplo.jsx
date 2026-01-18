// ToastEjemplo.jsx
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import ToastAlert from '../components/ToastAlert';

export default function ToastEjemplo() {
  const [showToast, setShowToast] = useState(false);
  const [msg, setMsg]  = useState({
    strong:"",
    small:"",
    body:""
  });

  const handleClick = () => {
    setShowToast(true);
    setMsg({
      strong: "Exito strong",
      small: "Ahora",
      body:"Operacion completada"
    })
  };

  return (
    <>
      <Button onClick={handleClick} variant="primary">
        Mostrar Toast
      </Button>

      {/* <ToastAlert showToast={showToast} setShowToast={setShowToast} strong="Exito" small="ahora" body="Operacion completada on exito" /> */}
      <ToastAlert showToast={showToast} setShowToast={setShowToast} msg={msg} />
    </>
  );
}
