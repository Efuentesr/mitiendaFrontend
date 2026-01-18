

import { useState, useEffect, useContext } from "react";
import api from "../services/api.js";
import { approveOrder, cancelOrder, payOrder } from "../services/orderService.js";

const OrderDetail = ({ order, fetchOrders }) => {
  const [ status, setStatus ] = useState(order.status)
  const id = order["id"];
  const created = order.created

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

  return (
    // CORREGIDO: Layout responsivo con accordion adaptable
    <div className="accordion-item">
      {/* Header del accordion - responsivo */}
      <h2 className="accordion-header">
        <button 
          className="accordion-button collapsed bg-success-subtle fw-bold py-2 px-3" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target={`#collapse-${id}`}
          aria-expanded="false" 
          aria-controls={`collapse-${id}`}
        >
          <div className="d-flex flex-column flex-md-row w-100 gap-1 gap-md-3 pe-3">
            <span className="me-md-3">
              <span className="d-md-none">🛒 </span>
              Orden: {id}
            </span>
            <span className="text-muted small d-none d-md-inline">|</span>
            <span className="small">
              <span className="d-md-none fw-normal text-muted">Cliente: </span>
              {order.customer_username}
            </span>
            <span className="text-muted small d-none d-md-inline">|</span>
            <span className="small">
              <span className="d-md-none fw-normal text-muted">Estado: </span>
              <span className={`badge ${
                order.status === 'PA' ? 'bg-success' : 
                order.status === 'AP' ? 'bg-warning' : 
                order.status === 'AN' ? 'bg-danger' : 'bg-secondary'
              }`}>
                {order.status}
              </span>
            </span>
            <span className="text-muted small d-none d-lg-inline">|</span>
            <span className="small d-none d-lg-inline">
              📅 {(order.created).substring(0,10)}
            </span>
            <span className="ms-md-auto fw-bold text-success">
              ${Number(order.total_price).toFixed(2)}
            </span>
          </div>
        </button>
      </h2>
      
      {/* Contenido colapsable */}
      <div id={`collapse-${id}`} className="accordion-collapse collapse" data-bs-parent="#accordionOrdenes">
        <div className="accordion-body p-2 p-md-3">
          {/* Info adicional en móvil */}
          <div className="d-lg-none mb-3 small text-muted">
            <div>📅 Creado: {(order.created).substring(0,10)}</div>
            <div>🔄 Actualizado: {(order.updated).substring(0,10)}</div>
          </div>
          
          {/* Tabla responsiva */}
          <div className="table-responsive">
            <table className="table table-striped table-sm mb-3">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="text-center" style={{width: "40px"}}>#</th>
                  <th scope="col">Producto</th>
                  <th scope="col" className="text-end" style={{width: "70px"}}>Cant.</th>
                  <th scope="col" className="text-end" style={{width: "90px"}}>Precio</th>
                </tr>              
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row" className="text-center">{index + 1}</th>
                    <td className="text-truncate" style={{maxWidth: "150px"}}>
                      {item.product_name}
                    </td>
                    <td className="text-end">{item.quantity}</td>
                    <td className="text-end">${Number(item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="table-light">
                <tr>
                  <td colSpan="3" className="text-end fw-bold">Total:</td>
                  <td className="text-end fw-bold text-success">
                    ${Number(order.total_price).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* Botones responsivos */}
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {status === "CR" && (
              <button 
                type="button" 
                className="btn btn-success btn-sm" 
                onClick={() => handleApprove(order.id)}
              >
                ✓ Aprobar
              </button>
            )}
            {status === "AP" && (
              <button 
                type="button" 
                className="btn btn-primary btn-sm" 
                onClick={() => handlePay(order.id)}
              >
                💳 Pagar
              </button>
            )}
            {status !== "AN" && status !== "PA" && (
              <button 
                type="button" 
                className="btn btn-outline-danger btn-sm" 
                onClick={() => handleCancel(order.id)}
              >
                ✗ Anular
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
