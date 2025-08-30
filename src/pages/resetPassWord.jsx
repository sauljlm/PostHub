import React, { useState } from 'react';
import DBAccess from "../utils/dbAccess";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";

const ResetPassWord = () => {
    const usersDataDB = new DBAccess();
    const navigate = useNavigate();
    const { token } = useParams();
    const [userData, serUserData] = useState({
        token: token,
        password: ""
    })
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const addError = (formErrors) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            ...formErrors,
        }));
    }

    const saveData = async () => {
        const isValid = await validateForm();
        if (isValid) {
            const formData = JSON.stringify({
                token: userData.token,
                newPassword: userData.password,
            })
        
            usersDataDB.resetPassword(formData)
            navigate("/");
        }
    };

    const validatePassword = async (password) => {
        let formErrors = {};
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

        if (!regex.test(password)) {
            formErrors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial';
        }
        if (!password.trim()) {
            return 'La contraseña no puede estar vacía.';
        }
        if (Object.keys(formErrors).length === 0) {
            formErrors.password = '';
        }

        addError(formErrors);
        return formErrors;
    };

    const validateForm = async () => {
        let formErrors = {};

        if (!validatePassword(userData.password)) {
          formErrors.password = 'Contraseña inválida';
        }

        if (userData.password !== userData.confirmPassword) {
            formErrors.confirmPassword = 'Contraseñas no coinciden';
        }

        addError(formErrors);
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
                        <div className="form__item-container form__item-password">
                            <label for="userPassword">Contraseña</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={userData.password}
                                required
                                className="form__item"
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="show-password-btn"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <Eye size={25} /> : <EyeClosed size={25} />}
                            </button>
                        </div>

                        <div className="form__item-container form__item-password">
                            <label for="confirmUserPassword">Confirmar contraseña</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={userData.confirmPassword}
                                required
                                className={`form__item ${errors.confirmPassword ? 'form__item--error' : ''}`}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="show-password-btn"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <Eye size={25} /> : <EyeClosed size={25} />}
                            </button>
                        </div>

                        <div className="form__button-container">
                            <button 
                                className="form__button form__button-cancel"
                            >
                                Cancelar
                            </button>
                            <button 
                                className="form__button form__button-save"
                                onClick={saveData}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </form>
            </article>
        </section>
    );
};

export default ResetPassWord;