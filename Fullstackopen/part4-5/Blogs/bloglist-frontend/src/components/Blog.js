import React, { useState } from 'react';
import blogService from '../services/blogs';
import { Button } from '@material-ui/core';

const Blog = ({
  blog,
  blogs,
  setBlogs,
  setStatus,
  user
}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false);
  const [buttonName, setButtonName] = useState("view");
  const [likes, setLikes] = useState(blog.likes);

  const showWhenVisible = { display: visible ? '' : 'none' }

  const isBlogFromUser = blog.author === user.name;
  const showDeleteButtonWhenVisible = { display: isBlogFromUser ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const toggleButtonName = () => {
    if(buttonName === "view") {
      setButtonName("hide");
    } else {
      setButtonName("view");
    }
  }

  const handleView = () => {
    toggleButtonName();
    toggleVisibility();
  }

  const handleLike = async () => {
    const isLiked = Boolean(window.localStorage.getItem((blog.title + "Liked")));
    if(isLiked) {
      return;
    }
    const updatedBlog = { ...blog };
    updatedBlog.likes++;

    try {
      const returnedBlog = await blogService.update(updatedBlog.id, updatedBlog);
      console.log('returned blog', returnedBlog);
      setLikes(updatedBlog.likes);
      window.localStorage.setItem(
        (blog.title + "Liked"), true
      );
    } catch(e) {
        console.error(e);
        setStatus({ variant : "filled", status : "error", text : 'An unexpected error occured' });
        setTimeout(() => {
          setStatus({});
        }, 10000)
    }
  }

  const handleDelete = async () => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id);
        const newBlogList = blogs.filter(currentBlog => currentBlog.id !== blog.id);
        setBlogs(newBlogList);
        setStatus({ variant : "filled", status : "success", text : `Succesfully removed blog ${blog.title}` });
        setTimeout(() => {
          setStatus({});
        }, 10000)
      } catch(e) {
        console.error(e);
        setStatus({ variant : "filled", status : "error", text : 'An unexpected error occured' });
        setTimeout(() => {
          setStatus({});
        }, 10000)
      }
    }
  }

  return (
  <div style={blogStyle}>
    <div className="blog">
      {blog.title} {blog.author} <button onClick={handleView}>{buttonName}</button>
      <div className="blogView" style={showWhenVisible}>
        <div className="blogUrl">
          {blog.url}
        </div>
        <div className="blogLikes">
          likes {likes} <button onClick={handleLike}>like</button>
        </div>
        <div className="blogAuthor">
          {blog.author}
        </div>
        <div style={showDeleteButtonWhenVisible}>
          <Button onClick={handleDelete} variant="contained" color="secondary" type="button">remove</Button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Blog