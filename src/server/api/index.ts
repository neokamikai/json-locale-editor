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
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  } else {
    res.sendStatus(400);
  }
};
const jsonParser = (content: string) => {
  try {
    return JSON.parse(content.trim());
  } catch (error: any) {
    let errorPos = Number(error.message.substr(error.message.indexOf('at position')+12));
    const offset = 3;
    let countLinesBeforeError = content.substr(0, errorPos)
      .replace(/\r/g, '').replace(/\n$/, '').split('\n').length-2;
    let allLines = content.split(/\n/);
    allLines[countLinesBeforeError] = `<span style="color: red">${allLines[countLinesBeforeError]}</span>`;
    let linesToDisplay = allLines
      .slice(Math.max(0, countLinesBeforeError-offset), Math.min(countLinesBeforeError+offset+1,allLines.length));
      error.message += `\n<pre style="text-align: left">\n${linesToDisplay.join('\n')}</pre>`;
      throw error;
  }
}
api.post('/read-properties', upload.any(), readHandler((content: string) => parseProperties(content), 'json'));
api.post('/read-json', upload.any(), readHandler(jsonParser, 'json'));
api.post('/read-csv', upload.any(), readHandler((content: string) => parseCsv(content), 'rows'));
/*
* Import/Export .csv
* Export .json para cada idioma
*/

export default api;
