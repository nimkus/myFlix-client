import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { MdEditNote } from 'react-icons/md';
import { MovieCard } from '../movie-card/movie-card.jsx';

// UserEditView component handles profile editing, including password change, deletion, and displaying favorite movies
export const ProfileView = ({ userData, toggleFavoriteMovie }) => {
  // Function to format date for input fields in 'YYYY-MM-DD' format
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Function to format date for display in 'DD-MM-YYYY' format
  const formatDateForDisplay = (date) => {
    if (!date) return 'Not set';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid date';
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  };

  // Get name of logged in user and token from local storage
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // State management for user information, passwords, and form errors
  const [userInfo, setUserInfo] = useState(userData || null);
  const [tempData, setTempData] = useState(userData || null);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

  // State management for favortite movies
  const [favMovies, setFavMovies] = useState([]);

  // State to store form data
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const navigate = useNavigate();

  // Update userInfo and tempData when userData is received
  useEffect(() => {
    if (userData) {
      setUserInfo(userData);
      setTempData({
        ...userData,
        birthday: formatDateForInput(userData.birthday),
      });
    }
  }, [userData]);

  // Getting users favorite movies list from API
  useEffect(() => {
    const fetchUserInfo = async (page = 1, limit = 6) => {
      if (user && user.username) {
        try {
          const response = await fetch(
            `https://nimkus-movies-flix-6973780b155e.herokuapp.com/users/${user.username}/favMoviesAll`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const result = await response.json();
            setFavMovies(result.favMovies);
          } else {
            console.error(`Could not fetch favorite movies: ${response.status} ${response.statusText}`);
          }
        } catch (error) {
          console.error('Network or server error:', error);
        }
      } else {
        console.error('User or username is not available');
      }
    };
    fetchUserInfo();
  }, [token]);

  // Handles toggling of favorite movie status
  const handleToggleFavorite = (movieId) => {
    toggleFavoriteMovie(movieId);
  };

  // Handle changes in form inputs and validate them
  const handleChange = (field, value) => {
    if (field === 'currentPassword' || field === 'newPassword') {
      setPasswordData({ ...passwordData, [field]: value });
      validateField(field, value);
    } else {
      setTempData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
      validateField(field, value);
    }
  };

  // Validates individual fields and sets appropriate error messages
  const validateField = (field, value) => {
    let errorMessage = '';

    switch (field) {
      case 'username':
        if (value.length < 5) errorMessage = 'Username must be at least 5 characters long.';
        break;
      case 'email':
        const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!emailPattern.test(value)) errorMessage = 'Please enter a valid email address.';
        break;
      case 'birthday':
        const birthDate = new Date(value);
        const today = new Date();
        const ageLimit = 200;
        if (birthDate > today) {
          errorMessage = 'The birthday cannot be in the future.';
        } else if (birthDate < new Date(today.setFullYear(today.getFullYear() - ageLimit))) {
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

  // Handle saving profile changes with validation and API call
  const handleSave = async (event) => {
    event.preventDefault();

    if (Object.values(formErrors).some((error) => error)) {
      alert('Please correct the errors before saving.');
      return;
    }
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

      const response = await fetch(`https://nimkus-movies-flix-6973780b155e.herokuapp.com/users/${userInfo.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserInfo(updatedUser.user);
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
      setPasswordData({ currentPassword: '', newPassword: '' }); // Clear passwords after saving
    }

    setTimeout(() => setSuccessMessage(''), 7000); // Automatically clear success message after 7 seconds
  };

  // Resets the form to its original state
  const resetForm = () => {
    setTempData(userInfo); // Reset tempData to the current user data
    setPasswordData({
      currentPassword: '',
      newPassword: '',
    });
    setFormErrors({});
    setIsEditing(false);
    setShowPasswordFields(false);
    setSuccessMessage(''); // Clear any existing messages
  };

  // Handles the deletion of the user profile with API call
  const handleDelete = async () => {
    if (!token) {
      alert('You need to be logged in to perform this action.');
      return;
    }

    try {
      const response = await fetch(`https://nimkus-movies-flix-6973780b155e.herokuapp.com/users/${userInfo.username}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Clear user data from local storage and session
        try {
          localStorage.removeItem('token'); // Clear JWT token
          localStorage.removeItem('user'); // Clear user info
          sessionStorage.clear(); // Clear session storage if used
        } catch (error) {
          console.error('Error clearing local or session storage:', error);
        }
        setDeleteError(''); // Clear any previous errors
        window.location.reload(); // Reload the page to remove user state
      } else {
        const contentType = response.headers.get('Content-Type');
        let errorMessage = 'Failed to delete the profile. Please try again.';
        if (contentType && contentType.includes('application/json')) {
          const errorDetails = await response.json();
          errorMessage = errorDetails.message || errorMessage;
        }
        setDeleteError(errorMessage);
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      setDeleteError('Network or server error while deleting profile.');
    }
  };

  // Renders individual profile fields (username, email, birthday) with validation feedback
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
                    aria-label={label}
                    style={{ lineHeight: '1.6', color: '#444' }}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="ms-2"
                    aria-label={showPasswords ? 'Hide password' : 'Show password'}
                  >
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
                  aria-label={label}
                  style={{ lineHeight: '1.6', color: '#444' }}
                  required
                />
              )}
            </>
          ) : (
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
              aria-label={label}
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
        {!userInfo.username ? (
          <p>Loading profile...</p> // Add a loading state to handle the fetch delay
        ) : (
          <>
            <h2 className="text-center mb-3">{userInfo.username}</h2>
            <hr className="my-4" />

            {successMessage && (
              <div className="text-center mb-3">
                <span className={`text-${successMessage.includes('successfully') ? 'success' : 'danger'}`}>
                  {successMessage}
                </span>
              </div>
            )}

            {/* Confirmation Modal for profile deletion */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Profile Deletion</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to delete your profile? This action is irreversible.</Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleDelete} className="rounded-pill">
                  Delete Profile
                </Button>
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="rounded-pill">
                  Cancel
                </Button>
              </Modal.Footer>
            </Modal>

            <Form>
              {renderProfileField('Username', 'username', tempData.username)}
              {renderProfileField('Email', 'email', tempData.email)}
              {renderProfileField('Birthday', 'birthday', tempData.birthday)}

              {isEditing && (
                <>
                  {/* Change Password Toggle */}
                  <Button
                    variant="link"
                    className="mb-3"
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                    aria-label={showPasswordFields ? 'Hide password fields' : 'Show password fields'}
                  >
                    {showPasswordFields ? 'Hide Password Fields' : 'Change Password'}
                  </Button>

                  {/* Password Fields */}
                  {showPasswordFields && (
                    <>
                      {renderProfileField('Current Password', 'currentPassword', passwordData.currentPassword)}
                      {renderProfileField('New Password', 'newPassword', passwordData.newPassword)}
                    </>
                  )}

                  {/* Delete Profile Button */}
                  <Button
                    variant="link"
                    className="text-danger mb-3"
                    onClick={() => setShowDeleteModal(true)}
                    aria-label="Delete profile"
                  >
                    Delete Profile
                  </Button>
                </>
              )}

              <hr className="my-4" />

              <div className="text-end">
                {!isEditing ? (
                  <>
                    <Button
                      variant="primary"
                      className="px-4 me-3 rounded-pill"
                      onClick={() => setIsEditing(true)}
                      aria-label="Edit profile"
                    >
                      <MdEditNote className="me-1 mb-1" />
                      Edit
                    </Button>
                    <Link to={'/'}>
                      <Button variant="outline-primary" className="px-4 rounded-pill" aria-label="Go back to main page">
                        Back
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      onClick={handleSave}
                      variant="primary"
                      className="px-4 me-3 rounded-pill"
                      aria-label="Save changes"
                    >
                      Save Changes
                    </Button>

                    <Button
                      variant="outline-primary"
                      className="px-4 rounded-pill"
                      onClick={resetForm}
                      aria-label="Cancel editing"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </Form>

            {/* Display favorite movies only if not editing */}
            {!isEditing && (
              <Row className="mb-4 mt-4">
                <Col>
                  <h5>Favorite Movies</h5>
                  {favMovies && favMovies.length > 0 ? (
                    <Row>
                      {favMovies.map((favMovie) => (
                        <Col key={favMovie._id} md={4} className="mb-4">
                          <MovieCard
                            movie={{ ...favMovie, id: favMovie._id }}
                            isFavorite={true}
                            onToggleFavorite={handleToggleFavorite}
                          />
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <p>None</p>
                  )}
                </Col>
              </Row>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};
