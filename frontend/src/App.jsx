import { useState } from 'react';
import axios from 'axios';
import config from './config';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const extractFilename = (contentDisposition) => {
    if (!contentDisposition) {
      addLog('No Content-Disposition header provided to extractFilename');
      return null;
    }
    
    addLog(`=== FILENAME EXTRACTION ===`);
    addLog(`1. Raw Content-Disposition header: ${contentDisposition}`);
    
    // Try different patterns for filename extraction
    const patterns = [
      { name: 'Standard format', pattern: /filename="([^"]+)"/ },
      { name: 'Without quotes', pattern: /filename=([^;]+)/ },
      { name: 'URL encoded', pattern: /filename=([^&]+)/ }
    ];

    for (const { name, pattern } of patterns) {
      const match = contentDisposition.match(pattern);
      if (match) {
        const extracted = decodeURIComponent(match[1]);
        addLog(`2. Successfully extracted filename using ${name}: ${extracted}`);
        return extracted;
      }
      addLog(`   Pattern ${name} did not match`);
    }
    
    addLog('3. No filename pattern matched');
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    addLog(`Starting download for URL: ${url}`);

    try {
      const apiUrl = `${config.API_BASE_URL}${config.API_ENDPOINT}`;
      addLog(`Sending request to: ${apiUrl}`);
      const response = await axios.post(apiUrl, { url }, {
        responseType: 'blob',
        headers: {
          'Accept': 'audio/mpeg',
        },
        // Enable CORS
        withCredentials: false
      });
      addLog('Received response from backend');

      // Log all response headers for debugging
      addLog('=== RESPONSE HEADERS ===');
      Object.entries(response.headers).forEach(([key, value]) => {
        addLog(`  ${key}: ${value}`);
      });

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      addLog(`=== FILENAME HANDLING ===`);
      addLog(`1. Content-Disposition header: ${contentDisposition}`);
      
      let filename = 'audio.mp3';
      if (contentDisposition) {
        const extractedFilename = extractFilename(contentDisposition);
        if (extractedFilename) {
          filename = extractedFilename;
          addLog(`2. Using extracted filename: ${filename}`);
        } else {
          addLog('3. Could not extract filename from Content-Disposition header, using default: audio.mp3');
        }
      } else {
        addLog('2. No Content-Disposition header found, using default: audio.mp3');
      }

      // Create a download link
      addLog('=== DOWNLOAD PROCESS ===');
      addLog('1. Creating download link...');
      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      addLog(`2. Created blob of size: ${blob.size} bytes`);
      
      const downloadUrl = window.URL.createObjectURL(blob);
      addLog('3. Created object URL for download');
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      addLog(`4. Setting download filename to: ${filename}`);
      
      document.body.appendChild(link);
      addLog('5. Starting file download...');
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      addLog('6. Download completed successfully');
      addLog(`7. Final filename used: ${filename}`);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to download audio';
      addLog(`Error: ${errorMessage}`);
      if (err.response) {
        addLog('Error response headers:');
        Object.entries(err.response.headers).forEach(([key, value]) => {
          addLog(`  ${key}: ${value}`);
        });
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>YouTube to MP3 Downloader</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube URL here"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Downloading...' : 'Download MP3'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <div className="logs">
        <h3>Activity Log</h3>
        <div className="log-container">
          {logs.map((log, index) => (
            <div key={index} className="log-entry">{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
