import { Link } from 'react-router-dom';
import { CART_PRODUCTS, IMG_HTTP } from '../services/constants';

const Product = ({ product, indice, cartProducts, setCartProducts, currentPage }) => {
  // const id = product['id'];
  const code = product["code"];
  const image0 = product["img_url"];
  const image_array = image0.split(",");
  const image = IMG_HTTP + image_array[0];
  const description = product["name"];
  const stars = `${product["stars"]} out of 5 stars`;
  const price = `$${product["price"]}`;

  console.log('current page: ', currentPage)
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
    <div className="col-10 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-3"
      style={{ border: "1px solid #d5d9d9", width: "18rem", height: "31rem", borderRadius: "0.75Rem" }}
    >
      <Link
        to={`/product/${code}`}
      >
        <div className="prd-card-img">
          <img className="prd-img" src={image} alt="Product Image" />
        </div>
      </Link>

      <div className='mt-3'>
        <span className='fw-bold'>{code}</span>
        <span className="fs-7 px-2"
          style={{ 
            display: "-webkit-box", 
            WebkitLineClamp: "3", 
            WebkitBoxOrient: "vertical", 
            overflow: "hidden", 
            textOverflow: "ellipsis" 
          }}
        >
          {description}
        </span>
        <div className='fw-bold'>{stars}</div>
        <div className='fw-bold'>{price}</div>
      </div>

      <div className='d-flex justify-content-center'>
        <button className="btn btn-success" onClick={addToCart}>Añadir a Canasta</button>
      </div>
    </div>
  );
};

export default Product;
