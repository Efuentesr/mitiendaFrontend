// services/userService.js
import axios from "axios";
import { ACCESS_TOKEN } from "../services/constants"

export const userRegistration = async (react_url, data) => {
  // console.log("React_URL", React," dataForRegistration." , data)
  try {
    console.log("entrando a grabar  usuario ...",data)
    const route = react_url + "api/dj-rest-auth/registration/" ;
    const response = await axios.post(
      route,
      {
        username: data.username,
        email: data.email,
        password1: data.password,
        password2: data.password2
      },
      {
        headers: { "Content-Type": "application/json",},
      }
    );
    console.log("creo  usuario ...response.data.key", response.data.key)
    const token = response.data.key
    localStorage.setItem(ACCESS_TOKEN, token);
    const routePatch = react_url + "api/dj-rest-auth/user/" ;
    const resPatch = await axios.patch(
      routePatch, 
      {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        rol: data.rol
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    )
    // console.log("Se actualizo  usuario ...")
  } catch (err) {
    throw err;
  }  
};

