// Configuration for API endpoints
const config = {
  // Auto-detect production environment and use same domain
  API_BASE_URL: import.meta.env.VITE_API_URL || 
                (window.location.hostname === 'localhost' ? 'http://localhost:5001' : ''),
  API_ENDPOINT: '/api/download'
};

export default config; 