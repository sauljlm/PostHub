const Post = ({public_id, title, postDate, imageURL, description, userName}) => {

    return (
        <article className="post">
            <header className="post-header">
                <div className="post-header__left">
                    <img
                        src="https://placehold.co/40x40"
                        alt={`${userName} profile`}
                        className="post-header__profile-image"
                    />
                    <div className="post-header__info">
                        <h2 className="post-header__username">{userName}</h2>
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
                    <strong>{userName}</strong> {description}
                </div>
                <p className="post-content__post-date">{new Date(postDate).toLocaleString()}</p>
            </div>

            <div className="post-footer">
                <input type="text" placeholder="Agrega un comentario..." className="post-footer__input" />
                <button className="post-footer__submit-btn">Publicar</button>
            </div>
        </article>
    );
};

export default Post;
