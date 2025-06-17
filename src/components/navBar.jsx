import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';

const Navbar = () => {
    const { currentUser, logOut } = useContext(UserContext);

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
        <>
            <header className="header">
                <div className="nav-container top">
                    <h1>Post Hub</h1>
                    {currentUser && (
                        <button className="header__sign-out" onClick={signOff}>
                            Cerrar Sesión
                        </button>
                    )}
                </div>
            </header>
            <nav className="nav-container bottom">
                <ul className="menu__container">
                    {currentUser ? renderMenuItems(navigationLogged) : renderMenuItems(navigationMain)}
                </ul>
            </nav>
        </>
    );
};

export default Navbar;