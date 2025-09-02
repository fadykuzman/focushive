import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { taskDatabase } from '../utils/taskDatabase';

const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      loading: false,
      error: null,
      activeTaskId: null,

      // Task operations
      addTask: async (taskData) => {
        try {
          set({ error: null });
          const newTask = await taskDatabase.addTask(taskData);
          set(state => ({ 
            tasks: [newTask, ...state.tasks] 
          }));
          return newTask;
        } catch (err) {
          set({ error: err.message });
          throw err;
        }
      },

      updateTask: async (taskId, updates) => {
        try {
          set({ error: null });
          const updatedTask = await taskDatabase.updateTask(taskId, updates);
          set(state => ({
            tasks: state.tasks.map(task => 
              task.id === taskId ? updatedTask : task
            )
          }));
          return updatedTask;
        } catch (err) {
          set({ error: err.message });
          throw err;
        }
      },

      deleteTask: async (taskId) => {
        try {
          set({ error: null });
          await taskDatabase.deleteTask(taskId);
          set(state => ({
            tasks: state.tasks.filter(task => task.id !== taskId),
            activeTaskId: state.activeTaskId === taskId ? null : state.activeTaskId
          }));
        } catch (err) {
          set({ error: err.message });
          throw err;
        }
      },

      completeTask: async (taskId) => {
        try {
          const { updateTask, loadTasks } = get();
          const updatedTask = await updateTask(taskId, { 
            status: 'completed',
            completedAt: new Date()
          });
          await taskDatabase.updateTaskProductivityScore(taskId);
          await loadTasks();
          return updatedTask;
        } catch (err) {
          throw err;
        }
      },

      uncompleteTask: async (taskId) => {
        try {
          const { updateTask, loadTasks } = get();
          const updatedTask = await updateTask(taskId, { 
            status: 'pending',
            completedAt: null
          });
          await loadTasks();
          return updatedTask;
        } catch (err) {
          throw err;
        }
      },

      loadTasks: async () => {
        try {
          set({ loading: true, error: null });
          const allTasks = await taskDatabase.getAllTasks();
          set({ 
            tasks: allTasks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
            loading: false 
          });
        } catch (err) {
          set({ error: err.message, loading: false });
          console.error('Failed to load tasks:', err);
        }
      },

      // Task management
      setActiveTask: (taskId) => {
        set({ activeTaskId: taskId });
      },

      clearActiveTask: () => {
        set({ activeTaskId: null });
      },

      // Helper functions
      getActiveTask: () => {
        const { tasks, activeTaskId } = get();
        return tasks.find(task => task.id === activeTaskId) || null;
      },

      getPendingTasks: () => {
        const { tasks } = get();
        return tasks.filter(task => task.status === 'pending');
      },

      getInProgressTasks: () => {
        const { tasks, activeTaskId } = get();
        return tasks.filter(task => task.status === 'in_progress' && task.id !== activeTaskId);
      },

      getCompletedTasks: () => {
        const { tasks } = get();
        return tasks.filter(task => task.status === 'completed');
      },

      getTaskStats: async (taskId) => {
        try {
          return await taskDatabase.getTaskStats(taskId);
        } catch (err) {
          set({ error: err.message });
          return null;
        }
      },

      linkTaskToSession: async (taskId, sessionId, timeSpent) => {
        try {
          set({ error: null });
          await taskDatabase.linkTaskToSession(taskId, sessionId, timeSpent);
          await get().loadTasks();
        } catch (err) {
          set({ error: err.message });
          throw err;
        }
      }
    }),
    {
      name: 'focushive-tasks',
      partialize: (state) => ({
        tasks: state.tasks,
        activeTaskId: state.activeTaskId
      })
    }
  )
);

// Initialize tasks on store creation
useTaskStore.getState().loadTasks();

export default useTaskStore;