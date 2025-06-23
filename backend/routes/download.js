const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const downloadFolder = path.join(__dirname, '..', 'downloads');
if (!fs.existsSync(downloadFolder)) {
  console.log('Creating downloads directory:', downloadFolder);
  fs.mkdirSync(downloadFolder);
}

// Function to clean YouTube URL (remove playlist parameters)
function cleanYouTubeUrl(url) {
  console.log('=== URL CLEANING ===');
  console.log('Original URL:', url);
  
  // Remove playlist and radio parameters
  let cleanUrl = url;
  if (url.includes('&list=') || url.includes('&start_radio=')) {
    cleanUrl = url.split('&')[0]; // Take only the video ID part
    console.log('Cleaned URL (removed playlist params):', cleanUrl);
  }
  
  return cleanUrl;
}

router.post('/download', (req, res) => {
  const { url } = req.body;
  console.log('=== DOWNLOAD REQUEST START ===');
  console.log('Received download request for URL:', url);
  console.log('Current working directory:', process.cwd());
  console.log('Download folder:', downloadFolder);
  
  if (!url) {
    console.error('Error: Missing URL in request');
    return res.status(400).json({ error: 'Missing URL' });
  }

  // Clean the URL to remove playlist parameters
  const cleanUrl = cleanYouTubeUrl(url);
  console.log('Using cleaned URL for processing:', cleanUrl);

  // Check if yt-dlp is available
  console.log('=== CHECKING YT-DLP ===');
  exec('which yt-dlp', (whichErr, whichStdout, whichStderr) => {
    if (whichErr) {
      console.error('yt-dlp not found in PATH:', whichErr);
      console.error('which stderr:', whichStderr);
      return res.status(500).json({ error: 'yt-dlp not found' });
    }
    console.log('yt-dlp found at:', whichStdout.trim());
    
    // Check yt-dlp version
    exec('yt-dlp --version', (versionErr, versionStdout, versionStderr) => {
      if (versionErr) {
        console.error('Error getting yt-dlp version:', versionErr);
        console.error('Version stderr:', versionStderr);
      } else {
        console.log('yt-dlp version:', versionStdout.trim());
      }
      
      // First, get the video title with anti-detection measures and playlist handling
      const getTitleCommand = `yt-dlp --get-title --no-check-certificates --no-playlist --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "${cleanUrl}"`;
      console.log('=== GETTING VIDEO TITLE ===');
      console.log('Getting video title with command:', getTitleCommand);

      exec(getTitleCommand, { timeout: 60000 }, (titleErr, titleStdout, titleStderr) => {
        console.log('=== TITLE COMMAND RESULT ===');
        console.log('Title command completed');
        console.log('Title stdout length:', titleStdout ? titleStdout.length : 0);
        console.log('Title stderr length:', titleStderr ? titleStderr.length : 0);
        
        if (titleErr) {
          console.error('Error getting title:', titleErr);
          console.error('Error details:', titleStderr);
          console.error('Title stdout (if any):', titleStdout);
          
          // Check if it's a timeout issue
          if (titleErr.signal === 'SIGTERM') {
            console.error('Command was killed by timeout (SIGTERM)');
            console.error('This might be due to playlist processing taking too long');
          }
          
          // Try alternative approach with different user agent and longer timeout
          console.log('=== RETRYING WITH ALTERNATIVE USER AGENT ===');
          const altTitleCommand = `yt-dlp --get-title --no-check-certificates --no-playlist --user-agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${cleanUrl}"`;
          
          exec(altTitleCommand, { timeout: 90000 }, (altTitleErr, altTitleStdout, altTitleStderr) => {
            console.log('=== ALTERNATIVE TITLE COMMAND RESULT ===');
            console.log('Alternative title command completed');
            console.log('Alternative title stdout length:', altTitleStdout ? altTitleStdout.length : 0);
            
            if (altTitleErr) {
              console.error('Alternative title command also failed:', altTitleErr);
              console.error('Alternative error details:', altTitleStderr);
              if (altTitleErr.signal === 'SIGTERM') {
                console.error('Alternative command also killed by timeout');
              }
              return res.status(500).json({ error: 'Failed to get video title - YouTube bot detection or timeout' });
            }
            
            const title = altTitleStdout.trim();
            console.log('Alternative title command succeeded:', title);
            processDownload(title, cleanUrl, res);
          });
          return;
        }

        const title = titleStdout.trim();
        console.log('=== TITLE HANDLING ===');
        console.log('1. Raw title from YouTube:', title);
        console.log('2. Title that will be used in filename:', `${title}.mp3`);

        processDownload(title, cleanUrl, res);
      });
    });
  });
});

function processDownload(title, url, res) {
  // Sanitize the title to make it safe for filenames
  const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  console.log('3. Sanitized title for temporary file:', sanitizedTitle);
  
  const outputPath = path.join(downloadFolder, `${sanitizedTitle}.mp3`);
  console.log('4. Temporary file path:', outputPath);
  
  // Use anti-detection measures for download with playlist handling
  const command = `yt-dlp -x --audio-format mp3 --no-check-certificates --no-playlist --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" --sleep-interval 2 --max-sleep-interval 5 -o "${outputPath}" "${url}"`;
  console.log('=== DOWNLOADING AUDIO ===');
  console.log('Executing download command:', command);

  exec(command, { timeout: 180000 }, (err, stdout, stderr) => {
    console.log('=== DOWNLOAD COMMAND RESULT ===');
    console.log('Download command completed');
    console.log('Download stdout length:', stdout ? stdout.length : 0);
    console.log('Download stderr length:', stderr ? stderr.length : 0);
    
    if (err) {
      console.error('Download error:', err);
      console.error('Error details:', stderr);
      console.error('Download stdout (if any):', stdout);
      
      if (err.signal === 'SIGTERM') {
        console.error('Download command was killed by timeout (SIGTERM)');
      }
      
      // Try alternative download approach
      console.log('=== RETRYING DOWNLOAD WITH ALTERNATIVE USER AGENT ===');
      const altCommand = `yt-dlp -x --audio-format mp3 --no-check-certificates --no-playlist --user-agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" --sleep-interval 3 --max-sleep-interval 7 -o "${outputPath}" "${url}"`;
      
      exec(altCommand, { timeout: 240000 }, (altErr, altStdout, altStderr) => {
        console.log('=== ALTERNATIVE DOWNLOAD COMMAND RESULT ===');
        console.log('Alternative download command completed');
        console.log('Alternative download stdout length:', altStdout ? altStdout.length : 0);
        
        if (altErr) {
          console.error('Alternative download command also failed:', altErr);
          console.error('Alternative error details:', altStderr);
          if (altErr.signal === 'SIGTERM') {
            console.error('Alternative download command also killed by timeout');
          }
          return res.status(500).json({ error: 'Download failed - YouTube bot detection or timeout' });
        }
        
        console.log('Alternative download command succeeded:', altStdout);
        sendFile(outputPath, title, res);
      });
      return;
    }

    console.log('Download output:', stdout);
    sendFile(outputPath, title, res);
  });
}

function sendFile(outputPath, title, res) {
  if (!fs.existsSync(outputPath)) {
    console.error('Error: MP3 file not found at expected path');
    console.error('Checking download folder contents:');
    try {
      const files = fs.readdirSync(downloadFolder);
      console.error('Files in download folder:', files);
    } catch (readErr) {
      console.error('Error reading download folder:', readErr);
    }
    return res.status(500).json({ error: 'MP3 not found' });
  }

  console.log('Found MP3 file:', outputPath);
  console.log('=== SENDING FILE ===');
  
  // Get file stats
  const stats = fs.statSync(outputPath);
  console.log('File size:', stats.size);

  // Set CORS headers
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  
  // Set content headers
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Length', stats.size);
  res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
  
  console.log('5. Headers set:');
  console.log('   Content-Type:', res.getHeader('Content-Type'));
  console.log('   Content-Length:', res.getHeader('Content-Length'));
  console.log('   Content-Disposition:', res.getHeader('Content-Disposition'));

  // Create a read stream and pipe it to the response
  const fileStream = fs.createReadStream(outputPath);
  fileStream.pipe(res);

  // Handle cleanup after the file is sent
  fileStream.on('end', () => {
    console.log('6. File sent successfully with filename:', `${title}.mp3`);
    // Cleanup
    fs.unlink(outputPath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log('7. Temporary file deleted:', outputPath);
      }
    });
  });

  fileStream.on('error', (err) => {
    console.error('Error streaming file:', err);
    res.status(500).json({ error: 'Error streaming file' });
  });
}

module.exports = router;
