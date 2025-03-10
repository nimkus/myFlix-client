import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { MdEditNote } from 'react-icons/md';
import { MovieCard } from '../movie-card/movie-card.jsx';

/**
 * ProfileView component allows users to view and edit their profile information.
 * Users can update their details, change their password, delete their profile,
 * and view their list of favorite movies.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.userData - The user data object received from the API.
 * @param {Function} props.toggleFavoriteMovie - Function to toggle favorite movie status.
 * @returns {JSX.Element} A user profile view with editable fields.
 */
export const ProfileView = ({ userData, toggleFavoriteMovie }) => {
  const navigate = useNavigate();

  /**
   * @state {Object|null} userInfo - Stores user profile data.
   */
  const [userInfo, setUserInfo] = useState(userData || null);

  /**
   * @state {Object} tempData - Holds temporary profile edits before saving.
   */
  const [tempData, setTempData] = useState(userData || null);

  /**
   * @state {Object} passwordData - Contains the current and new password values.
   * @property {string} currentPassword - The user's current password.
   * @property {string} newPassword - The new password to update.
   */
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

  /**
   * @state {Array} favMovies - List of the user's favorite movies.
   */
  const [favMovies, setFavMovies] = useState([]);

  /**
   * @state {Object} formErrors - Stores validation error messages for form fields.
   */
  const [formErrors, setFormErrors] = useState({});

  /**
   * @state {boolean} isEditing - Tracks whether the user is in profile editing mode.
   */
  const [isEditing, setIsEditing] = useState(false);

  /**
   * @state {boolean} showPasswordFields - Controls visibility of the password change fields.
   */
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  /**
   * @state {boolean} showPasswords - Determines whether passwords are visible in the input fields.
   */
  const [showPasswords, setShowPasswords] = useState(false);

  /**
   * @state {string} successMessage - Stores a success or error message after form submission.
   */
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * @state {boolean} showDeleteModal - Controls the visibility of the delete profile confirmation modal.
   */
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /**
   * @state {string} deleteError - Stores error messages related to profile deletion.
   */
  const [deleteError, setDeleteError] = useState('');

  // Retrieve user details from localStorage
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  /**
   * Formats a given date to be used in an input field ('YYYY-MM-DD' format).
   *
   * @param {string} date - The date string to format.
   * @returns {string} The formatted date or an empty string if invalid.
   */
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  /**
   * Formats a given date for display ('DD-MM-YYYY' format).
   *
   * @param {string} date - The date string to format.
   * @returns {string} The formatted date or 'Not set' if invalid.
   */
  const formatDateForDisplay = (date) => {
    if (!date) return 'Not set';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid date';
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  };

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

  /**
   * Fetches the user's list of favorite movies from the API.
   */
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

  /**
   * Toggles the favorite status of a given movie.
   * @callback toggleFavoriteMovie
   * @param {string} movieId - The unique identifier of the movie.
   */
  const handleToggleFavorite = (movieId) => {
    toggleFavoriteMovie(movieId);
  };

  /**
   * Handles input field changes, updates state, and validates the field.
   *
   * @param {string} field - The field being updated.
   * @param {string} value - The new value of the field.
   */
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

  /**
   * Handles saving profile changes with validation and API call.
   *
   * @param {Event} event - The form submission event.
   */
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

  /**
   * Validates individual input fields and sets appropriate error messages.
   *
   * @param {string} field - The name of the field being validated.
   * @param {string} value - The value entered in the field.
   */
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

  /**
   * Resets form to original state
   */
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

  /**
   * Handles the deletion of the user profile with an API call.
   */
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

  /**
   * Renders an individual profile field with validation feedback.
   *
   * @param {string} label - The display label for the field.
   * @param {string} field - The name of the field (e.g., "username", "email", "birthday").
   * @param {string} value - The current value of the field.
   * @returns {JSX.Element} A form field row for user profile editing or viewing.
   */
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
