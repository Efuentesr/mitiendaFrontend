import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from 'react-router-dom';


const Menu = () => {
  const { loggedUser, isLoading }  = useContext(AuthContext);
  if (isLoading) return <p>Cargando usuario...</p>;
  if (!loggedUser) return <p>Cargando usuario...</p>;

  return (
    <Navbar bg="success" variant="dark" expand="sm" className="w-100 py-0">
      <div className="container-fluid">
        <Navbar.Brand as={Link} to="/">miTienda</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar"  className="pb-0 ">
          <Nav className="me-auto" >
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>  
            { (loggedUser && (loggedUser.is_staff)) ? (
                <NavDropdown title="Admin" id="nav-dropdown2">
                    <NavDropdown.Item as={Link} to="/registerProj">Register Projects</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/listProj">List Projects</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/registerDep">Register Department</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/listDep">List Deparments</NavDropdown.Item>
                </NavDropdown>
              ):(<></>)
            }

            <NavDropdown title="Cuenta" id="nav-dropdown">
              <NavDropdown.Item ><strong>Usuario: {loggedUser.username||"not logged"}</strong></NavDropdown.Item>

              {!loggedUser ? (
                <>
                  <NavDropdown.Item as={Link} to="/registerUser">Registrarse</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/login">Iniciar Sesion</NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item as={Link} to="/closeSession">Cerrar Sesion</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/changePwd">Cambiar Password</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/userAddData">Modificar Datos</NavDropdown.Item>
                </>
              )}
            </NavDropdown>

            { loggedUser && (
                <Nav.Link as={Link} to="/comprar">Productos</Nav.Link>
              )
            }

            <NavDropdown title="Compras" id="nav-dropdown">
              {loggedUser && (
                <>
                  <NavDropdown.Item as={Link} to="/carta">Canasta</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/ordenes">Ordenes</NavDropdown.Item>
                </>
              ) }
            </NavDropdown>

            <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Menu;
