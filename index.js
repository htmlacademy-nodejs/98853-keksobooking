'use strict';

require(`colors`);
const init = require(`./src/init.js`);
const {generateEntity} = require(`./src/generate.js`);

console.log(generateEntity());
const command = process.argv[2];

init(command);

