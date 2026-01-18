import { Link } from 'react-router-dom';
import { CART_PRODUCTS, IMG_HTTP } from '../services/constants';

const Product = ({ product, indice, cartProducts, setCartProducts, currentPage }) => {
  const code = product["code"];
  const image0 = product["img_url"];
  const image_array = image0.split(",");
  const image = IMG_HTTP + image_array[0];
  const description = product["name"];
  const stars = `${product["stars"]} out of 5 stars`;
  const price = `$${product["price"]}`;

  const addToCart = () => {
    const existe = cartProducts.find(item => item["code"] === code);
    if (existe) {
      alert(`Producto ${product['code']} ya existe en la canasta`);
    } else {
      const producToAdd = {
        code: product["code"],
        name: product["name"],
        image: image,
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

  return (
    // CORREGIDO: Eliminado style con width/height fijos, ahora usa grid Bootstrap correctamente
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3 p-2">
      <div className="card h-100 border shadow-sm">
        <Link to={`/product/${code}`} className="text-decoration-none">
          <div className="prd-card-img d-flex justify-content-center align-items-center p-3">
            <img 
              className="prd-img" 
              src={image} 
              alt={description}
              loading="lazy"
            />
          </div>
        </Link>

        <div className="card-body d-flex flex-column p-3">
          <span className="fw-bold text-dark small">{code}</span>
          <p className="card-text product-description small text-muted my-2"
            style={{ 
              display: "-webkit-box", 
              WebkitLineClamp: "3", 
              WebkitBoxOrient: "vertical", 
              overflow: "hidden", 
              textOverflow: "ellipsis",
              minHeight: "3.6rem"
            }}
          >
            {description}
          </p>
          <div className="mt-auto">
            <div className="small text-muted">{stars}</div>
            <div className="fw-bold fs-5 text-success">{price}</div>
          </div>
        </div>

        <div className="card-footer bg-transparent border-0 p-3 pt-0">
          <button 
            className="btn btn-success w-100" 
            onClick={addToCart}
          >
            Añadir a Canasta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
