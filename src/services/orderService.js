import api from "./api";

export const approveOrder = async (orderId) => {
  const response = await api.post(`/api/Order/${orderId}/approve/`);
  return response.data;
};

export const payOrder = async (orderId) => {
  const response = await api.post(`/api/Order/${orderId}/pay/`);
  return response.data;
};

export const cancelOrder = async (orderId) => {
  // console.log("`/api/Order/${orderId}/cancel/`", `/api/Order/${orderId}/cancel/`)
  const response = await api.post(`/api/Order/${orderId}/cancel/`);
  console.log("response.data", response.data);
  return response.data;
};
