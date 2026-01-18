import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./mitiendaApp.css";

import Menu from "./components/Menu";
import Home from "./pages/Home";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import CloseSession from "./pages/CloseSession";
import RegisterUser from "./pages/RegisterUser";
import RegisterProj from "./pages/RegisterProj";
import ListProj from "./pages/ListProj";
import RegisterDep from "./pages/RegisterDep";
import ChangePwd from "./pages/ChangePwd";
import UserAddData from "./pages/UserAddData";
import Comprar from "./pages/Comprar";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Ordenes from "./pages/Ordenes";

const MitiendaApp = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="d-flex flex-column vh-100">
          <Menu className="me-5"/>  
          <div className="flex-fill" style={{ overflowY: "auto" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/registerProj" element={<RegisterProj />} />
              <Route path="/listProj" element={<ListProj />} />
              <Route path="/registerDep" element={<RegisterDep />} />
              <Route path="/registerUser" element={<RegisterUser />} />
              <Route path="/login" element={<Login />} />
              <Route path="/closeSession" element={<CloseSession />} />
              <Route path="/changePwd" element={<ChangePwd />} />
              <Route path="/userAddData" element={<UserAddData />} />
              <Route path="/comprar" element={<Comprar/>} />
              <Route path="/product/:code" element={<ProductDetail />} />
              <Route path="/carta" element={<Cart />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/ordenes" element={<Ordenes />} />
            </Routes>       
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default MitiendaApp;
