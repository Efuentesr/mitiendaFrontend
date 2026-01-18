import { useState, useEffect } from "react"
import { MdDelete } from "react-icons/md";
import { CART_PRODUCTS } from "../services/constants"
import ConfirmButton from "../components/ConfirmButton";

const ProductInCart = ({product, indice, cartProducts, setCartProducts}) => {
    const [showModal, setShowModal] = useState(false);

    const image = product["image"];
    const description = product["name"]; 
    const price = `$${product["price"]}`;
    const stock = product["stocks"];
    const [qty, setQty] = useState(0)
//    console.log("productInCart Image", image)
    
    const updateTheCart = (cantidad) => {
        const updatedCart = cartProducts.map((item, i) =>
            i === indice ? { ...item, qtyToBuy: cantidad } : item
        );
        setCartProducts(updatedCart);
        localStorage.setItem(CART_PRODUCTS,JSON.stringify(updatedCart));
    }
    const substractQty = ()=>{
        if (qty>1) {
            setQty(qty-1);
            updateTheCart(qty-1);
        } else {
            alert("Producto sera retirado de la canasta");
        }
    }
    const addQty = ()=>{
        if (qty < stock ) {
            setQty(qty+1);
            updateTheCart(qty+1);
        } else {
            alert("No puede vender mas que el stock disponible")
        }
    }

    const deleteItem = ()=>{
        console.log("Borrando registro de la canasta")
        const updatedCart = cartProducts.filter((_, i) => i !== indice);
        setCartProducts(updatedCart);
        setShowModal(false);

        localStorage.setItem(CART_PRODUCTS,JSON.stringify(updatedCart));
    }

    useEffect(()=>{
        setQty(Number(product.qtyToBuy))        
    },[])

    return (
        <div  className="container">
            {/* <div className="d-flex m-4 align-items-center"style={{ height: "19rem"}}> */}
            <div className="row g-3 m-2 align-items-center">
                <div className="col-12 col-md-3 text-center">
                    <img
                        src={image}
                        alt="Product"
                        className="img-fluid rounded"
                        style={{ maxHeight: "180px", objectFit: "contain" }}
                    />
                </div>

                <div className="col-12 col-md-3">
                    <div className="fw-semibold">{description}</div>
                    <div className="fw-bold mt-2">Unit Price: {price}</div>
                </div>


                <div className="col-6 col-md-2 text-center">
                    <div className="fw-bold mb-2">Quantity</div>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <button onClick={substractQty}>-</button>
                        <span>{qty}</span>
                        <button onClick={addQty}>+</button>
                    </div>
                </div>
                <div className="col-6 col-md-2 text-center">
                    <div className="fw-bold mb-2">Subtotal</div>
                    <div>{(qty * product.price).toFixed(2)}</div>
                </div>
                <div className="col-12 col-md-2 text-center">
                    <MdDelete
                        className="fs-2 text-danger"
                        role="button"
                        onClick={() => setShowModal(true)}
                    />
                </div>


            </div>
            {/* El modal de confirmación */}
            <ConfirmButton
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => deleteItem()}   // aquí la acción real
                title="Eliminar producto"
                message="¿Seguro que quieres borrar este producto?"
            />
        </div>
    )
}

export default ProductInCart
