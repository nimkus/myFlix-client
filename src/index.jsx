import { createRoot } from 'react-dom/client';
import { MainView } from './components/main-view/main-view';

import './index.scss';
import Container from 'react-bootstrap/Container';

/**
 * MyFlixApplication is the root component of the application.
 * It serves as a wrapper around `MainView` and provides Bootstrap styling.
 *
 * @component
 * @returns {JSX.Element} The main application wrapped in a Bootstrap Container.
 */
const MyFlixApplication = () => {
  return (
    <Container className="pt-4">
      <MainView />
    </Container>
  );
};

/**
 * @constant {HTMLElement} container - The root DOM element where the app is mounted.
 */
const container = document.querySelector('#root');
/**
 * @constant {React.Root} root - The React root instance for rendering the application.
 */
const root = createRoot(container);

// Tells React to render your app in the root DOM element
root.render(<MyFlixApplication />);
