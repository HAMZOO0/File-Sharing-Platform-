const express = require("express");
const multer = require("multer");
const ejs = require("ejs");

const app = express();

const PORT = 3000;

app.set("view engine", "ejs");

//  const upload = multer({dest:"upload/"}) // this si middleware

const storage = multer.diskStorage({
  destination: function (req, file, cal_bk) {

   return cal_bk(null ,'./upload')

  },

  filename: function (req, file, cal_bk) {
    return cal_bk (null , `${Date.now()}-- ${file.originalname}`)

  },
});

const upload = multer({storage})

app.get("/", (req, res) => {
  res.render("upload");
});

app.post("/upload", upload.single("fileuploader"), (req, res) => {
  console.log(req.body);
  console.log(req.file);

  return res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
