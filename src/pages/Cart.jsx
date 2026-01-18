import { useState, useRef, useContext }  from "react";
import ProductInCart from './ProductInCart.jsx';
import { useNavigate } from "react-router-dom";
import { BsArrowUpCircleFill} from 'react-icons/bs';
import { AuthContext } from "../context/AuthContext.jsx";

import { CART_PRODUCTS } from "../services/constants";
// import Checkout from "../components/CheckOut.jsx";
import { createOrder } from "../services/createOrder.js";

// const react_url = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "no hay base";

const Cart = () => {
  const {cartProducts, setCartProducts, loggedUser } = useContext(AuthContext);
  const headRef = useRef();
  // const [qty, setQty] = useState(0)
  const navigate = useNavigate();  
  const goToTop = () => {
    headRef.current.scrollIntoView();
  }

  const handleCheckout = async () => {
    if (!cartProducts.length) {
      alert("El carrito está vacío");
      return;
    }

    // Mapear carrito a items
    const items = cartProducts.map(item => ({
      product: item.code,       // ID del producto
      quantity: item.qtyToBuy,
      price: parseFloat(item.price)
    }));

    let total = cartProducts.reduce((acc, p) => acc + p.qtyToBuy * parseFloat(p.price), 0);
    total = total.toFixed(2);
    const orderData = {
      total_price: total,
      discount: 0,
      tax: 0,
      items
    };

    try {
      const order = await createOrder(orderData);  // llamar servicio
      alert(`Orden creada con ID: ${order.id}`);

      localStorage.removeItem("cartProducts"); // limpiar carrito
      setCartProducts([]);
      navigate("/ordenes"); 
    } catch (error) {
      console.error("Error al crear la orden:", error.response?.data || error.message);
      alert("Ocurrió un error al procesar la orden");
    }  
  };  
  return(
  <>
    <div 
      ref={headRef} 
      id="checkout" 
      className="d-flex flex-row justify-content-center my-2"
    >
        {loggedUser && <button className='btn btn-warning' onClick={handleCheckout}>Check Out</button>}
        {!loggedUser && <button className='btn btn-secondary'>No Check Out</button>}
    </div>

    <div  className="d-flex flex-column" >
        <BsArrowUpCircleFill 
          style={{fontSize: "30px", fontWeight: "600", color:"orange",  position: "fixed", bottom: "20px", right: "20px", zIndex: "100"}}
          onClick={goToTop}
        />
        { cartProducts.map((product, i) => (
            <div key={i} className="d-flex flex-row" style={{gap:"2rem"}}>
              <ProductInCart product={product} cartProducts={cartProducts} setCartProducts={setCartProducts} indice={i} />
            </div>
          ))
        }
    </div>
  </>
)}

export default Cart