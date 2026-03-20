import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LogOut, Layout, User as UserIcon, Loader2 } from 'lucide-react';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import api from './api';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// Main Layout with Dynamic Header
const MainLayout = ({ children, onLogout, user }) => (
  <div className="app-container">
    <nav className="glass-card animate-fade-in" style={{ 
      marginBottom: '2rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '1rem 2rem' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '1.25rem' }}>
        <Layout className="text-primary" size={24} style={{ color: 'var(--primary)' }} />
        <span>MiniTask Manager</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <UserIcon size={18} />
            <span>Hola, <strong style={{ color: 'var(--text)' }}>{user.username}</strong></span>
          </div>
        )}
        <button onClick={onLogout} className="btn-icon" style={{ padding: '0.5rem 0.8rem', gap: '0.4rem' }}>
          <LogOut size={18} />
          <span style={{ fontSize: '0.9rem' }}>Salir</span>
        </button>
      </div>
    </nav>
    <main className="animate-fade-up">
      {children}
    </main>
  </div>
);

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me/');
      setUser(response.data);
    } catch (err) {
      console.error("No se pudo obtener el perfil", err);
      // Si falla obtener el usuario, probablemente el token no sirve
      if (err.response?.status === 401) handleLogout();
    }
  };

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/tasks" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={token ? <Navigate to="/tasks" /> : <Register onLogin={handleLogin} />} />
        
        <Route 
          path="/tasks" 
          element={
            <ProtectedRoute>
              <MainLayout onLogout={handleLogout} user={user}>
                <Tasks />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/tasks" />} />
      </Routes>
    </Router>
  );
}

export default App;
