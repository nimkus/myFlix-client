import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    // prevents reload the entire page
    event.preventDefault();

    const data = {
      username: username,
      password: password,
    };

    fetch('https://nimkus-movies-flix-6973780b155e.herokuapp.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          onLoggedIn(data.user, data.token);
        } else {
          alert('No such user');
        }
      })
      .catch((e) => {
        alert('Something went wrong');
      });
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="mt-4 p-4 border rounded shadow-sm"
      style={{ maxWidth: '400px', margin: '0 auto' }}
    >
      <h3 className="text-center mb-4">Login</h3>

      <Form.Group controlId="formUsernameLogin" className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          minLength="5"
          autoComplete="username" // Autofill für das Benutzername-Feld
          required
        />
      </Form.Group>

      <Form.Group controlId="formPasswordLogin" className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$"
          title="Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol."
          autoComplete="current-password" // Autofill für das Passwort-Feld
          required
        />
      </Form.Group>

      <Button type="submit" variant="primary" className="w-100 mb-3">
        Login
      </Button>

      <div className="text-center">
        <small>Don't have an account?</small> <br />
        <Link to="/signup" className="btn btn-link">
          Sign up here
        </Link>
      </div>
    </Form>
  );
};
