import React, { useState } from 'react';
import Input from '@material-ui/core/Input';
import { Button } from '@material-ui/core';
import loginService from '../services/login';
import blogService from '../services/blogs';

const LoginForm = ({
    setUser,
    setStatus
}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        console.log('logging in with', username);
        
        try {
          const user = await loginService.login({
            username, password,
          });
    
          window.localStorage.setItem(
            'loggedBlogappUser', JSON.stringify(user)
          );
          blogService.setToken(user.token);
          setUser(user);
          setUsername('');
          setPassword('');
        } catch (exception) {
          setStatus({variant : "filled", status : "error", text : "Wrong credentials were provided"});
          setTimeout(() => {         
            setStatus({});  
          }, 10000)
        }
    }

    return (
    <form onSubmit={handleLogin}>
      <div>
        username:
          <Input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          />
      </div>
      <div>
        password:
          <Input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          />
      </div>
      <Button variant="contained" color="primary" type="submit">login</Button>
    </form>
  )
}

export default LoginForm