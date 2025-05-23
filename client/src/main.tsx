import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Configure error handling and boundaries
class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('React Error Boundary caught error:', error);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

// Configure HMR
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => {
    console.log('[vite] Hot Module Reload active');
  });
}

// Suppress iframe sandbox warnings from Vite dev server
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args[0];
  if (typeof message === 'string' && message.includes('allow-downloads-without-user-activation')) {
    // Silently ignore this Vite dev server sandbox warning
    return;
  }
  originalConsoleError.apply(console, args);
};

// Protection against nested iframe loading
function preventNestedLoading() {
  try {
    // Check if we're in an iframe
    if (window.self !== window.top) {
      // Get our current URL path
      const currentPath = window.location.href;
      
      // Check if the current URL already contains multiple hash routes
      // This indicates we're being loaded recursively
      if ((currentPath.match(/#/g) || []).length > 1) {
        console.error('Preventing recursive iframe loading');
        // Replace the content with a message instead of loading the app again
        document.body.innerHTML = '<div style="padding: 20px; text-align: center;">Loading main application...</div>';
        
        try {
          // Try to communicate with parent frame to fix the URL
          window.parent.postMessage({
            type: 'REDIRECT_TO_CLEAN_URL',
            url: `${currentPath.split('#')[0]}#${currentPath.split('#')[1] || ''}`
          }, '*');
        } catch (e) {
          console.error('Failed to communicate with parent frame', e);
        }
        
        return false; // Don't render the app
      }
    }
    return true; // Render the app normally
  } catch (e) {
    console.error('Error in iframe detection', e);
    return true; // If anything fails, render the app normally
  }
}

// Only render the app if we're not in a nested iframe situation
if (preventNestedLoading()) {
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  }
}
