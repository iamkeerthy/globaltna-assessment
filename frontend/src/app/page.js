'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // Build the URL depending on whether a category filter is selected
        const url = category 
          ? `${process.env.NEXT_PUBLIC_API_URL}/jobs?category=${category}`
          : `${process.env.NEXT_PUBLIC_API_URL}/jobs`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error('Error loading jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [category]); // This runs automatically whenever the category filter dropdown changes

  return (
    <div className="space-y-6">
      {/* Header section with Filter Dropdown */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Service Requests</h1>
          <p className="text-sm text-gray-500">Browse and manage active trade jobs</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="category-filter" className="text-sm font-medium text-gray-600 whitespace-nowrap">Filter by:</label>
          <select 
            id="category-filter"
            className="w-full sm:w-48 border border-gray-300 p-2 rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Painting">Painting</option>
            <option value="Joinery">Joinery</option>
          </select>
        </div>
      </div>

      {/* Main Board Display Area */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-medium">Loading trade board records...</div>
      ) : jobs.length === 0 ? (
        <div className="bg-white text-center py-16 rounded-xl border border-dashed border-gray-300 shadow-sm">
          <p className="text-gray-500 text-lg font-medium mb-1">No service requests found</p>
          <p className="text-sm text-gray-400">Be the first to post a request using the button above!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="border border-gray-200 p-5 rounded-xl shadow-sm bg-white hover:shadow-md transition duration-200 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {job.category}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    job.status === 'Open' ? 'bg-green-100 text-green-800' :
                    job.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{job.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">{job.description}</p>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100 mt-auto">
                <span className="font-medium">📍 {job.location}</span>
                <Link href={`/jobs/${job._id}`} className="text-blue-500 hover:text-blue-700 font-bold flex items-center gap-0.5">
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}