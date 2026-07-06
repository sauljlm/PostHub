import React, { useState } from 'react';
import DBAccess from "../utils/dbAccess";
import resizeImage from "../utils/resizeImg";
import TextInput from "../components/common/textInput";
import { useNavigate } from "react-router-dom";

const MAX_FILES = 10;
const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const VALID_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const NewPost = () => {
    const postsDataDB = new DBAccess();
    const navigate = useNavigate();

    const [postData, setPostData] = useState({
        userName: "",
        postTitle: "",
        postDate: Date.now(),
        postDescription: "",
        state: "AC"
    })
    const [errors, setErrors] = useState({});

    // Each item: { file, previewUrl, type: 'image' | 'video' }
    const [mediaFiles, setMediaFiles] = useState([]);

    const isImage = (file) => file.type.startsWith('image/');
    const isVideo = (file) => file.type.startsWith('video/');

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files || []);
        event.target.value = ""; // allow re-selecting the same file later

        if (!selectedFiles.length) return;

        if (mediaFiles.length + selectedFiles.length > MAX_FILES) {
            alert(`Puedes subir un máximo de ${MAX_FILES} archivos por publicación.`);
        }

        const filesToAdd = selectedFiles.slice(0, MAX_FILES - mediaFiles.length);

        filesToAdd.forEach((file) => {
            if (!validateFile(file)) return;

            if (isImage(file)) {
                const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB
                if (file.size > maxSizeInBytes) {
                    resizeImage(file, 1024, 1024, 0.9, (resizedFile) => {
                        addMediaItem(resizedFile, 'image');
                    });
                } else {
                    addMediaItem(file, 'image');
                }
            } else if (isVideo(file)) {
                addMediaItem(file, 'video');
            }
        });
    };

    const addMediaItem = (file, type) => {
        const previewUrl = URL.createObjectURL(file);
        setMediaFiles((prev) => [...prev, { file, previewUrl, type }]);
    };

    const removeMediaItem = (index) => {
        setMediaFiles((prev) => {
            URL.revokeObjectURL(prev[index].previewUrl);
            return prev.filter((_, i) => i !== index);
        });
    };

    const addError = (formErrors) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            ...formErrors,
        }));
    }

    const validateFile = (file) => {
        const isValidType = VALID_IMAGE_TYPES.includes(file.type) || VALID_VIDEO_TYPES.includes(file.type);
        if (!isValidType) {
            alert("Por favor, selecciona imágenes (jpg, png, gif, webp) o videos (mp4, webm, mov) válidos.");
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

        mediaFiles.forEach(({ file }) => {
            formData.append('files', file);
        });

        await postsDataDB.createNewPost(formData);
        navigate("/");
    };

    const validateForm = async () => {
        let formErrors = {};

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
                            <label htmlFor="file">Añadir fotos o videos</label>
                            <input
                                type="file"
                                name="file"
                                accept="image/*,video/*"
                                multiple
                                className={`form__item ${errors.image ? 'form__item--error' : ''}`}
                                onChange={handleFileChange}
                            />
                            {mediaFiles.length > 0 && (
                                <div className="form__media-preview-grid">
                                    {mediaFiles.map((item, index) => (
                                        <div className="form__media-preview-item" key={item.previewUrl}>
                                            {item.type === 'image' ? (
                                                <img src={item.previewUrl} alt={`preview ${index + 1}`} />
                                            ) : (
                                                <video src={item.previewUrl} muted />
                                            )}
                                            <button
                                                type="button"
                                                className="form__media-preview-remove"
                                                onClick={() => removeMediaItem(index)}
                                                aria-label="Quitar archivo"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                                className="form__button form__button-cancel"
                                onClick={() => console.log("cancelando")}
                            >
                                Cancelar
                            </button>
                            <button
                                className="form__button form__button-save"
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
