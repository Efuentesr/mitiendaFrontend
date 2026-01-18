import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';

import api from "../services/api.js";
import { logout } from "../services/api.js"
import ToastAlert from '../components/ToastAlert';

const ChangePwd = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: {errors} } = useForm();
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
        small: "ChangePasssword", 
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
    };

    const workSubmit = async (data) => {
      console.log("data: ", data)
      try {
        const response = await api.post(
          "api/user/change-password/", 
          data,
        );
        console.log("password cambiado");
        activateToast("Cambio de password finalizado con exito");
        resetAndFalse();
        logout();
      } catch (err) {
        activateToast("Error al cambiar password, por favor verifique");
        errCatch(err, "cambiar password");
        resetAndFalse();
      } 
    }
    useEffect(() => {
        console.log(`showToast: ${showToast}, msg: ${msg["strong"]}`)
    }, [msg, showToast]);

    return(
      <>
        <ToastAlert 
          showToast={showToast} 
          setShowToast={setShowToast} 
          msg={msg}
        /> 
        <div className="container my-header" >
          <div className="my-container my-container-sm">
            <h1  className="text-center">Change Password</h1>
            <div className="my-card">
              <div className="my-card-body">
                <form id="Register" onSubmit={handleSubmit(workSubmit)}>
                  <div className="form-group old_password">
                    <label id="old_passwordLbl" htmlFor="old_password">Password Actual</label>
                    <input
                      type="password"
                      id="old_password"
                      className="form-control"
                      placeholder="Ingrese su password actual"
                      {...register("old_password", {
                          required: {
                            value: true,
                            message: "Password actual es requerido"
                          }
                        })
                      }
                    />
                    {
                        errors.old_password && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.old_password.message}</span>
                    }                  </div>             
                  <div className="form-group new_password">
                    <label id="new_passwordLbl" htmlFor="new_password"> Nuevo Password</label>
                    <input
                      type="password"
                      id="new_password"
                      className="form-control"
                      placeholder="Ingrese Nuevo password"
                      {...register("new_password", {
                          required: {
                            value: true,
                            message: "Reingreso de password es requerido"
                          }
                        })
                      }
                    />
                    {
                        errors.new_password && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.new_password.message}</span>
                    }
                  </div>
                  <div className="form-group text-center mt-2">
                      <button name="register" className="btn btn-primary me-2" type="submit">Grabar</button>
                      <button name="Cancel" type="button" className="btn btn-secondary me-2" onClick={resetAndFalse}>Cancelar</button>
                      <button type="button" className="btn btn-secondary" onClick={()=> navigate("/")}>Salir</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>    
      </>
    )
}
export default ChangePwd;
