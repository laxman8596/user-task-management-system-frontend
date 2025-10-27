import React from 'react';

const TaskSection = ({ 
  tasks, 
  loading, 
  showTaskForm, 
  setShowTaskForm, 
  taskData, 
  handleTaskInputChange, 
  handleTaskSubmit, 
  editingTask, 
  resetTaskForm, 
  handleTaskEdit, 
  handleTaskDelete, 
  getStatusColor 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Daily Tasks</h2>
        <button 
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showTaskForm ? 'Cancel' : '+ Add Task'}
        </button>
      </div>

      {showTaskForm && (
        <form onSubmit={handleTaskSubmit} className="mb-6 p-4 border rounded bg-gray-50">
          <div className="space-y-3">
            <input
              type="text"
              name="title"
              placeholder="Task title"
              value={taskData.title}
              onChange={handleTaskInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              name="description"
              placeholder="Task description"
              value={taskData.description}
              onChange={handleTaskInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                name="status"
                value={taskData.status}
                onChange={handleTaskInputChange}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="started">Started</option>
                <option value="completed">Completed</option>
              </select>
              <input
                type="date"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleTaskInputChange}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <button 
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
              <button 
                type="button"
                onClick={resetTaskForm}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-gray-500">Loading tasks...</div>
      ) : (
        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <div key={task._id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{task.description}</p>
                {task.dueDate && (
                  <p className="text-sm text-gray-500 mb-2">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleTaskEdit(task)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleTaskDelete(task._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-8">
              No tasks yet. Create your first task!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskSection;