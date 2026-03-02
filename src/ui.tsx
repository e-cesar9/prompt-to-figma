import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [activeTab, setActiveTab] = useState<'system' | 'screen' | 'code' | 'settings'>('system');
  const [apiKey, setApiKey] = useState('');
  const [aiProvider, setAiProvider] = useState<'anthropic' | 'openai' | 'deepseek'>('anthropic');
  const [brief, setBrief] = useState('');
  const [screenPrompt, setScreenPrompt] = useState('');
  const [codeFormat, setCodeFormat] = useState<'react' | 'vue' | 'html'>('react');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [generatedCode, setGeneratedCode] = useState('');
  const [progressStep, setProgressStep] = useState(0);
  const [progressTotal, setProgressTotal] = useState(0);

  // Load saved API key on mount
  useEffect(() => {
    // Request saved settings from plugin backend
    parent.postMessage({ pluginMessage: { type: 'get-settings' } }, '*');
  }, []);

  // Listen to messages from plugin backend
  useEffect(() => {
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      if (!msg) return;

      if (msg.type === 'settings') {
        // Received saved settings
        setApiKey(msg.apiKey || '');
        setAiProvider(msg.provider || 'anthropic');
      } else if (msg.type === 'progress') {
        // Progressive creation updates
        console.log('🔥 PROGRESS:', msg.message, `${msg.step}/${msg.total}`);
        setLoading(true);
        setMessage(msg.message);
        setMessageType('info');
        setProgressStep(msg.step || 0);
        setProgressTotal(msg.total || 0);
      } else if (msg.type === 'loading') {
        setLoading(true);
        setMessage(msg.message);
        setMessageType('info');
        setProgressStep(0);
        setProgressTotal(0);
      } else if (msg.type === 'success') {
        setLoading(false);
        setMessage(msg.message);
        setMessageType('success');
        setProgressStep(0);
        setProgressTotal(0);
        setTimeout(() => setMessage(''), 3000);
      } else if (msg.type === 'error') {
        setLoading(false);
        setMessage(`${msg.message}`);
        setMessageType('error');
        setProgressStep(0);
        setProgressTotal(0);
      } else if (msg.type === 'code-generated') {
        setLoading(false);
        setGeneratedCode(msg.code);
        setMessage('Code generated! ✨');
        setMessageType('success');
      }
    };
  }, []);

  const saveApiKey = () => {
    // Send settings to plugin backend for storage
    parent.postMessage({ 
      pluginMessage: { 
        type: 'save-settings',
        apiKey,
        provider: aiProvider
      } 
    }, '*');
    setMessage('API key saved! 🔐');
    setMessageType('success');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleGenerateSystem = () => {
    if (!apiKey.trim()) {
      setMessage('Please add your API key in Settings first');
      setMessageType('error');
      setActiveTab('settings');
      return;
    }
    if (!brief.trim()) {
      setMessage('Please enter a brief');
      setMessageType('error');
      return;
    }
    parent.postMessage({ 
      pluginMessage: { 
        type: 'generate-system', 
        brief,
        apiKey,
        provider: aiProvider
      } 
    }, '*');
  };

  const handleGenerateScreen = () => {
    if (!apiKey.trim()) {
      setMessage('Please add your API key in Settings first');
      setMessageType('error');
      setActiveTab('settings');
      return;
    }
    if (!screenPrompt.trim()) {
      setMessage('Please enter a screen description');
      setMessageType('error');
      return;
    }
    parent.postMessage({ 
      pluginMessage: { 
        type: 'generate-screen', 
        prompt: screenPrompt,
        apiKey,
        provider: aiProvider
      } 
    }, '*');
  };

  const handleExportCode = () => {
    parent.postMessage({ pluginMessage: { type: 'export-code', format: codeFormat } }, '*');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setMessage('Code copied! 📋');
    setMessageType('success');
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
          🎨 System
        </button>
        <button
          className={`tab ${activeTab === 'screen' ? 'active' : ''}`}
          onClick={() => setActiveTab('screen')}
        >
          📱 Screen
        </button>
        <button
          className={`tab ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          💻 Code
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Content */}
      <div className="content">
        {activeTab === 'settings' && (
          <div className="section">
            <h2>⚙️ API Settings</h2>
            <p className="description">
              Connect your AI provider to start generating designs.
            </p>

            <div className="form-group">
              <label className="label">AI Provider</label>
              <div className="provider-selector">
                <button
                  className={`provider-btn ${aiProvider === 'anthropic' ? 'active' : ''}`}
                  onClick={() => setAiProvider('anthropic')}
                >
                  🧠 Sonnet 4.5
                </button>
                <button
                  className={`provider-btn ${aiProvider === 'openai' ? 'active' : ''}`}
                  onClick={() => setAiProvider('openai')}
                >
                  🤖 GPT-5.2
                </button>
                <button
                  className={`provider-btn ${aiProvider === 'deepseek' ? 'active' : ''}`}
                  onClick={() => setAiProvider('deepseek')}
                >
                  🚀 DeepSeek
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="label">
                {aiProvider === 'anthropic' ? 'Anthropic API Key' : 
                 aiProvider === 'openai' ? 'OpenAI API Key' : 
                 'DeepSeek API Key'}
              </label>
              <input
                type="password"
                className="input"
                placeholder={aiProvider === 'anthropic' ? 'sk-ant-...' : 
                             aiProvider === 'openai' ? 'sk-...' : 
                             'sk-...'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="help-text">
                {aiProvider === 'anthropic' 
                  ? 'Get your key at console.anthropic.com'
                  : aiProvider === 'openai'
                  ? 'Get your key at platform.openai.com'
                  : 'Get your key at platform.deepseek.com'}
              </p>
            </div>

            <button className="button primary" onClick={saveApiKey}>
              💾 Save Settings
            </button>

            {apiKey && (
              <div className="status-badge success">
                ✓ API key configured
              </div>
            )}
          </div>
        )}

        {activeTab === 'system' && (
          <div className="section">
            <h2>Generate Design System</h2>
            <p className="description">
              Describe your project and AI will create a complete design system with colors,
              typography, spacing, and components.
            </p>

            <textarea
              className="textarea"
              placeholder="Example: Modern fintech app, trustworthy and professional, target millennials, blue and green colors preferred"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={6}
              disabled={loading}
            />

            <button className="button primary" onClick={handleGenerateSystem} disabled={loading}>
              {loading ? '⏳ Generating...' : '✨ Generate Design System'}
            </button>

            <div className="examples">
              <p className="examples-title">Quick examples:</p>
              <button
                className="example-chip"
                onClick={() =>
                  setBrief('Modern e-commerce platform, vibrant and energetic, Gen Z audience, bold typography')
                }
              >
                E-commerce
              </button>
              <button
                className="example-chip"
                onClick={() => setBrief('Healthcare app, calm and reassuring, elderly users, accessible design')}
              >
                Healthcare
              </button>
              <button
                className="example-chip"
                onClick={() => setBrief('Gaming dashboard, dark mode, neon accents, competitive, futuristic')}
              >
                Gaming
              </button>
              <button
                className="example-chip"
                onClick={() => setBrief('SaaS B2B platform, professional, clean, minimalist, productivity focused')}
              >
                SaaS
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
              placeholder="Example: Create a login screen with email, password fields, forgot password link, and a sign-in button with social auth options"
              value={screenPrompt}
              onChange={(e) => setScreenPrompt(e.target.value)}
              rows={6}
              disabled={loading}
            />

            <button className="button primary" onClick={handleGenerateScreen} disabled={loading}>
              {loading ? '⏳ Generating...' : '🎨 Generate Screen'}
            </button>

            <div className="examples">
              <p className="examples-title">Quick examples:</p>
              <button
                className="example-chip"
                onClick={() => setScreenPrompt('Login screen with email, password, social auth buttons, and forgot password link')}
              >
                Login
              </button>
              <button
                className="example-chip"
                onClick={() =>
                  setScreenPrompt('Dashboard with 4 stats cards at top, main chart in center, recent activity list on the right')
                }
              >
                Dashboard
              </button>
              <button
                className="example-chip"
                onClick={() => setScreenPrompt('User profile settings with avatar upload, name/email form, notification toggles')}
              >
                Settings
              </button>
              <button
                className="example-chip"
                onClick={() => setScreenPrompt('Product listing page with search bar, filter sidebar, grid of product cards with images')}
              >
                Products
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
      {message && (
        <div className={`message ${messageType}`}>
          <div className="message-text">{message}</div>
          {progressTotal > 0 && (
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(progressStep / progressTotal) * 100}%` }}
                />
              </div>
              <div className="progress-text">{progressStep} / {progressTotal}</div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          Made with ❤️ by Rico • <span className="badge">v1.1</span>
        </p>
      </footer>
    </div>
  );
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function initApp() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found!');
    document.body.innerHTML = '<div style="padding: 20px; color: red;">Error: Root element not found</div>';
    return;
  }
  
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
