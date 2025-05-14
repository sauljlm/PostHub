import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';

const Navbar = () => {
    // const [activeLink, setActiveLink] = useState(0);
    const { currentUser, logOut } = useContext(UserContext);
    const [hamburguerActive, setHamburguerActive] = useState(false);

    const pathname = window.location.pathname;
    const navigate = useNavigate();

    const navigationLogged = [
        { title: "Inicio", path: "/" },
        { title: "Nuevo post", path: "/new-post" },
        { title: "Mi perfil", path: "/mi-perfil" }
    ];
    const navigationMain = [
        { title: "Inicio", path: "/" },
        { title: "Iniciar Sesión", path: "/log-in" },
        { title: "Registrarse", path: "/sign-up" }
    ];
    
    const handleLinkClick = (idx) => {
        //setActiveLink(idx);
    };

    const signOff = () => {
        logOut();
        navigate("/");
        Swal.fire({
            icon: 'success',
            title: 'La sesión se cerró con éxito',
            confirmButtonText: 'Entendido'
        });
    }
    
    const renderMenuItems = (navigationItems) => {
        return navigationItems.map((item, idx) => (
            <li
                key={idx}
                className={`menu__link ${item.path === pathname ? ' menu__link--active' : ''}`}
            >
                <a href={item.path} onClick={() => handleLinkClick(idx)}>
                {item.title}
                </a>
            </li>
        ));
    };

    return (
        <header className="header">
            <div className="mobile-nav">
                <div className="hamburguer" onClick={() => setHamburguerActive(!hamburguerActive)}>
                    <svg className={`hamburguer__btn ${hamburguerActive ? ' hamburguer__btn--active' : ''}`}>
                        <path className="line line-top" d="M0,9h30"/>
                        <path className="line line-center" d="M0,15h30"/>
                        <path className="line line-bottom" d="M0,21h30"/>
                    </svg>
                </div>
                <nav className={`menu ${hamburguerActive ? ' menu--show' : ''}`}>
                    <ul className="menu__container">
                    {currentUser ? renderMenuItems(navigationLogged) : renderMenuItems(navigationMain)}
                    </ul>
                </nav>
            </div>
            <div className="desktop-nav">
                <nav className="menu">
                    {currentUser &&<button className="header__sign-out" onClick={signOff}>Cerrar Sesion</button>}
                    <ul className="menu__container">
                    {currentUser ? renderMenuItems(navigationLogged) : renderMenuItems(navigationMain)}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;