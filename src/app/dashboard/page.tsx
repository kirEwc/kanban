'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaClipboardList, FaSpinner, FaSearch, FaCheckCircle, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import TaskModal from './TaskModal';

type Task = {
  id: string;
  title: string;
  description: string;
  status: 'all' | 'in-progress' | 'in-review' | 'complete';
};

type Column = {
  id: string;
  title: string;
  color: string;
  status: 'all' | 'in-progress' | 'in-review' | 'complete';
};

export default function Dashboard() {
  const columns: Column[] = [
    { id: '1', title: 'All Tasks', color: 'from-blue-400/50 to-blue-600/50', status: 'all' },
    { id: '2', title: 'In Progress', color: 'from-purple-400/50 to-purple-600/50', status: 'in-progress' },
    { id: '3', title: 'In Review', color: 'from-amber-400/50 to-amber-600/50', status: 'in-review' },
    { id: '4', title: 'Complete', color: 'from-green-400/50 to-green-600/50', status: 'complete' },
  ];

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task]);
    setIsModalOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setTasks(tasks.map(t => t.id === task.id ? task : t));
    setIsModalOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    const newStatus = columns[parseInt(result.destination.droppableId)].status;
    movedTask.status = newStatus;
    updatedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(updatedTasks);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <FaClipboardList className="text-blue-400" />
          Kanban Board
        </h1>
        <button
          onClick={() => {
            setCurrentTask(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-all hover:bg-blue-600"
        >
          <FaPlus />
          Agregar Tarea
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {columns.map((column, index) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg bg-gray-800/50 p-4"
          >
            <div className={`mb-4 rounded-lg bg-gradient-to-r ${column.color} p-3`}>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                {column.status === 'all' && <FaClipboardList />}
                {column.status === 'in-progress' && <FaSpinner className="animate-spin" />}
                {column.status === 'in-review' && <FaSearch />}
                {column.status === 'complete' && <FaCheckCircle />}
                {column.title}
              </h2>
            </div>
            <Droppable droppableId={index.toString()}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
              {tasks
                .filter(task => task.status === column.status)
                .map((task, taskIndex) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="rounded-lg bg-gray-700/50 p-4 shadow-lg transition-all hover:bg-gray-700"
                        >
                    <h3 className="text-lg font-medium text-white">{task.title}</h3>
                    <p className="mt-2 text-sm text-gray-300">{task.description}</p>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setCurrentTask(task);
                          setIsModalOpen(true);
                        }}
                        className="flex items-center gap-1 rounded bg-blue-500/20 px-2 py-1 text-sm text-blue-400 transition-colors hover:bg-blue-500/30"
                      >
                        <FaEdit />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="flex items-center gap-1 rounded bg-red-500/20 px-2 py-1 text-sm text-red-400 transition-colors hover:bg-red-500/30"
                      >
                        <FaTrash />
                        Eliminar
                      </button>
                    </div>
                        </div>
                      )}
                    </Draggable>
                  </motion.div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </motion.div>
      ))}
    </div>
  </DragDropContext>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-xl"
          >
            <h2 className="mb-4 text-xl font-semibold text-white">
              {currentTask ? 'Edit Task' : 'Add New Task'}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newTask: Task = {
                  id: currentTask?.id || Math.random().toString(36).substr(2, 9),
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  status: (formData.get('status') as Task['status']) || 'all',
                };
                currentTask ? handleEditTask(newTask) : handleAddTask(newTask);
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={currentTask?.title}
                  required
                  className="mt-1 block w-full rounded-md bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={currentTask?.description}
                  required
                  className="mt-1 block w-full rounded-md bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={currentTask?.status || 'all'}
                  className="mt-1 block w-full rounded-md bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Tasks</option>
                  <option value="in-progress">In Progress</option>
                  <option value="in-review">In Review</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md bg-gray-600 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600"
                >
                  {currentTask ? 'Save Changes' : 'Add Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}