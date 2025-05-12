import React, { useState } from 'react';
import DBAccess from "../utils/dbAccess";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const LogIn = () => {
    const usersDataDB = new DBAccess();
    const navigate = useNavigate();
    const { logIn } = useContext(UserContext);

    const [userData, serUserData] = useState({
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState({});

    const validateAvailableEmail = async (email) => {
        try {
            const user = await usersDataDB.getUserByEmail(email);
            return user === null;
        } catch (error) {
            console.error('Error al obtener el usuario por correo electrónico:', error);
            return false;
        }
    }

    const saveData = async () => {
        const isValid = await validateForm();
        if (isValid) {
            const formData = new FormData();

            Object.keys(userData).forEach(key => {
                formData.append(key, userData[key]);
            });
        
            const loggedUser = await usersDataDB.logIn(formData);
            await logIn(loggedUser);
            navigate("/");
        }
    };

    const validateForm = async () => {
        let formErrors = {};
        const isEmailAvailable = await validateAvailableEmail(userData.email);
        if (isEmailAvailable) {
            formErrors.email = 'Correo electronico no existe';
        }
        if (!userData.email) {
            formErrors.email = 'Ingresa el correo electrónico';
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleChange = (e) => {
        serUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <section className="content-wrapper">
            <article className="form-container">
                <form onSubmit={(e) => e.preventDefault()} className="form" id="log-in-form">
                    <div className="form-section">
                        <div className="password-icon-container">
                            <svg width="79" height="99" viewBox="0 0 79 99" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M39.5 75.3333C43.8197 75.3333 47.3214 71.8635 47.3214 67.5833C47.3214 63.3031 43.8197 59.8333 39.5 59.8333C35.1803 59.8333 31.6786 63.3031 31.6786 67.5833C31.6786 71.8635 35.1803 75.3333 39.5 75.3333ZM39.5 75.3333V85.6667M3 49.5H76V88.25C76 92.5302 72.4982 96 68.1786 96H10.8214C6.50177 96 3 92.5302 3 88.25V49.5ZM39.5 3C51.0191 3 60.3571 12.2528 60.3571 23.6667V49.5H18.6429V23.6667C18.6429 12.2528 27.9809 3 39.5 3Z" stroke="#000" stroke-width="5" stroke-linecap="round" />
                            </svg>
                        </div>
                        <div className="form__item-container">
                            <label for="userEmail">Correo electrónico</label>
                            <input
                                type="text"
                                name="email"
                                value={userData.email}
                                required
                                className={`form__item ${errors.email ? 'form__item--error' : ''}`}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form__item-container">
                            <label for="userPassword">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={userData.password}
                                required
                                className="form__item"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form__button-container">
                            <button 
                                className="form__button form__button-cancel"
                            >
                                Anterior
                            </button>
                            <button 
                                className="form__button form__button-save"
                                onClick={saveData}
                            >
                                Registrar
                            </button>
                        </div>
                    </div>
                </form>
            </article>
        </section>
    );
};

export default LogIn;