// Configuration for API endpoints
const config = {
  // Use environment variable if available, otherwise default to localhost
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  API_ENDPOINT: '/api/download'
};

export default config; 