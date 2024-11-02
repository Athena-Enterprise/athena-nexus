// frontend/src/components/DeveloperSection.js

import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeveloperSection = () => {
  const [commandName, setCommandName] = useState('');
  const [commandDescription, setCommandDescription] = useState('');
  const [commandCode, setCommandCode] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateCommand = async () => {
    if (!commandName || !commandDescription || !commandCode) {
      toast.warn('Please fill in all fields.');
      return;
    }

    setCreating(true);
    try {
      const response = await axios.post('/api/admin/commands', {
        name: commandName,
        description: commandDescription,
        code: commandCode,
      }, { withCredentials: true });
      toast.success('Command created successfully.');
      // Reset fields
      setCommandName('');
      setCommandDescription('');
      setCommandCode('');
    } catch (error) {
      console.error('Error creating command:', error);
      toast.error('Failed to create command.');
    } finally {
      setCreating(false);
    }
  };

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
          <span className="label-text">Command Code</span>
        </label>
        <CodeEditor
          language="javascript"
          value={commandCode}
          onChange={(value) => setCommandCode(value)}
        />
      </div>
      <button
        onClick={handleCreateCommand}
        className={`btn btn-primary ${creating ? 'loading' : ''}`}
        disabled={creating}
      >
        Create Command
      </button>
    </div>
  );
};

export default DeveloperSection;
