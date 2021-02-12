const fs = require('fs');
const path = require('path');
const express = require("express");
const multer = require('multer');
const parseCsv = require('../tools/parse-csv');
const parseProperties = require('../tools/parse-properties');
const upload = multer({
  limits: {
    fileSize: '50m',
    files: 5,
  },
});


const api = express.Router()

const readHandler = (parser, key) => async (req, res) => {
  if (Array.isArray(req.files)) {
    try {
      const files = [];
      const deleteActions = [];
      for (const file of req.files) {
        const data = await parser(file.buffer.toString('utf-8'));
        deleteActions.push(() => fs.unlinkSync(file.path));
        files.push({
          file,
          [key]: data,
          size: file.size,
          name: path.parse(file.originalname).name,
          ext: path.parse(file.originalname).ext,
        });
      }
      
      res.json({
        files,
        body: req.body,
      });
      process.nextTick(() => {
        deleteActions.forEach((action) => {
          try {
            action()
          } catch (error) {
            console.error(error);
          }
        });
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
  else {
    res.sendStatus(400);
  }
}

api.post('/read-properties', upload.any(), readHandler((content) => parseProperties(content), 'json'));
api.post('/read-json', upload.any(), readHandler((content) => JSON.parse(content), 'json'));
api.post('/read-csv', upload.any(), readHandler((content) => parseCsv(content), 'rows'));
/* 
* Import/Export .csv
* Export .json para cada idioma
*/

module.exports = api;