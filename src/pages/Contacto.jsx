import React from 'react'

const Contacto = () => {
  const openWhatsApp = () => {
    window.open("https://web.whatsapp.com", "_blank");  
  };
  openWhatsApp();
  return (
    <div>Contacto</div>
  )
}

export default Contacto