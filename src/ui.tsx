import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './ui.css';

function App() {
  const [activeTab, setActiveTab] = useState<'system' | 'screen' | 'code'>('system');
  const [brief, setBrief] = useState('');
  const [screenPrompt, setScreenPrompt] = useState('');
  const [codeFormat, setCodeFormat] = useState<'react' | 'vue' | 'html'>('react');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  // Listen to messages from plugin backend
  React.useEffect(() => {
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;

      if (msg.type === 'loading') {
        setLoading(true);
        setMessage(msg.message);
      } else if (msg.type === 'success') {
        setLoading(false);
        setMessage(msg.message);
        setTimeout(() => setMessage(''), 3000);
      } else if (msg.type === 'error') {
        setLoading(false);
        setMessage(`Error: ${msg.message}`);
      } else if (msg.type === 'code-generated') {
        setLoading(false);
        setGeneratedCode(msg.code);
        setMessage('Code generated! ✨');
      }
    };
  }, []);

  const handleGenerateSystem = () => {
    if (!brief.trim()) {
      setMessage('Please enter a brief');
      return;
    }
    parent.postMessage({ pluginMessage: { type: 'generate-system', brief } }, '*');
  };

  const handleGenerateScreen = () => {
    if (!screenPrompt.trim()) {
      setMessage('Please enter a screen description');
      return;
    }
    parent.postMessage({ pluginMessage: { type: 'generate-screen', prompt: screenPrompt } }, '*');
  };

  const handleExportCode = () => {
    parent.postMessage({ pluginMessage: { type: 'export-code', format: codeFormat } }, '*');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setMessage('Code copied! 📋');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🤖 DesignAI</h1>
        <p className="subtitle">AI-Powered Design System & Code Generator</p>
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          🎨 Design System
        </button>
        <button
          className={`tab ${activeTab === 'screen' ? 'active' : ''}`}
          onClick={() => setActiveTab('screen')}
        >
          📱 Generate Screen
        </button>
        <button
          className={`tab ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          💻 Export Code
        </button>
      </div>

      {/* Content */}
      <div className="content">
        {activeTab === 'system' && (
          <div className="section">
            <h2>Generate Design System</h2>
            <p className="description">
              Describe your project and AI will create a complete design system with colors,
              typography, spacing, and components.
            </p>

            <textarea
              className="textarea"
              placeholder="Example: Modern fintech app, trustworthy and professional, target millennials"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={6}
              disabled={loading}
            />

            <button className="button primary" onClick={handleGenerateSystem} disabled={loading}>
              {loading ? '⏳ Generating...' : '✨ Generate Design System'}
            </button>

            <div className="examples">
              <p className="examples-title">Examples:</p>
              <button
                className="example-chip"
                onClick={() =>
                  setBrief('Modern e-commerce platform, vibrant and energetic, Gen Z audience')
                }
              >
                E-commerce
              </button>
              <button
                className="example-chip"
                onClick={() => setBrief('Healthcare app, calm and reassuring, elderly users')}
              >
                Healthcare
              </button>
              <button
                className="example-chip"
                onClick={() => setBrief('Gaming dashboard, dark mode, neon accents, competitive')}
              >
                Gaming
              </button>
            </div>
          </div>
        )}

        {activeTab === 'screen' && (
          <div className="section">
            <h2>Generate Screen</h2>
            <p className="description">
              Describe the screen you want and AI will create the full layout with components.
            </p>

            <textarea
              className="textarea"
              placeholder="Example: Create a login screen with email, password fields, and a sign-in button"
              value={screenPrompt}
              onChange={(e) => setScreenPrompt(e.target.value)}
              rows={6}
              disabled={loading}
            />

            <button className="button primary" onClick={handleGenerateScreen} disabled={loading}>
              {loading ? '⏳ Generating...' : '🎨 Generate Screen'}
            </button>

            <div className="examples">
              <p className="examples-title">Examples:</p>
              <button
                className="example-chip"
                onClick={() => setScreenPrompt('Login screen with social auth buttons')}
              >
                Login
              </button>
              <button
                className="example-chip"
                onClick={() =>
                  setScreenPrompt('Dashboard with stats cards, chart, and activity feed')
                }
              >
                Dashboard
              </button>
              <button
                className="example-chip"
                onClick={() => setScreenPrompt('Profile settings screen with avatar and form')}
              >
                Settings
              </button>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="section">
            <h2>Export to Code</h2>
            <p className="description">
              Select a frame in Figma, then export it to React, Vue, or HTML code.
            </p>

            <div className="format-selector">
              <label className="radio-label">
                <input
                  type="radio"
                  name="format"
                  value="react"
                  checked={codeFormat === 'react'}
                  onChange={() => setCodeFormat('react')}
                />
                <span>⚛️ React</span>
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  name="format"
                  value="vue"
                  checked={codeFormat === 'vue'}
                  onChange={() => setCodeFormat('vue')}
                />
                <span>🌿 Vue</span>
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  name="format"
                  value="html"
                  checked={codeFormat === 'html'}
                  onChange={() => setCodeFormat('html')}
                />
                <span>📄 HTML</span>
              </label>
            </div>

            <button className="button primary" onClick={handleExportCode} disabled={loading}>
              {loading ? '⏳ Exporting...' : '💻 Export Code'}
            </button>

            {generatedCode && (
              <div className="code-output">
                <div className="code-header">
                  <span>Generated Code</span>
                  <button className="copy-button" onClick={copyCode}>
                    📋 Copy
                  </button>
                </div>
                <pre className="code-block">{generatedCode}</pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Message */}
      {message && <div className="message">{message}</div>}

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          Made with ❤️ by Rico • <span className="badge">Free MVP</span>
        </p>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
