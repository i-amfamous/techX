import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Import order matters. base.css sets shared defaults; component CSS (imported
// from App's tree) must come after it so section styles can override them.
import './styles/base.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
