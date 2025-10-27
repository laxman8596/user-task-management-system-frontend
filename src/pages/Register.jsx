
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const  Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({username:'', email: '', password: '' });
  const [error, setError] = useState(null);

  const handlSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post('/api/auth/register',form,{
        withCredentials: true
      })
      toast.success("Successfully Registered! Please login.");
      console.log("Successfully Register",form);
      navigate("/login")
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Registration error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 md:mt-10 p-4 md:p-6 bg-white rounded-lg shadow-xl m-4">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form className="space-y-4" onSubmit={handlSubmit}>
         <div>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            className="w-full p-2 md:p-3 border rounded text-sm md:text-base"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            className="w-full p-2 md:p-3 border rounded text-sm md:text-base"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
       
        <div>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            className="w-full p-2 md:p-3 border rounded text-sm md:text-base"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <button
          type="submit" 
          className="w-full bg-blue-600 text-white p-2 md:p-3 rounded hover:bg-blue-700 text-sm md:text-base"
        >
           Register
        </button>
      </form>
    </div>
  );
};

export default  Register;
