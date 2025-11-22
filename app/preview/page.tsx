'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function PreviewContent() {
  const searchParams = useSearchParams();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const name = searchParams.get('name');
    const distance = searchParams.get('distance');

    if (!name || !distance) {
      setError('Name and distance are required');
      setLoading(false);
      return;
    }

    // Use GET endpoint directly - more reliable in production
    // This avoids blob URLs and client-side processing
    const previewUrl = `/api/certificate/preview?name=${encodeURIComponent(name)}&distance=${encodeURIComponent(distance)}`;
    setPreviewUrl(previewUrl);
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-600 border-t-transparent mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Certificate</h2>
          <p className="text-gray-600">Please wait while we create your certificate preview...</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Certificate Preview</h1>
          </div>
          <div className="w-full" style={{ height: 'calc(100vh - 120px)', minHeight: '800px' }}>
            {previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title="Certificate Preview"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600 mb-4"></div>
          <p className="text-gray-700 text-lg">Loading...</p>
        </div>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  );
}
