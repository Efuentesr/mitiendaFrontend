import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { AuthContext } from "../context/AuthContext";
// import { ACCESS_TOKEN, REFRESH_TOKEN } from "../services/constants"
import axios from "axios";
import CaseEdit from "../components/CaseEdit";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


// Leer token de localStorage (guardado después del login)
// const token = localStorage.getItem("access");
const react_url = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "no hay base"
const casesListing = () => {
  const { loggedUser, isLoading } = useContext(AuthContext);
  const [showDel, setShowDel] = useState(false);
  const [cases, setCases] = useState([]);
  const [clickedCase, setClickedCase] = useState({});


  const handleCloseDel = () => setShowDel(false);
  const handleShowDel = () => setShowDel(true);
//
  const [show, setShow] = useState(false);
//  const handleClose = () => setShow(false);
  const handleShow = (caso) => {
    setShow(true)
    console.log("Estoy en handle how")
    setClickedCase(caso)
  };
//  
  const deleteClicked = (caso) => {
    setClickedCase(caso)
    setShowDel(true);
  }

  const deleteCase = async (caso) => {
    if (caso.estado === "abierto") {
      const token = localStorage.getItem("access");
      const route = react_url + "api/casos/"+caso.id+"/"
      try {
        const res = await axios.delete(
          route,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        console.log("Se elimino caso: ", caso.id)
        loadCases()
      } catch (err) {
        console.error("Error cargando casos", err);
      }
    } else {
      console.log("Caso no esta en estado='abierto'")
    }
    handleCloseDel()
  }

  const loadCases = async () => {
    const token = localStorage.getItem("access");
    const route = react_url + "api/casos/";
    try {
      const res = await axios.get(
        route,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      console.log("loggedUser: ", loggedUser.username, "\ncasos: ", res.data)
      const userCases = res.data.filter(
        (caso) => caso.comprador === loggedUser.username
      );
      if (userCases.length < 1) {
        console.warn("No tiene casos registrados");
      }

      setCases(userCases);
    } catch (err) {
      console.error("Error cargando casos", err);
    }
  };

  // Espera a que loggedUser esté disponible antes de cargar departamentos
  useEffect(() => {
    if (loggedUser) {
      loadCases();
    }
  }, [loggedUser]);

  return (
    <>
      {/* Modal para confirmar si borra o no */}
      <Modal show={showDel} onHide={handleCloseDel}>
        <Modal.Body>Confirma eliminacion de registro?  </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={()=>deleteCase(clickedCase)}>Si</Button>
          <Button variant="secondary" onClick={handleCloseDel}>No</Button>
        </Modal.Footer>
      </Modal>
      <CaseEdit caso={clickedCase} show={show} setShow={setShow} refreshCases={loadCases} />

      <div  >
        <h1  className="text-center mt-4">Casos</h1>
        <div className="container my-header my-card">
          <table className="table table-striped table-sm">
            <thead>
              <tr>
                <th scope="col">Caso</th>
                <th scope="col">Proyecto</th>
                <th scope="col">Dpto</th>
                <th scope="col">Descripcion</th>
                <th scope="col">Comprador</th>
                <th scope="col">FechaReg</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody>
              { cases.map((caso, i) => (
                <tr key={i}> 
                  <td>{caso["id"]}</td>
                  <td>{caso["proyecto_codigo_display"].substring(0,25)}</td>
                  <td>{caso["numero_departamento_display"].substring(0,25)}</td>
                  <td>{caso["descripcion"].substring(0,25)}</td>
                  <td>{caso["comprador"]}</td>
                  <td>{caso["fecha_registro"].toString().split("T")[0]}</td>
                  <td>{caso["estado"]}</td>
                  <td>  <RiDeleteBin6Line style={{color:"red"}} onClick={()=> deleteClicked(caso)} /> </td>
                  <td><FaEdit  style={{color:"grey"}}  onClick={() => handleShow(caso)} /></td>
                </tr>

              ))
              }

            </tbody>

          </table>   
        </div>
      </div>
    </>
  )
}

export default casesListing;
