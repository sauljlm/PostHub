import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import DBAccess from "../utils/dbAccess";
import useWindowSize from '../hooks/useWindowSize';

const Profile = () => {
  const { username } = useParams();
  const [postsItems, setPostsItems] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);
  const { width } = useWindowSize();

  useEffect(() => {
    const fetchData = async () => {
      const sessionUser = JSON.parse(sessionStorage.getItem("loggedUser"));
      setLoggedUser(sessionUser);

      const isMyProfile = !username || username === sessionUser?.userName;
      const userToFetch = isMyProfile ? sessionUser.userName : username;

      const db = new DBAccess();
      const user = await db.getUserByUsername(userToFetch);
      setUserData(user);

      const posts = await db.getPostsByUserName(userToFetch);
      posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
      setPostsItems(posts);
    };

    fetchData();
  }, [username]);

  if (!userData) return <p>Cargando perfil...</p>;

  const isOwnProfile = loggedUser?.userName === userData.userName;

  return (
    <div className="content-wrapper profile">
      <section className="profile__info-box">
        <div className="profile__info-container">
          <img
            src= {userData.imageURL}
            alt={`${userData.userName} profile`}
            className="profile__info-profile-photo"
          />
          <div className="profile__info">
            <h2 className="profile__info-username">{userData.userName}</h2>
            <ul className="profile__info-specs">
              <li>{postsItems.length} <span>Publicaciones</span></li>
              <li>{"0"} <span>Seguidores</span></li>
              <li>{"0"} <span>Seguidos</span></li>
            </ul>
            {width > 768 && (
              <>
                <h3 className="profile__info-name">{userData.name}</h3>
                <p className="profile__info-bio">{userData.bio}</p>
              </>
            )}
          </div>
        </div>
        {width < 768 && (
          <>
            <h3 className="profile__info-name">{userData.name}</h3>
            <p className="profile__info-bio">{userData.bio}</p>
          </>
        )}
      </section>
      {/* <div className="profile__actions">
        {isOwnProfile ? (
          <button>Editar perfil</button>
        ) : (
          <button>Seguir</button>
        )}
      </div> */}
      <div className="profile__actions">
        {isOwnProfile ? (
          <p>{userData.name}</p>
        ) : (
          <p>{userData.name}</p>
        )}
      </div>
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