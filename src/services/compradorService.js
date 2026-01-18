// services/compradorService.js
import axios from "axios";

export const crearOActualizarComprador = async (token, new_data, react_url) => {
  // console.log("**** comprador token: ", token, " data: ", new_data, " url ", react_url)
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

  const url = `${react_url}api/compradores/${new_data.username}/`;
  // console.log("trato de grabar comprador")
  try {

    await axios.get(url, axiosConfig);
    // Si existe, actualiza
    await axios.patch(url, data, axiosConfig);
    // console.log("grabe comprador")
  } catch (err) {
    if (err.response?.status === 404) {
      // Si no existe, intenta crear
      data["codigo_usuario"] = new_data.username;
      // console.log(`${react_url}api/compradores/`, data, axiosConfig);
      await axios.post(`${react_url}api/compradores/`, data, axiosConfig);
    } else {
      throw err;
    }
  }
};
