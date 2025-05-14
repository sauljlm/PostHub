import React, { useState, useEffect } from "react";
import Post from "../components/post";
import { useParams } from 'react-router-dom';
import DBAccess from "../utils/dbAccess";

const Profile = () => {
  const { username } = useParams();
  const [postsItems, setPostsItems] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!username) return;
  
      const dbAccess = new DBAccess();
      let posts = await dbAccess.getPostsByUserName(username);
      posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
      setPostsItems(posts);

      const userByUsername = await dbAccess.getUserByUsername(username)
      setUserData(userByUsername);
    };
  
    fetchPosts();
  }, []);

  return (
    <div className="content-wrapper profile">
      <section className="profile__info-container">
        <img
            src= {userData.imageURL}
            alt={`${userData.userName} profile`}
            className="profile__info-profile-photo"
        />
        <div className="profile__info">
          <h2 className="profile__info-username">{userData.userName}</h2>
          <ul className="profile__info-specs">
            <li>{"0"} <span>publicaciones</span></li>
            <li>{"0"} <span>seguidores</span></li>
            <li>{"0"} <span>seguidos</span></li>
          </ul>
          <h3 className="profile__info-name">{userData.name}</h3>
          <p className="profile__info-bio">{userData.bio}</p>
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