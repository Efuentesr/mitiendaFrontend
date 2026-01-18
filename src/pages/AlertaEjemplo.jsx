import React, { useState } from 'react';
import Alerta from "./Alerta";

const AlertaEjemplo = () => {
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  const mostrarMensaje = () => {
    setMostrarAlerta(true);

    // Opcional: ocultar automáticamente después de 5 segundos
    // setTimeout(() => setMostrarAlerta(false), 5000);
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-primary" onClick={mostrarMensaje}>
        Mostrar Alerta
      </button>

      {mostrarAlerta && ( <Alerta setMostrarAlerta={setMostrarAlerta} msg1="Atencion" msg2="miren este mensaje" /> )}
    </div>
  );
};

export default AlertaEjemplo;
