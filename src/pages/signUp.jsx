//Floatui component https://www.floatui.com/
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import DBAccess from "../utils/dbAccess";
import resizeImage from "../utils/resizeImg";
import TextInput from "../components/common/textInput";
import { Eye, EyeClosed } from "lucide-react";

const SignUp = () => {
    const usersDataDB = new DBAccess();
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
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
    const [showPassword, setShowPassword] = useState(false);

    const [previewImage, setPreviewImage] = useState(null);
    const [activeView, setActiveView] = useState(1);
    
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();
        const maxSizeInBytes = 1 * 1024 * 1024; // 2 MB

        if (selectedFile) {
            if (selectedFile.size > maxSizeInBytes) {
                resizeImage(selectedFile, 1024, 1024, 0.9, (resizedFile) => {
                    setUserData({ ...userData, file: resizedFile });
                    reader.onloadend = () => {
                        setPreviewImage(resizedFile);
                    };
                });
            } else {
                setUserData({ ...userData, file: selectedFile });
                reader.onloadend = () => {
                    setPreviewImage(reader.result);
                };
            }
            reader.readAsDataURL(selectedFile);
        }
    };

    const addError = (formErrors) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            ...formErrors,
        }));
    }

    const validateUserName = async (userName) => {
        let formErrors = {};
        const isUserNameAvailable = await usersDataDB.getAvailableUserName(userName);

        if (!isUserNameAvailable) {
            formErrors.userName = 'Nombre de usuario ya registrado';
        }
        if (!userName.trim()) {
            formErrors.userName = 'Nombre de usuario no puede estar vacío';
        }
        if (Object.keys(formErrors).length === 0) {
            formErrors.userName = '';
        }

        addError(formErrors);
        return formErrors;
    };

    const validateName = (name) => {
        let formErrors = {};
        const regex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s']{1,50}$/;

        if (!regex.test(name)) {
            formErrors.name = 'Nombre invalido';
        }
        if (!name.trim()) {
            formErrors.name = 'Nombre de usuario no puede estar vacío';
        }
        if (Object.keys(formErrors).length === 0) {
            formErrors.name = '';
        }
        
        addError(formErrors);
        return formErrors;
    };

    const validateEmail = async (email) => {
        let formErrors = {};
        const regex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
        const isEmailAvailable = await usersDataDB.getAvailableEmail(email);

        if (!isEmailAvailable) {
            formErrors.email = 'Correo electronico ya registrado';
        }
        if (!regex.test(email)) {
            formErrors.email = 'Correo electrónico inválido';
        }
        if (!email.trim()) {
            formErrors.email = 'El correo electrónico no puede estar vacío.';
        }
        if (Object.keys(formErrors).length === 0) {
            formErrors.email = '';
        }

        addError(formErrors);
        return formErrors;
    };

    const validateGender = (gender) => {
        let formErrors = {};

        if (!gender.trim()) {
            formErrors.gender = 'Debe seleccionar un género';
        }
        if (Object.keys(formErrors).length === 0) {
            formErrors.gender = '';
        }
        
        addError(formErrors);
        return formErrors;
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

    const validateImage = (image) => {
        const validFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (image && !validFileTypes.includes(image.type)) {
            alert("Por favor, selecciona un archivo de imagen válido (jpg, png, gif).");
            return false;
        }
        return true;
    }

    const validateBirthDate = (date) => {
        let formErrors = {};
        const today = new Date();
        const birthDate = new Date(date);

        if (!date) {
            formErrors.birthDate = 'Debe seleccionar una fecha de nacimiento';
        } else if (birthDate >= today) {
            formErrors.birthDate = 'La fecha de nacimiento no puede estar en el futuro';
        } else {
            const ageDiffMs = today - birthDate;
            const ageDate = new Date(ageDiffMs);
            const age = Math.abs(ageDate.getUTCFullYear() - 1970); // Calcular edad
            if (age < 12) {
                formErrors.birthDate = 'Debe tener al menos 12 años';
            }
        }

        addError(formErrors);
        return formErrors;
    }

    const saveData = async () => {
        const formData = new FormData();

        Object.keys(userData).forEach(key => {
            formData.append(key, userData[key]);
        });
    
        await usersDataDB.createNewUser(formData);
        navigate("/log-in");
    };

    const validateForm1 = async () => {
        let accumulatedErrors = {};
    
        const validations = [
            await validateUserName(userData.userName),
            await validateName(userData.name),
            await validateEmail(userData.email),
            await validateGender(userData.gender),
            await validateBirthDate(userData.birthDate)
        ];
    
        validations.forEach(errorObj => {
            Object.entries(errorObj).forEach(([key, value]) => {
                if (value) {
                    accumulatedErrors[key] = value;
                }
            });
        });
    
        return Object.keys(accumulatedErrors).length === 0;
    };

    const validateForm2 = async () => {
        let formErrors = {};

        if (!validateImage(userData.file)) {
            formErrors.image = 'Formato de imagen inválido';
          }
        if (!userData.bio.trim()) {
            formErrors.bio = 'La bio no puede estar vacía';
        }
        addError(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const validateForm3 = async () => {
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
        setUserData({
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
            <article className="form-container">
                <form onSubmit={(e) => e.preventDefault()} className="form" id="new-user-form">
                    <div className="form-section" style={{ display: activeView === 1 ? 'block' : 'none' }}>
                        <div className="form__item-container">
                            <TextInput
                                labelText="User Name"
                                errorText={errors.userName}
                                type="text"
                                id="userName"
                                name="userName"
                                className={`form__item ${errors.userName ? 'form__item--error' : ''}`}
                                placeholder="UserName"
                                setValue={handleChange}
                                validationFunction={validateUserName}
                            />
                        </div>
                        <div className="form__item-container">
                            <TextInput
                                labelText="Name"
                                errorText={errors.name}
                                type="text"
                                id="name"
                                name="name"
                                className={`form__item ${errors.name ? 'form__item--error' : ''}`}
                                placeholder="Name"
                                setValue={handleChange}
                                validationFunction={validateName}
                            />
                        </div>
                        <div className="form__item-container">
                            <TextInput
                                labelText="Email"
                                errorText={errors.email}
                                type="text"
                                id="email"
                                name="email"
                                className={`form__item ${errors.email ? 'form__item--error' : ''}`}
                                placeholder="Email"
                                setValue={handleChange}
                                validationFunction={validateEmail}
                            />
                        </div>
                        <div className="form__item-container">
                            <label for="userGender">Género</label>
                            <select name="gender" value={userData.gender} onChange={handleChange} className="form__item-select">
                                <option value="">Seleccionar género</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="O">Otro</option>
                            </select>
                        </div>
                        <div className="form__item-container">
                            <TextInput
                                labelText="Birth Date"
                                errorText={errors.birthDate}
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                className={`form__item ${errors.birthDate ? 'form__item--error' : ''}`}
                                placeholder="Birth Date"
                                setValue={handleChange}
                                validationFunction={validateBirthDate}
                            />
                        </div>
                        <div className="form__button-container">
                            <button 
                                className="form__button form__button-cancel"
                            >
                                Cancelar
                            </button>
                            <button 
                                className="form__button form__button-save"
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
                                className={`form__item ${errors.image ? 'form__item--error' : ''}`}
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="form__item-container">
                            <label for="bibliography">Bibliografia</label>
                            <textarea 
                                name="bio"
                                className={`form__item form__item-description ${errors.bio ? 'form__item--error' : ''}`}
                                value={userData.bio}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <div className="form__button-container">
                            <button 
                                className="form__button form__button-cancel"
                                onClick={() => setActiveView(1)}
                            >
                                Anterior
                            </button>
                            <button 
                                className="form__button form__button-save"
                                
                                onClick={async () => {
                                    const isValid = await validateForm2();
                                    if (isValid) {
                                        setActiveView(3);
                                    }
                                }}
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
                                onClick={() => setActiveView(2)}
                            >
                                Anterior
                            </button>
                            <button 
                                className="form__button form__button-save"
                                onClick={async () => {
                                    const isValid = await validateForm3();
                                    if (isValid) {
                                        saveData();
                                    }
                                }}
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

export default SignUp;