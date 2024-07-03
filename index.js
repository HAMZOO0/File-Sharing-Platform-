




const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const uploadDir = path.join(__dirname, 'public', 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.set('view engine', 'ejs');
app.use(express.static('public'));

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
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});




