'use strict';

const http = require(`http`);
const url = require(`url`);
const fs = require(`fs`);
const path = require(`path`);
const {promisify} = require(`util`);
let mime = require(`mime-types`);

const read = promisify(fs.readFile);
const open = promisify(fs.open);

const DEFAULT_PORT = 3000;
const HOSTNAME = `127.0.0.1`;

const STATUS_CODES = {
  OK: `200`,
  notFound: `404`
};

const NOT_FOUND_MESSAGE = `Такой страницы не существует!`;

const DIR_NAME_WITH_STATIC = `static`;

const basePath = `${path.resolve(__dirname, `..`)}/${DIR_NAME_WITH_STATIC}`;

const readFile = async (filePath, res) => {
  try {
    await open(filePath, `r`);
  } catch (error) {
    if (error.code === `ENOENT`) {
      res.writeHead(STATUS_CODES.notFound, error.message, {
        'content-type': `text/plain; charset=UTF-8`
      });
      res.end(NOT_FOUND_MESSAGE);
      return;
    }
  }

  const data = await read(filePath);
  const contentType = mime.contentType(path.extname(filePath));

  res.writeHead(STATUS_CODES.OK, {
    'content-type': contentType
  });

  res.end(data);
};

const server = http.createServer(async (req, res) => {

  let filePath;

  const parsedUrl = url.parse(req.url).pathname;

  // parsedUrl === `/` ? filePath = `index.html` : filePath = parsedUrl;  ESLint ругается "Expected an assignment or function call and instead saw an expression"

  if (parsedUrl === `/`) {
    filePath = `index.html`;
  } else {
    filePath = parsedUrl;
  }

  const fullPath = `${basePath}/${filePath}`;

  try {
    await readFile(fullPath, res);
  } catch (error) {
    res.writeHead(500, error.message, {
      'content-type': `text-plain`
    });
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
