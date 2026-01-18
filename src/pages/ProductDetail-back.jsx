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

  console.log(`api/product/${code}`)
  console.log('type of product ', typeof product)

  

  useEffect(() => {
    const cargaProducto = async () => {
      const response = await api.get(`api/Product/${code}`);
      setProduct(response.data)
    }
    cargaProducto();
    console.log("***********", product);
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

  if (Object.keys(product).length === 0 ) return <div>Cargando producto...</div>;


  console.log("product Detail, product",product);
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
//        id: product["id"],
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
    console.log("antes de navigate -1 ")
    navigate(-1);
    console.log("despues de navigate -1 ")
    // Navegar de vuelta a la ruta anterior y pasar scrollY
    navigate(location.state?.from || "/comprar", {
      replace: true,
      state: { scrollY: location.state?.scrollY || 0 }
    });
  };

  return (
    <div className="container mt-3 border rounded" style={{ width: "25rem", height: "37rem" }}>
      <div style={{ height: "35rem" }}>
        <div className='mt-2' style={{ height: "23rem", fontSize: "11.2px" }}>
          <div className='d-flex justify-content-center rounded mt-2'>
            <img
              src={activeImage}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.03)", maxHeight: "19rem", maxWidth: "19rem", width: "100%", height: "100%", objectFit: "contain" }}
              alt="Imagen principal"
            />
          </div>
          {/* Miniaturas */}
          {image_array.length > 0 && (
            <div className="d-flex justify-content-center gap-2 mt-2 p-2">
              {image_array.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Miniatura ${index + 1}`}
                  className={`img-thumbnail ${img === activeImage ? "border border-primary" : ""}`}
                  style={{ width: "60px", height: "40px", cursor: "pointer" }}
                  onClick={() => setActiveImage(img)}
                />
              ))}
            </div>
          )}
        </div>
        <div className='mt-3'>
          <span className='fw-bold mb-1'>{code}</span>
          <span className="fs-7 px-2"
            style={{ display: "-webkit-box", WebkitLineClamp: "4", WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {description}
          </span>
          <div className='fw-bold'>{stars}</div>
          <div className='fw-bold'>{price}</div>
          <div className='fw-bold'>{stocks}</div>
        </div>
      </div>

      <div className='d-flex justify-content-center mt-5'>
        <button className="btn btn-success w-auto me-2" onClick={addToCart}>
          Añadir a Canasta
        </button>
        <button className="btn btn-secondary w-auto" onClick={() => navigate(-1)}>
          Seguir comprando
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
