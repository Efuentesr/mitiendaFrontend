import React, { useState } from "react";

const ImageCard = ({ title, description, images, mode = "carousel" }) => {
  const [activeImage, setActiveImage] = useState(images[0]);
  const carouselId = `carousel-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="card shadow-sm" style={{ width: "18rem" }}>
      {/* ----- MODO CARRUSEL ----- */}
      {mode === "carousel" && (
        <div id={carouselId} className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {images.map((img, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  src={img}
                  className="d-block w-100"
                  alt={`Imagen ${index + 1}`}
                />
              </div>
            ))}
          </div>

          {/* Controles */}
          {images.length > 1 && (
            <>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#${carouselId}`}
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Anterior</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#${carouselId}`}
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Siguiente</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* ----- MODO MINIATURAS ----- */}
      {mode === "thumbnails" && (
        <>
          {/* Imagen principal */}
          <img
            src={activeImage}
            className="card-img-top"
            alt="Imagen principal"
          />

          {/* Miniaturas */}
          {images.length > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-2 p-2">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Miniatura ${index + 1}`}
                  className={`img-thumbnail ${
                    img === activeImage ? "border border-primary" : ""
                  }`}
                  style={{
                    width: "60px",
                    height: "40px",
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveImage(img)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Contenido del Card */}
      <div className="card-body text-center">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <button className="btn btn-primary">Ver más</button>
      </div>
    </div>
  );
};

export default ImageCard;
