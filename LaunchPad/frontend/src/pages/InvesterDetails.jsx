import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const SignupInvestor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    organizationName: '',
    bio: '',
    type: 'Angel',
    preferredDomain: '',
    linkedin: '',
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
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
      const response = await API.post('/createInvestorProfile', formData);
      
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage('Investor details submitted successfully!');
        navigate('/investor-profile');
      } else {
        setError('Unexpected server response.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen mt-11 flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 px-4 py-10">
      <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-xl w-full max-w-lg p-8 border border-white/20 text-white">
        <h2 className="text-3xl font-bold text-center mb-6">Investor Details</h2>

        {/* Success or Error Message */}
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
            <label className="block mb-1">Organization Name</label>
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="e.g. InvestCorp"
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
              placeholder="Share your background and investment experience..."
              rows="4"
            />
          </div>

          <div>
            <label className="block mb-1">Investor Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-pink-300">
              <option className="text-black" value="Angel">Angel</option>
              <option className="text-black" value="VC">VC</option>
              <option className="text-black" value="Institutional">Institutional</option>
              <option className="text-black" value="Incubator">Incubator</option>
              <option className="text-black" value="Other">Other</option>
            </select>
          </div>
          

          <div>
            <label className="block mb-1">Preferred Domain</label>
            <input
              type="text"
              name="preferredDomain"
              value={formData.preferredDomain}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="e.g. FinTech, HealthTech"
            />
          </div>

          <div>
            <label className="block mb-1">LinkedIn Profile</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="https://linkedin.com/in/your-profile"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-300 transition mt-4 shadow-lg"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Investor Details'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupInvestor;
