class TaskDatabase {
  constructor() {
    this.dbName = 'focushive-tasks';
    this.version = 1;
    this.db = null;
  }

  async init() {
    if (this.db) return this.db;

    if (typeof indexedDB === 'undefined') {
      throw new Error('IndexedDB is not available in this environment');
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB for tasks'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('tasks')) {
          const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
          
          taskStore.createIndex('status', 'status', { unique: false });
          taskStore.createIndex('priority', 'priority', { unique: false });
          taskStore.createIndex('createdAt', 'createdAt', { unique: false });
          taskStore.createIndex('completedAt', 'completedAt', { unique: false });
          taskStore.createIndex('dueDate', 'dueDate', { unique: false });
        }

        if (!db.objectStoreNames.contains('taskSessions')) {
          const taskSessionStore = db.createObjectStore('taskSessions', { keyPath: 'id' });
          
          taskSessionStore.createIndex('taskId', 'taskId', { unique: false });
          taskSessionStore.createIndex('sessionId', 'sessionId', { unique: false });
          taskSessionStore.createIndex('startTime', 'startTime', { unique: false });
          taskSessionStore.createIndex('date', 'date', { unique: false });
        }
      };
    });
  }

  generateId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateTaskSessionId() {
    return `tasksession_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async addTask(taskData) {
    try {
      await this.init();
      
      const task = {
        id: this.generateId(),
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'pending',
        priority: taskData.priority || 'medium',
        estimatedDuration: taskData.estimatedDuration || null,
        estimatedSessions: taskData.estimatedSessions || 1,
        tags: taskData.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: null,
        dueDate: taskData.dueDate || null,
        totalTimeSpent: 0,
        sessionsCount: 0,
        productivityScore: 0
      };

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['tasks'], 'readwrite');
        const store = transaction.objectStore('tasks');
        const request = store.add(task);

        request.onsuccess = () => resolve(task);
        request.onerror = () => reject(new Error('Failed to add task'));
      });
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }

  async updateTask(taskId, updates) {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['tasks'], 'readwrite');
        const store = transaction.objectStore('tasks');
        const getRequest = store.get(taskId);

        getRequest.onsuccess = () => {
          const task = getRequest.result;
          if (!task) {
            reject(new Error('Task not found'));
            return;
          }

          const updatedTask = {
            ...task,
            ...updates,
            updatedAt: new Date(),
            ...(updates.status === 'completed' && !task.completedAt ? { completedAt: new Date() } : {})
          };

          const updateRequest = store.put(updatedTask);
          updateRequest.onsuccess = () => resolve(updatedTask);
          updateRequest.onerror = () => reject(new Error('Failed to update task'));
        };

        getRequest.onerror = () => reject(new Error('Failed to get task for update'));
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(taskId) {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['tasks', 'taskSessions'], 'readwrite');
        
        const taskStore = transaction.objectStore('tasks');
        const taskSessionStore = transaction.objectStore('taskSessions');
        
        const deleteTaskRequest = taskStore.delete(taskId);
        
        const taskSessionIndex = taskSessionStore.index('taskId');
        const getTaskSessionsRequest = taskSessionIndex.getAll(taskId);
        
        getTaskSessionsRequest.onsuccess = () => {
          const taskSessions = getTaskSessionsRequest.result;
          taskSessions.forEach(taskSession => {
            taskSessionStore.delete(taskSession.id);
          });
        };

        deleteTaskRequest.onsuccess = () => resolve();
        deleteTaskRequest.onerror = () => reject(new Error('Failed to delete task'));
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async getAllTasks() {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['tasks'], 'readonly');
        const store = transaction.objectStore('tasks');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to get all tasks'));
      });
    } catch (error) {
      console.error('Error getting all tasks:', error);
      return [];
    }
  }

  async getTasksByStatus(status) {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['tasks'], 'readonly');
        const store = transaction.objectStore('tasks');
        const index = store.index('status');
        const request = index.getAll(status);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to get tasks by status'));
      });
    } catch (error) {
      console.error('Error getting tasks by status:', error);
      return [];
    }
  }

  async linkTaskToSession(taskId, sessionId, timeSpent) {
    try {
      await this.init();
      
      const taskSession = {
        id: this.generateTaskSessionId(),
        taskId: taskId,
        sessionId: sessionId,
        timeSpent: timeSpent,
        startTime: new Date(),
        date: new Date().toISOString().split('T')[0]
      };

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['taskSessions', 'tasks'], 'readwrite');
        const taskSessionStore = transaction.objectStore('taskSessions');
        const taskStore = transaction.objectStore('tasks');
        
        const addTaskSessionRequest = taskSessionStore.add(taskSession);
        
        addTaskSessionRequest.onsuccess = () => {
          const getTaskRequest = taskStore.get(taskId);
          
          getTaskRequest.onsuccess = () => {
            const task = getTaskRequest.result;
            if (task) {
              const updatedTask = {
                ...task,
                totalTimeSpent: (task.totalTimeSpent || 0) + timeSpent,
                sessionsCount: (task.sessionsCount || 0) + 1,
                updatedAt: new Date()
              };
              
              const updateTaskRequest = taskStore.put(updatedTask);
              updateTaskRequest.onsuccess = () => resolve(taskSession);
              updateTaskRequest.onerror = () => reject(new Error('Failed to update task time'));
            } else {
              resolve(taskSession);
            }
          };
        };

        addTaskSessionRequest.onerror = () => reject(new Error('Failed to link task to session'));
      });
    } catch (error) {
      console.error('Error linking task to session:', error);
      throw error;
    }
  }

  async getTaskSessions(taskId) {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['taskSessions'], 'readonly');
        const store = transaction.objectStore('taskSessions');
        const index = store.index('taskId');
        const request = index.getAll(taskId);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to get task sessions'));
      });
    } catch (error) {
      console.error('Error getting task sessions:', error);
      return [];
    }
  }

  async calculateProductivityScore(taskId) {
    try {
      const task = await this.getTask(taskId);
      const sessions = await this.getTaskSessions(taskId);
      
      if (!task || sessions.length === 0) {
        return 0;
      }

      let score = 0;
      const totalTimeSpent = task.totalTimeSpent || 0;
      const estimatedDuration = task.estimatedDuration || 0;
      
      if (task.status === 'completed') {
        score += 50;
        
        if (estimatedDuration > 0) {
          const efficiency = estimatedDuration / totalTimeSpent;
          if (efficiency >= 0.8 && efficiency <= 1.2) {
            score += 30;
          } else if (efficiency >= 0.6 && efficiency <= 1.4) {
            score += 20;
          } else if (efficiency >= 0.4 && efficiency <= 1.6) {
            score += 10;
          }
        }
      }
      
      const sessionConsistency = sessions.length > 0 ? Math.min(sessions.length * 5, 20) : 0;
      score += sessionConsistency;
      
      return Math.min(score, 100);
    } catch (error) {
      console.error('Error calculating productivity score:', error);
      return 0;
    }
  }

  async getTask(taskId) {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['tasks'], 'readonly');
        const store = transaction.objectStore('tasks');
        const request = store.get(taskId);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to get task'));
      });
    } catch (error) {
      console.error('Error getting task:', error);
      return null;
    }
  }

  async updateTaskProductivityScore(taskId) {
    try {
      const score = await this.calculateProductivityScore(taskId);
      await this.updateTask(taskId, { productivityScore: score });
      return score;
    } catch (error) {
      console.error('Error updating task productivity score:', error);
      return 0;
    }
  }

  async getTaskStats(taskId) {
    try {
      const task = await this.getTask(taskId);
      const sessions = await this.getTaskSessions(taskId);
      
      if (!task) return null;

      return {
        task,
        totalSessions: sessions.length,
        totalTimeSpent: task.totalTimeSpent || 0,
        averageSessionTime: sessions.length > 0 ? (task.totalTimeSpent / sessions.length) : 0,
        productivityScore: task.productivityScore || 0,
        estimatedVsActual: task.estimatedDuration ? {
          estimated: task.estimatedDuration,
          actual: task.totalTimeSpent,
          variance: ((task.totalTimeSpent - task.estimatedDuration) / task.estimatedDuration) * 100
        } : null
      };
    } catch (error) {
      console.error('Error getting task stats:', error);
      return null;
    }
  }

  async exportTasks() {
    try {
      const tasks = await this.getAllTasks();
      const allTaskSessions = await this.getAllTaskSessions();
      
      return {
        exportDate: new Date().toISOString(),
        version: '1.0',
        tasks: tasks,
        taskSessions: allTaskSessions
      };
    } catch (error) {
      console.error('Error exporting tasks:', error);
      throw error;
    }
  }

  async getAllTaskSessions() {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['taskSessions'], 'readonly');
        const store = transaction.objectStore('taskSessions');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to get all task sessions'));
      });
    } catch (error) {
      console.error('Error getting all task sessions:', error);
      return [];
    }
  }

  async clearAllTasks() {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['tasks', 'taskSessions'], 'readwrite');
        
        const taskStore = transaction.objectStore('tasks');
        const taskSessionStore = transaction.objectStore('taskSessions');
        
        const clearTasksRequest = taskStore.clear();
        const clearTaskSessionsRequest = taskSessionStore.clear();

        Promise.all([
          new Promise((res, rej) => {
            clearTasksRequest.onsuccess = () => res();
            clearTasksRequest.onerror = () => rej();
          }),
          new Promise((res, rej) => {
            clearTaskSessionsRequest.onsuccess = () => res();
            clearTaskSessionsRequest.onerror = () => rej();
          })
        ]).then(() => resolve()).catch(() => reject(new Error('Failed to clear all tasks')));
      });
    } catch (error) {
      console.error('Error clearing all tasks:', error);
      throw error;
    }
  }
}

export const taskDatabase = new TaskDatabase();