// frontend/src/components/common/ErrorBoundary.js

import React from 'react';
import { toast } from 'react-toastify';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to display fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log the error
    console.error('ErrorBoundary caught an error:', error, info);
    toast.error('Something went wrong!');
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return <h1 className="text-center mt-20 text-2xl">Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
