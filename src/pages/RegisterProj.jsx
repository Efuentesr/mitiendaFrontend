import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import ToastAlert from '../components/ToastAlert';

// import { ACCESS_TOKEN, REFRESH_TOKEN } from "../services/constants"

// Leer token de localStorage (guardado después del login)
// const token = localStorage.getItem("access");
const react_url = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "no hay base"

const RegisterProj = () => {
    const { wempresa }  = useContext(AuthContext);
    const [recordExists, setRecordExists] = useState(false);

    const [modificar, setModificar] = useState(false);


    const [showToast, setShowToast] = useState(false)
    const [msg, setMsg] = useState({
      strong:"",
      small:"",
      body:""
    })
    const activateToast = (toastMsg) => {
      setShowToast(true);
      setMsg ({
        strong: "Exito",
        small: "Proyecto", 
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
      setRecordExists(false);
    }

    // const navigate = useNavigate();
    const { 
      register, 
      handleSubmit, 
      setValue,
      reset,
      formState: {errors} 
    } = useForm()    

    const resetAndFalse = () => {
      setRecordExists(false);
      setModificar(false)
      reset()
    }


    const formatDate = (fechaStr) => {
      if (!fechaStr) return '';
      return fechaStr.slice(0, 10); // toma solo los primeros 10 caracteres (YYYY-MM-DD)
    };
    // manejar el submit del boton grabars
    const workSubmit = async (data) => {
      // console.log(`workSubmit >> recordExists: ${recordExists}  data: ${data}`);
      const token = localStorage.getItem("access");
      let wdata = {...data};
      wdata.empresa = wempresa;
      if (!recordExists) {
        const route = react_url + "api/proyectos/";
        console.log("route: ", route ," token: ", token, " wdata: ", wdata)
        try {
          const res = await axios.post(
            route,
            wdata,
            {
              headers: { Authorization: `Token ${token}`,},
            }
          );   
          activateToast("Grabacion de registro completada on exito");
          resetAndFalse();
        } catch (err) {
          errCatch(err, "grabar registro")
        }
      } else {
        const route = react_url + "api/proyectos/" + data.codigo_proyecto + "/" ;
        try {
          const res = await axios.patch(
            route,
            data,
            {
              headers: { Authorization: `Token ${token}`,},
            }
          );   
          activateToast("Re-grabacion de registro completada on exito");
          resetAndFalse();
        } catch (err) {
          errCatch(err, "regrabar registro");
        }
      }

    }

    // manejar el onBlur del codigo_proyecto
    const handleOnBlur = async (e) => {
      const codigo = e.target.value;
      if (codigo) {
        try {
          const token = localStorage.getItem("access");
          const route = react_url + "api/proyectos/" + codigo + "/"
          const res = await axios.get(
            route,
            {
              headers: { Authorization: `Token ${token}`,},
            }
          );
          const data = res.data;
          // console.log("data: ",data)
          setValue("ubicacion", data.ubicacion);
          setValue("numero_pisos", data.numero_pisos);
          setValue("numero_departamentos", data.numero_departamentos);
          setValue("fecha_inicio", data.fecha_inicio);
          setValue("observaciones", data.observaciones);
          setRecordExists(true);;
        } catch (err) {
          errCatch(err, "buscar registro");
          setModificar(true);
          setRecordExists(false);
        }
      }     
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
            <h1  className="text-center">Proyectos</h1>
            <div className="my-card">
              <div className="my-card-body">
                <form id="project" onSubmit={handleSubmit(workSubmit)}>
                  <div className="form-group mb-4 codigo_proyecto">
                    <label htmlFor="codigo_proyecto">Codigo de Proyecto</label>
                    <input
                      type="text"
                      id="codigo_proyecto"
                      className="form-control"
                      maxLength={20}
                      readOnly={modificar || recordExists}
                      size="22"
                      placeholder="Ingrese Codigo de proyecto"
                      {...register("codigo_proyecto", {
                          required: {
                            value: true,
                            message: "Codigo de proyecto es requerido"
                          },

                          pattern: {
                            value: /^[a-zA-Z0-9\-]{5,20}$/,
                            message:
                              'Ingrese 5 y 20 caracteres'
                          }

                        })
                      }
                      onBlur={handleOnBlur}
                    />
                    {
                      errors.codigo_proyecto && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.codigo_proyecto.message}</span>

                    }
                  </div>
                            
                  <div className="form-group ubicacion">
                    <label id="ubicacionLbl" htmlFor="ubicacion">Ubicacion</label>
                    <input
                      type="text"
                      id="ubicacion"
                      className="form-control"
                      readOnly={!modificar}
                      // placeholder="Ingrese ubicacion"
                      {...register("ubicacion", {
                          required: {
                            value: true,
                            message: "ubicacion es requerida"
                          }
                        })
                      }
                    />
                    {
                      errors.ubicacion && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.ubicacion.message}</span>
                    }

                  </div>
                  <div className="d-flex">
                    <div className="form-group me-3 numero_pisos">
                      <label id="numero_pisosLbl" htmlFor="numero_pisos">Nro Pisos</label>
                      <input
                        type="text"
                        id="numero_pisos"
                        className="form-control"
                        size="8"
                        readOnly={!modificar}
                        // placeholder="NroPisos"
                        {...register("numero_pisos", {
                            required: {
                              value: true,
                              message: "numero_pisos es requerido"
                            },

                            pattern: {
                              value: /^[0-9]{1,2}$/,
                              message:
                                'Debe contener entre 1 y 2 cifras'
                            }

                            
                          })
                        }
                      />
                      {
                        errors.numero_pisos && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.numero_pisos.message}</span>
                      }
                    </div>
                    <div className="form-group numero_departamentos">
                      <label id="numero_departamentosLbl" htmlFor="numero_departamentos">Nro Dptos</label>
                      <input
                        type="text"
                        id="numero_departamentos"
                        className="form-control"
                        size="8"
                        readOnly={!modificar}
                        // placeholder="Nro dptos"
                        {...register("numero_departamentos", {
                            required: {
                              value: true,
                              message: "Numero de departamentos es requerido"
                            }
                          })
                        }
                      />
                      {
                        errors.numero_departamentos && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.numero_departamentos.message}</span>
                      }
                    </div>
                  </div>
                  <div className="form-group fecha_inicio">
                    <label id="fecha_inicioLbl" htmlFor="fecha_inicio">Fecha_de inicio</label>
                    <input
                      type="date"
                      // name="password"
                      id="fecha_inicio"
                      className="form-control"
                      readOnly={!modificar}
                      // placeholder="Ingrese su fecha_inicio"
                      {...register("fecha_inicio", {
                          required: {
                            value: true,
                            message: "fecha_inicio es requerido"
                          }
                        })
                      }
                    />
                    {
                      errors.fecha_inicio && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.fecha_inicio.message}</span>
                    }
                  </div>
                  <div className="form-group observaciones">
                    <label id="observacionesLbl" htmlFor="observaciones">Observaciones</label>
                    <input
                      type="text"
                      id="observaciones"
                      className="form-control"
                      readOnly={!modificar}
                      // placeholder="Ingrese su observaciones"
                      {...register("observaciones", {
                          required: {
                            value: true,
                            message: "Observaciones es requerido"
                          }
                        })
                      }
                    />
                    {
                      errors.observaciones && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.observaciones.message}</span>
                    }
                  </div>

                  <div className="form-group text-center mt-2">
                      { ( modificar ) &&
                        <button name="Regproyecto" type="submit" className="btn btn-primary me-2" >Grabar</button>
                      }
                      { (recordExists && !modificar ) &&
                        <button name="Regproyecto" type="submit" className="btn btn-primary me-2" onClick={()=>setModificar(true)} >Modificar</button>
                      }
                      { (modificar || recordExists ) &&
                        <button name="RegprojCancel" type="button" className="btn btn-secondary" onClick={resetAndFalse}>Cancelar</button>
                      }
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>    
      </>
    )
}
export default RegisterProj;
