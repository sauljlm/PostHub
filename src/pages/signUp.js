//Floatui component https://www.floatui.com/
import React, { useState } from 'react';
import DBAccess from "../utils/dbAccess";

const SignUp = () => {
    const usersDataDB = new DBAccess();

    const [userData, serUserData] = useState({
        userName: "",
        name: "",
        bio: "",
        email: "",
        gender: "",
        password: "",
        confirmPassword: "",
        birthDate: "",
        file: "",
        userType: "User"
    })
    const [errors, setErrors] = useState({});

    const [previewImage, setPreviewImage] = useState(null);
    const [activeView, setActiveView] = useState(1);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        serUserData({...userData, file: selectedFile})

        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const validateAvailableEmail = async (email) => {
        try {
            const user = await usersDataDB.getUserByEmail(email);
            return user === null; // Retorna true si no existe el usuario, false si existe
        } catch (error) {
            console.error('Error al obtener el usuario por correo electrónico:', error);
            return false;
        }
    }

    const validateAvailableUserName = async (userName) => {
        try {
            const user = await usersDataDB.getUserByUsername(userName);
            return user === null; // Retorna true si no existe el usuario, false si existe
        } catch (error) {
            console.error('Error al obtener el usuario por nombre de usuario:', error);
            return false;
        }
    };

    const validateName = (name) => {
        const regex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s']{1,50}$/;
        let valid = regex.test(name);
        return valid;
    };

    const validateEmail = (email) => {
        //const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const regex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
        const valid = regex.test(email);
        return valid;
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        const valid = regex.test(password);
        return valid;
    };

    /*
    const validateForm = () => {
        validateName(userData.name);
        validateEmail(userData.email);
        validatePassword(userData.password);
    };
    */

    const saveData = async () => {
        const formData = new FormData();

        Object.keys(userData).forEach(key => {
            formData.append(key, userData[key]);
        });
    
        await usersDataDB.createNewUser(formData);
    };

    const validateForm1 = async () => {
        let formErrors = {};

        const isUserNameAvailable = await validateAvailableUserName(userData.userName);
        if (!isUserNameAvailable) {
            formErrors.userName = 'Nombre de usuario ya registrado';
        }
        if (!userData.userName.trim()) {
            formErrors.userName = 'Nombre de usuario no puede estar vacío';
        }
        if (!validateName(userData.name) || !userData.name.trim()) {
            formErrors.name = 'Nombre inválido';
        }
        if (!validateEmail(userData.email)) {
            formErrors.email = 'Correo electrónico inválido';
        }
        const isEmailAvailable = await validateAvailableEmail(userData.email);
        if (!isEmailAvailable) {
            formErrors.email = 'Correo electronico ya registrado';
        }
        /*
        if (!validatePassword(userData.password)) {
          formErrors.password = 'Contraseña inválida';
        }
        */
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
            <div className="crumbs-container">
                <div className={`crumb ${activeView >= 1 && 'crumb-active'}`} id="crumb-1">1</div>
                <div className={`crumb ${activeView >= 2 && 'crumb-active'}`} id="crumb-2">2</div>
                <div className={`crumb ${activeView >= 3 && 'crumb-active'}`} id="crumb-3">3</div>
            </div>
            <section className="form-container">
                <form onSubmit={(e) => e.preventDefault()} className="form" id="new-user-form">
                    <div className="form-section" style={{ display: activeView === 1 ? 'block' : 'none' }}>
                        <div className="form__item-container">
                            <label for="userName">Nombre de usuario</label>
                            <input
                                type="text"
                                name="userName"
                                value={userData.userName}
                                required
                                className={`form__item ${errors.userName ? 'form__item--error' : ''}`}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form__item-container">
                            <label for="userName">Nombre</label>
                            <input
                                type="text"
                                name="name"
                                value={userData.name}
                                required
                                className={`form__item ${errors.name ? 'form__item--error' : ''}`}
                                onChange={handleChange}
                            />
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
                            <label for="userGender">Género</label>
                            <select name="gender" value={userData.gender} onChange={handleChange}>
                                <option value="">Seleccionar género</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="O">Otro</option>
                            </select>
                        </div> 
                        <div className="form__item-container">
                            <label for="userBirthDate">Fecha de nacimiento</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={userData.birthDate}
                                required
                                className="form__item"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form__button-container">
                            <button 
                                className="form__button"
                            >
                                Cancelar
                            </button>
                            <button 
                                className="form__button"
                                onClick={async () => {
                                    const isValid = await validateForm1();
                                    if (isValid) {
                                        setActiveView(2);
                                    }
                                }}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>

                    <div className="form-section" style={{ display: activeView === 2 ? 'block' : 'none' }}>
                        <div className="form__item-container form__item-file">
                            
                            <div className="form__item-file-container">
                                <div className={`${previewImage ? 'form__item-file--active' : ''}`}  style={{ backgroundImage: `url(${previewImage})`}}></div>
                            </div>
                            <label for="file">Añadir foto de perfil</label>
                            <input
                                type="file"
                                name="file"
                                required
                                className="form__item"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="form__item-container">
                            <label for="bibliography">Bibliografia</label>
                            <textarea 
                                name="bio" 
                                className="form__item form__item-description" 
                                value={userData.bio}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <div className="form__button-container">
                            <button 
                                className="form__button"
                                onClick={() => setActiveView(1)}
                            >
                                Anterior
                            </button>
                            <button 
                                className="form__button"
                                onClick={() => setActiveView(3)}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>

                    <div className="form-section" style={{ display: activeView === 3 ? 'block' : 'none' }}>
                        <div className="password-icon-container">
                            <svg width="79" height="99" viewBox="0 0 79 99" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M39.5 75.3333C43.8197 75.3333 47.3214 71.8635 47.3214 67.5833C47.3214 63.3031 43.8197 59.8333 39.5 59.8333C35.1803 59.8333 31.6786 63.3031 31.6786 67.5833C31.6786 71.8635 35.1803 75.3333 39.5 75.3333ZM39.5 75.3333V85.6667M3 49.5H76V88.25C76 92.5302 72.4982 96 68.1786 96H10.8214C6.50177 96 3 92.5302 3 88.25V49.5ZM39.5 3C51.0191 3 60.3571 12.2528 60.3571 23.6667V49.5H18.6429V23.6667C18.6429 12.2528 27.9809 3 39.5 3Z" stroke="#000" stroke-width="5" stroke-linecap="round" />
                            </svg>
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

                        <div className="form__item-container">
                            <label for="confirmUserPassword">Confirmar contraseña</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={userData.confirmPassword}
                                required
                                className="form__item"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form__button-container">
                            <button 
                                className="form__button"
                                onClick={() => setActiveView(2)}
                            >
                                Anterior
                            </button>
                            <button 
                                className="form__button"
                                onClick={saveData}
                            >
                                Registrar
                            </button>
                        </div>
                    </div>
                </form>
            </section>
        </section>
    );
};

export default SignUp;