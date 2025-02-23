'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaEdit, FaTrash, FaPlus, FaCheck } from 'react-icons/fa';

type Task = {
  id: string;
  title: string;
  description: string;
  status: 'all' | 'in-progress' | 'in-review' | 'complete';
};

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task?: Task | null;
};

export default function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('all');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus('all');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: task?.id || Math.random().toString(36).substr(2, 9),
      title,
      description,
      status,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {task ? (
                  <span className="flex items-center gap-2">
                    <FaEdit className="text-blue-400" />
                    Editar Tarea
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FaPlus className="text-green-400" />
                    Nueva Tarea
                  </span>
                )}
              </h2>
              <button
                onClick={onClose}
                className="rounded p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="mb-2 block text-sm text-gray-300">
                  Título
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="mb-2 block text-sm text-gray-300">
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-32 w-full rounded-lg bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="status" className="mb-2 block text-sm text-gray-300">
                  Estado
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Task['status'])}
                  className="w-full rounded-lg bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas las Tareas</option>
                  <option value="in-progress">En Progreso</option>
                  <option value="in-review">En Revisión</option>
                  <option value="complete">Completada</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
                >
                  <FaTimes />
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                >
                  <FaCheck />
                  {task ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}