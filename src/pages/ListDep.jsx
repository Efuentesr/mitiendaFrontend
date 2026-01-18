import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { AuthContext } from "../context/AuthContext";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../services/constants"
import axios from "axios";
import MyModal from "../components/MyModal";


// Leer token de localStorage (guardado después del login)
const token = localStorage.getItem("access");
const react_url = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "no hay base"

const ListDep = () => {
  const [projects, setProjects] = useState([]);
  const [clickedProject, setClickedProject] = useState({});

//
  const [show, setShow] = useState(false);
//  const handleClose = () => setShow(false);
  const handleShow = (project) => {
    setShow(true)
    setClickedProject(project)
  };
//  


  const readProjects = async () => {
    const route = react_url + "api/proyectos/";
    try {
      const res = await axios.get(
        route,
        {
          headers: { Authorization: `Token ${token}`,},
        }
      );   
      setProjects(res.data)
      // console.log("proyectos: ", res.data)

    } catch (error) {
      console.error("Error al leer proyectos registro:", error);
    }
  }

  useEffect(() => {
    readProjects()
  },[projects])
  return (
    <div  >

      <MyModal project={clickedProject} show={show} setShow={setShow} />

      <h1  className="text-center mt-4">Proyectos</h1>
      <div className="container my-header my-card">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Proyecto</th>
              <th scope="col">Ubicacion</th>
              <th scope="col">Pisos</th>
              <th scope="col">Dptos</th>
              <th scope="col">F.Inicio</th>
            </tr>
          </thead>
          <tbody>
            { projects.map((project, i) => (
              // <tr key={i}  style={{cursor:"pointer"}} onClick={()=><h1>Hola</h1>}>
              
              <tr key={i}> 
                <th scope="row">{i}</th>
                <td   style={{cursor:"pointer"}} onClick={() => handleShow(project)}>{project["codigo_proyecto"]}</td> 
                <td>{project["ubicacion"].substring(0,20)}</td>
                <td>{project["numero_pisos"]}</td>
                <td>{project["numero_departamentos"]}</td>
                <td>{project["fecha_inicio"]}</td>
              </tr>

            ))
            }

          </tbody>

        </table>   
      </div>
    </div>
  )
}

export default ListDep
