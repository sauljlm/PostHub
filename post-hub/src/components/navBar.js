import { useState } from "react";

const Navbar = () => {
    const [currentUser, setCurrentUser] = useState(false);
    const [activeLink, setActiveLink] = useState(null);

    const pathname = window.location.pathname;
    const navigationLogged = [
        { title: "Inicio", path: "#start" },
        { title: "Nuevo post", path: "#newPost" },
        { title: "My perfil", path: "#ourCustomers" }
    ];
    const navigationMain = [
        { title: "Inicio", path: "#start" },
        { title: "Iniciar Sesion", path: "#logIn" },
        { title: "Registrarse", path: "#signUp" }
    ];

    async function updateLoggedUser() {
        currentUser = await JSON.parse(window.sessionStorage.getItem('loggedUser'));
    }

    const handleLinkClick = (idx) => {
        setActiveLink(idx);
      };
    
      const renderMenuItems = (navigationItems) => {
        return navigationItems.map((item, idx) => (
          <li
            key={idx}
            className={`menu__link ${idx === activeLink ? ' menu__link--active' : ''}`}
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
                <div className="hamburguer">
                    <svg className="hamburguer__btn">
                        <path className="line line-top" d="M0,9h30"/>
                        <path className="line line-center" d="M0,15h30"/>
                        <path className="line line-bottom" d="M0,21h30"/>
                    </svg>
                </div>
                <nav className="menu">
                    <ul className="menu__container">
                    {currentUser ? renderMenuItems(navigationLogged) : renderMenuItems(navigationMain)}
                    </ul>
                </nav>
            </div>
            <div className="desktop-nav">
                <nav className="menu">
                    <button className="header__sign-out">Cerrar Sesion</button>
                    <ul className="menu__container">
                    {currentUser ? renderMenuItems(navigationLogged) : renderMenuItems(navigationMain)}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;