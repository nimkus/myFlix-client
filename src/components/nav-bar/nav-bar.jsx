import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, Dropdown } from 'react-bootstrap';

/**
 * NavBar component displays the application's navigation menu.
 * It includes links to different sections such as Movies, Directors, and Genres.
 * The navigation bar also allows users to view their profile and log out.
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {Object} props.user - The current authenticated user's details.
 * @param {string} props.user.username - The username of the logged-in user.
 * @param {Function} props.onLogout - Function to handle user logout.
 * @returns {JSX.Element} A navigation bar with user authentication controls.
 */
export const NavBar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  /**
   * Handles user logout.
   * Calls `onLogout` function and redirects the user to the login page.
   *
   * @function
   * @returns {void}
   */
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" variant="light" className="py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="me-3">
          <img
            style={{ width: '130px' }}
            src="https://i.postimg.cc/rsK0ykfz/bunbuster-Logo.png"
            alt="Bunbuster logo shows a rabbit with sunglasses above lettering"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as="span" className="fw-bold">
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? 'text-primary fw-bold' : 'text-dark fw-bold')}
                style={{ textDecoration: 'none' }}
              >
                Movies
              </NavLink>
            </Nav.Link>
            <Nav.Link as="span" className="fw-bold">
              <NavLink
                to="/movies/directors"
                className={({ isActive }) => (isActive ? 'text-primary fw-bold' : 'text-dark fw-bold')}
                style={{ textDecoration: 'none' }}
              >
                Directors
              </NavLink>
            </Nav.Link>
            <Nav.Link as="span" className="fw-bold">
              <NavLink
                to="/movies/genres"
                className={({ isActive }) => (isActive ? 'text-primary fw-bold' : 'text-dark fw-bold')}
                style={{ textDecoration: 'none' }}
              >
                Genres
              </NavLink>
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto align-items-center">
            <Navbar.Text className="me-3">
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="outline-primary"
                  id="dropdown-basic"
                  className="d-flex align-items-center rounded-pill px-3"
                >
                  Signed in as: <strong className="ms-2">{user.username}</strong>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to={`/users/${user.username}`}>
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-primary">
                    <strong>Logout</strong>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Navbar.Text>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
