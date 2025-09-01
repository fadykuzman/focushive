'use client';

import { useState, useEffect } from 'react';

const TaskTemplates = ({ onTemplateSelect }) => {
  const [templates, setTemplates] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    estimatedPomodoros: 1
  });

  useEffect(() => {
    const savedTemplates = localStorage.getItem('focushive-task-templates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    } else {
      const defaultTemplates = [
        { id: '1', title: 'Deep Work Session', estimatedPomodoros: 4 },
        { id: '2', title: 'Code Review', estimatedPomodoros: 2 },
        { id: '3', title: 'Email Processing', estimatedPomodoros: 1 },
        { id: '4', title: 'Learning/Research', estimatedPomodoros: 3 }
      ];
      setTemplates(defaultTemplates);
      localStorage.setItem('focushive-task-templates', JSON.stringify(defaultTemplates));
    }
  }, []);

  const saveTemplates = (updatedTemplates) => {
    setTemplates(updatedTemplates);
    localStorage.setItem('focushive-task-templates', JSON.stringify(updatedTemplates));
  };

  const handleAddTemplate = (e) => {
    e.preventDefault();
    if (!newTemplate.title.trim()) return;

    const template = {
      id: Date.now().toString(),
      title: newTemplate.title,
      estimatedPomodoros: newTemplate.estimatedPomodoros
    };

    saveTemplates([...templates, template]);
    setNewTemplate({ title: '', estimatedPomodoros: 1 });
    setShowAddForm(false);
  };

  const handleDeleteTemplate = (templateId) => {
    saveTemplates(templates.filter(t => t.id !== templateId));
  };

  return (
    <div id="task-templates" className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-white/60 text-sm font-medium">Templates</h4>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-white/60 hover:text-white text-xs"
        >
          {showAddForm ? 'Cancel' : '+ Add Template'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddTemplate} className="space-y-2">
          <input
            type="text"
            placeholder="Template name"
            value={newTemplate.title}
            onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/50 text-sm"
          />
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-xs">Pomodoros:</span>
            <button
              type="button"
              onClick={() => setNewTemplate(prev => ({ ...prev, estimatedPomodoros: Math.max(1, prev.estimatedPomodoros - 1) }))}
              className="w-5 h-5 rounded hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white text-xs"
            >
              −
            </button>
            <span className="text-white text-xs font-medium min-w-[15px] text-center">
              {newTemplate.estimatedPomodoros}
            </span>
            <button
              type="button"
              onClick={() => setNewTemplate(prev => ({ ...prev, estimatedPomodoros: prev.estimatedPomodoros + 1 }))}
              className="w-5 h-5 rounded hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white text-xs"
            >
              +
            </button>
            <button
              type="submit"
              className="ml-2 px-3 py-1 bg-white/20 text-white rounded hover:bg-white/30 text-xs"
            >
              Save
            </button>
          </div>
        </form>
      )}

      <div className="space-y-1">
        {templates.map(template => (
          <div 
            key={template.id}
            className="flex items-center justify-between p-2 rounded border border-white/10 hover:border-white/20 cursor-pointer hover:bg-white/5"
            onClick={() => onTemplateSelect?.(template)}
          >
            <span className="text-white/70 text-sm">{template.title}</span>
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-xs">{template.estimatedPomodoros} pom</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTemplate(template.id);
                }}
                className="w-4 h-4 rounded hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-red-400"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskTemplates;