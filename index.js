const express = require('express');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.render('upload'); // Ensure upload.ejs exists
});

app.post('/upload', upload.single('fileuploader'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        const fileName = req.file.filename;
        const downloadUrl = `${req.protocol}://${req.get('host')}/download/${fileName}`;
        res.render('link', { downloadUrl }); // Ensure link.ejs exists
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/download/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const fileUrl = `/upload/${fileName}`;
    res.render('download', { fileUrl }); // Ensure download.ejs exists
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
