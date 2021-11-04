import React from 'react';
import { logout, signInWithGoogle } from '../api/firebase';

const Login = () => (
  <div>
    <h1>LOGIN PAGE</h1>
    <button type="submit" onClick={signInWithGoogle}>Sign In</button>
    <button type="submit" onClick={logout}>Log out</button>
  </div>
);

export default Login;
