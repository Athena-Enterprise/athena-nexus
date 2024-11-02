// frontend/src/components/PublicDocs.js

import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const PublicDocs = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = async () => {
    try {
      const response = await axios.get('/docs/public', { withCredentials: true });
      setDocs(response.data);
    } catch (error) {
      console.error('Error fetching public documentation:', error);
      toast.error('Failed to fetch documentation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  if (loading) {
    return <div>Loading Documentation...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Public Documentation</h2>
      {docs.length === 0 ? (
        <p>No public documentation available.</p>
      ) : (
        <ul className="list-disc list-inside">
          {docs.map((doc) => (
            <li key={doc.id}>
              <Link to={`/docs/${doc.id}`} className="text-blue-500 hover:underline">
                {doc.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PublicDocs;
