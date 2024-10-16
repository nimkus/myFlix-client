import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const SignupView = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
    email: '',
    birthday: '',
  });

  const [formErrors, setFormErrors] = useState({
    username: '',
    password: '',
    email: '',
    birthday: '',
  });

  const handleChange = (field, value) => {
    setFormValues({ ...formValues, [field]: value });
    validateField(field, value);
  };

  const validateField = (field, value) => {
    let errorMessage = '';

    switch (field) {
      case 'username':
        if (value.length < 5) {
          errorMessage = 'Username must be at least 5 characters long.';
        }
        break;
      case 'password':
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordPattern.test(value)) {
          errorMessage =
            'Password must contain at least 8 characters, an uppercase letter, a lowercase letter, a number, and a symbol.';
        }
        break;
      case 'email':
        const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!emailPattern.test(value)) {
          errorMessage = 'Please enter a valid email address.';
        }
        break;
      case 'birthday':
        const today = new Date();
        const birthDate = new Date(value);
        const ageLimit = 200;
        const maxAgeDate = new Date(today.setFullYear(today.getFullYear() - ageLimit));

        if (birthDate > new Date()) {
          errorMessage = 'The birthday cannot be in the future.';
        } else if (birthDate < maxAgeDate) {
          errorMessage = `This is not a valid age in the bunnyverse.`;
        }
        break;
      default:
        break;
    }

    setFormErrors({ ...formErrors, [field]: errorMessage });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prevent form submission if there are validation errors
    if (Object.values(formErrors).some((error) => error)) {
      alert('Please correct the errors before submitting.');
      return;
    }

    const { username, password, email, birthday } = formValues;
    const data = { username, password, email, birthday };

    try {
      const response = await fetch('https://nimkus-movies-flix-6973780b155e.herokuapp.com/users', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Signup successful');
        navigate('/login');
      } else {
        const errorMessage = await response.text();
        alert(`Signup failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred during signup. Please try again later.');
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="mt-4 p-4 border rounded shadow-sm"
      style={{ maxWidth: '400px', margin: '0 auto' }}
    >
      <h3 className="text-center mb-4">Sign Up</h3>

      <Form.Group controlId="formUsernameSignup" className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your username"
          value={formValues.username}
          onChange={(e) => handleChange('username', e.target.value)}
          isInvalid={!!formErrors.username}
          required
        />
        <Form.Control.Feedback type="invalid">{formErrors.username}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formPasswordSignup" className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter your password"
          value={formValues.password}
          onChange={(e) => handleChange('password', e.target.value)}
          isInvalid={!!formErrors.password}
          required
        />
        <Form.Control.Feedback type="invalid">{formErrors.password}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formEmailSignup" className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="you@example.com"
          value={formValues.email}
          onChange={(e) => handleChange('email', e.target.value)}
          isInvalid={!!formErrors.email}
          required
        />
        <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formBirthdaySignup" className="mb-3">
        <Form.Label>Birthday</Form.Label>
        <Form.Control
          type="date"
          value={formValues.birthday}
          onChange={(e) => handleChange('birthday', e.target.value)}
          isInvalid={!!formErrors.birthday}
          required
        />
        <Form.Control.Feedback type="invalid">{formErrors.birthday}</Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" variant="primary" className="w-100 mb-3">
        Sign Up
      </Button>

      <div className="text-center">
        <small>Already have an account?</small> <br />
        <Link to="/login" className="btn btn-link">
          Login here
        </Link>
      </div>
    </Form>
  );
};
