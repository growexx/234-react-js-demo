import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from './authApiSlice';
import { setCredentials } from './authSlice';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useAuth();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await login({ email: user, password: pwd }).unwrap();
      localStorage.setItem('token', userData?.data?.token);
      setIsAuthenticated(true);
      dispatch(setCredentials({ token: userData?.data?.token, user: userData?.data }));
      setUser('');
      setPwd('');
      navigate("/welcome");
    } catch (err) {
      if (!err?.originalStatus && !err?.status) {
        setErrMsg('No Server Response');
      } else if (err.originalStatus === 400 || err.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.originalStatus === 401 || err.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUser(e.target.value);

  const handlePwdInput = (e) => setPwd(e.target.value);

  const content = isLoading ? (
    <h1>Loading...</h1>
  ) : (
    <section className="login">
      <p
        data-testid="error-para"
        ref={errRef}
        className={errMsg ? 'errmsg' : 'offscreen'}
        aria-live="assertive">
        {errMsg}
      </p>

      <h1>User Login</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          placeholder="Enter your Email here..."
          id="username"
          ref={userRef}
          value={user}
          onChange={handleUserInput}
          autoComplete="off"
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          placeholder="Enter your Password here..."
          id="password"
          onChange={handlePwdInput}
          value={pwd}
          required
        />
        <button>Log In</button>
      </form>
    </section>
  );

  return content;
};

export default Login;
