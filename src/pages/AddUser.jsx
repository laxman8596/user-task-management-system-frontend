import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createUser } from '../store/slices/userSlice';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

const AddUser = () => {
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createUser(formData));
    setFormData({ username: '', email: '', password: '', role: 'user' });
  };

  if (auth?.user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only administrators can add new users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <BackButton to="/admin" />
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Add New User</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setFormData({ username: '', email: '', password: '', role: 'user' })}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
            >
              Add User
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Admin User Creation:</h3>
          <ul className="text-green-700 space-y-1">
            <li>• Create new users with username, email, and password</li>
            <li>• Assign user or admin role</li>
            <li>• New users can login immediately after creation</li>
            <li>• View all users in the User Profile page</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
