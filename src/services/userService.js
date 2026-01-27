// services/userService.js
import api from "./api.js";

export const userRegistration = async (data) => {
  try {
    // console.log("entrando a grabar  usuario ...",data)
    const response = await api.post(
      "api/auth/register/",
      {
        username: data.username,
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        is_provider: data.is_provider
      },
      {
        headers: { "Content-Type": "application/json",},
      }
    );
    console.log("creo  usuario: ", data.username)
  } catch (err) {
    throw err;
  }  
};

