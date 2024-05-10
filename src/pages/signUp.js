//Floatui component https://www.floatui.com/
import React, { useState, useEffect } from 'react';
import DBAccess from "../utils/dbAccess";

export default () => {
  const usersDataDB = new DBAccess("Tests");

  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [file, setFile] = useState("");

  const [activeView, setActiveView] = useState(1);

  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };


  const saveData = async () => {
    const data = {
        userName: userName,
        name: name,
        bio: bio,
        email: email,
        gender, gender,
        password: password,
        confirmPassword: confirmPassword,
        birthDate: birthDate,
        file: file,
        metaData: "stuff",
    };
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          console.log(`${key}: ${data[key]}`);
        }
      }
    //usersDataDB.create(data);
  };

  const validateName = (name) => {
    const regex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s']{1,50}$/;
    let valid = regex.test(name);
    return valid;
  };

  const validateEmail = (email) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const valid = regex.test(email);
    return valid;
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    const valid = regex.test(password);
    return valid;
  };

  const validateForm = () => {
    const valid =
      validateName(name) &&
      validateEmail(email) &&
      validatePassword(password);
    return valid;
  };

  return (
    <section>
        <div className="crumbs-container">
            <div className="crumb" id="crumb-1">1</div>
            <div className="crumb" id="crumb-2">2</div>
            <div className="crumb" id="crumb-3">3</div>
        </div>
        <section className="form-container">
            <form onSubmit={(e) => e.preventDefault()} className="form" id="new-user-form">
                <div className="form-section" style={{ display: activeView === 1 ? 'block' : 'none' }}>
                    <div className="form__item-container">
                        <label for="userName">Nombre de usuario</label>
                        <input
                            type="name"
                            required
                            className="form__item"
                            onChange={(event) => {
                                setUserName(event.target.value);
                            }}
                        />
                    </div>
                    <div className="form__item-container">
                        <label for="userName">Nombre</label>
                        <input
                            type="name"
                            required
                            className="form__item"
                            onChange={(event) => {
                                setName(event.target.value);
                            }}
                        />
                    </div>
                    <div className="form__item-container">
                        <label for="userEmail">Correo electronico</label>
                        <input
                            type="text"
                            required
                            className="form__item"
                            onChange={(event) => {
                                setEmail(event.target.value);
                            }}
                        />
                    </div>
                    <div className="form__item-container">
                        <label for="userEmail">Género</label>
                        <select name="genero" onChange={(event) => {
                                setGender(event.target.value);
                            }}>
                            <option value="">Seleccionar género</option>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div> 
                    <div className="form__item-container">
                        <label for="userBirthDate">Fecha de nacimiento</label>
                        <input
                            type="date"
                            required
                            className="form__item"
                            onChange={(event) => {
                                setBirthDate(event.target.value);
                            }}
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
                            onClick={() => setActiveView(2)}
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
                            required
                            className="form__item"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="form__item-container">
                        <label for="bibliography">Bibliografia</label>
                        <textarea 
                            name="bibliography" 
                            className="form__item form__item-description" 
                            onChange={(event) => {
                                setBio(event.target.value);
                            }}
                        ></textarea>
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
                            required
                            className="form__item"
                            onChange={(event) => {
                                setPassword(event.target.value);
                            }}
                        />
                    </div> 

                    <div className="form__item-container">
                        <label for="confirmUserPassword">Confirmar contraseña</label>
                        <input
                            type="password"
                            required
                            className="form__item"
                            onChange={(event) => {
                                setConfirmPassword(event.target.value);
                            }}
                        />
                    </div>
                    <div className="form__button-container">
                        <button 
                            className="form__button"
                            onClick={() => setActiveView(3)}
                        >
                            Anterior
                        </button>
                        <button 
                            className="form__button"
                            onClick={() => saveData()}
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
