import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { AuthContext } from "../context/AuthContext";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../services/constants"
import api from "../services/api"

const Login = () => {
    const { fetchUser, setIsLoading }  = useContext(AuthContext);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: {errors} } = useForm()    
    // console.log(import.meta.env.VITE_API_URL);

    const workSubmit = async (data) => {
      setIsLoading(true);
      console.log("Login.jsx, data: ",data);
      const u = data.username 
      const p = data.password
      try {
        const response = await api.post("api/token/", 
          {username: u, password: p}
        );
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        // console.log(` Login.jsx token: ${ACCESS_TOKEN}  usuario: ${loggedUser}`)
        await fetchUser();
        navigate("/");
      } catch (error) {
        console.error("Error al verificar login:", error);
      } finally {
        setIsLoading(false);
      }
    }

    return(
      <>
        <div className="container my-header" >
          <div className="my-container my-container-sm">
            <h1  className="text-center">Login</h1>
            <div className="my-card">
              <div className="my-card-body">

                <form id="logIn" onSubmit={handleSubmit(workSubmit)}>
                  <div className="form-group">
                    <label htmlFor="username">Usuario</label>
                    <input
                      type="text"
                      // name="email"
                      id="username"
                      className="form-control"
                      placeholder="Ingrese su usuario"
                      {...register("username", {
                          required: {
                            value: true,
                            message: "Usuario es requerido"
                          }
                        })
                      }
                    />
                    {
                      errors.username && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.username.message}</span>

                    }
                  </div>
                  <div className="form-group">
                    <label id="passwordLbl" htmlFor="password">Password</label>
                    <input
                      type="password"
                      // name="password"
                      id="password"
                      className="form-control"
                      placeholder="Ingrese su password"
                      {...register("password", {
                          required: {
                            value: true,
                            message: "Password es requerido"
                          }
                        })
                      }
                    />
                  </div>             
                  {
                      errors.password && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.password.message}</span>
                  }
                  <div className="form-group text-center mt-2">
                      <button name="login" className="btn btn-success" type="submit">Iniciar Sesion</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>    
      </>
    )
}
export default Login;
