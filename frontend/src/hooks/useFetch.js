// frontend/src/hooks/useFetch.js

import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await api.get(url, { withCredentials: true });
        setData(response.data);
      } catch (err) {
        console.error(`Error fetching ${url}:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url, user]);

  return { data, loading, error };
};

export default useFetch;
