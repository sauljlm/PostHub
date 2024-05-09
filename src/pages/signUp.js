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
    usersDataDB.create(data);
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
            <div className="crumb" id="crumb-4">4</div>
        </div>
        <section className="form-container">
            <form onSubmit={(e) => e.preventDefault()} className="form" id="new-user-form">
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

                <div className="form__item-container">
                    <label for="userEmail">Correo electronico</label>
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
                    <label for="userEmail">Género</label>
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

                <div className="form__item-container form__item-cont-file">
                    <label for="file">Añadir foto de perfil</label>
                    <div className="js-new-user-preview"></div>
                    <input
                        type="file"
                        required
                        className="form__item"
                        onChange={(event) => {
                            setFile(event.target.value);
                        }}
                    />
                </div>

                <div className="form__button-container">
                    <button 
                        className="form__button"
                        onClick={() => saveData()}
                    >
                        Registrar
                    </button>
                    <button 
                        className="form__button"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </section>
    </section>
  );
};
