const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

require('dotenv').config(); // Load environment variables
const app = express();

const PORT = process.env.PORT ; // Use environment variable or default to 3000

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//When you add express.static, you're telling Express to serve static files (like images, CSS files, or uploaded files) from a specified directory. Here’s what this line of code does:

app.use(express.static(path.join(__dirname, 'public'))); // for css

app.use('/upload', express.static(path.join(__dirname, 'upload')));

// Determine upload directory based on environment
const uploadDir = process.env.NODE_ENV === 'production' ? os.tmpdir() : path.join(__dirname, 'upload');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Route to display the upload form
app.get('/', (req, res) => {
    res.render('upload');
});

// Route to handle file upload and generate shareable link

app.post('/upload', upload.single('fileuploader'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        const fileName = req.file.filename;
        const downloadUrl = `${req.protocol}://${req.get('host')}/download/${fileName}`;
        res.render('link', { downloadUrl });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to display the download page
app.get('/download/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const fileUrl = `/upload/${fileName}`;
    res.render('download', { fileUrl });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
