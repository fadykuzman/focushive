'use client';

import { useState, useEffect } from 'react';

const TaskTemplates = ({ onTemplateSelect, isInSidebar = false }) => {
  const [templates, setTemplates] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    estimatedSessions: 1
  });

  useEffect(() => {
    const savedTemplates = localStorage.getItem('focushive-task-templates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    } else {
      const defaultTemplates = [
        { id: '1', title: 'Deep Work Session', estimatedSessions: 4 },
        { id: '2', title: 'Code Review', estimatedSessions: 2 },
        { id: '3', title: 'Email Processing', estimatedSessions: 1 },
        { id: '4', title: 'Learning/Research', estimatedSessions: 3 }
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
      estimatedSessions: newTemplate.estimatedSessions
    };

    saveTemplates([...templates, template]);
    setNewTemplate({ title: '', estimatedSessions: 1 });
    setShowAddForm(false);
  };

  const handleDeleteTemplate = (templateId) => {
    saveTemplates(templates.filter(t => t.id !== templateId));
  };

  return (
    <div id="task-templates" className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className={`text-sm font-medium ${
          isInSidebar ? 'text-gray-600' : 'text-white/60'
        }`}>Templates</h4>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`text-xs ${
            isInSidebar ? 'text-gray-600 hover:text-gray-800' : 'text-white/60 hover:text-white'
          }`}
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
            className={`w-full px-3 py-2 rounded text-sm focus:outline-none ${
              isInSidebar 
                ? 'bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500' 
                : 'bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-white/50'
            }`}
          />
          <div className="flex items-center gap-2">
            <span className={`text-xs ${
              isInSidebar ? 'text-gray-600' : 'text-white/60'
            }`}>Sessions:</span>
            <button
              type="button"
              onClick={() => setNewTemplate(prev => ({ ...prev, estimatedSessions: Math.max(1, prev.estimatedSessions - 1) }))}
              className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                isInSidebar 
                  ? 'hover:bg-gray-100 text-gray-500 hover:text-gray-700' 
                  : 'hover:bg-white/10 text-white/60 hover:text-white'
              }`}
            >
              −
            </button>
            <span className={`text-xs font-medium min-w-[15px] text-center ${
              isInSidebar ? 'text-gray-700' : 'text-white'
            }`}>
              {newTemplate.estimatedSessions}
            </span>
            <button
              type="button"
              onClick={() => setNewTemplate(prev => ({ ...prev, estimatedSessions: prev.estimatedSessions + 1 }))}
              className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                isInSidebar 
                  ? 'hover:bg-gray-100 text-gray-500 hover:text-gray-700' 
                  : 'hover:bg-white/10 text-white/60 hover:text-white'
              }`}
            >
              +
            </button>
            <button
              type="submit"
              className={`ml-2 px-3 py-1 rounded text-xs ${
                isInSidebar 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
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
            className={`flex items-center justify-between p-2 rounded border cursor-pointer ${
              isInSidebar 
                ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50' 
                : 'border-white/10 hover:border-white/20 hover:bg-white/5'
            }`}
            onClick={() => onTemplateSelect?.(template)}
          >
            <span className={`text-sm ${
              isInSidebar ? 'text-gray-700' : 'text-white/70'
            }`}>{template.title}</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${
                isInSidebar ? 'text-gray-500' : 'text-white/50'
              }`}>{template.estimatedSessions} ses</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTemplate(template.id);
                }}
                className={`w-4 h-4 rounded flex items-center justify-center ${
                  isInSidebar 
                    ? 'hover:bg-gray-100 text-gray-400 hover:text-red-500' 
                    : 'hover:bg-white/10 text-white/30 hover:text-red-400'
                }`}
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