const express = require('express');
const path = require('path');
const multer = require('multer');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Ensure 'upload' directory exists or handle it dynamically for production
const uploadDir = path.join(__dirname, 'upload');
app.use('/upload', express.static(uploadDir));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.render('upload');
});

app.post('/upload', upload.single('fileuploader'), (req, res) => {
    const fileName = req.file.filename;
    const downloadUrl = `${req.protocol}://${req.get('host')}/download/${fileName}`;
    res.render('link', { downloadUrl });
});

app.get('/download/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const fileUrl = `/upload/${fileName}`;
    res.render('download', { fileUrl });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
