import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const InvestorProfile = () => {
  const [savedStartups, setSavedStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedStartups = async () => {
      try {
        const res = await API.get('/savedStartups');
        console.log('Saved Startups:', res.data);
        setSavedStartups(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load saved startups:', err);
        setError('Failed to load saved startups');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedStartups();
  }, []);

  const handleCardClick = (startupId) => {
    navigate(`/startup/${startupId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Welcome, Investor!</h2>
        <p className="text-gray-700 mb-6">
          Use the navigation above to explore startup pitches, manage your profile, or logout.
        </p>

        <h3 className="text-xl font-semibold mb-4">Saved Startups</h3>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : savedStartups.length === 0 ? (
          <p className="text-gray-700">You haven’t saved any startups yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {savedStartups.map((startup) => (
              <div
                key={startup._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl overflow-hidden w-full flex flex-col cursor-pointer"
                onClick={() => handleCardClick(startup._id)}
                role="button"
                tabIndex="0"
              >
                {startup.pitch ? (
                  <video
                    className="w-full h-64 object-cover bg-black"
                    src={startup.pitch}
                    muted
                    loop
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    No Pitch Video
                  </div>
                )}
                <div className="p-4 h-[90px]">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{startup.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <span>{startup.founderId?.userId?.fullName || 'Unknown Founder'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorProfile;
