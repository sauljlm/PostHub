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
    <div className="content-wrapper profile">
      <section className="profile__info-container">
        <img
            src= {loggedUser.imageURL}
            alt={`${loggedUser.userName} profile`}
            className="profile__info-profile-photo"
        />
        <div className="profile__info">
          <h2 className="profile__info-username">{loggedUser.userName}</h2>
          <ul className="profile__info-specs">
            <li>{"0"} <span>publicaciones</span></li>
            <li>{"0"} <span>seguidores</span></li>
            <li>{"0"} <span>seguidos</span></li>
          </ul>
          <h3 className="profile__info-name">{loggedUser.name}</h3>
          <p className="profile__info-bio">{loggedUser.bio}</p>
        </div>
      </section>
      <section className="profile__post-container">
        {Array.isArray(postsItems) && postsItems.length > 0 ? (
          postsItems.map((postItem) => (
            <div className="profile__post-asset-container">
              <img src={postItem.imageURL} alt={postItem.postTitle} className="profile__post-asset" />
            </div>
          ))
        ) : (
          <p>No hay publicaciones disponibles</p>
        )}
      </section>
    </div>
  );
};

export default Profile;