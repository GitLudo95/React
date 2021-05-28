import React, { useState } from 'react';
import Input from '@material-ui/core/Input';
import { Button } from '@material-ui/core';
import blogService from '../services/blogs';

const BlogForm = ({
    blogs,
    setBlogs,
    setStatus
}) => {
    const [newAuthor, setNewAuthor] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [newTitle, setNewTitle] = useState('');

    const validateAddBlog = () => {
        let errorMessage = "";
        if(!newTitle) {
          errorMessage += "Title is required\n";
        }
        if(!newAuthor) {
          errorMessage += "Author is required\n";
        }
        if(!newUrl) {
          errorMessage += "Url is required\n";
        }
        return errorMessage;
    }
    
    const addBlog = async event => {
        event.preventDefault();
        try {
          const newBlog = {
            title: newTitle,
            author: newAuthor,
            url: newUrl,
          }
          const errorMessage = validateAddBlog();
          if(!errorMessage) {
            const returnedBlog = await blogService.create(newBlog);
            let newBlogList = [...blogs].concat(returnedBlog);
            setBlogs(newBlogList);
            setNewTitle('');
            setNewAuthor('');
            setNewUrl('');
            setStatus({variant : "filled", status : "success", text : `Succesfully created blog: ${newBlog.title}`});
            setTimeout(() => {         
              setStatus({});  
            }, 10000)
          } else {
            setStatus({variant : "filled", status : "error", text : `${errorMessage}`});
            setTimeout(() => {         
              setStatus({});  
            }, 10000)
          }
        } catch(e) {
          console.error(e);
          let errorText = "An unexpected exception occured in the create blog service";
          if(e.response && e.response.status === "401") {
            errorText = "User session expired, login again";
          }
          setStatus({variant : "filled", status : "error", text : errorText});
          setTimeout(() => {         
            setStatus({});  
          }, 10000)
        }
    }

    return (
    <form onSubmit={addBlog}>
      <div>
        Title:
          <Input
          id="BlogFormTitle"
          type="text"
          value={newTitle}
          name="Title"
          onChange={({ target }) => setNewTitle(target.value)}
          />
      </div>
      <div>
        Author:
            <Input
            id="BlogFormAuthor"
            type="text"
            value={newAuthor}
            name="Author"
            onChange={({ target }) => setNewAuthor(target.value)}
            />
      </div>
      <div>
        Url:
            <Input
            id="BlogFormUrl"
            type="text"
            value={newUrl}
            name="Url"
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </div>
        <Button id="BlogFormSubmit" variant="contained" color="primary" type="submit">create</Button>
    </form>
  )
}

export default BlogForm