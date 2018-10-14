'use strict';

const http = require(`http`);
const {promisify} = require(`util`);
const {parse} = require(`url`);
const {join, extname} = require(`path`);
const {readFile} = require(`fs`);

const fsReadFile = promisify(readFile);

const DEFAULT_PORT = 3000;
const HOSTNAME = `127.0.0.1`;

const StatusCodes = {
  OK: `200`,
  NOT_FOUND: `404`,
  SERVER_ERROR: `500`
};

const ContentTypes = {
  CSS: `text/css`,
  HTML: `text/html; charset=UTF-8`,
  JPG: `image/jpeg`,
  PNG: `image/png`,
  ICO: `image/x-icon`
};

const NOT_FOUND_MESSAGE = `Такой страницы не существует!`;

const DIR_NAME_WITH_STATIC = `static`;

const basePath = join(__dirname, `..`, DIR_NAME_WITH_STATIC);

const sendFile = async (filePath, res) => {
  const data = await fsReadFile(filePath);
  const ext = extname(filePath).slice(1);
  const contentType = ContentTypes[ext.toUpperCase()];
  res.writeHead(StatusCodes.OK, {
    'content-type': contentType
  });
  res.end(data);
};

const server = http.createServer(async (req, res) => {

  let filePath;

  const parsedUrl = parse(req.url).pathname;

  filePath = parsedUrl === `/` ? `index.html` : parsedUrl;

  const fullPath = join(basePath, filePath);

  try {
    await sendFile(fullPath, res);
  } catch (error) {
    if (error.code === `ENOENT`) {
      res.writeHead(StatusCodes.NOT_FOUND, {
        'content-type': `text/plain; charset=UTF-8`
      });
      res.end(NOT_FOUND_MESSAGE);
      return;
    }
    res.writeHead(StatusCodes.SERVER_ERROR, error.message, {
      'content-type': `text-plain`
    });
    console.log(error.message);
    res.end(error.message);
  }
});

const startServer = (port = DEFAULT_PORT) => {
  server.listen(port, HOSTNAME, () => {
    console.log(`Server starting... Go to http://${HOSTNAME}:${port}`);
  });
};

module.exports = {
  startServer
};
