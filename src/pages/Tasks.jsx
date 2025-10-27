import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../store/slices/userSlice';
import { getAllTasks } from '../store/slices/taskSlice';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from '../utils/axiosConfig';
import BackButton from '../components/BackButton';
import ConfirmModal from '../components/ConfirmModal';

const Tasks = () => {
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const { users } = useSelector(state => state.users);
  const { allTasks, loading } = useSelector(state => state.tasks);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignFormData, setAssignFormData] = useState({
    title: '',
    description: '',
    userId: '',
    dueDate: ''
  });
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseAction, setResponseAction] = useState(null);
  const [taskToRespond, setTaskToRespond] = useState(null);

  useEffect(() => {
    if (auth?.user?.role === 'admin') {
      dispatch(fetchUsers());
      dispatch(getAllTasks());
    } else {
      fetchAssignedTasks();
    }
  }, [dispatch, auth]);

  const fetchAssignedTasks = async () => {
    try {
      const response = await axios.get('/api/tasks/assigned', {
        withCredentials: true
      });
      setAssignedTasks(response.data);
    } catch (error) {
      console.error('Error fetching assigned tasks:', error);
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks/assign', assignFormData, {
        withCredentials: true
      });
      toast.success('Task assigned successfully!');
      setAssignFormData({ title: '', description: '', userId: '', dueDate: '' });
      setShowAssignForm(false);
      dispatch(getAllTasks());
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign task');
    }
  };

  const handleTaskResponse = (task, response) => {
    setTaskToRespond(task);
    setResponseAction(response);
    setShowResponseModal(true);
  };

  const confirmTaskResponse = async () => {
    try {
      await axios.patch(`/api/tasks/${taskToRespond._id}/respond`, { response: responseAction }, {
        withCredentials: true
      });
      toast.success(`Task ${responseAction} successfully!`);
      fetchAssignedTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to respond to task');
    }
    setShowResponseModal(false);
    setTaskToRespond(null);
    setResponseAction(null);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'started': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (auth?.user?.role === 'admin') {
    return (
      <div className="max-w-7xl mx-auto mt-10 p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <BackButton to="/admin" />
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-blue-700">Task Management</h2>
            <button 
              onClick={() => setShowAssignForm(!showAssignForm)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              {showAssignForm ? 'Cancel' : 'Assign Task'}
            </button>
          </div>

          {showAssignForm && (
            <div className="mb-6 p-4 border rounded bg-gray-50">
              <h4 className="text-lg font-semibold mb-4">Assign Task to User</h4>
              <form onSubmit={handleAssignTask} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Task title"
                    value={assignFormData.title}
                    onChange={(e) => setAssignFormData({...assignFormData, title: e.target.value})}
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <select
                    value={assignFormData.userId}
                    onChange={(e) => setAssignFormData({...assignFormData, userId: e.target.value})}
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select User</option>
                    {users.filter(user => user.role === 'user').map(user => (
                      <option key={user._id} value={user._id}>{user.username} ({user.email})</option>
                    ))}
                  </select>
                </div>
                <textarea
                  placeholder="Task description"
                  value={assignFormData.description}
                  onChange={(e) => setAssignFormData({...assignFormData, description: e.target.value})}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
                <input
                  type="date"
                  value={assignFormData.dueDate}
                  onChange={(e) => setAssignFormData({...assignFormData, dueDate: e.target.value})}
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Assign Task
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allTasks && allTasks.map(task => (
                    <tr key={task._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-sm">
                            {task.userId?.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {task.userId?.username || 'Unknown'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500">{task.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.assignmentStatus)}`}>
                          {task.assignmentStatus}
                        </span>
                        {task.assignmentStatus === 'accepted' && (
                          <div className="text-xs text-green-600 mt-1">✓ User Accepted</div>
                        )}
                        {task.assignmentStatus === 'rejected' && (
                          <div className="text-xs text-red-600 mt-1">✗ User Rejected</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {task.assignedBy ? (
                          <div>
                            <div className="font-medium">{task.assignedBy.username}</div>
                            <div className="text-xs">{task.assignedBy.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Self-created</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User view - assigned tasks
  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <BackButton />
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Assigned Tasks</h2>
        
        <div className="space-y-4">
          {assignedTasks.map(task => (
            <div key={task._id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.assignmentStatus)}`}>
                    {task.assignmentStatus}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-2">{task.description}</p>
              
              {task.assignedBy && (
                <p className="text-sm text-gray-500 mb-2">
                  Assigned by: {task.assignedBy.username}
                </p>
              )}
              
              {task.dueDate && (
                <p className="text-sm text-gray-500 mb-3">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
              
              {task.assignmentStatus === 'assigned' && (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleTaskResponse(task, 'accepted')}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleTaskResponse(task, 'rejected')}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {assignedTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No assigned tasks found.
          </div>
        )}
      </div>
      
      <ConfirmModal
        isOpen={showResponseModal}
        onClose={() => {
          setShowResponseModal(false);
          setTaskToRespond(null);
          setResponseAction(null);
        }}
        onConfirm={confirmTaskResponse}
        title={`${responseAction === 'accepted' ? 'Accept' : 'Reject'} Task`}
        message={`Are you sure you want to ${responseAction === 'accepted' ? 'accept' : 'reject'} the task "${taskToRespond?.title}"?`}
        confirmText={responseAction === 'accepted' ? 'Accept' : 'Reject'}
        cancelText="Cancel"
      />
    </div>
  );
};

export default Tasks;