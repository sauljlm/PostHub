import React, { useState, useEffect } from "react";
import Post from "../components/post";
import DBAccess from "../utils/dbAccess";

const Profile = () => {
  const [postsItems, setPostsItems] = useState([]);
  const [loggedUser, setLoggedUser] = useState([]);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("loggedUser"));
    if (user) {
      setLoggedUser(user);
    }
  }, []);
  
  useEffect(() => {
    const fetchPosts = async () => {
      if (!loggedUser || !loggedUser.userName) return;
  
      const postDataDB = new DBAccess();
      let posts = await postDataDB.getPostsByUserName(loggedUser.userName);
      posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
      setPostsItems(posts);
    };
  
    fetchPosts();
  }, [loggedUser]);

  return (
    <div className="content-wrapper">
      <section>
        {/* <img
            src= {loggedUser.imageURL}
            alt={`${loggedUser.userName} profile`}
            className="post-header__profile-image"
        /> */}
      </section>
      <section className="post-container">
        {Array.isArray(postsItems) && postsItems.length > 0 ? (
          postsItems.map((postItem) => (
            <Post
              key={postItem._id}
              public_id={postItem.public_id}
              title={postItem.postTitle}
              postDate={new Date(postItem.postDate)}
              imageURL={postItem.imageURL}
              description={postItem.postDescription}
              userData={loggedUser}
            />
          ))
        ) : (
          <p>No hay publicaciones disponibles</p>
        )}
      </section>
    </div>
  );
};

export default Profile;