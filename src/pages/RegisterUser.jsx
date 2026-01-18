import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { AuthContext } from "../context/AuthContext";
import { ACCESS_TOKEN } from "../services/constants"
import axios from "axios";
import ToastAlert from '../components/ToastAlert';
import { userRegistration } from "../services/userService";
import { crearOActualizarComprador } from "../services/compradorService";
import { crearOActualizarProveedor } from "../services/proveedorService";


const react_url = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "no hay base";
const RegisterUser = () => {
    const { loggedUser, setLoggedUser, setIsLoading, fetchUser }  = useContext(AuthContext);
    const navigate = useNavigate();
    const { register, handleSubmit, reset, watch, formState: {errors} } = useForm();
    const [modificar, setModificar] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [msg, setMsg] = useState({
      strong:"",
      small:"",
      body:""
    })
    const resetAndFalse = () => {
      reset()
    }
    const activateToast = (toastMsg) => {
      setShowToast(true);
      setMsg ({
        strong: "Exito",
        small: "Usuario", 
        body: toastMsg 
      })
    };
    const errCatch = (err, operacion) => {
      let err_msg = "";
      if (err.response) {
        err_msg = `Error al ${operacion}: ${err.response.status} -  ${err.response.data.detail} `
      } else {
        err_msg = `Error en el parrafo ${operacion}: ${err}`
      }
      console.log(err_msg);
    }

    const workSubmit = async (data) => {
      const dataForCompProv = {
        username: data.username,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,      
      }
      
      let cancelar = await verIfUserExists(data);
      if (cancelar){
        reset()
        return
      }
      try 
      {
        await userRegistration(react_url, data);        
        const token = localStorage.getItem("access");
        console.log( " enviando token: ", token);
        await fetchUser(token)
        console.log("registro de usuario completado on exito")
        navigate("/")
      } catch (err) {
        if (err.response){
          console.log("Error al grabar datos: ", err.code, err.response.request.responseURL, err.response.data);
        } else {
          console.log("Error al grabar datos: ", err.code);
        }
        reset()
      }
    }

    const verIfUserExists = async (data) => {
      const route = react_url + "api/check-user-exists/" ;
      const response = await axios.post(
        route,
        { username: data.username, },
        { headers: { "Content-Type": "application/json",}, }
      );
      let cancelar = false
      if (response.data["user_exists"]) {
        console.log("Error: Usuario ya existe")
        cancelar = true
      }
      return cancelar
    } 

    return(
      <>
        <ToastAlert 
          showToast={showToast} 
          setShowToast={setShowToast} 
          msg={msg}
        /> 
        <div className="container my-header" >
          <div className="my-container my-container-sm">
            <h1  className="text-center">Registro de Usuario</h1>
            <div className="my-card">
              <div className="my-card-body">
                <form id="Register" onSubmit={handleSubmit(workSubmit)}>

                  <div className="form-group username">
                    <label htmlFor="username">Usuario</label>
                    <input
                      type="text"
                      id="username"
                      className="form-control"
                      placeholder="Ingrese su usuario"
                      {...register("username", {
                          required: {
                            value: true,
                            message: "Usuario es requerido"
                          },
                        })
                      }
                    />
                    {
                      errors.username && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.username.message}</span>

                    }
                  </div>
                  <div className="form-group email">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      size={40}
                      className="form-control"
                      // placeholder="Ingrese su email"
                      {...register("email", {
                          required: {
                            value: true,
                            message: "email es requerido"
                          }
                        })
                      }
                    />
                    {
                      errors.email && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.email.message}</span>

                    }
                  </div>
                  <div className="form-group password">
                    <label id="passwordLbl" htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      // placeholder="Ingrese su password"
                      {...register("password", {
                          required: {
                            value: true,
                            message: "Password es requerido"
                          }
                        })
                      }
                    />
                    {
                        errors.password && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.password.message}</span>
                    }
                  </div>             
                  <div className="form-group password2">
                    <label id="password2Lbl" htmlFor="password2"> verificacion  Password</label>
                    <input
                      type="password"
                      id="password2"
                      className="form-control"
                      // placeholder="Re-ingrese su password"
                      {...register("password2", {
                          required: {
                            value: true,
                            message: "Reingreso de password es requerido"
                          },
                          validate: (value) => {
                            if ( value === watch("password")) {
                              return true;
                            } else {
                              return "Confirmacion de password debe coincidir con password";
                            }
                          }

                        })
                      }
                    />
                    {
                        errors.password2 && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.password2.message}</span>
                    }
                  </div>

                  <div className="form-group rol">
                    <label htmlFor="rol" >Rol</label>
                    <select
                      id="rol"
                      className="form-control"
                      // disabled={!modificar}
                      {...register("rol", {
                          required: {
                            value: true,
                            message: "Rol es requerido"
                          },
                        })
                      }
                    >
                      <option value="">Seleccione Rol </option>
                      {/* <option value="admin">Admin</option> */}
                      <option value="comprador">Comprador</option>
                      <option value="proveedor">Proveedor</option>
                    </select>
                    {
                      errors.rol && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.rol.message}</span>
                    }
                  </div>
                  <div className="form-group first_name">
                    <label id="first_nameLbl" htmlFor="first_name">Nombre</label>
                    <input
                      type="text"
                      id="first_name"
                      className="form-control"
                      // readOnly={!modificar}
                      // placeholder="Ingrese su nombre"
                      {...register("first_name", {
                          required: {
                            value: true,
                            message: "Nombre es requerido"
                          }
                        })
                      }
                    />
                    {
                        errors.first_name && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.first_name.message}</span>
                    }
                  </div>          
                  <div className="form-group last_name">
                    <label id="last_nameLbl" htmlFor="last_name">Apellidos</label>
                    <input
                      type="text"
                      id="last_name"
                      className="form-control"
                      // readOnly={!modificar}
                      {...register("last_name", {
                          required: {
                            value: true,
                            message: "Apellidos son requeridos"
                          }
                        })
                      }
                    />
                    {
                        errors.last_name && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.last_name.message}</span>
                    }
                  </div> 

                  <div className="form-group text-center mt-2">
                      <button name="register" className="btn btn-primary me-2" type="submit">Grabar</button>
                      <button name="Cancel" type="button" className="btn btn-secondary me-2" onClick={()=>reset()}>Cancelar</button>
                      <button name="Salir" type="button" className="btn btn-secondary" onClick={()=>navigate("/login")}>Salir</button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>    
      </>
    )
}
export default RegisterUser;
