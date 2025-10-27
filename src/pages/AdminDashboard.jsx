import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  clearMessages,
} from '../store/slices/userSlice';
import { getAllTasks } from '../store/slices/taskSlice';
import { checkTokenExpiry } from '../utils/clearAuth';
import ConfirmModal from '../components/ConfirmModal';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, stats, loading } = useSelector((state) => state.users);
  const { allTasks } = useSelector(state => state.tasks);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    checkTokenExpiry();
    dispatch(fetchUsers());
    dispatch(getAllTasks());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(
      updateUser({
        id: editingUser._id,
        userData: { username: formData.username, email: formData.email },
      })
    );

    dispatch(fetchUsers());
    resetForm();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, email: user.email });
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await dispatch(deleteUser(userToDelete._id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({ username: '', email: '' });
    setEditingUser(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto mt-4 md:mt-10 p-3 md:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-3 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700">Admin Dashboard</h2>
          <div className="flex flex-wrap items-center gap-2 md:space-x-4">
            <Link 
              to="/create-task"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 inline-block text-center"
            >
              Assign Task
            </Link>
            <Link 
              to="/user-profile"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 inline-block text-center"
            >
              All Users
            </Link>
            <Link 
              to="/add-user"
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-200 inline-block text-center"
            >
              Add User
            </Link>
            <Link 
              to="/tasks"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-200 inline-block text-center"
            >
              All Tasks
            </Link>
          </div>
        </div>

        {/* Admin Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-blue-50 p-4 md:p-6 rounded-lg">
            <h3 className="text-base md:text-lg font-semibold text-blue-800 mb-2">Total Users</h3>
            <div className="text-2xl md:text-3xl font-bold text-blue-600">{stats.totalUsers || 0}</div>
            <div className="text-xs md:text-sm text-blue-600 mt-1">Registered users</div>
          </div>
          
          <div className="bg-green-50 p-4 md:p-6 rounded-lg">
            <h3 className="text-base md:text-lg font-semibold text-green-800 mb-2">Total Tasks</h3>
            <div className="text-2xl md:text-3xl font-bold text-green-600">{allTasks?.length || 0}</div>
            <div className="text-xs md:text-sm text-green-600 mt-1">All tasks created</div>
          </div>
          
          <div className="bg-yellow-50 p-4 md:p-6 rounded-lg">
            <h3 className="text-base md:text-lg font-semibold text-yellow-800 mb-2">Assigned Tasks</h3>
            <div className="text-2xl md:text-3xl font-bold text-yellow-600">
              {allTasks?.filter(task => task.assignmentStatus !== 'self-created').length || 0}
            </div>
            <div className="text-xs md:text-sm text-yellow-600 mt-1">Tasks assigned to users</div>
          </div>
          
          <div className="bg-purple-50 p-4 md:p-6 rounded-lg">
            <h3 className="text-base md:text-lg font-semibold text-purple-800 mb-2">Pending Responses</h3>
            <div className="text-2xl md:text-3xl font-bold text-purple-600">
              {allTasks?.filter(task => task.assignmentStatus === 'assigned').length || 0}
            </div>
            <div className="text-xs md:text-sm text-purple-600 mt-1">Awaiting user response</div>
          </div>
        </div>

        {editingUser && (
          <div className="mb-6 bg-gray-50 p-4 md:p-6 rounded-lg border">
            <h4 className="text-lg font-semibold mb-4">Edit User</h4>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Update User
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">User Management</h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading users...</div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="hidden md:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-3 md:px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-2 md:ml-4">
                              <div className="text-xs md:text-sm font-medium text-gray-900">
                                {user.username}
                              </div>
                              <div className="sm:hidden text-xs text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-3 md:px-6 py-4 text-xs md:text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="hidden md:table-cell px-3 md:px-6 py-4 text-xs md:text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="bg-yellow-500 text-white px-2 md:px-3 py-1 rounded text-xs md:text-sm hover:bg-yellow-600 transition duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              className="bg-red-500 text-white px-2 md:px-3 py-1 rounded text-xs md:text-sm hover:bg-red-600 transition duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {users.length === 0 && (
                <div className="text-center py-8 text-gray-500">No users found.</div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete user "${userToDelete?.username}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AdminDashboard;
