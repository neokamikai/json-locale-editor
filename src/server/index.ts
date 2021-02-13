import express from 'express';
import { AddressInfo } from 'net';
import api from './api';
import Logger from './tools/logger';

const logger = Logger.instance('main');
const app = express();

const { PORT = 3000 } = process.env;

app.use(express.static('src/public'));
app.use(express.json({ }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

const server = app.listen(PORT, () => {
  const serverAddress = (server.address() as AddressInfo);
  logger.log(`We are live on http://127.0.0.1:${serverAddress.port}`);
});
