const express = require("express");

const api = require('./api');

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.static("src/public"));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

const server = app.listen(PORT, () => {
  console.log(`We are live on ${server.address().address} at`, server.address().port);
});