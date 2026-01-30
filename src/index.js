import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Affiliate Redirect Component
function AffiliateRedirect() {
  const { code } = useParams();
  const [status, setStatus] = React.useState('loading');
  
  React.useEffect(() => {
    const redirect = async () => {
      try {
        // Track click
        await fetch('http://localhost:5000/api/track/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ linkCode: code })
        });
        
        // Get product URL
        const res = await fetch(`http://localhost:5000/api/affiliate/link/${code}`);
        const data = await res.json();
        
        if (data.product_url) {
          window.location.href = data.product_url;
        } else {
          // Fallback: redirect to home
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
      } catch (err) {
        setStatus('error');
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    };
    redirect();
  }, [code]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-white text-xl">Weiterleitung...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-white text-xl">Link nicht gefunden</p>
            <p className="text-gray-400 mt-2">Weiterleitung zur Startseite...</p>
          </>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/aff/:code" element={<AffiliateRedirect />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();