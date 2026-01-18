// src/pages/OrdersPage.jsx
import { useState, useEffect, useContext } from "react";
import api from "../services/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import OrderDetail from "./OrderDetail.jsx";

const Ordenes = () => {
  const { loggedUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      console.log("loggedUser", loggedUser, loggedUser.is_staff);
      const route = loggedUser.is_staff 
        ? "api/Order/"       // Admin ve todas
        : "api/Order/?customer=" + loggedUser.id; // Usuario ve las suyas

      console.log('Antes de await');

      const response = await api.get(route);

      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loggedUser) return;



    fetchOrders();
  }, [loggedUser]);

  if (loading) return <p>Cargando órdenes...</p>;
  if (!orders.length) return <p>No hay órdenes disponibles.</p>;
  // console.log("Ordenes: ", orders)

  return (
    <div className="container mt-4">
      <h2>Ordenes</h2>
      <div className="accordion accordion-flush" id="accordionOrdenes">
      {orders.slice().map( (order) => (
        <div key={order.id} className="card mb-3">
          <OrderDetail order={order} fetchOrders={fetchOrders} />
        </div>
      ))}
      </div>
    </div>
  );
};

export default Ordenes;
