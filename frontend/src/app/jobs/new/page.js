'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewJobPage() {
  const router = useRouter();
  
  // State tracking for all input fields required by the data model
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Plumbing', // Default fallback option matching enum
    location: '',
    contactName: '',
    contactEmail: ''
  });
  
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // 1. Client-side Validation Checks
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim() || !formData.contactName.trim() || !formData.contactEmail.trim()) {
      setError('All form fields are strictly required.');
      setSubmitting(false);
      return;
    }

    // Basic email format check before making an API call
    const emailRegex = /^\s*[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}\s*$/;
    if (!emailRegex.test(formData.contactEmail)) {
      setError('Please enter a valid email address layout (e.g., name@domain.com).');
      setSubmitting(false);
      return;
    }

    // 2. Send data to Express API
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit service request.');
      }

      // Success! Redirect back to the home page trade board
      router.push('/');
      router.refresh(); // Forces Next.js to pull the fresh dataset from the backend
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Post a Service Request</h1>
        <p className="text-sm text-gray-500">Provide details so tradespeople can review your request</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 p-3 rounded-lg text-sm font-medium mb-4">
          ⚠️ {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title</label>
          <input 
            type="text" 
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            placeholder="e.g., Need a plumber for a leaking kitchen tap"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})} 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
          <select 
            className="w-full border border-gray-300 p-2 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
          >
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Painting">Painting</option>
            <option value="Joinery">Joinery</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea 
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            rows="4" 
            placeholder="Describe the job specifications or problem in detail..."
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})} 
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
          <input 
            type="text" 
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            placeholder="e.g., Glasgow"
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})} 
            required 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Name</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Your Name"
              value={formData.contactName}
              onChange={e => setFormData({...formData, contactName: e.target.value})} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="name@example.com"
              value={formData.contactEmail}
              onChange={e => setFormData({...formData, contactEmail: e.target.value})} 
              required 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          className="w-full bg-blue-600 text-white p-2.5 rounded-md font-bold hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 mt-2 shadow-sm"
        >
          {submitting ? 'Submitting Request...' : 'Submit Job Request'}
        </button>
      </form>
    </div>
  );
}