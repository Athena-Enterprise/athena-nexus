// frontend/src/components/DeveloperSection.js

import React, { useState } from 'react';
import CodeEditor from '../utils/CodeEditor';
import useFetch from '../../hooks/useFetch';
import api from '../../services/api';
import { toast } from 'react-toastify';

const DeveloperSection = () => {
  const {
    data: features = [],
    loading,
    error,
  } = useFetch('/features');
  const [commandName, setCommandName] = useState('');
  const [commandDescription, setCommandDescription] = useState('');
  const [commandCode, setCommandCode] = useState('');
  const [featureId, setFeatureId] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleCreateCommand = async () => {
    if (!commandName || !commandDescription || !commandCode || !featureId) {
      toast.warn('Please fill in all fields.');
      return;
    }

    setLoadingSubmit(true);
    try {
      await api.post('/commands', {
        name: commandName,
        description: commandDescription,
        code: commandCode,
        featureId: featureId,
      });
      toast.success('Command created successfully.');
      setCommandName('');
      setCommandDescription('');
      setCommandCode('');
      setFeatureId('');
    } catch (error) {
      console.error('Error creating command:', error);
      toast.error('Failed to create command.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading Developer Section...</div>;
  }

  if (error) {
    toast.error('Failed to fetch features.');
    return <div className="text-center text-error">Error loading features.</div>;
  }

  return (
    <div className="pt-20 shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Developer Section</h2>
      <div className="mb-4">
        <label className="label">
          <span className="label-text">Command Name</span>
        </label>
        <input
          type="text"
          value={commandName}
          onChange={(e) => setCommandName(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Enter command name"
        />
      </div>
      <div className="mb-4">
        <label className="label">
          <span className="label-text">Command Description</span>
        </label>
        <textarea
          value={commandDescription}
          onChange={(e) => setCommandDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
          placeholder="Enter command description"
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="label">
          <span className="label-text">Feature</span>
        </label>
        <select
          value={featureId}
          onChange={(e) => setFeatureId(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="">Select Feature</option>
          {features.map((feature) => (
            <option key={feature.id} value={feature.id}>
              {feature.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <CodeEditor
          language="javascript"
          value={commandCode}
          onChange={(value) => setCommandCode(value)}
        />
      </div>
      <button
        onClick={handleCreateCommand}
        className={`btn btn-primary ${loadingSubmit ? 'loading' : ''}`}
        disabled={loadingSubmit}
      >
        Create Command
      </button>
    </div>
  );
};

export default DeveloperSection;