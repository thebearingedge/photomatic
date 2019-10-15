const path = require('path');
const uuid = require('uuid');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, 'public/photos'));
  },
  filename: (req, file, callback) => {
    callback(null, uuid() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage
});

module.exports = upload;
