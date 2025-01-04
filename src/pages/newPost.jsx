import React, { useState } from 'react';
import DBAccess from "../utils/dbAccess";
import resizeImage from "../utils/resizeImg";
import TextInput from "../components/common/textInput";

const NewPost = () => {
    const postsDataDB = new DBAccess();

    const [postData, setPostData] = useState({
        userName: "",
        postTitle: "",
        postDate: "",
        postDescription: "",
        state: "AC"
    })
    const [errors, setErrors] = useState({});

    const [previewImage, setPreviewImage] = useState(null);
    
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();
        const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB

        if (selectedFile) {
            if (selectedFile.size > maxSizeInBytes) {
                resizeImage(selectedFile, 1024, 1024, 0.9, (resizedFile) => {
                    setPostData({ ...postData, file: resizedFile });
                    reader.onloadend = () => {
                        setPreviewImage(resizedFile);
                    };
                    console.log("size " + resizedFile.size);
                });
            } else {
                setPostData({ ...postData, file: selectedFile });
                reader.onloadend = () => {
                    setPreviewImage(reader.result);
                };
            }
            console.log("size " + selectedFile.size);
            reader.readAsDataURL(selectedFile);
        }
    };

    const addError = (formErrors) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            ...formErrors,
        }));
    }

    const validateImage = (image) => {
        const validFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (image && !validFileTypes.includes(image.type)) {
            alert("Por favor, selecciona un archivo de imagen válido (jpg, png, gif).");
            return false;
        }
        return true;
    }

    const saveData = async () => {
        const formData = new FormData();
        const loggedUser = JSON.parse(window.sessionStorage.getItem('loggedUser'));
        const updatedPostData = { ...postData, userName: loggedUser.userName };

        Object.keys(updatedPostData).forEach(key => {
            formData.append(key, updatedPostData[key]);
        });
    
        await postsDataDB.createNewPost(formData);
    };

    const validateForm = async () => {
        let formErrors = {};

        if (!validateImage(postData.file)) {
            formErrors.image = 'Formato de imagen inválido';
        }

        if (!postData.postTitle.trim()) {
            formErrors.title = 'El titulo no puede estar vacío';
        }

        if (!postData.postDescription.trim()) {
            formErrors.description = 'La descripción no puede estar vacía';
        }

        addError(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleChange = (e) => {
        setPostData(prevPostData => ({
            ...prevPostData,
            [e.target.name]: e.target.value
        }));
    }

    return (
        <section className="content-wrapper">
            <section className="form-container">
                <form onSubmit={(e) => e.preventDefault()} className="form" id="new-post-form">
                    <div className="form-section">
                        <div className="form__item-container form__item-file">
                            <div className="form__item-file-container">
                                <div className={`${previewImage ? 'form__item-file--active' : ''}`}  style={{ backgroundImage: `url(${previewImage})`}}></div>
                            </div>
                            <label htmlFor="file">Añadir foto de perfil</label>
                            <input
                                type="file"
                                name="file"
                                required
                                className={`form__item ${errors.image ? 'form__item--error' : ''}`}
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="form__item-container">
                            <TextInput
                                labelText="Titulo"
                                errorText={errors.title}
                                type="text"
                                id="postTitle"
                                name="postTitle"
                                className={`form__item ${errors.title ? 'form__item--error' : ''}`}
                                placeholder="Titulo"
                                setValue={handleChange}
                            />
                        </div>
                        <div className="form__item-container">
                            <label htmlFor="bibliography">Descripción</label>
                            <textarea 
                                name="postDescription"
                                className={`form__item form__item-description ${errors.description ? 'form__item--error' : ''}`}
                                value={postData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <div className="form__button-container">
                            <button 
                                className="form__button"
                                onClick={() => console.log("cancelando")}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="form__button"
                                onClick={async () => {
                                    const isValid = await validateForm();
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
            </section>
        </section>
    );
};

export default NewPost;