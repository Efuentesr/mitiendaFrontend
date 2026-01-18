

import { useState, useEffect, useContext } from "react";
import api from "../services/api.js";
import { approveOrder, cancelOrder, payOrder } from "../services/orderService.js";

const OrderDetail = ({ order, fetchOrders }) => {
  const [ status, setStatus ] = useState(order.status)
  const id = order["id"];
  const created = order.created

  const algo = () => {

  }

  const handleApprove = async (orderId) => {
    try {
      await approveOrder(orderId);
      alert("Orden aprobada y stock reservado");
      fetchOrders();
      setStatus('AP');
    } catch (error) {
      alert(
        error.response?.data?.detail ||
        `Error al aprobar la orden`
      );
    }
  };

  const handlePay = async (orderId) => {
    try {
      await payOrder(orderId);
      alert("Orden pagada y stock actualizado");
      fetchOrders();
      setStatus('PA');
    } catch (error) {
      alert(
        error.response?.data?.detail ||
        `Error al aprobar la orden`
      );
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await cancelOrder(orderId);
      alert("Orden cancelada y cantidades restituidas");
      fetchOrders();
      setStatus('AN');
    } catch (error) {
      alert(
        error.response?.data?.detail ||
        `Error al anular la orden`
      );
    }
  };


  useEffect(() => {

  }

  )

  return (
    // <div className="accordion accordion-flush" id="accordionFlushExample">
      <div className="container accordion-item">
            <div className="d-flex fw-bold bg-success-subtle accordion-header">
              <div className="col d-flex" style={{maxWidth:"8.5rem"}}>
                <button className="accordion-button collapsed ps-2 pe-2 py-0 fw-bold bg-success-subtle w-5" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target={`#${id}`}
                  aria-expanded="false" 
                  aria-controls="flush-collapseOne">
                    Orden: {id}
                </button>
              </div>
              <div className="col me-2 bg-success-subtle"   style={{maxWidth:"10rem"}}>Cliente:  {order.customer_username}</div>
              <div className="col me-2">Estado: {order.status}</div>
              <div className="col me-2">Creado: {(order.created).substring(0,10)}</div>
              <div className="col me-2">Actualizado: {(order.updated).substring(0,10)}</div>
              <div className="col me-2">Total: {Number(order.total_price).toFixed(2)}</div>
            </div>   
            <div id={id} className="accordion-collapse collapse" data-bs-parent="#accordionOrdenes">
              <div className="accordion-body py-0 mb-2">
                <table className="table table-striped mb-0">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Producto</th>
                      <th scope="col" className="text-end">Cantidad</th>
                      <th scope="col" className="text-end">Precio</th>
                    </tr>              
                  </thead>
                  <tbody>
                      {order.items.map((item,index) => (
                        <tr key={item.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{item.product_name.substring(0,34)}</td>
                          <td className="text-end"> {item.quantity}</td>
                          <td className="text-end">${Number(item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            <div className="container d-flex justify-content-center mb-2">
              { ( status === "CR" ) &&
                <button type="button" className="btn btn-success me-2" onClick={() => handleApprove(order.id)}>Aprobar</button>
              }
              { ( status === "AP" ) &&
                <button type="button" className="btn btn-success me-2" onClick={() => handlePay(order.id)}>Pagar</button>
              }
              { ( status != "AN" ) &&
                <button type="button" className="btn btn-secondary" onClick={() => handleCancel(order.id)}>Anular</button>
              }
            </div>
            </div>
      
      </div>
    // </div>
  );
};

export default OrderDetail;
