const fs = require('fs');
const https = require('https');

/** @type {(url: string, destionation: string) => Promise<void>} */
function download(url, destination) {
  const file = fs.createWriteStream(destination);

  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        response.pipe(file);

        file.on('finish', () => {
          file.close((error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      })
      .on('error', (error) => {
        fs.unlink(destination, (error) => {
          reject(error);
        });

        reject(error);
      });
  });
}

module.exports = download;