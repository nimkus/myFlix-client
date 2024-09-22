import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    // this prevents the default behavior of the form which is to reload the entire page
    event.preventDefault();

    const data = {
      access: username,
      password: password,
    };

    fetch('https://nimkus-movies-flix-6973780b155e.herokuapp.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            const errorMessage = error.message || `Error ${res.status}: ${res.statusText}`;
            throw new Error(errorMessage);
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user && data?.token) {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          onLoggedIn(data.user, data.token);
        } else {
          alert('Invalid user data returned from server.');
        }
      })
      .catch((error) => {
        console.error('Login failed:', error); // Log error details to console for debugging
        alert(error.message || 'Something went wrong, please try again.');
      });
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-3">
      <Form.Group controlId="formUsernameLogin">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          minLength="5"
          required
        />
      </Form.Group>
      <Form.Group controlId="formPasswordLogin">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$"
          title="Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol."
          required
        />
      </Form.Group>
      <Button type="submit" className="mt-3" variant="primary">
        Submit
      </Button>
    </Form>
  );
};
