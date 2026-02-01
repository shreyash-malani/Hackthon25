import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios'; // adjust path if needed

const SignupFounder = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    bio: '',
    websiteUrl: '',
    BussinessNumber: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await API.post('/createFounderProfile', formData);

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage('Founder details submitted successfully!');
        navigate('/founder-profile');
      } else {
        setError('Unexpected response from the server.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit founder details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen mt-12 flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 px-4 py-10">
      <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-xl w-full max-w-lg p-8 border border-white/20 text-white">
        <h2 className="text-3xl font-bold text-center mb-6">Founder Details</h2>

        {/* Success or Error Message */}
        {successMessage && (
          <div className="bg-green-500/10 text-green-200 border border-green-300 px-4 py-2 rounded mb-4 text-center">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 text-red-200 border border-red-300 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="e.g. Startup Inc."
            />
          </div>

          <div>
            <label className="block mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-pink-300"
              rows="4"
              placeholder="Tell us about your startup..."
            />
          </div>

          <div>
            <label className="block mb-1">Website URL</label>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="https://yourstartup.com"
            />
          </div>

          <div>
            <label className="block mb-1">Business Number</label>
            <input
              type="text"
              name="BussinessNumber"
              value={formData.BussinessNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="e.g. +1234567890"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-300 transition mt-4 shadow-lg"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Founder Details'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupFounder;
