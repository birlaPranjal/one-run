'use client';

import { useState } from 'react';

export default function CertificateGenerator() {
  const [name, setName] = useState('');
  const [distance, setDistance] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePreview = () => {
    if (!name || !distance) {
      setError('Please fill in both name and distance fields');
      return;
    }

    setError('');
    // Open preview in new tab
    const previewUrl = `/preview?name=${encodeURIComponent(name)}&distance=${encodeURIComponent(distance)}`;
    window.open(previewUrl, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, distance }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate certificate');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${name.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Reset form
      setName('');
      setDistance('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg text-black">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Certificate Generator
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="name" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Participant Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-black"
            placeholder="Enter participant name"
          />
        </div>

        <div>
          <label 
            htmlFor="distance" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Distance
          </label>
          <select
            id="distance"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white"
          >
            <option value="">Select distance</option>
            <option value="3 KM">3 KM</option>
            <option value="5 KM">5 KM</option>
            <option value="7 KM">7 KM</option>
          </select>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handlePreview}
            disabled={!name || !distance}
            className="flex-1 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Preview Certificate
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-6 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </form>
    </div>
  );
}

