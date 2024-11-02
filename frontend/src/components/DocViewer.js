// frontend/src/components/DocViewer.js

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';

const DocViewer = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      // Redirect non-admin users
      navigate('/admin');
      return;
    }
    fetchDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const fetchDocument = async () => {
    try {
      const response = await api.get(`/docs/${id}`);
      setDocument(response.data);
    } catch (error) {
      console.error('Error fetching document:', error);
      toast.error('Failed to fetch document');
    }
  };

  if (!document) {
    return <div>Loading...</div>;
  }

  return (
    <div className="shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">{document.title}</h2>
      <ReactMarkdown>{document.content}</ReactMarkdown>
      <div className="mt-4">
        <Link to={`/admin/docs/edit/${id}`} className="btn btn-primary mr-2">
          Edit Document
        </Link>
        <Link to="/admin/docs" className="btn btn-secondary">
          Back to Documentation
        </Link>
      </div>
    </div>
  );
};

export default DocViewer;
