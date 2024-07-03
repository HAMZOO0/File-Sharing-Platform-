// Import required modules
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000; // Use PORT from environment or default to 3000

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ensure 'uploads' directory exists within 'public'
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // Destination folder for uploads
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Rename file to avoid conflicts
    }
});
const upload = multer({ storage: storage });

// Route to display the upload form
app.get('/', (req, res) => {
    res.render('upload'); // Renders 'upload.ejs' from the 'views' directory
});

// Route to handle file uploads and generate a shareable link
app.post('/upload', upload.single('file'), (req, res) => {
    const fileName = req.file.filename;
    const downloadUrl = `${req.protocol}://${req.get('host')}/download/${fileName}`;
    res.render('link', { downloadUrl }); // Renders 'link.ejs' with the download URL
});

// Route to handle file downloads
app.get('/download/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, 'public', 'uploads', fileName);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        res.download(filePath, fileName); // Download the file
    } else {
        res.status(404).send('File not found'); // Handle file not found
    }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
