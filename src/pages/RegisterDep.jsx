import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
// import { ACCESS_TOKEN, REFRESH_TOKEN } from "../services/constants"
import ToastAlert from '../components/ToastAlert';

// Leer token de localStorage (guardado después del login)
// const token = localStorage.getItem("access");
const react_url = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "no hay base"

const RegisterDep = () => {
    const [recordExists, setRecordExists] = useState(false);
    const [projects, setProjects] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [modificar, setModificar] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const [msg, setMsg] = useState({
      strong:"",
      small:"",
      body:""
    })
    const activateToast = (toastMsg) => {
      setShowToast(true);
      setMsg ({
        strong: "Exito",
        small: "Departamento", 
        body: toastMsg 
      })
    }
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
    const resetAndFalse = () => {
      setRecordExists(false);
      setModificar(false)
      reset()
    }
    const { 
      register, 
      handleSubmit, 
      setValue,
      reset,
      getValues,
      setFocus,
      formState: {errors} 
    } = useForm()    

    const formatDate = (fechaStr) => {
      if (!fechaStr) return '';
      return fechaStr.slice(0, 10); // toma solo los primeros 10 caracteres (YYYY-MM-DD)
    };
    // manejar el submit del boton grabars
    const workSubmit = async (data) => {
      console.log(`workSubmit >> recordExists: ${recordExists}  data: ${data}`);
      const token = localStorage.getItem("access");
      let wdata = {...data};
      if (!recordExists) {
        console.log(data)
        const route = react_url + "api/departamentos/";
        try {
          const res = await axios.post(
            route,
            wdata,
            {
              headers: { Authorization: `Token ${token}`,},
            }
          );   
          activateToast("Grabacion de registro completada on exito")
          resetAndFalse()
        } catch (err) {
          errCatch(err, "grabar registro")              
        }
      } else {
        const route = react_url + "api/departamentos/by-id/" + data.proyecto + "/" + data.numero_departamento + "/" ;
        try {
          const res = await axios.patch(
            route,
            data,
            {
              headers: { Authorization: `Token ${token}`,},
            }
          );   
          activateToast("Re-grabacion de registro completada on exito")
          resetAndFalse()
        } catch (err) {
          errCatch(err, "grabar registro")    
        }
      }

    }

    // manejar el onBlur del nro_departamento
    const handleOnBlurDep = async (e) => {
      const proj = getValues("proyecto")
      if (!proj){
        setFocus("proyecto");
      }
      const dpto = (e.target.value);
      if (dpto) {
        try {
          console.log("Verificando si existe departamento")
          const token = localStorage.getItem("access");
          const route = react_url + "api/departamentos/by-id/" + proj + "/" + dpto + "/"
          const res = await axios.get(
            route,
            {
              headers: { Authorization: `Token ${token}`,},
            }
          );
          const data = res.data;
          console.log("data: ",data)
          setValue("piso", data.piso);
          setValue("caracteristicas", data.caracteristicas);
          setValue("fecha_registro", data.fecha_registro);
          setValue("fecha_venta", data.fecha_venta);
          setValue("garantia_inicio", data.garantia_inicio);
          setValue("garantia_fin", data.garantia_fin);
          setValue("fecha_inicio", data.fecha_inicio);
          setValue("comprador", data.comprador);
          setRecordExists(true);
        } catch (err) {
          errCatch(err, "buscar registro");
          setModificar(true);
          setRecordExists(false);
          // reset({
          //   proyecto: proj,
          //   numero_departamento: dpto
          // },{keepDefaultValues: true});
        }
      }     
      console.log("record Exists: ", recordExists)

    }

    useEffect(()=>{
      const loadProjects = async() => {
        try {
          const token = localStorage.getItem("access");
          const route = react_url + "api/proyectos/"
          const res = await axios.get(
            route,
            {
              headers: { Authorization: `Token ${token}`,},
            }
          );
          // console.log("res.data: ", res.data)
          setProjects(res.data)
        } catch (err) {
          let errorMsg = `Error cargando proyectos, ${err}`
          alert(errorMsg);
          setErrorMsg(errorMsg)
        }
      } 
      loadProjects();
    },[])
    // console.log("project despues de useEffect",projects);

    return(
      <>

        <ToastAlert 
          showToast={showToast} 
          setShowToast={setShowToast} 
          msg={msg}
        />          


        { errorMsg 
          ? <h2>Debe existir algun proyecto donde crear/modificar Departamentos</h2>
          :
          <div className="container my-header" >
            <div className="my-container my-container-sm">
              <h1  className="text-center">Departamento</h1>
              <div className="my-card">
                <div className="my-card-body">

                  <form id="project" onSubmit={handleSubmit(workSubmit)}>
                    
                    <div className="form-group codigo_proyecto">
                      <label htmlFor="proyecto" >Codigo Proyecto</label>
                      {/* <input */}
                      <select
                        // type="text"
                        id="proyecto"
                        className="form-control"
                        // readOnly={modificar || recordExists}
                        disabled={modificar || recordExists}
                        // placeholder="Ingrese Codigo_proyecto"
                        {...register("proyecto", {
                            required: {
                              value: true,
                              message: "Codigo de proyecto es requerido"
                            },
                          })
                        }
                      >
                        <option value="">Selecciona Proyecto </option>
                        {projects.map((project, i) => (
                          <option key={i} value={project.codigo_proyect}>
                            {project.codigo_proyecto}
                          </option>
                        ))}
                      </select>
                      {
                        errors.proyecto && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.proyecto.message}</span>
                      }
                    </div>
                    <div className="form-group numero_departamento">
                      <label id="numero_departamentoLbl" htmlFor="numero_departamento">Nro. de Departamento</label>
                      <input
                        type="text"
                        id="numero_departamento"
                        className="form-control"
                        readOnly={modificar || recordExists}
                        placeholder="Ingrese Numero departamento"
                        {...register("numero_departamento", {
                            required: {
                              value: true,
                              message: "Numero Departamento es requerido"
                            }
                          })
                        }
                        onBlur={handleOnBlurDep}
                      />
                      {
                        errors.numero_departamento && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.numero_departamento.message}</span>
                      }
                    </div>
                    <hr className="mb-4"/>

                    <div className="form-group piso">
                      <label id="pisoLbl" htmlFor="piso">Piso</label>
                      <input
                        type="text"
                        id="piso"
                        className="form-control"
                        readOnly={!modificar}
                        // placeholder="Ingrese Numero piso"
                        {...register("piso", {
                            required: {
                              value: true,
                              message: "piso es requerido"
                            }
                          })
                        }
                      />
                      {
                        errors.piso && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.piso.message}</span>
                      }

                    </div>
                    <div className="form-group caracteristicas">
                      <label id="caracteristicasLbl" htmlFor="caracteristicas">Caracteristicas</label>
                      <input
                        type="text"
                        id="caracteristicas"
                        className="form-control"
                        readOnly={!modificar}
                        // placeholder="Ingrese caracteristicas"
                        {...register("caracteristicas", {
                            required: {
                              value: true,
                              message: "Caracteristicas son requeridas"
                            }
                          })
                        }
                      />
                      {
                        errors.caracteristicas && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.caracteristicas.message}</span>
                      }

                    </div>
                    <div className="d-flex">
                      <div className="form-group me-3 fecha_registro">
                        <label id="fecha_registroLbl" htmlFor="fecha_registro">Fecha Registro</label>
                        <input
                          type="date"
                          id="fecha_registro"
                          className="form-control"
                          readOnly={!modificar}
                          size="8"
                          placeholder="Fecha de registro"
                          {...register("fecha_registro", {
                              required: {
                                value: true,
                                message: "Fecha registro es requerida"
                              }
                            })
                          }
                        />
                        {
                          errors.fecha_registro && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.fecha_registro.message}</span>
                        }
                      </div>
                      <div className="form-group fecha_venta">
                        <label id="fecha_ventaLbl" htmlFor="fecha_venta">fecha_venta</label>
                        <input
                          type="date"
                          id="fecha_venta"
                          className="form-control"
                          readOnly={!modificar}
                          size="8"
                          placeholder="Fecha Venta"
                          {...register("fecha_venta", {
                              required: {
                                value: true,
                                message: "Fecha de venta es requerida"
                              }
                            })
                          }
                        />
                        {
                          errors.fecha_venta && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.fecha_venta.message}</span>
                        }
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="form-group me-3 garantia_inicio">
                        <label id="garantia_inicioLbl" htmlFor="garantia_inicio">Inicio de Garantia</label>
                        <input
                          type="date"
                          id="garantia_inicio"
                          className="form-control"
                          readOnly={!modificar}
                          size="8"
                          placeholder="Inicio de garantia"
                          {...register("garantia_inicio", {
                              required: {
                                value: true,
                                message: "Inicio garantia es requerida"
                              }
                            })
                          }
                        />
                        {
                          errors.garantia_inicio && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.garantia_inicio.message}</span>
                        }
                      </div>
                      <div className="form-group garantia_fin">
                        <label id="garantia_finLbl" htmlFor="garantia_fin">Fin de Garantia</label>
                        <input
                          type="date"
                          id="garantia_fin"
                          className="form-control"
                          readOnly={!modificar}
                          size="8"
                          placeholder="Fin garantia"
                          {...register("garantia_fin", {
                              required: {
                                value: true,
                                message: "Fin de garantia es requerida"
                              }
                            })
                          }
                        />
                        {
                          errors.garantia_fin && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.garantia_fin.message}</span>
                        }
                      </div>
                    </div>
                    <div className="form-group comprador">
                      <label id="compradorLbl" htmlFor="comprador">Comprador</label>
                      <input
                        type="text"
                        id="comprador"
                        className="form-control"
                        readOnly={!modificar}
                        // placeholder="Ingrese comprador"
                        {...register("comprador", {
                            required: {
                              value: true,
                              message: "Comprador es requerido"
                            },

                            pattern: {
                              value: /^(1[0-9]{10}|2[0-9]{10}|\d{8})$/,
                              message: 'Debe ingresar RUC o DNI'
                            }




                          })
                        }
                      />
                      {
                        errors.comprador && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.comprador.message}</span>
                      }
                    </div>
                    <div className="form-group text-center mt-2 botones">
                      { ( modificar ) &&
                        <button name="Regproyecto" type="submit" className="btn btn-primary me-2" >Grabar</button>
                      }
                      { (recordExists && !modificar ) &&
                        <button name="Regproyecto" type="submit" className="btn btn-primary me-2" onClick={()=>setModificar(true)} >Modificar</button>
                      }
                      { (modificar || recordExists ) &&
                        <button name="RegprojCancel" type="button" className="btn btn-secondary" onClick={resetAndFalse}>Cancelar</button>
                      }                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        }    
      </>
    )
}
export default RegisterDep;
