import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

// Leer token de localStorage (guardado después del login)
const token = localStorage.getItem("access");
const react_url = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "no hay base"

const CaseEdit = ({caso, show, setShow, refreshCases}) => {
    console.log("caso: ",caso, " show: ",show)
    const {  wempresa }  = useContext(AuthContext);
    const [modificar, setModificar] = useState(true);

    const handleClose = () => { 
      setShow(false)
      refreshCases();
    };
    const formatDate = (fechaStr) => {
      if (!fechaStr) return '';
      return fechaStr.slice(0, 10); // toma solo los primeros 10 caracteres (YYYY-MM-DD)
    };
    const resetAndFalse = () => {
      setModificar(false);
      reset();
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
        setValue("departamento", caso["departamento"]);
        setValue("descripcion", caso["descripcion"]);
        setValue("fecha_registro", formatDate(caso["fecha_registro"]));
        console.log("Se cargaron valores");
    }

    useEffect( () => {
      if (caso) {
        loadFormValues();
      }
    },[caso])

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header>
          <Modal.Title className="text-center">Modificacion de Caso</Modal.Title>
      </Modal.Header>
      <Modal.Body>
{/*  */}
        <div className="container my-header">
          <div className="my-container my-container-sm">
            <h1 className="text-center">Registro de Casos</h1>
            <div className="my-card">
              <div className="my-card-body">
                <form id="case" onSubmit={handleSubmit(workSubmit)}>


                  <div className="form-group proy_dep">
                    <label id="proy_depnLbl" htmlFor="proy_dep">Proyecto : Ubicacion</label>
                    <input
                      type="text"
                      id="proy_dep"
                      className="form-control"
                      readOnly={!modificar}
                      placeholder={`${caso.proyecto_codigo_display} : ${caso.numero_departamento_display}`}
                    />
                  </div>
                  <div className="d-flex">
                    <div className="form-group caso_id me-2">
                      <label htmlFor="case_id">caso.id</label>
                      <input
                        type="text"
                        id="case_id"
                        className="form-control"
                        readOnly={!modificar}
                        placeholder={`${caso.id}`}
                        size={8}
                      />
                    </div>

                    <div className="form-group caso_id">
                      <label htmlFor="fecha_registro">Fecha Registro</label>
                      <input
                        type="date"
                        id="fecha_registro"
                        className="form-control"
                        readOnly={!modificar}
                      {...register("fecha_registro", {
                        required: {
                          value: true,
                          message: "fecha_registro es requerida",
                        },
                      })}

                      />
                    </div>
                  </div>
                  <hr className="mb-6" />

                  <div className="form-group descripcion">
                    <label htmlFor="descripcion">Descripción del Caso</label>
                    <textarea
                      rows={4}
                      cols={40}
                      id="descripcion"
                      readOnly={!modificar}
                      className="form-control"
                      {...register("descripcion", {
                        required: {
                          value: true,
                          message: "Descripción es requerida",
                        },
                      })}
                    />
                    {errors.descripcion && (
                      <span style={{ color: "red", fontSize: "0.8rem" }}> {errors.descripcion.message} </span>
                    )}
                  </div>
                  <div className="form-group text-center mt-2">
                      <button type="submit" className="btn btn-primary me-2" >Grabar</button>
                      <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancelar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>   
{/*  */}
      </Modal.Body>
    </Modal>
  )
}

export default CaseEdit;