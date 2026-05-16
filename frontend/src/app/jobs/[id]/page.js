'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function JobDetailPage({ params }) {
  // Unwrap the dynamic ID route parameters
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`);
        if (!res.ok) throw new Error('Job request details are missing or unavailable.');
        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) throw new Error('Could not update status parameters.');
      const updatedJob = await res.json();
      setJob(updatedJob); // Instantly changes the badge state on screen
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you strictly sure you want to permanently delete this service request?')) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Could not remove the selected job record.');
      
      router.push('/');
      router.refresh();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading job details...</div>;
  if (error) return <div className="text-center py-12 text-red-500 font-medium">⚠️ {error}</div>;
  if (!job) return <div className="text-center py-12 text-gray-500">Job request not found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-100">
      {/* Upper Title Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
            {job.category}
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">{job.title}</h1>
        </div>
        
        <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 min-w-[140px]">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Update Status</label>
          <select 
            value={job.status} 
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded p-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Description Content */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Job Description</h3>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
          {job.description}
        </p>
      </div>

      {/* Contact Details Meta Block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-gray-100 py-4 mb-6 text-sm text-gray-600">
        <div>📍 <span className="font-bold text-gray-800">Location:</span> {job.location}</div>
        <div>👤 <span className="font-bold text-gray-800">Client:</span> {job.contactName}</div>
        <div className="truncate">✉️ <span className="font-bold text-gray-800">Email:</span> {job.contactEmail}</div>
      </div>

      {/* Navigation Buttons Block */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => router.push('/')} 
          className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition duration-200"
        >
          &larr; Back to Trade Board
        </button>
        <button 
          onClick={handleDelete} 
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 font-bold text-sm shadow-sm"
        >
          Delete Request
        </button>
      </div>
    </div>
  );
}