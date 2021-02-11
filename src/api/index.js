const fs = require('fs');
const path = require('path');
const express = require("express");
const multer = require('multer');
const parseCsv = require('../tools/parse-csv');
const upload = multer({
  limits: {
    fileSize: '50m',
    files: 5,
  },
});


const api = express.Router()

api.post('/read-json', upload.any(), (req, res) => {

  if (Array.isArray(req.files)) {
    try {
      const files = [];
      const deleteActions = [];
      req.files.forEach((file) => {
        const json = JSON.parse(file.buffer.toString('utf-8'));
        deleteActions.push(() => fs.unlinkSync(file.path));
        files.push({
          file,
          json,
          size: file.size,
          name: path.parse(file.originalname).name,
        });
      });
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
});
api.post('/read-csv', upload.any(), async (req, res) => {
  if (Array.isArray(req.files)) {
    try {
      const files = [];
      const deleteActions = [];
      for (const file of req.files) {
        const rows = await parseCsv(file.buffer.toString('utf-8'));
        deleteActions.push(() => fs.unlinkSync(file.path));
        files.push({
          file,
          rows,
          size: file.size,
          name: path.parse(file.originalname).name,
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
});
/* 
* Import/Export .csv
* Export .json para cada idioma
*/

module.exports = api;