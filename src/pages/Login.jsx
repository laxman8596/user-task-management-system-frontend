import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post("/api/auth/login", form, {
        withCredentials: true,
      });

      setAuth({
        accessToken: res.data.accessToken,
        user: res.data.user,
      });
      
      toast.success(`Successfully logged in as ${res.data.user.role}!`);
      console.log("Successfully logged in",res.data);

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Login error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 md:mt-10 p-4 md:p-6 bg-white rounded-lg shadow-xl m-4">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form className="space-y-4" onSubmit={handleLogin}>
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
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
