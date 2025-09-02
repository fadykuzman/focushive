'use client';

import { useState, useEffect } from 'react';
import useTaskStore from '../../stores/taskStore';
import TaskTemplates from './TaskTemplates';
import { notesDatabase } from '../../utils/notesDatabase';

const FocusTaskList = ({ onTaskSelect, selectedTaskId, isInSidebar = false }) => {
  const tasks = useTaskStore(state => state.tasks);
  const addTask = useTaskStore(state => state.addTask);
  const updateTask = useTaskStore(state => state.updateTask);
  const deleteTask = useTaskStore(state => state.deleteTask);
  const completeTask = useTaskStore(state => state.completeTask);
  const getPendingTasks = useTaskStore(state => state.getPendingTasks);
  const getInProgressTasks = useTaskStore(state => state.getInProgressTasks);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSessions, setNewTaskSessions] = useState(1);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [taskNotes, setTaskNotes] = useState({});
  const [notesContent, setNotesContent] = useState({});
  const [originalNotesContent, setOriginalNotesContent] = useState({});
  const [notesChanged, setNotesChanged] = useState({});
  const [notesEditMode, setNotesEditMode] = useState({});

  const handleTemplateSelect = async (template) => {
    try {
      const taskData = {
        title: template.title,
        estimatedSessions: template.estimatedSessions,
        estimatedDuration: template.estimatedSessions * 25 * 60,
        status: 'pending'
      };
      
      const newTask = await addTask(taskData);
      onTaskSelect?.(newTask);
    } catch (err) {
      console.error('Failed to create task from template:', err);
    }
  };

  const todayTasks = [...getPendingTasks(), ...getInProgressTasks()];
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const taskData = {
        title: newTaskTitle,
        estimatedSessions: newTaskSessions,
        estimatedDuration: newTaskSessions * 25 * 60,
        status: 'pending'
      };
      
      await addTask(taskData);
      setNewTaskTitle('');
      setNewTaskSessions(1);
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      await completeTask(taskId);
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      if (selectedTaskId === taskId) {
        onTaskSelect?.(null);
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const incrementSessions = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newSessions = (task.estimatedSessions || 1) + 1;
      await updateTask(taskId, {
        estimatedSessions: newSessions,
        estimatedDuration: newSessions * 25 * 60
      });
    }
  };

  const decrementSessions = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && (task.estimatedSessions || 1) > 1) {
      const newSessions = (task.estimatedSessions || 1) - 1;
      await updateTask(taskId, {
        estimatedSessions: newSessions,
        estimatedDuration: newSessions * 25 * 60
      });
    }
  };

  // Load notes for tasks
  useEffect(() => {
    const loadTaskNotes = async () => {
      const notesMap = {};
      for (const task of tasks) {
        try {
          const notes = await notesDatabase.getNotesByTask(task.id);
          notesMap[task.id] = notes;
        } catch (error) {
          console.error('Failed to load notes for task:', task.id, error);
          notesMap[task.id] = [];
        }
      }
      setTaskNotes(notesMap);
    };

    if (tasks.length > 0) {
      loadTaskNotes();
    }
  }, [tasks]);

  const toggleNotes = (taskId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
    
    // Initialize notes content if not already loaded
    if (!notesContent[taskId] && taskNotes[taskId] && taskNotes[taskId].length > 0) {
      const content = taskNotes[taskId][0]?.content || '';
      setNotesContent(prev => ({
        ...prev,
        [taskId]: content
      }));
      setOriginalNotesContent(prev => ({
        ...prev,
        [taskId]: content
      }));
    }
    
    // If opening notes for the first time and no existing notes, enter edit mode
    if (!taskNotes[taskId] || taskNotes[taskId].length === 0) {
      enterEditMode(taskId);
    }
  };

  const handleNotesChange = (taskId, content) => {
    setNotesContent(prev => ({
      ...prev,
      [taskId]: content
    }));
    
    // Check if content has changed
    const hasChanged = content !== (originalNotesContent[taskId] || '');
    setNotesChanged(prev => ({
      ...prev,
      [taskId]: hasChanged
    }));
  };

  const enterEditMode = (taskId) => {
    setNotesEditMode(prev => ({
      ...prev,
      [taskId]: true
    }));
  };

  const exitEditMode = (taskId) => {
    setNotesEditMode(prev => ({
      ...prev,
      [taskId]: false
    }));
  };

  const cancelEdit = (taskId) => {
    // Restore original content
    setNotesContent(prev => ({
      ...prev,
      [taskId]: originalNotesContent[taskId] || ''
    }));
    setNotesChanged(prev => ({
      ...prev,
      [taskId]: false
    }));
    exitEditMode(taskId);
  };

  const deleteNotes = async (taskId) => {
    if (!confirm('Delete notes for this task?')) return;
    
    try {
      const existingNotes = taskNotes[taskId] || [];
      if (existingNotes.length > 0) {
        await notesDatabase.deleteNote(existingNotes[0].id);
        
        // Clear local state
        setTaskNotes(prev => ({
          ...prev,
          [taskId]: []
        }));
        setNotesContent(prev => ({
          ...prev,
          [taskId]: ''
        }));
        setOriginalNotesContent(prev => ({
          ...prev,
          [taskId]: ''
        }));
        setNotesChanged(prev => ({
          ...prev,
          [taskId]: false
        }));
      }
    } catch (error) {
      console.error('Failed to delete notes:', error);
    }
  };

  const saveNotes = async (taskId) => {
    const content = notesContent[taskId] || '';
    
    try {
      const existingNotes = taskNotes[taskId] || [];
      
      if (existingNotes.length > 0) {
        // Update existing note
        await notesDatabase.updateNote(existingNotes[0].id, {
          content,
          title: `Notes for ${tasks.find(t => t.id === taskId)?.title || 'Task'}`,
          tags: []
        });
      } else {
        // Create new note
        await notesDatabase.addNote({
          content,
          title: `Notes for ${tasks.find(t => t.id === taskId)?.title || 'Task'}`,
          tags: [],
          taskId
        });
      }
      
      // Reload notes
      const updatedNotes = await notesDatabase.getNotesByTask(taskId);
      setTaskNotes(prev => ({
        ...prev,
        [taskId]: updatedNotes
      }));
      
      // Update original content and reset changed state
      setOriginalNotesContent(prev => ({
        ...prev,
        [taskId]: content
      }));
      setNotesChanged(prev => ({
        ...prev,
        [taskId]: false
      }));
      exitEditMode(taskId);
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  };

  const TaskItem = ({ task, isSelected }) => (
    <div 
      id={`focus-task-${task.id}`}
      className={`rounded-lg border transition-colors ${
        isInSidebar
          ? (isSelected 
              ? 'border-blue-500 bg-blue-50 text-gray-800' 
              : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-800')
          : (isSelected 
              ? 'border-white text-white' 
              : 'border-white/20 hover:border-white/40 text-white/80 hover:text-white')
      }`}
      style={isSelected && !isInSidebar ? { backgroundColor: '#3F88C5' } : {}}
    >
      <div 
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={() => onTaskSelect?.(task)}
        title={isSelected ? "Click to deactivate task" : "Click to set as active task"}
      >
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTaskComplete(task.id);
          }}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            isInSidebar 
              ? 'border-gray-300 hover:border-gray-400' 
              : 'border-white/40 hover:border-white'
          }`}
        >
          {task.status === 'completed' && (
            <img src="/icons/check.svg" alt="Complete" className="w-4 h-4" />
          )}
        </button>
        
        <div className="flex-1">
          <div className={`font-medium ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
            {task.title}
          </div>
          <div className={`text-sm ${
            isInSidebar ? 'text-gray-500' : 'opacity-60'
          }`}>
            {Math.floor((task.totalTimeSpent || 0) / 1500)} / {task.estimatedSessions || 1} sessions
          </div>
        </div>

      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            decrementSessions(task.id);
          }}
          className={`w-6 h-6 rounded flex items-center justify-center ${
            isInSidebar 
              ? 'hover:bg-gray-100 text-gray-500 hover:text-gray-700' 
              : 'hover:bg-white/10 text-white/60 hover:text-white'
          }`}
        >
          −
        </button>
        
        <span className={`text-sm font-medium min-w-[20px] text-center ${
          isInSidebar ? 'text-gray-700' : 'text-white'
        }`}>
          {task.estimatedSessions || 1}
        </span>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            incrementSessions(task.id);
          }}
          className={`w-6 h-6 rounded flex items-center justify-center ${
            isInSidebar 
              ? 'hover:bg-gray-100 text-gray-500 hover:text-gray-700' 
              : 'hover:bg-white/10 text-white/60 hover:text-white'
          }`}
        >
          +
        </button>


        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTaskDelete(task.id);
          }}
          className={`w-6 h-6 rounded flex items-center justify-center ${
            isInSidebar 
              ? 'hover:bg-gray-100 text-gray-400 hover:text-red-500' 
              : 'hover:bg-white/10 text-white/40 hover:text-red-400'
          }`}
        >
          <img src="/icons/trash.svg" alt="Delete" className="w-4 h-4" />
        </button>
      </div>
      </div>
    </div>
  );

  return (
    <div id="focus-task-list" className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className={`font-medium ${
          isInSidebar ? 'text-gray-800' : 'text-white'
        }`}>Tasks</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className={`text-sm ${
            isInSidebar ? 'text-gray-600 hover:text-gray-800' : 'text-white/60 hover:text-white'
          }`}
        >
          + Add Task
        </button>
      </div>

      {showAddForm && (
        <div className="p-4 rounded-lg border border-white/20 bg-white/5">
          <form onSubmit={handleAddTask} className="space-y-3">
            <input
              type="text"
              placeholder="What are you working on?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className={`w-full px-3 py-2 rounded focus:outline-none ${
                isInSidebar 
                  ? 'bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-white/50'
              }`}
              autoFocus
            />
            
            <div className="flex items-center gap-3">
              <span className={`text-sm ${
                isInSidebar ? 'text-gray-600' : 'text-white/60'
              }`}>Est Sessions:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNewTaskSessions(Math.max(1, newTaskSessions - 1))}
                  className="w-6 h-6 rounded hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
                >
                  −
                </button>
                <span className={`font-medium min-w-[20px] text-center ${
                  isInSidebar ? 'text-gray-700' : 'text-white'
                }`}>
                  {newTaskSessions}
                </span>
                <button
                  type="button"
                  onClick={() => setNewTaskSessions(newTaskSessions + 1)}
                  className="w-6 h-6 rounded hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className={`px-4 py-2 rounded text-sm ${
                  isInSidebar 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewTaskTitle('');
                  setNewTaskSessions(1);
                }}
                className={`px-4 py-2 text-sm ${
                  isInSidebar 
                    ? 'text-gray-600 hover:text-gray-800' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-2">
        {todayTasks.map(task => (
          <TaskItem 
            key={task.id} 
            task={task} 
            isSelected={selectedTaskId === task.id}
          />
        ))}
      </div>

      {todayTasks.length === 0 && !showAddForm && (
        <div className={`text-center py-4 ${
          isInSidebar ? 'text-gray-500' : 'text-white/40'
        }`}>
          <p className="text-sm">Add tasks to work on today</p>
        </div>
      )}

      <TaskTemplates onTemplateSelect={handleTemplateSelect} isInSidebar={isInSidebar} />

      {completedTasks.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className={`text-sm font-medium ${
              isInSidebar ? 'text-gray-600' : 'text-white/60'
            }`}>
              Completed ({completedTasks.length})
            </h4>
          </div>
          <div className="space-y-1">
            {completedTasks.slice(0, 3).map(task => (
              <div key={task.id} className={`flex items-center gap-3 py-2 text-sm ${
                isInSidebar ? 'text-gray-400' : 'text-white/40'
              }`}>
                <img src="/icons/check.svg" alt="Completed" className="w-4 h-4" />
                <span className="line-through">{task.title}</span>
                <span className="text-xs">
                  {Math.floor((task.totalTimeSpent || 0) / 1500)} sessions
                </span>
              </div>
            ))}
            {completedTasks.length > 3 && (
              <div className={`text-center text-xs py-1 ${
                isInSidebar ? 'text-gray-400' : 'text-white/30'
              }`}>
                ... and {completedTasks.length - 3} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusTaskList;