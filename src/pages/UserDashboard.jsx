import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/slices/taskSlice';
import axios  from 'axios';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';
import ConfirmModal from '../components/ConfirmModal';

const UserDashboard = () => {

    const {auth} = useAuth();
    const dispatch = useDispatch();
    const { tasks, loading } = useSelector(state => state.tasks);
    const [profile, setProfile] = useState(null);
    const [error,setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '' });
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [taskData, setTaskData] = useState({ title: '', description: '', status: 'pending', dueDate: '' });
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);


    useEffect(()=>{
        const fetchProfiles = async()=>{
            if(!auth?.accessToken) return;
            try {
                const res = await axios.get("/api/users/me",{
                    headers:{
                        Authorization: `Bearer ${auth?.accessToken}`
                    },
                    withCredentials:true
                })
                setProfile(res.data)
                setFormData({ username: res.data.username, email: res.data.email })
            } catch (error) {
                console.log("Failed to fetch user Profile:",error);
                setError("Failed to fetch user Profile")
            }
        }
        fetchProfiles()
        dispatch(fetchTasks())
    },[auth, dispatch])

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await axios.put('/api/users/me', formData, {
                headers: { Authorization: `Bearer ${auth?.accessToken}` },
                withCredentials: true
            });
            setProfile(res.data);
            setFormData({ username: res.data.username, email: res.data.email });
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const handleDelete = async () => {
        setError(null);
        try {
            await axios.delete('/api/users/me', {
                headers: { Authorization: `Bearer ${auth?.accessToken}` },
                withCredentials: true
            });
            toast.success('Account deleted successfully!');
            localStorage.removeItem('auth');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete account';
            setError(errorMessage);
            toast.error(errorMessage);
        }
        setShowDeleteAccountModal(false);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        if (editingTask) {
            await dispatch(updateTask({ id: editingTask._id, taskData }));
        } else {
            await dispatch(createTask(taskData));
        }
        resetTaskForm();
    };

    const handleTaskEdit = (task) => {
        setEditingTask(task);
        setTaskData({
            title: task.title,
            description: task.description,
            status: task.status,
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
        });
        setShowTaskForm(true);
    };

    const handleTaskDelete = (task) => {
        setTaskToDelete(task);
        setShowDeleteTaskModal(true);
    };

    const confirmTaskDelete = async () => {
        if (taskToDelete) {
            await dispatch(deleteTask(taskToDelete._id));
            setShowDeleteTaskModal(false);
            setTaskToDelete(null);
        }
    };

    const resetTaskForm = () => {
        setTaskData({ title: '', description: '', status: 'pending', dueDate: '' });
        setEditingTask(null);
        setShowTaskForm(false);
    };

    const handleTaskInputChange = (e) => {
        setTaskData({ ...taskData, [e.target.name]: e.target.value });
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'started': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
  return (
    <div className="max-w-6xl mx-auto mt-4 md:mt-10 p-3 md:p-6 bg-gray-50 min-h-screen">
      <BackButton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-xl p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-700">User Profile</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          {profile ? (
            <div className="space-y-4">
              {!isEditing ? (
                <>
                  <div>
                    <span className="font-semibold text-gray-700">Username:</span>
                    <span className="ml-2 text-gray-900">{profile.username}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-900">{profile.email}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Role:</span>
                    <span className="ml-2 text-gray-900 capitalize">{profile.role}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Created At:</span>
                    <span className="ml-2 text-gray-900">{new Date(profile.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Edit Profile
                    </button>
                    <button 
                      onClick={() => setShowDeleteAccountModal(true)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete Account
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Username:</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Save Changes
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="text-gray-500">Loading profile...</div>
          )}
        </div>

        {/* Task Management Section */}
        <div className="bg-white rounded-lg shadow-xl p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-xl md:text-2xl font-bold text-blue-700">Daily Tasks</h2>
            <button 
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="bg-blue-500 text-white px-3 md:px-4 py-2 rounded hover:bg-blue-600 text-sm md:text-base"
            >
              {showTaskForm ? 'Cancel' : '+ Add Task'}
            </button>
          </div>

          {showTaskForm && (
            <form onSubmit={handleTaskSubmit} className="mb-6 p-3 md:p-4 border rounded bg-gray-50">
              <div className="space-y-3">
                <input
                  type="text"
                  name="title"
                  placeholder="Task title"
                  value={taskData.title}
                  onChange={handleTaskInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Task description"
                  value={taskData.description}
                  onChange={handleTaskInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  rows="3"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    name="status"
                    value={taskData.status}
                    onChange={handleTaskInputChange}
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
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
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button 
                    type="submit"
                    className="bg-green-500 text-white px-3 md:px-4 py-2 rounded hover:bg-green-600 text-sm md:text-base"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                  <button 
                    type="button"
                    onClick={resetTaskForm}
                    className="bg-gray-500 text-white px-3 md:px-4 py-2 rounded hover:bg-gray-600 text-sm md:text-base"
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
                  <div key={task._id} className="p-3 md:p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-2 sm:space-y-0">
                      <h3 className="font-semibold text-base md:text-lg">{task.title}</h3>
                      <select
                        value={task.status}
                        onChange={(e) => {
                          dispatch(updateTask({ 
                            id: task._id, 
                            taskData: { status: e.target.value } 
                          }));
                        }}
                        className={`px-2 py-1 text-xs rounded-full border-none outline-none cursor-pointer ${getStatusColor(task.status)}`}
                      >
                        <option value="pending">pending</option>
                        <option value="started">started</option>
                        <option value="completed">completed</option>
                      </select>
                    </div>
                    <p className="text-gray-600 mb-2">{task.description}</p>
                    {task.dueDate && (
                      <p className="text-sm text-gray-500 mb-2">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button 
                        onClick={() => handleTaskEdit(task)}
                        className="bg-yellow-500 text-white px-2 md:px-3 py-1 rounded text-xs md:text-sm hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleTaskDelete(task)}
                        className="bg-red-500 text-white px-2 md:px-3 py-1 rounded text-xs md:text-sm hover:bg-red-600"
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
      </div>
      
      <ConfirmModal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        onConfirm={handleDelete}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost."
        confirmText="Delete Account"
        cancelText="Cancel"
      />
      
      <ConfirmModal
        isOpen={showDeleteTaskModal}
        onClose={() => {
          setShowDeleteTaskModal(false);
          setTaskToDelete(null);
        }}
        onConfirm={confirmTaskDelete}
        title="Delete Task"
        message={`Are you sure you want to delete the task "${taskToDelete?.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export default UserDashboard