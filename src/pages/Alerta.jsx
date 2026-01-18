// import React, { useState } from 'react';

const Alerta = ({setMostrarAlerta, msg1, msg2}) => {
  return (
    <div className="alert alert-warning alert-dismissible fade show mt-3" role="alert">
      <strong>{msg1}:</strong> {msg2}
      <button
        type="button"
        className="btn-close"
        onClick={() => setMostrarAlerta(false)}
        aria-label="Cerrar"
      ></button>
    </div>
  )
};

export default Alerta;
