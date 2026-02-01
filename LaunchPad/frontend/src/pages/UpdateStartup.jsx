import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const UpdateStartup = () => {
  const { startupId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    domain: '',
    stage: '',
    location: '',
    description: '',
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [pitchFile, setPitchFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const res = await API.get(`/getStartupById/${startupId}`);
        setForm(res.data.startup);
      } catch (error) {
        console.error('Error fetching startup:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
  }, [startupId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (pdfFile) formData.append('startupPdf', pdfFile);
      if (pitchFile) formData.append('pitch', pitchFile);

      await API.put(`/updateStartupProfile/${startupId}`, formData);
      alert('Startup updated successfully!');
      navigate('/founder-profile');
    } catch (error) {
      console.error('Error updating startup:', error);
      alert('Update failed!');
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Update Startup</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Title"
          required
        />
        <input
          type="text"
          name="domain"
          value={form.domain}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Domain"
        />
        <input
          type="text"
          name="stage"
          value={form.stage}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Stage"
        />
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Location"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Description"
        ></textarea>

        <div>
          <label className="block mb-1">Upload New PDF (optional):</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
          />
        </div>

        <div>
          <label className="block mb-1">Upload New Pitch Video (optional):</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setPitchFile(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Update Startup
        </button>
      </form>
    </div>
  );
};

export default UpdateStartup;
