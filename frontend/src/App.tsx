import React, { useState, useEffect } from 'react';
import './App.css';

interface Item {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

const App: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'tasks', label: 'Tasks', icon: '✓' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="app">
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">{!isCollapsed && 'My App'}</h2>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
              onClick={() => setActiveItem(item.id)}
              title={isCollapsed ? item.label : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              {!isCollapsed && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" title={isCollapsed ? 'Help' : ''}>
            <span className="nav-icon">❓</span>
            {!isCollapsed && <span className="nav-label">Help</span>}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <h1>{menuItems.find(item => item.id === activeItem)?.label}</h1>
        </header>

        <div className="content-body">
          <div className="card">
            <h3>Welcome to {menuItems.find(item => item.id === activeItem)?.label}</h3>
            <p>This is a demo app with TypeScript frontend and Go backend.</p>
          </div>

          {activeItem === 'dashboard' && (
            <div className="card">
              <h3>Items from Go Backend</h3>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="items-grid">
                  {items.map((item) => (
                    <div key={item.id} className="item-card">
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                      <small>Created: {new Date(item.createdAt).toLocaleDateString()}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="card">
            <h3>Features</h3>
            <ul>
              <li>✨ Collapsible sidebar menu</li>
              <li>🚀 TypeScript + React frontend</li>
              <li>⚡ Go backend with REST API</li>
              <li>🎨 Modern, responsive design</li>
              <li>🔄 Real-time data fetching</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
