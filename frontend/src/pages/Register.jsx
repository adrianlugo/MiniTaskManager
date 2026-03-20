import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import api from '../api';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});
    
    try {
      await api.post('/auth/register/', formData);
      // Login automático tras registro
      const loginResp = await api.post('/auth/login/', { username: formData.username, password: formData.password });
      onLogin(loginResp.data.access);
      navigate('/tasks');
    } catch (err) {
      if (err.response?.status === 400 && err.response.data) {
        setFieldErrors(err.response.data);
        setError('Por favor, corrige los errores en el formulario.');
      } else {
        setError('Algo salió mal con el registro. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderFieldError = (field) => {
    if (fieldErrors[field]) {
      return fieldErrors[field].map((msg, idx) => (
        <div key={idx} style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <AlertCircle size={12} />
          {msg}
        </div>
      ));
    }
    return null;
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card animate-fade-up">
        <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem', textAlign: 'center' }}>Empecemos</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>Regístrate para organizar tus tareas hoy mismo.</p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.9rem', borderLeft: '4px solid var(--danger)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }} size={20} />
              <input
                type="text"
                placeholder="Usuario"
                style={{ paddingLeft: '3rem', marginBottom: 0 }}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            {renderFieldError('username')}
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }} size={20} />
              <input
                type="email"
                placeholder="Correo electrónico"
                style={{ paddingLeft: '3rem', marginBottom: 0 }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            {renderFieldError('email')}
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }} size={20} />
              <input
                type="password"
                placeholder="Contraseña"
                style={{ paddingLeft: '3rem', marginBottom: 0 }}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            {renderFieldError('password')}
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Crear Cuenta'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
