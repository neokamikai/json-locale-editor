import fs from 'fs';
import path from 'path';
import express from 'express';
import multer from 'multer';
import parseCsv from '../tools/parse-csv';
import parseProperties from '../tools/parse-properties';
import Logger from '../tools/logger';

const logger = Logger.instance('src/api');

const MEGABYTE = 1024 * 1024;
const upload = multer({
  limits: {
    fileSize: 50 * MEGABYTE,
    files: 5,
  },
});

const api = express.Router();

const readHandler = (parser: Function, key: string) => async (
  req: express.Request, res: express.Response,
) => {
  if (Array.isArray(req.files)) {
    try {
      const files: Array<{
        file: any, size: number, ext: string, name: string, [key: string]: any,
      }> = [];
      await Promise.all(req.files.map(async (file) => {
        const data = await parser(file.buffer.toString('utf-8'));
        files.push({
          file,
          [key]: data,
          size: file.size,
          name: path.parse(file.originalname).name,
          ext: path.parse(file.originalname).ext,
        });
      }));

      res.json({
        files,
        body: req.body,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  } else {
    res.sendStatus(400);
  }
};

api.post('/read-properties', upload.any(), readHandler((content: string) => parseProperties(content), 'json'));
api.post('/read-json', upload.any(), readHandler((content: string) => JSON.parse(content.trim()), 'json'));
api.post('/read-csv', upload.any(), readHandler((content: string) => parseCsv(content), 'rows'));
/*
* Import/Export .csv
* Export .json para cada idioma
*/

export default api;
