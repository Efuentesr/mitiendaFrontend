import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import { CART_PRODUCTS, IMG_HTTP } from "../services/constants";
import api from '../services/api';

const ProductDetail = () => {
  const { cartProducts, setCartProducts } = useContext(AuthContext);

  const { code } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const cargaProducto = async () => {
      const response = await api.get(`api/Product/${code}`);
      setProduct(response.data)
    }
    cargaProducto();
  },[code])

  let image_array = [];
  useEffect(() => {
    if (product?.img_url) {
      image_array = product.img_url
        .split(",")
        .map(img => IMG_HTTP + img);
      setActiveImage(image_array[0]);
    }
  }, [product]);

  if (Object.keys(product).length === 0 ) return <div className="text-center p-4">Cargando producto...</div>;

  const p_code = product["code"];
  const description = product["name"];
  const stars = `${product["stars"]} out of 5 stars`;
  const price = `$${product["price"]}`;
  const stocks = `Stock ${product["stocks"]}`;

  const addToCart = () => {
    const existe = cartProducts.find(item => item["code"] === p_code);
    if (existe) {
      alert(`Producto ${product['code']} ya existe en la canasta`);
    } else {
      const producToAdd = {
        code: product["code"],
        name: product["name"],
        image: image_array[0],
        stars: product["stars"],
        price: product["price"],
        stocks: product["stocks"],
        qtyToBuy: 1
      };
      const updatedCart = [...cartProducts, producToAdd];
      setCartProducts(updatedCart);
      localStorage.setItem(CART_PRODUCTS, JSON.stringify(updatedCart));
      alert(`Producto ${product['code']} adicionado a la canasta`);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    // CORREGIDO: Container responsivo con max-width en vez de width fijo
    <div className="container mt-3 px-3">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6">
          <div className="card border rounded shadow-sm">
            {/* Imagen principal */}
            <div className="card-body">
              <div className="d-flex justify-content-center rounded bg-light p-3">
                <img
                  src={activeImage}
                  className="img-fluid"
                  style={{ 
                    maxHeight: "280px", 
                    objectFit: "contain" 
                  }}
                  alt="Imagen principal"
                />
              </div>
              
              {/* Miniaturas - responsivas */}
              {image_array.length > 0 && (
                <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">
                  {image_array.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Miniatura ${index + 1}`}
                      className={`img-thumbnail ${img === activeImage ? "border border-primary border-2" : ""}`}
                      style={{ 
                        width: "50px", 
                        height: "50px", 
                        objectFit: "cover",
                        cursor: "pointer" 
                      }}
                      onClick={() => setActiveImage(img)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="card-body pt-0">
              <span className="badge bg-secondary mb-2">{code}</span>
              <p className="card-text"
                style={{ 
                  display: "-webkit-box", 
                  WebkitLineClamp: "4", 
                  WebkitBoxOrient: "vertical", 
                  overflow: "hidden", 
                  textOverflow: "ellipsis" 
                }}
              >
                {description}
              </p>
              <div className="text-muted small">{stars}</div>
              <div className="fw-bold fs-4 text-success my-2">{price}</div>
              <div className="text-muted">{stocks}</div>
            </div>

            {/* Botones - responsivos */}
            <div className="card-footer bg-transparent border-0 p-3">
              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                <button 
                  className="btn btn-success flex-grow-1" 
                  onClick={addToCart}
                >
                  Añadir a Canasta
                </button>
                <button 
                  className="btn btn-outline-secondary flex-grow-1" 
                  onClick={() => navigate(-1)}
                >
                  Seguir comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
