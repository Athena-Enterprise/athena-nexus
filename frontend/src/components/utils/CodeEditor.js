// frontend/src/components/utils/CodeEditor.js

import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';

const CodeEditor = ({ language, value, onChange, readOnly = false, height = '200px' }) => {
  const handleEditorChange = (value) => {
    if (!readOnly && onChange) {
      onChange(value);
    }
  };

  return (
    <div style={{ height }}>
      <CodeMirror
        value={value}
        height={height}
        extensions={[javascript()]}
        theme={githubLight}
        onChange={handleEditorChange}
        readOnly={readOnly}
      />
    </div>
  );
};

export default CodeEditor;
