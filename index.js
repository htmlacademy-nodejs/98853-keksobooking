'use strict';
require(`colors`);
const init = require(`./src/init.js`);

require(`dotenv`).config();

const command = process.argv[2];

init(command);

