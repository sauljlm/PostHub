import { useEffect, useState, useMemo } from "react";
import { Link } from 'react-router-dom';
import { timeAgo } from "../utils/formatter";
import DBAccess from "../utils/dbAccess";
import Swal from 'sweetalert2';

import favorite from '../assets/favorite.svg';
import favoriteFilled from '../assets/favorite-filled.svg';
import { getPostMedia } from '../utils/postMedia';

const PostMediaCarousel = ({ media, alt }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    if (media.length === 0) return null;

    const goTo = (index) => {
        setActiveIndex((index + media.length) % media.length);
    };

    const activeItem = media[activeIndex];

    return (
        <div className="post-asset-container">
            {activeItem.type === 'video' ? (
                <video
                    key={activeItem.url}
                    src={activeItem.url}
                    className="post-asset"
                    controls
                />
            ) : (
                <img key={activeItem.url} src={activeItem.url} alt={alt} className="post-asset" />
            )}

            {media.length > 1 && (
                <>
                    <button
                        type="button"
                        className="post-asset-arrow post-asset-arrow--prev"
                        onClick={() => goTo(activeIndex - 1)}
                        aria-label="Anterior"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        className="post-asset-arrow post-asset-arrow--next"
                        onClick={() => goTo(activeIndex + 1)}
                        aria-label="Siguiente"
                    >
                        ›
                    </button>
                    <div className="post-asset-dots">
                        {media.map((item, index) => (
                            <button
                                type="button"
                                key={item.url}
                                className={`post-asset-dot ${index === activeIndex ? 'post-asset-dot--active' : ''}`}
                                onClick={() => goTo(index)}
                                aria-label={`Ir al elemento ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const Post = ({postData, onUpdatePost}) => {

    const [userData, setUserData] = useState(null);
    const [loggedUser, setLoggedUser] = useState(null);
    const [liked, setLiked] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [showComments, setShowComments] = useState(false);

    // Memoriza la instancia de DBAccess para evitar que cambie en cada render
    const postDataDB = useMemo(() => new DBAccess(), []);

    useEffect(() => {
      const fetchUser = async () => {
        const userData = await postDataDB.getUserByUsername(postData.userName);
        setUserData(userData);

        const loggedUserData = await postDataDB.getLoggedUser();
        setLoggedUser(loggedUserData);
        
        if (loggedUserData && loggedUserData.userName) {
            const hasLiked = postData.likes.some(like => like.userName === loggedUserData.userName);
            setLiked(hasLiked);
          } else {
            setLiked(false);
          }
      };
  
      fetchUser();
    }, [postData, postDataDB]);

    const handleLike = async () => {
        if (loggedUser) {
            setLiked(!liked);
            await postDataDB.postLike(postData._id, loggedUser.userName);
            onUpdatePost();
        } else {
			Swal.fire({
				'icon': 'error',
				'title': 'Debes iniciar sesión',
				'confirmButtonText': 'Entendido'
			});
        }
    };

    const addComment = async () => {
        if (loggedUser) {
            await postDataDB.addComment(postData._id, loggedUser.userName, commentText);
            setCommentText("");
            onUpdatePost();
        } else {
			Swal.fire({
				'icon': 'error',
				'title': 'Debes iniciar sesión',
				'confirmButtonText': 'Entendido'
			});
        }
    }

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
                        <h2 className="post-header__username"><Link to={`/${userData.userName}`}>{userData.userName}</Link></h2>
                        <p className="post-header__location">Sedona, Arizona</p>
                    </div>
                </div>
                <div className="post-header__options">...</div>
            </header>

            <PostMediaCarousel media={getPostMedia(postData)} alt={postData.postTitle} />

            <div className="post-content">
                <div className="post-content__actions">
                    <button
                        className="post-content__like-btn"
                        onClick={handleLike}
                        style={{
                            backgroundImage: `url(${liked ? favoriteFilled : favorite})`  
                        }}
                    />
                    <button className="post-content__comment-btn"
                        onClick={() => setShowComments(prev => !prev)}
                    >
                        <span className="post-content__comment-badge">
                        {postData.comments.length}
                        </span>
                    </button>
                </div>
                <p className="post-content__likes">{postData.likes.length} Me gusta</p>
                <div className="post-content__description">
                    {postData.postDescription}
                </div>

                <p className="post-content__post-date">{timeAgo(postData.postDate)}</p>
                {showComments && (
                    <div className="post-content__comments-container">
                        <ul className="post-content__comments">
                            {postData.comments.sort((a, b) => new Date(b.commentDate) - new Date(a.commentDate)).map((comment) => (
                                <li 
                                    key={comment.id}
                                    className="post-content__comment"
                                >
                                    <p className="post-content__comment-header">
                                        <span className="post-content__comment-username">   {comment.userName}
                                        </span>
                                        <span className="post-content__comment-date">{timeAgo(comment.commentDate)}
                                        </span>
                                    </p>
                                    <p>{comment.commentText}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="post-footer">
                <input 
                    type="text" 
                    placeholder="Agrega un comentario..." 
                    className="post-footer__input" 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            addComment();
                        }
                    }}
                />
                <button className="post-footer__submit-btn" onClick={addComment}>Comentar</button>
            </div>
        </article>
    );
};

export default Post;
