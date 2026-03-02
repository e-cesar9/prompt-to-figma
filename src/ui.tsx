import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// Simple icon component
const Icon = ({ name, size = 16 }: { name: string; size?: number }) => {
  const icons: Record<string, JSX.Element> = {
    palette: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5"/>
        <circle cx="17.5" cy="10.5" r=".5"/>
        <circle cx="8.5" cy="7.5" r=".5"/>
        <circle cx="6.5" cy="12.5" r=".5"/>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
      </svg>
    ),
    smartphone: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    code: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    settings: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6m0 6v6m6-12l-5.2 3M7.2 15L2 18m10-8l-5.2 3M20 6l-5.2 3m0 6L20 18M7.2 9L2 6"/>
      </svg>
    ),
    brain: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
      </svg>
    ),
    zap: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    sparkles: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        <path d="M5 3v4"/>
        <path d="M19 17v4"/>
        <path d="M3 5h4"/>
        <path d="M17 19h4"/>
      </svg>
    ),
    layers: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    react: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="1.5"/>
        <path d="M12 8.5c3.5 0 6.5-1 6.5-2s-3-2-6.5-2-6.5 1-6.5 2 3 2 6.5 2z" fill="none" stroke="currentColor" strokeWidth="1"/>
        <ellipse cx="12" cy="12" rx="11" ry="4" fill="none" stroke="currentColor" strokeWidth="1"/>
        <ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(60 12 12)" fill="none" stroke="currentColor" strokeWidth="1"/>
        <ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(120 12 12)" fill="none" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    vue: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 3h4l6 10 6-10h4L12 21 2 3z"/>
        <path d="M6 3l6 10 6-10h-3l-3 5-3-5H6z" fill="none" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    html: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 3l2 18 6 2 6-2 2-18H4z"/>
        <path d="M7 7h10l-1 9-4 1-4-1-0.3-3h2l0.1 1.5 2.2 0.7 2.2-0.7L16 11H8l-0.5-4h9"/>
      </svg>
    ),
  };
  
  return <span style={{ display: 'inline-flex', verticalAlign: 'middle', marginRight: '6px' }}>{icons[name] || icons.sparkles}</span>;
};

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
  const [availableSystems, setAvailableSystems] = useState<Array<{name: string}>>([]);
  const [selectedSystem, setSelectedSystem] = useState('');

  // Load saved API key and design systems on mount
  useEffect(() => {
    // Request saved settings from plugin backend
    parent.postMessage({ pluginMessage: { type: 'get-settings' } }, '*');
    // Request available design systems
    parent.postMessage({ pluginMessage: { type: 'get-design-systems' } }, '*');
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
      } else if (msg.type === 'design-systems') {
        // Received available design systems
        setAvailableSystems(msg.systems || []);
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
        setMessage('Code generated!');
        setMessageType('success');
      } else if (msg.type === 'code-stream-start') {
        setLoading(true);
        setGeneratedCode('');
        setMessage('Analyzing design with AI...');
        setMessageType('info');
      } else if (msg.type === 'code-chunk') {
        setGeneratedCode((prev) => prev + msg.chunk);
      } else if (msg.type === 'code-stream-end') {
        setLoading(false);
        setMessage('Code generated!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
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
        provider: aiProvider,
        designSystem: selectedSystem || null
      } 
    }, '*');
  };

  const handleExportCode = () => {
    parent.postMessage({ 
      pluginMessage: { 
        type: 'export-code', 
        format: codeFormat
      } 
    }, '*');
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
        <h1>
          Prompt, Design, Code
        </h1>
        <p className="subtitle">Design, generated, coded.</p>
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          <Icon name="palette" size={16} />
          System
        </button>
        <button
          className={`tab ${activeTab === 'screen' ? 'active' : ''}`}
          onClick={() => setActiveTab('screen')}
        >
          <Icon name="smartphone" size={16} />
          Screen
        </button>
        <button
          className={`tab ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          <Icon name="code" size={16} />
          Code
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Icon name="settings" size={16} />
          Settings
        </button>
        <div 
          className="tab-indicator" 
          style={{
            transform: `translateX(${
              activeTab === 'system' ? '0%' : 
              activeTab === 'screen' ? '100%' : 
              activeTab === 'code' ? '200%' : '300%'
            })`
          }}
        />
      </div>

      {/* Content */}
      <div className="content">
        {activeTab === 'settings' && (
          <div className="section">
            <h2>API Settings</h2>
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
                  <Icon name="brain" size={14} />
                  Sonnet 4.5
                </button>
                <button
                  className={`provider-btn ${aiProvider === 'openai' ? 'active' : ''}`}
                  onClick={() => setAiProvider('openai')}
                >
                  <Icon name="zap" size={14} />
                  GPT-5.2
                </button>
                <button
                  className={`provider-btn ${aiProvider === 'deepseek' ? 'active' : ''}`}
                  onClick={() => setAiProvider('deepseek')}
                >
                  <Icon name="brain" size={14} />
                  DeepSeek R1
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
              Save Settings
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
              Describe your project and AI will create a complete, WCAG AA compliant design system with colors,
              typography, spacing, and components. Be specific about industry, audience, and brand personality.
            </p>

            <textarea
              className="textarea"
              placeholder="Example: Modern fintech app for millennials. Trustworthy and professional feel. Use Inter font. Primary color blue (#0066CC preferred), secondary green. Clean, minimalist aesthetic. WCAG AA compliant."
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={6}
              disabled={loading}
            />

            <button className="button primary" onClick={handleGenerateSystem} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Design System'}
            </button>

            <div className="examples">
              <p className="examples-title">Pro examples (detailed prompts = better results):</p>
              <button
                className="example-chip"
                onClick={() =>
                  setBrief('Modern e-commerce platform for Gen Z. Vibrant, energetic, playful. Use Poppins font. Primary coral pink (#FF6B6B), secondary yellow (#FFD93D). Bold typography, rounded corners. Instagram-inspired aesthetic. High contrast for accessibility.')
                }
              >
                E-commerce
              </button>
              <button
                className="example-chip"
                onClick={() => setBrief('Healthcare telemedicine app for elderly users (65+). Calm, reassuring, trustworthy. Use Inter font with minimum 16px body text. Primary blue (#0066CC), secondary green (#10B981). Large touch targets, AAA contrast. Simple, clear design.')}
              >
                Healthcare
              </button>
              <button
                className="example-chip"
                onClick={() => setBrief('Competitive gaming dashboard. Dark mode first. Neon purple (#A855F7) and cyan (#06B6D4) accents on dark background (#0F172A). Futuristic, tech-forward. Sharp angles, glowing effects. Monospace font for stats. High energy.')}
              >
                Gaming
              </button>
              <button
                className="example-chip"
                onClick={() => setBrief('B2B SaaS productivity platform for enterprise. Professional, trustworthy, minimalist. Use Inter font. Primary indigo (#4F46E5), neutral grays. Clean, spacious layouts. Focus on readability and data density. Notion/Linear inspired.')}
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

            <div className="form-group">
              <label className="label">Design System (optional)</label>
              <select 
                className="select" 
                value={selectedSystem} 
                onChange={(e) => setSelectedSystem(e.target.value)}
                disabled={loading}
              >
                <option value="">None (default colors)</option>
                {availableSystems.map(sys => (
                  <option key={sys.name} value={sys.name}>{sys.name}</option>
                ))}
              </select>
              <p className="hint">Choose a design system to use its colors, typography, and spacing</p>
            </div>

            <textarea
              className="textarea"
              placeholder="Example: Create a login screen with email, password fields, forgot password link, and a sign-in button with social auth options"
              value={screenPrompt}
              onChange={(e) => setScreenPrompt(e.target.value)}
              rows={6}
              disabled={loading}
            />

            <button className="button primary" onClick={handleGenerateScreen} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Screen'}
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
              {apiKey.trim() 
                ? ' AI semantic detection enabled (button, input, form, h1-h6, etc.)' 
                : ' Using fast mode (configure API key in Settings for AI semantic detection).'}
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
                <span><Icon name="react" size={14} />React</span>
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  name="format"
                  value="vue"
                  checked={codeFormat === 'vue'}
                  onChange={() => setCodeFormat('vue')}
                />
                <span><Icon name="vue" size={14} />Vue</span>
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  name="format"
                  value="html"
                  checked={codeFormat === 'html'}
                  onChange={() => setCodeFormat('html')}
                />
                <span><Icon name="html" size={14} />HTML</span>
              </label>
            </div>

            <button className="button primary" onClick={handleExportCode} disabled={loading}>
              {loading ? 'Exporting...' : 'Export Code'}
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
          {loading && progressTotal === 0 && (
            <div className="splinter" title="Splinter is thinking...">🐀</div>
          )}
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
          Prompt to Design, to Code • <span className="badge">v2.0</span> • Design, generated, coded.
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
