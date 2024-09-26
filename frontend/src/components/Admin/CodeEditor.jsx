import React, { useState } from 'react';

import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import '../../App.css';

function CodeEditor() {
  
  const [language, setLanguage] = useState('.js');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');
  const [input, setInput] = useState('');
  const [code, setCode] = useState({
    '.js': '',
    '.py': '',
    '.java': '',
    '.cpp': '',
    '.c': '',
  });

  const languageMode = {
    '.js': javascript(),
    '.py': python(),
    '.java': java(),
    '.cpp': cpp(),
    '.c': cpp(),
  };

  const runCode = async () => {
    const currentCode = code[language];
    try {
      const response = await axios.post('http://localhost:5000/run', {
        language,
        code: currentCode,
        fileName,
        input
      });
      setOutput(response.data.output);
    } catch (error) {
      console.error('Error running code:', error.response || error.message);
      setOutput('Error running code.');
    }
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
  };

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleCodeChange = (value) => {
    setCode(prevCode => ({
      ...prevCode,
      [language]: value
    }));
  };

  return (
    <div className="code-space-container">
      <div className="editor-section">
        <h3>Code Editor</h3>
        <div className="language-selection">
          <label>Select Language:</label>
          <select value={language} onChange={handleLanguageChange}>
            <option value=".js">JavaScript</option>
            <option value=".py">Python</option>
            <option value=".java">Java</option>
            <option value=".cpp">C++</option>
            <option value=".c">C</option>
          </select>
        </div>
        <div>
          <label>File Name:</label>
          <input type="text" value={fileName} onChange={handleFileNameChange} placeholder="Enter file name" />
        </div>
        <CodeMirror
          value={code[language]}
          height="500px"
          extensions={[languageMode[language]]}
          theme={oneDark}
          onChange={handleCodeChange}
        />
      </div>

      <div className="io-section">
        <div className="input-section">
          <h3>Input</h3>
          <textarea
            className="input-box"
            value={input}
            onChange={handleInputChange}
            placeholder="Enter input"
          />
        </div>
        <button className="run-button" onClick={runCode}>Run Code</button>
        <div className="output-section">
          <h3>Output</h3>
          <pre className="output-box">{output}</pre>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
