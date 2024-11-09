// frontend/src/hooks/useFetch.js

import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(options.initialData || null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(!options.skipInitialLoading);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If the hook is set to skip initial loading or user is not authenticated
    if (options.skipInitialLoading || (options.requiresAuth && !user)) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      console.log(`Fetching URL: ${url}`); // Logging line
      try {
        const response = await api.get(url, {
          withCredentials: true,
          signal, // Attach the signal to allow request cancellation
          ...options.fetchOptions, // Spread any additional fetch options
        });
        setData(response.data);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error(`Error fetching ${url}:`, err);
          setError(err.response?.data || err.message || 'An error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to cancel the request if the component unmounts
    return () => {
      controller.abort();
    };
  }, [url, user, options.skipInitialLoading, options.requiresAuth, options.fetchOptions]);

  return { data, loading, error };
};

export default useFetch;
