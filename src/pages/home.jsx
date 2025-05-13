import React, { useState, useEffect } from "react";
import Post from "../components/post";
import DBAccess from "../utils/dbAccess";


const Home = () => {
  const [postsItems, setPostsItems] = useState([]);
  //const [loggedUser, setLoggedUser] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postDataDB = new DBAccess();
      let posts = await postDataDB.getPosts();
      posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate))
      await setPostsItems(posts);
      //await setLoggedUser(JSON.parse(sessionStorage.getItem("loggedUser")));
    };

    fetchPosts();
  }, []);


  return (
    <div className="content-wrapper">
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
              userName={postItem.userName}
            />
          ))
        ) : (
          <p>No hay publicaciones disponibles</p>
        )}
      </section>
    </div>
  );
};

export default Home;