import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, CheckCircle, Circle, Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import api from '../api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [search, setSearch] = useState('');
  const [addingTask, setAddingTask] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [search]);

  const fetchTasks = async () => {
    setError('');
    try {
      const response = await api.get(`/api/tasks/?search=${search}`);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks', err);
      setError('No se pudieron cargar las tareas. Verifica la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    
    setAddingTask(true);
    setError('');
    
    try {
      const response = await api.post('/api/tasks/', newTask);
      setTasks([response.data, ...tasks]);
      setNewTask({ title: '', description: '' });
    } catch (err) {
      console.error('Error creating task', err);
      setError('Error al crear la tarea. Reintente por favor.');
    } finally {
      setAddingTask(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const response = await api.post(`/api/tasks/${id}/toggle/`);
      setTasks(tasks.map(t => t.id === id ? response.data : t));
    } catch (err) {
      console.error('Error status toggle', err);
      setError('Error al actualizar el estado.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}/`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting task', err);
      setError('No se pudo borrar la tarea.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Tus Tareas</h1>
          <p style={{ color: 'var(--text-muted)' }}>Lista de pendientes y objetivos para hoy.</p>
        </div>
        <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.875rem', fontWeight: 600 }}>
          {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Modern Search & Add Form */}
      <div className="glass-card animate-fade-in" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              placeholder="¿Qué necesitas hacer hoy?" 
              style={{ marginBottom: 0 }}
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
            <button className="btn-primary" type="submit" style={{ whiteSpace: 'nowrap' }} disabled={addingTask}>
              {addingTask ? <Loader2 className="animate-spin" size={20} /> : <><PlusCircle size={20} /> Añadir</>}
            </button>
          </div>
          <input 
            placeholder="Añade una descripción (Enter para confirmar)" 
            style={{ marginBottom: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
        </form>
      </div>

      {/* Task List Container */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <Loader2 className="animate-spin text-primary" size={48} style={{ color: 'var(--primary)', margin: 'auto' }} />
        </div>
      ) : tasks.length > 0 ? (
        <div className="task-grid">
          {tasks.map((task) => (
            <div key={task.id} className="task-item animate-fade-up">
              <div className="task-content" style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%' }}>
                <div 
                  className={`checkbox ${task.is_completed ? 'checked' : ''}`}
                  onClick={() => handleToggle(task.id)}
                >
                  {task.is_completed && <CheckCircle size={18} color="white" />}
                </div>
                <div className={`task-info ${task.is_completed ? 'completed' : ''}`} style={{ flex: 1 }}>
                  <h3 style={{ textDecoration: task.is_completed ? 'line-through' : 'none' }}>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button 
                  className="btn-icon" 
                  onClick={() => handleDelete(task.id)}
                  title="Eliminar"
                  style={{ color: 'var(--danger)', opacity: 0.6 }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem', opacity: 0.7 }}>
          <PlusCircle size={48} style={{ margin: '0 auto 1rem', display: 'block' }} />
          <p>No tienes tareas aún. ¡Empieza creando una!</p>
        </div>
      )}
    </div>
  );
};

export default Tasks;
