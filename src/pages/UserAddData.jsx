import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { AuthContext } from "../context/AuthContext";
import api from "../services/api.js";
import ToastAlert from '../components/ToastAlert';

const UserAddData = () => {
    const { loggedUser,setLoggedUser ,isLoading , setIsLoading, fetchUser }  = useContext(AuthContext);
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, setFocus, formState: {errors} } = useForm();
    const [modificar, setModificar] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [msg, setMsg] = useState({
      strong:"",
      small:"",
      body:""
    })
    const resetAndFalse = () => {
      setModificar(false);
      loadCurrentValues();
    }
    const activateToast = (toastMsg) => {
      setShowToast(true);
      setMsg ({
        strong: "Exito",
        small: "AddData", 
        body: toastMsg 
      });
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
      setIsLoading(true)
      try {
        // console.log("Esta es la data que grabare: ", data, " Token:", token)
        const response = await api.patch(
          "api/user/", 
          {
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            is_provider: data.is_provider
          },
        );
        activateToast("Cambio de datos finalizado con exito");
      } catch (err) {
        activateToast("Error al cambiar datos, por favor verifique");
        errCatch(err, "cambiar datos");
        resetAndFalse
      } finally {
        setIsLoading(false);
        resetAndFalse();
      }
    }

    const loadCurrentValues = async () => {
        try {
          const res = await api.get(
            "api/user",
          );
          const data = res.data;
          setValue("username", data.username);
          setValue("email", data.email);
          setValue("is_provider", data.is_provider);
          setValue("first_name", data.first_name);
          setValue("last_name", data.last_name);
          setFocus("email");
          console.log("data actual: ", data)
        } catch (err) {
          errCatch(err, "buscar registro");
          setModificar(true);
          setRecordExists(false);
        } 
    }

    useEffect(() => {
      loadCurrentValues()        
    }, []);



    return(
      <>
        <ToastAlert 
          showToast={showToast} 
          setShowToast={setShowToast} 
          msg={msg}
        /> 
        <div className="container my-header" >
          <div className="my-container my-container-sm">
            <h1  className="text-center">Datos Adicionales</h1>
            <div className="my-card">
              <div className="my-card-body">
                <form id="Register" onSubmit={handleSubmit(workSubmit)}>
                  <div className="form-group username">
                    <label htmlFor="username" >UserName</label>
                    <input
                      type="text"
                      id="username"
                      className="form-control"
                      readOnly={true}
                      {...register("username", {
                          required: {
                            value: true,
                            message: "username es requerido"
                          }
                        })
                      }
                    />
                    {
                        errors.username && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.username.message}</span>
                    }
                  </div>
                  <div className="form-group email">
                    <label htmlFor="email" >Email</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      readOnly={!modificar}
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
                  <div className="form-group rol">
                    <label htmlFor="rol" >Seleccione Rol</label>
                    <select
                      id="rol"
                      className="form-control"
                      disabled={!modificar}
                      {...register("rol", {
                          required: {
                            value: true,
                            message: "Rol es requerido"
                          },
                        })
                      }
                    >
                    {/*
                      <option value="">Seleccione Rol </option>
                    */}
                      <option value="admin">Admin</option>
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
                      readOnly={!modificar}
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
                      readOnly={!modificar}
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
                      { ( modificar ) &&
                        <button type="submit" className="btn btn-primary me-2" disabled={isLoading} >
                          {isLoading ? "Guardando ..." : "Grabar"}
                        </button>
                      }
                      { (!modificar ) &&
                        <button 
                          type="submit" 
                          className="btn btn-primary me-2" 
                          onClick={()=>setModificar(true)} 
                        >
                          Modificar
                        </button>
                      }
                      <button type="button" className="btn btn-secondary me-2" onClick={resetAndFalse}>Cancelar</button>
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
  export default UserAddData;
