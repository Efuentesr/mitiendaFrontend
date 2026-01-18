import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

// Leer token de localStorage (guardado después del login)
const token = localStorage.getItem("access");
const react_url = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "no hay base"

const MyModal = ({project, show, setShow, refreshProjects}) => {
    const {  wempresa }  = useContext(AuthContext);

    const handleClose = () => { 
      // reset()
      setShow(false)
      refreshProjects();
    };
//   const handleShow = () => setShow(true);
    const { 
      register, 
      handleSubmit, 
      setValue,
      reset,
      formState: {errors} 
    } = useForm();

    // manejar el submit del boton grabars
    const workSubmit = async (data) => {
      const route = react_url + "api/proyectos/" + data.codigo_proyecto + "/" ;
      try {
        const res = await axios.patch(
          route,
          data,
          {
            headers: { Authorization: `Token ${token}`,},
          }
        );   
        console.log("Registro regrabado, res.data: ", res.data);
        handleClose();
      } catch (error) {
        console.error("Error al verificar regrabar registro:", error);
      }
    }


    const loadFormValues = () => {
        setValue("codigo_proyecto", project["codigo_proyecto"]);
        setValue("ubicacion", project["ubicacion"]);
        setValue("numero_pisos", project["numero_pisos"]);
        setValue("numero_departamentos", project["numero_departamentos"]);
        setValue("fecha_inicio", project["fecha_inicio"]);
        setValue("observaciones", project["observaciones"]);
        // setValue("empresa", wempresa);
        console.log("Se cargaron valores");
    }

    useEffect( () => {
      if (project) {
        loadFormValues();
      }
    },[project])

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header>
          <Modal.Title className="text-center">Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
{/*  */}
        <div className="container my-header" >
          <div className="my-container my-container-sm">
            <h1  className="text-center">Proyecto</h1>
            <div className="my-card">
              <div className="my-card-body">
                <form id="project" onSubmit={handleSubmit(workSubmit)}>
                  <div className="form-group">
                    <label htmlFor="codigo_proyecto">Codigo Proyecto</label>
                    <input
                      type="text"
                      id="codigo_proyecto"
                      className="form-control"
                      placeholder="Ingrese Codigo_proyecto"
                      readOnly
                      {...register("codigo_proyecto", {
                          required: {
                            value: true,
                            message: "Codigo de proyecto es requerido"
                          },
                        })
                      }
                      // onBlur={handleOnBlur}
                    />
                    {
                      errors.codigo_proyecto && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.codigo_proyecto.message}</span>

                    }
                  </div>
                  <div className="form-group">
                    <label id="ubicacionLbl" htmlFor="ubicacion">Ubicacion</label>
                    <input
                      type="text"
                      id="ubicacion"
                      className="form-control"
                      placeholder="Ingrese ubicacion"
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
                    <div className="form-group me-3">
                      <label id="numero_pisosLbl" htmlFor="numero_pisos">Nro Pisos</label>
                      <input
                        type="text"
                        id="numero_pisos"
                        className="form-control"
                        size="8"
                        placeholder="NroPisos"
                        {...register("numero_pisos", {
                            required: {
                              value: true,
                              message: "numero_pisos es requerido"
                            }
                          })
                        }
                      />
                      {
                        errors.numero_pisos && <span style={{color: "red", fontSize:"0.8rem"}} >{errors.numero_pisos.message}</span>
                      }
                    </div>
                    <div className="form-group">
                      <label id="numero_departamentosLbl" htmlFor="numero_departamentos">Nro Dptos</label>
                      <input
                        type="text"
                        id="numero_departamentos"
                        className="form-control"
                        size="8"
                        placeholder="Nro dptos"
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
                  <div className="form-group">
                    <label id="fecha_inicioLbl" htmlFor="fecha_inicio">Fecha_de inicio</label>
                    <input
                      type="date"
                      // name="password"
                      id="fecha_inicio"
                      className="form-control"
                      placeholder="Ingrese su fecha_inicio"
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
                  <div className="form-group">
                    <label id="observacionesLbl" htmlFor="observaciones">Observaciones</label>
                    <input
                      type="text"
                      id="observaciones"
                      className="form-control"
                      placeholder="Ingrese su observaciones"
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
                      <button name="Regproyecto" type="submit" className="btn btn-primary me-2" >Grabar</button>
                      <button name="RegprojCancel" type="button" className="btn btn-secondary" onClick={handleClose}>Cancelar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>    
{/*  */}
      </Modal.Body>
      {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
          Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
          Save Changes
          </Button>
     </Modal.Footer> */}
    </Modal>
  )
}

export default MyModal