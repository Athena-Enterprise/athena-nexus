// frontend/src/components/DocEditor.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const DocEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      // Redirect non-admin users
      navigate('/admin');
      return;
    }

    if (id) {
      fetchDocument();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const fetchDocument = async () => {
    try {
      const response = await api.get(`/docs/${id}`);
      setTitle(response.data.title);
      setContent(response.data.content);
      setIsPublic(response.data.isPublic);
    } catch (error) {
      console.error('Error fetching document:', error);
      toast.error('Failed to fetch document');
    }
  };

  const handleSave = async () => {
    try {
      if (!title.trim()) {
        toast.error('Title cannot be empty.');
        return;
      }

      if (!content.trim()) {
        toast.error('Content cannot be empty.');
        return;
      }

      if (id) {
        await api.put(`/docs/${id}`, { title, content, isPublic });
        toast.success('Document updated successfully');
      } else {
        await api.post('/docs', { title, content, isPublic });
        toast.success('Document created successfully');
      }
      navigate('/admin/docs');
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Failed to save document');
    }
  };

  return (
    <div className="shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {id ? 'Edit Document' : 'Create Document'}
      </h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>
      <div className="mb-4">
        <ReactQuill
          value={content}
          onChange={setContent}
          placeholder="Write your documentation here..."
          modules={{
            toolbar: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
              ['link', 'image'],
              ['clean']
            ],
          }}
          formats={[
            'header',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image'
          ]}
        />
      </div>
      {/* Toggle for public visibility */}
      <div className="mb-4 form-control">
        <label className="cursor-pointer label">
          <span className="label-text">Make Public</span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
        </label>
      </div>
      <button onClick={handleSave} className="btn btn-primary">
        Save
      </button>
    </div>
  );
};

export default DocEditor;
