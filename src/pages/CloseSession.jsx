import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from 'react-router-dom';
import { REFRESH_TOKEN } from "../services/constants";
import api from '../services/api';
import { logout } from '../services/api';

const CloseSession = () => {
    const { setLoggedUser } = useContext(AuthContext);

  const closeMySession = async () => {
    await api.post(
      "/api/logout/", 
      {
        refresh: localStorage.getItem(REFRESH_TOKEN),
      }
    )
    setLoggedUser(null);
    logout();
  };
  closeMySession();

  return <Navigate to="/login" />;
};

export default CloseSession;
