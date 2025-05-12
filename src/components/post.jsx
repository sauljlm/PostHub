import { useEffect, useState } from "react";
import { timeAgo } from "../utils/formatter";
import DBAccess from "../utils/dbAccess";

const Post = ({public_id, title, postDate, imageURL, description, userName}) => {

    const [userData, setUserData] = useState(null);

    useEffect(() => {
      const fetchUser = async () => {
        const postDataDB = new DBAccess();
        const data = await postDataDB.getUserByUsername(userName);
        setUserData(data);
      };
  
      fetchUser();
    }, [userName]);
  
    if (!userData) return <p>Cargando usuario...</p>;

    return (
        <article className="post">
            <header className="post-header">
                <div className="post-header__left">
                    <img
                        src= {userData.imageURL}
                        alt={`${userData.userName} profile`}
                        className="post-header__profile-image"
                    />
                    <div className="post-header__info">
                        <h2 className="post-header__username">{userData.userName}</h2>
                        <p className="post-header__location">Sedona, Arizona</p>
                    </div>
                </div>
                <div className="post-header__options">...</div>
            </header>

            <div className="post-asset-container">
                <img src={imageURL} alt={title} className="post-asset" />
            </div>

            <div className="post-content">
                <div className="post-content__actions">
                    <button className="post-content__like-btn">❤️</button>
                    <button className="post-content__comment-btn">💬</button>
                </div>
                <p className="post-content__likes">444 Me gusta</p>
                <div className="post-content__description">
                    <strong>{userData.userName}</strong> {description}
                </div>
                <p className="post-content__post-date">{timeAgo(postDate)}</p>
            </div>

            <div className="post-footer">
                <input type="text" placeholder="Agrega un comentario..." className="post-footer__input" />
                <button className="post-footer__submit-btn">Publicar</button>
            </div>
        </article>
    );
};

export default Post;
