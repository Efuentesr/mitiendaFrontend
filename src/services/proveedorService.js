// services/proveedorService.js
import axios from "axios";

export const crearOActualizarProveedor = async (token, new_data, react_url) => {
  const data = {
    tipo: new_data.username.length === 8 ? "PN" : "EMP",
    dni: new_data.username.length === 8 ? new_data.username : "",
    ruc: new_data.username.length !== 8 ? new_data.username : "",
    email: new_data.email,
    nombres: new_data.first_name,
    apellidos: new_data.last_name,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };

  const url = `${react_url}api/proveedores/${new_data.username}/`;

  try {
    await axios.get(url, axiosConfig);
    // Si existe, actualiza
    await axios.patch(url, data, axiosConfig);
  } catch (err) {
    if (err.response?.status === 404) {
      // Si no existe, intenta crear
      data["codigo_usuario"] = new_data.username;
      await axios.post(`${react_url}api/proveedores/`, data, axiosConfig);
    } else {
      throw err;
    }
  }
};
