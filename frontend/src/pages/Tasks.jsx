import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, CheckCircle, Circle, Search, Filter, Loader2, AlertCircle, Edit3, X } from 'lucide-react';
import api from '../api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [search, setSearch] = useState('');
  const [addingTask, setAddingTask] = useState(false);
  const [error, setError] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [deletedCount, setDeletedCount] = useState(() => {
    const saved = localStorage.getItem('minitask_deleted_total');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [taskToDelete, setTaskToDelete] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    setAddingTask(true);
    setError('');

    try {
      if (editingTaskId) {
        // Modo Edición: actualizamos la tarea existente
        const response = await api.patch(`/api/tasks/${editingTaskId}/`, newTask);
        setTasks(tasks.map(t => t.id === editingTaskId ? response.data : t));
        cancelEdit();
      } else {
        // Modo Creación: añadimos tarea nueva
        const response = await api.post('/api/tasks/', newTask);
        setTasks([response.data, ...tasks]);
        setNewTask({ title: '', description: '' });
      }
    } catch (err) {
      console.error('Error saving task', err);
      setError('Error al guardar la tarea. Reintente por favor.');
    } finally {
      setAddingTask(false);
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setNewTask({ title: task.title, description: task.description || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setNewTask({ title: '', description: '' });
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

  const handleDeleteRequest = (task) => {
    setTaskToDelete(task);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      await api.delete(`/api/tasks/${taskToDelete.id}/`);
      setTasks(tasks.filter(t => t.id !== taskToDelete.id));
      
      const newDeleteCount = deletedCount + 1;
      setDeletedCount(newDeleteCount);
      localStorage.setItem('minitask_deleted_total', newDeleteCount);
      setTaskToDelete(null);
    } catch (err) {
      console.error('Error deleting task', err);
      setError('No se pudo borrar la tarea.');
      setTaskToDelete(null);
    }
  };

  const completedCount = tasks.filter(t => t.is_completed).length;
  const pendingCount = tasks.length - completedCount;

  const badgeStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '2rem',
    fontSize: '0.8rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.1)'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.025em' }}>Tus Tareas</h1>
            <p style={{ color: 'var(--text-muted)' }}>Panel de control y objetivos personales.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ ...badgeStyle, background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
            <Circle size={14} /> Pendientes: {pendingCount}
          </div>
          <div style={{ ...badgeStyle, background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <CheckCircle size={14} /> Completadas: {completedCount}
          </div>
          <div style={{ ...badgeStyle, background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <Trash2 size={14} /> Borradas: {deletedCount}
          </div>
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              placeholder="¿Qué necesitas hacer hoy?"
              style={{ marginBottom: 0 }}
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
            <button className="btn-primary" type="submit" style={{ whiteSpace: 'nowrap' }} disabled={addingTask}>
              {addingTask ? <Loader2 className="animate-spin" size={20} /> : (
                editingTaskId ? <><Edit3 size={20} /> Actualizar</> : <><PlusCircle size={20} /> Añadir</>
              )}
            </button>
            {editingTaskId && (
              <button
                className="btn-icon"
                type="button"
                onClick={cancelEdit}
                title="Cancelar edición"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <X size={20} />
              </button>
            )}
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
          {tasks.filter(t => t.id !== editingTaskId).map((task) => (
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  className="btn-icon"
                  onClick={() => handleEditClick(task)}
                  title="Editar"
                >
                  <Edit3 size={20} />
                </button>
                <button
                  className="btn-icon"
                  onClick={() => handleDeleteRequest(task)}
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
      {/* Modal de Confirmación Premium */}
      {taskToDelete && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem', animation: 'fadeIn 0.2s ease-out'
        }}>
          <div className="glass-card animate-fade-up" style={{
            maxWidth: '400px', width: '100%', textAlign: 'center',
            border: '1px solid rgba(239, 68, 68, 0.2)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', width: '64px', height: '64px',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--danger)'
            }}>
              <Trash2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>¿Seguro de esta acción?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Estás a punto de eliminar permanentemente la tarea: <br/>
              <strong style={{ color: 'var(--text)' }}>"{taskToDelete.title}"</strong>
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                className="btn-icon" 
                onClick={() => setTaskToDelete(null)}
                style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1.5rem', borderRadius: '0.75rem' }}
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                style={{ background: 'var(--danger)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700 }}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
