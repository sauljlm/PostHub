import React, { useState, useEffect } from "react";
import Post from "../components/post";
import DBAccess from "../utils/dbAccess";


const Home = () => {
  const [postsItems, setPostsItems] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    const postDataDB = new DBAccess();
    let posts = await postDataDB.getPosts();
    posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate))
    await setPostsItems(posts);
  }

  return (
    <div className="content-wrapper">
      <section className="post-container">
        {Array.isArray(postsItems) && postsItems.length > 0 ? (
          postsItems.map((postItem) => (
            <Post
              key={postItem._id}
              postData={postItem}
              onUpdatePost={getPosts}
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