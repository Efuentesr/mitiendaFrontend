import axios from "axios";
import api from "./api";

// const react_url = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "no hay base";

export const createOrder = async (orderData) => {

  const response = await api.post("api/Order/", orderData);

  return response.data;
};