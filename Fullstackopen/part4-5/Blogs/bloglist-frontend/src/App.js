import './style.css';

import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import StatusBar from './components/StatusBar';
import Togglable from './components/Togglable';
import blogService from './services/blogs';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [status, setStatus] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchBlogs() {
      const blogs = await blogService.getAll();
      console.log(blogs)
      blogs.sort((a, b) => {
        if(a.likes > b.likes) return -1;
        if(a.likes < b.likes) return 1;
      })
      setBlogs( blogs )
    }
    fetchBlogs();
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, [])

  const handleLogout = () => {
    console.log('logging out', user.username);
    window.localStorage.removeItem('loggedBlogappUser');

    setUser(null);
  }

  if(user === null) {
    return(
      <div>
        <h2>Log in to application</h2>
        <StatusBar variant={status.variant} status={status.status} text={status.text} />
        <LoginForm setUser={setUser} setStatus={setStatus} />
      </div>
    )
  }
  return(
    <div>
      <StatusBar variant={status.variant} status={status.status} text={status.text} />
      <h2>Blogs</h2>
      <p>{user.username} logged in <button onClick={handleLogout} >log out</button></p>
      <Togglable buttonLabel="new blog">
        <BlogForm blogs={blogs} setBlogs={setBlogs} setStatus={setStatus} />
      </Togglable>
      {blogs.map(blog =>
        <Blog blogs={blogs} setBlogs={setBlogs} setStatus={setStatus} user={user} key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App