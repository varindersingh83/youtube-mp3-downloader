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

router.post('/download', (req, res) => {
  const { url } = req.body;
  console.log('Received download request for URL:', url);
  
  if (!url) {
    console.error('Error: Missing URL in request');
    return res.status(400).json({ error: 'Missing URL' });
  }

  // First, get the video title
  const getTitleCommand = `yt-dlp --get-title "${url}"`;
  console.log('Getting video title with command:', getTitleCommand);

  exec(getTitleCommand, (titleErr, titleStdout, titleStderr) => {
    if (titleErr) {
      console.error('Error getting title:', titleErr);
      console.error('Error details:', titleStderr);
      return res.status(500).json({ error: 'Failed to get video title' });
    }

    const title = titleStdout.trim();
    console.log('=== TITLE HANDLING ===');
    console.log('1. Raw title from YouTube:', title);
    console.log('2. Title that will be used in filename:', `${title}.mp3`);

    // Sanitize the title to make it safe for filenames
    const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    console.log('3. Sanitized title for temporary file:', sanitizedTitle);
    
    const outputPath = path.join(downloadFolder, `${sanitizedTitle}.mp3`);
    console.log('4. Temporary file path:', outputPath);
    
    const command = `yt-dlp -x --audio-format mp3 -o "${outputPath}" "${url}"`;
    console.log('Executing download command:', command);

    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error('Download error:', err);
        console.error('Error details:', stderr);
        return res.status(500).json({ error: 'Download failed' });
      }

      console.log('Download output:', stdout);
      
      if (!fs.existsSync(outputPath)) {
        console.error('Error: MP3 file not found at expected path');
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
    });
  });
});

module.exports = router;
