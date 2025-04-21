'use client';
import React, { useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css'; // Adjust the path as necessary
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      if (response.data.success) {
        router.push('/dashboard');
      } else {
        setErrorMessage('Invalid email or password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className={styles['login-container']}>
      <img src="/logo.jpeg" alt="WaveSOW Logo" className={styles.logo} />
      <h1>Welcome to SOW Tracker</h1>
      <p>Sign in to manage your SOW documents</p>
      <form onSubmit={handleSubmit}>
        <div className={styles['form-group']}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.actions}>
          <div>
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <a href="#" >Forgot Password?</a>
        </div>
        <button type="submit" className={styles['login-btn']}>
          Sign In
        </button>
        {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Login;
