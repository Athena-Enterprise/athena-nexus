// frontend/src/components/CodeEditor.js

import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

const CodeEditor = ({ value, onChange, language = 'javascript' }) => {
  const handleChange = (value, viewUpdate) => {
    onChange(value);
  };

  let langExtension;
  if (language === 'javascript') {
    langExtension = javascript();
  }
  // Add more languages if needed

  return (
    <div className="border rounded">
      <CodeMirror
        value={value}
        height="200px"
        extensions={[langExtension]}
        onChange={handleChange}
      />
    </div>
  );
};

export default CodeEditor;
