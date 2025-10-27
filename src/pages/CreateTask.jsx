import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../store/slices/userSlice';
import { assignTask } from '../store/slices/taskSlice';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

const CreateTask = () => {
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const { users } = useSelector(state => state.users);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    userId: '',
    dueDate: ''
  });

  useEffect(() => {
    if (auth?.user?.role === 'admin') {
      dispatch(fetchUsers());
    }
  }, [dispatch, auth]);

  const handleInputChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(assignTask(taskData));
    setTaskData({ title: '', description: '', userId: '', dueDate: '' });
  };

  if (auth?.user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only administrators can create and assign tasks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-4 md:mt-10 p-3 md:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-4 md:p-6">
        <BackButton to="/admin" />
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6">Admin - Assign Task to User</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Task Title</label>
              <input
                type="text"
                name="title"
                value={taskData.title}
                onChange={handleInputChange}
                className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="Enter task title"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Assign to User</label>
              <select
                name="userId"
                value={taskData.userId}
                onChange={handleInputChange}
                className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                required
              >
                <option value="">Select a user</option>
                {users.filter(user => user.role === 'user').map(user => (
                  <option key={user._id} value={user._id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Task Description</label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleInputChange}
              className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              rows="4"
              placeholder="Enter detailed task description"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Due Date (Optional)</label>
            <input
              type="date"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleInputChange}
              className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={() => setTaskData({ title: '', description: '', userId: '', dueDate: '' })}
              className="px-4 md:px-6 py-2 md:py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 text-sm md:text-base"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="px-4 md:px-6 py-2 md:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-sm md:text-base"
            >
              Assign Task
            </button>
          </div>
        </form>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Admin Task Assignment:</h3>
          <ul className="text-blue-700 space-y-1">
            <li>• Only admins can assign tasks to users</li>
            <li>• Select a user from the dropdown to assign the task</li>
            <li>• The user will receive the task with "assigned" status</li>
            <li>• User can accept or reject the assigned task</li>
            <li>• View all task responses in the Tasks page</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;