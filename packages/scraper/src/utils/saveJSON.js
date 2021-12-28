'use strict';

const fs = require('fs');
const path = require('path');

/** @type {(name: string, data: unknown) => Promise<void>} */
function saveJSON(name, data) {
  const file = path.resolve(__dirname, '../../data/' + name);

  const json = JSON.stringify(data, null, 2);

  return new Promise((resolve, reject) => {
    fs.writeFile(file, json, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

module.exports = saveJSON;
