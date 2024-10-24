import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, Dropdown } from 'react-bootstrap';

export const NavBar = ({ user, onLogout }) => {
  const navigate = useNavigate();

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
            <Nav.Link as={Link} to="/" className="fw-bold">
              Movies
            </Nav.Link>
            <Nav.Link as={Link} to="/movies/directors" className="fw-bold">
              Directors
            </Nav.Link>
            <Nav.Link as={Link} to="/movies/genres" className="fw-bold">
              Genres
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
                  <Dropdown.Divider /> {/* Bootstrap-style divider */}
                  <Dropdown.Item onClick={handleLogout} className="text-primary">
                    <strong>Logout</strong> {/* Stronger font for emphasis */}
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
