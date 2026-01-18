import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import ToastAlert from '../components/ToastAlert';

const react_url = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "no hay base";

const CaseRegister = () => {
  const { loggedUser, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [modificar, setModificar] = useState(false);
  const [custDeps, setCustDeps] = useState([]);
  const [custIsLoading, setCustIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const resetAndFalse = () => {
    setModificar(false);
    reset();
  };

  const workSubmit = async (data) => {
      // console.log("Data: ", data, "\n custDeps:",custDeps);
      let elemento = custDeps.find((reg) => reg.id == data.dep_id);
      // console.log("Elemento: ", elemento)
      const token = localStorage.getItem("access");
      const wdata = {
        proyecto_codigo: elemento.proyecto,
        numero_departamento: elemento.numero_departamento,
        descripcion: data.descripcion,
        archivos: [],
        comprador: loggedUser.username
      }
      // console.log("wdata: ", wdata)
      console.log(JSON.stringify(wdata))
      const route = react_url + "api/casos/";
      try {
        const res = await axios.post(
          route,
          wdata,
          {
            headers: { Authorization: `Token ${token}`,},
          }
        );   
        // activateToast("Grabacion de registro completada on exito")
        alert("se grabo caso")
        resetAndFalse()
      } catch (err) {
        // errCatch(err, "grabar registro")              
        // console.error("Error grabando caso", err);

        if (err.response) {
          console.error("Detalle del error:", err.response.data);
          alert(JSON.stringify(err.response.data, null, 2));
        } else {
          console.error("Error sin respuesta:", err.message);}

      }

  };

  const loadCustDeps = async () => {
    const token = localStorage.getItem("access");
    try {
      const res = await axios.get(
        react_url + "api/departamentos/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      const userDeps = res.data.filter(
        (dep) => dep.comprador === loggedUser.username
      );
      if (userDeps.length < 1) {
        console.warn("No tiene departamentos registrados");
      }
      setCustDeps(userDeps);
    } catch (err) {
      console.error("Error cargando departamentos", err);
    }
  };

  // Espera a que loggedUser esté disponible antes de cargar departamentos
  useEffect(() => {
    if (loggedUser) {
      // setCustIsLoading(true);
      // loadCustDeps().finally(() => setCustIsLoading(false));
      loadCustDeps();
    }
  }, [loggedUser]);

  // Mostrar loading si el contexto aún no tiene loggedUser (por ejemplo, tras F5)
  if (isLoading || !loggedUser) {
    return <div className="container mt-5"><p>Cargando usuario...</p></div>;
  }

  return (
    <div className="container my-header">
      <div className="my-container my-container-sm">
        <h1 className="text-center">Registro de Casos</h1>
        <div className="my-card">
          <div className="my-card-body">
            <form id="case" onSubmit={handleSubmit(workSubmit)}>
              <div className="form-group dep_id">
                <label htmlFor="dep_id">Proyecto : Departamento</label>
                <select
                  id="dep_id"
                  className="form-control"
                  disabled={modificar}
                  {...register("dep_id", {
                    required: {
                      value: true,
                      message: "Dep_id es requerido",
                    },
                  })}
                  onBlur={()=> setModificar(true)}
                >
                  <option value="">Selecciona Proyecto </option>
                  {custDeps.map((dep, i) => (
                    <option key={i} value={dep.id}>
                      {dep.proyecto} : {dep.numero_departamento}
                    </option>
                  ))}
                </select>
                {errors.dep_id && (
                  <span style={{ color: "red", fontSize: "0.8rem" }}> {errors.dep_id.message} </span>
                )}
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
              <div className="form-group text-center mt-2 botones">
                {modificar && (
                  <button type="submit" className="btn btn-primary me-2">Grabar</button>
                )}
                {(modificar) && (
                  <button type="button" className="btn btn-secondary me-2" onClick={resetAndFalse}>
                    Cancelar
                  </button>
                )}
                <button type="button" className="btn btn-secondary" onClick={()=> navigate("/")}>Salir</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseRegister;
