// frontend/src/components/DocsSection.js

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const DocsSection = () => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 10; // Number of docs per page
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDocuments = async (search = '') => {
    try {
      const response = await api.get('/docs', { params: { isPublic: 'false', search } }); // Fetch admin-only docs
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };
  
  // Update the useEffect and search handler
  useEffect(() => {
    if (searchTerm.trim() === '') {
      fetchDocuments();
    } else {
      fetchDocuments(searchTerm);
    }
  }, [searchTerm]);

  // Filter documents based on search term (already handled by backend)
  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredDocuments.length / docsPerPage);

  // Get current page documents
  const indexOfLastDoc = currentPage * docsPerPage;
  const indexOfFirstDoc = indexOfLastDoc - docsPerPage;
  const currentDocs = filteredDocuments.slice(indexOfFirstDoc, indexOfLastDoc);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCreate = () => {
    navigate('/admin/docs/create');
  };

  return (
    <div className="pt-20 shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Documentation</h2>
        <button onClick={handleCreate} className="btn btn-primary">
          Create New Document
        </button>
      </div>
      <input
        type="text"
        placeholder="Search Documentation..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input input-bordered w-full mb-4"
      />
      <ul>
        {currentDocs.map((doc) => (
          <li key={doc.id} className="mb-2 flex justify-between items-center">
            <Link to={`/admin/docs/view/${doc.id}`} className="text-blue-500 hover:underline">
              {doc.title}
            </Link>
            <div>
              <Link to={`/admin/docs/edit/${doc.id}`} className="btn btn-sm btn-secondary mr-2">
                Edit
              </Link>
              {/* Optionally, add a delete button */}
            </div>
          </li>
        ))}
        {currentDocs.length === 0 && <li>No documents found.</li>}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <nav>
            <ul className="inline-flex items-center -space-x-px">
              {[...Array(totalPages)].map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-2 leading-tight ${
                      currentPage === index + 1
                        ? 'text-blue-600 bg-blue-50 border border-blue-300'
                        : 'text-gray-500 bg-white border border-gray-300'
                    } hover:bg-gray-100 hover:text-gray-700`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default DocsSection;
