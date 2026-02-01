import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'founder',
    contactNo: '',
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
    setSuccessMessage('');

    try {
      // Step 4: Send ID token to backend to authorize the request
      const response = await API.post('/signup', {
        email: formData.email,
        fullName: formData.fullName,
        role: formData.role,
        contactNo: formData.contactNo,
        firebaseUID: user.uid,
      }, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        }
      });

      if (response.status === 201) {
        setSuccessMessage('Registration successful! Redirecting...');
        // Redirect based on role
        setTimeout(() => {
          navigate(formData.role === 'founder' ? '/signup-founder' : '/signup-investor');
        }, 1000);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen mt-10 flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 px-4 py-10">
      <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-xl w-full max-w-lg p-8 border border-white/20 text-white">
        <h2 className="text-3xl font-bold text-center mb-6">Create Your Account 🎉</h2>

        {error && (
          <div className="bg-red-500/10 text-red-200 border border-red-300 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-500/10 text-green-200 border border-green-300 px-4 py-2 rounded mb-4 text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option className="text-black" value="founder">Founder</option>
              <option className="text-black" value="investor">Investor</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Contact Number</label>
            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="+91 000 000 0000"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-300 transition mt-4 shadow-lg"
          >
            {isProcessing ? 'Processing...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
