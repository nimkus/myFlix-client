import React, { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { MdEditNote } from 'react-icons/md';
import { MovieCard } from '../movie-card/movie-card.jsx';

export const UserEditView = ({ userInfo, movies, toggleFavoriteMovie }) => {
  // Filter favorite movies from the movies list based on userInfo
  const favoriteMovies = movies.filter((movie) => userInfo.favMovies.includes(movie.id));

  const handleToggleFavorite = (movieId) => {
    toggleFavoriteMovie(movieId);
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return ''; // Return empty if the date is invalid
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateForDisplay = (date) => {
    if (!date) return 'Not set';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid date'; // Return 'Invalid date' if the date is not a valid date
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [originalData, setOriginalData] = useState({
    ...userInfo,
    birthday: formatDateForInput(userInfo.birthday),
  });
  const [userData, setUserData] = useState({
    ...userInfo,
    birthday: formatDateForInput(userInfo.birthday),
  });
  const [tempData, setTempData] = useState({
    ...userInfo,
    birthday: formatDateForInput(userInfo.birthday),
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    birthday: '',
    currentPassword: '',
    newPassword: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false); // New state for password visibility

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    if (field === 'currentPassword' || field === 'newPassword') {
      setPasswordData({ ...passwordData, [field]: value });
      validateField(field, value);
    } else {
      setTempData({ ...tempData, [field]: value });
      validateField(field, value);
    }
  };

  const validateField = (field, value) => {
    let errorMessage = '';

    switch (field) {
      case 'username':
        if (value.length < 5) {
          errorMessage = 'Username must be at least 5 characters long.';
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
      case 'newPassword':
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordPattern.test(value)) {
          errorMessage =
            'Password must contain at least 8 characters, an uppercase letter, a lowercase letter, a number, and a symbol.';
        }
        break;
      default:
        break;
    }

    setFormErrors((prevErrors) => ({ ...prevErrors, [field]: errorMessage }));
  };

  const [successMessage, setSuccessMessage] = useState(''); // New state for feedback message

  const handleSave = async (event) => {
    event.preventDefault();

    if (Object.values(formErrors).some((error) => error)) {
      alert('Please correct the errors before saving.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to perform this action.');
      return;
    }

    try {
      const updateData = {
        username: tempData.username,
        birthday: tempData.birthday,
        email: tempData.email,
      };

      if (passwordData.currentPassword && passwordData.newPassword) {
        updateData.currentPassword = passwordData.currentPassword;
        updateData.newPassword = passwordData.newPassword;
      }

      const response = await fetch(
        `https://nimkus-movies-flix-6973780b155e.herokuapp.com/users/${originalData.username}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setOriginalData(updatedUser.user);
        setUserData(updatedUser.user);
        setIsEditing(false); // Return to non-editable mode
        setSuccessMessage('Profile updated successfully!');
      } else {
        const contentType = response.headers.get('Content-Type');
        let errorMessage = 'There was an issue with updating your profile.';

        if (contentType && contentType.includes('application/json')) {
          const errorDetails = await response.json();
          errorMessage = errorDetails.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }

        setSuccessMessage(errorMessage);
      }
    } catch (error) {
      console.error('Network or server error:', error);
      setSuccessMessage('Error updating profile. Please try again.');
    } finally {
      setPasswordData({ currentPassword: '', newPassword: '' }); // Always clear passwords on completion
    }

    setTimeout(() => {
      setSuccessMessage('');
    }, 7000);
  };

  const resetForm = () => {
    setTempData(originalData);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
    });
    setFormErrors({
      username: '',
      email: '',
      birthday: '',
      currentPassword: '',
      newPassword: '',
    });
    setIsEditing(false);
    setShowPasswordFields(false);
    setSuccessMessage(''); // Clear any existing success or error messages
  };

  const renderProfileField = (label, field, value) => (
    <Row className="mb-4" key={field}>
      <Col>
        <Form.Group controlId={`form${field.charAt(0).toUpperCase() + field.slice(1)}`}>
          <Form.Label className="text-muted mb-2" style={{ fontSize: '1rem', fontWeight: 'normal' }}>
            {label}
          </Form.Label>
          {isEditing ? (
            <>
              {field === 'currentPassword' || field === 'newPassword' ? (
                <div className="d-flex align-items-center">
                  <Form.Control
                    type={showPasswords ? 'text' : 'password'}
                    name={field}
                    autoComplete="new-password"
                    value={passwordData[field] || ''}
                    onChange={(e) => handleChange(field, e.target.value)}
                    isInvalid={!!formErrors[field]}
                    style={{ lineHeight: '1.6', color: '#444' }}
                    required
                  />
                  <Button variant="outline-secondary" onClick={() => setShowPasswords(!showPasswords)} className="ms-2">
                    {showPasswords ? 'Hide' : 'Show'}
                  </Button>
                </div>
              ) : (
                <Form.Control
                  type={field === 'birthday' ? 'date' : 'text'}
                  name={field}
                  autoComplete={
                    field === 'username'
                      ? 'username'
                      : field === 'email'
                        ? 'email'
                        : field === 'birthday'
                          ? 'bday'
                          : undefined
                  }
                  value={field === 'birthday' ? formatDateForInput(tempData[field]) : tempData[field] || ''}
                  onChange={(e) => handleChange(field, e.target.value)}
                  isInvalid={!!formErrors[field]}
                  style={{ lineHeight: '1.6', color: '#444' }}
                  required
                />
              )}
            </>
          ) : (
            // Display as plain text when not editing
            <Form.Control
              plaintext
              readOnly
              defaultValue={
                field === 'favMovies'
                  ? Array.isArray(value) && value.length === 0
                    ? 'None'
                    : value
                  : field === 'birthday'
                    ? formatDateForDisplay(value)
                    : value || 'Not set'
              }
              style={{ lineHeight: '1.6', color: '#444' }}
            />
          )}
          <Form.Control.Feedback type="invalid">{formErrors[field]}</Form.Control.Feedback>
        </Form.Group>
      </Col>
    </Row>
  );

  return (
    <Card className="p-4 my-3 border-0" style={{ maxWidth: '700px', margin: 'auto' }}>
      <Card.Body>
        <h2 className="text-center mb-3">{userData.username}</h2>
        <hr className="my-4" />

        {successMessage && (
          <div className="text-center mb-3">
            <span className={`text-${successMessage.includes('successfully') ? 'success' : 'danger'}`}>
              {successMessage}
            </span>
          </div>
        )}

        <Form>
          {renderProfileField('Username', 'username', userData.username)}
          {renderProfileField('Email', 'email', userData.email)}
          {renderProfileField('Birthday', 'birthday', userData.birthday)}

          {isEditing && (
            <>
              <Button variant="link" className="mb-3" onClick={() => setShowPasswordFields(!showPasswordFields)}>
                {showPasswordFields ? 'Hide Password Fields' : 'Change Password'}
              </Button>

              {showPasswordFields && (
                <>
                  {renderProfileField('Current Password', 'currentPassword', passwordData.currentPassword)}
                  {renderProfileField('New Password', 'newPassword', passwordData.newPassword)}
                </>
              )}
            </>
          )}

          <hr className="my-4" />

          <div className="text-center">
            {!isEditing ? (
              <>
                <Button variant="primary" className="px-4 me-3 rounded-pill" onClick={() => setIsEditing(true)}>
                  <MdEditNote className="me-1 mb-1" />
                  Edit
                </Button>
                <Link to={'/'}>
                  <Button variant="outline-primary" className="px-4 rounded-pill">
                    Back
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button type="button" onClick={handleSave} variant="primary" className="px-4 me-3 rounded-pill">
                  Save Changes
                </Button>

                <Button variant="outline-primary" className="px-4 rounded-pill" onClick={resetForm}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </Form>

        {/* Move the Favorite Movies section here */}
        {!isEditing && (
          <>
            <Row className="mb-4 mt-4">
              <Col>
                <h5>Favorite Movies</h5>
                {userData.favMovies && userData.favMovies.length > 0 ? (
                  <Row>
                    {movies
                      .filter((movie) => userData.favMovies.includes(movie.id))
                      .map((favMovie) => (
                        <Col key={favMovie.id} md={4}>
                          <MovieCard movie={favMovie} isFavorite={true} onToggleFavorite={handleToggleFavorite} />
                        </Col>
                      ))}
                  </Row>
                ) : (
                  <p>None</p>
                )}
              </Col>
            </Row>
          </>
        )}
      </Card.Body>
    </Card>
  );
};
