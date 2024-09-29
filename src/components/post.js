const Post = ({public_id, title, postDate, imageURL, description, userName}) => {

    return (
        <article className="post post-container">
            <div className="post__heading">
                {/* <img src={"../img/sinTareas.png"} alt="" className="post__heading__photo"/> */}
                <h2 className="post__heading__userName">{userName}</h2>
                <p>{postDate}</p>
            </div>
            <div className="post__asset-container">
                <img src={imageURL} alt="" className="post__asset"/>
            </div>
            <div className="post__content">
                <button>like</button>
                <button>comment</button>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </article>
    );
};

export default Post;