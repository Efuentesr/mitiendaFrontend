// src/pages/OrdersPage.jsx
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";

const ApproveOrder = () => {
  const { loggedUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loggedUser) return;

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("access");
        const route = loggedUser.is_staff 
          ? "http://localhost:8000/api/Order/"       // Admin ve todas
          : "http://localhost:8000/api/Order/?customer=" + loggedUser.id; // Usuario ve las suyas

        const response = await axios.get(route, {
          headers: { "Authorization": `Token ${token}` }
        });

        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener órdenes:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [loggedUser]);

  if (loading) return <p>Cargando órdenes...</p>;
  if (!orders.length) return <p>No hay órdenes disponibles.</p>;

  return (
    <div className="container mt-4">
      <h2>Órdenes</h2>
      {orders.map(order => (
        <div key={order.id} className="card mb-3">
          <div className="card-header">
            Orden #{order.id} - Estado: {order.status}
          </div>
          <div className="card-body">
            <p><strong>Total:</strong> ${Number(order.total_price).toFixed(2)}</p>
            <p><strong>Items:</strong></p>
            <ul>
              {order.items.map(item => (
                <li key={item.id}>
                  {item.product_name.substring(0,34)} - Cantidad:  {item.quantity} = ${Number(item.price).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApproveOrder;
