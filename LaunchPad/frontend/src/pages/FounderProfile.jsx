import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const FounderProfile = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const res = await API.get('/getMyStartupProfile');
        setStartups(res.data);
      } catch (err) {
        setError('Failed to load startups');
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  const handleEdit = (startupId) => {
    navigate(`/update-startup/${startupId}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-20">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Founder Dashboard</h2>
          <button
            onClick={() => navigate('/founder-dm')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Go to Direct Messages
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : startups.length === 0 ? (
          <p className="text-gray-700">You haven’t added any startups yet.</p>
        ) : (
          <div className="space-y-6">
            {startups.map((startup) => (
              <div
                key={startup._id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm"
              >
                <h3 className="text-xl font-semibold">{startup.title}</h3>
                <p className="text-gray-700 mb-2">{startup.description}</p>

                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Domain:</strong> {startup.domain}</p>
                  <p><strong>Stage:</strong> {startup.stage}</p>
                  <p><strong>Location:</strong> {startup.location}</p>
                  <p><strong>Likes:</strong> {startup.likes} | <strong>Dislikes:</strong> {startup.dislikes}</p>

                  {startup.pitch && (
                    <p>
                      <strong>Pitch Video:</strong>{' '}
                      <a
                        href={startup.pitch}
                        className="text-blue-500 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Pitch
                      </a>
                    </p>
                  )}

                  <div className="mt-2 pt-2 border-t border-gray-300">
                    <p><strong>Company:</strong> {startup.founderId?.companyName || 'N/A'}</p>
                    <p><strong>Bio:</strong> {startup.founderId?.bio || 'N/A'}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleEdit(startup._id)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FounderProfile;
