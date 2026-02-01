import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios'; // Adjust as needed
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post('/login', formData);
      const { token, role } = res.data;

      localStorage.setItem('token', token);

      if (role === 'founder') {
        navigate('/founder-profile');
      } else if (role === 'investor') {
        navigate('/investor-profile');
      } else {
        navigate('/');
      }

    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-blue-600 to-teal-600 px-4 py-10">
      <div className="bg-white/10 backdrop-blur-md shadow-2xl rounded-xl w-full max-w-md p-8 border border-white/20">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6 drop-shadow">
          Welcome Back 🚀
        </h2>

        {error && (
          <p className="text-red-300 bg-red-100 bg-opacity-20 text-center py-2 rounded mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-white block mb-1">Email</label>
            <div className="flex items-center bg-white/20 rounded px-3 py-2">
              <FaEnvelope className="text-white mr-2" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="bg-transparent outline-none text-white placeholder-white/60 flex-1"
              />
            </div>
          </div>

          <div>
            <label className="text-white block mb-1">Password</label>
            <div className="flex items-center bg-white/20 rounded px-3 py-2">
              <FaLock className="text-white mr-2" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-transparent outline-none text-white placeholder-white/60 flex-1"
              />
            </div>
          </div>

          <div className="text-sm text-white/80">
            Don't have an account?{' '}
            <a href="/signup" className="text-yellow-300 hover:underline font-medium">
              Sign Up
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-300 transition shadow-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
