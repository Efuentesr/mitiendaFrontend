import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Categories from "./Categories";


const Home = () => {
    const navigate = useNavigate();
    const { loggedUser, isLoading, fetchUser } = useContext(AuthContext);

    // 1. Efecto para redirigir si NO hay usuario (después de verificar sesión)
    useEffect(() => {
        if (loggedUser === null) {
            console.log("Home.jsx ->  loggedUser es null")
            navigate("/login");
        }
    }, [loggedUser, isLoading, navigate]);

    // 2. Efecto para cargar categorías y productos cuando hay usuario
    useEffect(() => {
        if (loggedUser === null) {
            const ue_user = async () => {
                await fetchUser();
                console.log("desde home porque loggedUser estaba null")
            }
            ue_user()
        }
        
    }, [loggedUser]);

    // 3. Renderizamos después de ejecutar hooks
    if (isLoading) {
        return (
            <div className="container text-center mt-5">
                <h3>Verificando sesión...</h3>
            </div>
        );
    }

    if (!loggedUser) {
        return (
            <div className="container mt-5">
                <h3>Debe iniciar sesión...</h3>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-10 center"></div>
                    <h1 className="text-center text-success mb-3">
                        Encuentre los productos que busca
                    </h1>
                    <p className="fs-4">
                        Bienvenido a nuestra tienda en línea, el lugar perfecto para 
                        encontrar todo lo que necesitas con la comodidad de comprar desde 
                        cualquier lugar. Explora nuestro catálogo de productos, 
                        descubre ofertas exclusivas y disfruta de una experiencia de compra
                        rápida y segura. Con métodos de pago confiables y envíos a todo 
                        el país, estamos aquí para hacer tu compra más fácil y satisfactoria.
                        ¡Empieza a comprar hoy mismo!
                    </p>
                </div>
                <br></br>                  
                <Categories />
            {/* </div> */}

        </div>
    )
}
export default Home;