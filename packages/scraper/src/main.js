const download = require('./download');
const path = require('path');
const puppeteer = require('puppeteer');

const fs = require('fs');

/**
 * @typedef {Object} Pokemon
 * @property {string} url
 * @property {string} name
 * @property {string} image
 */

async function main() {
  const browser = await puppeteer.launch();

  console.log('Browser was launched');

  const page = await browser.newPage();

  console.log('Page was created');

  await page.goto('https://wiki.pokexgames.com/index.php/Pok%C3%A9mon');

  console.log('Page was loaded');

  /** @type {Pokemon[]} */
  const pokemon = await page.evaluate(() => {
    /** @type {(pokemon: Partial<Pokemon>) => pokemon is Pokemon} */
    function isPokemon(pokemon) {
      return Boolean(
        pokemon.url?.trim() &&
          pokemon.name?.trim() &&
          !pokemon.image?.includes('XVazio.png'),
      );
    }

    /** @type {(table: HTMLTableElement) => [number, number][]} */
    function getColumnPairs(table) {
      const row = table.querySelector('tr');
      const cells = row?.querySelectorAll('td, th') ?? [];

      return Array.from(cells).reduce((pairs, cell, index) => {
        if (cell.innerText?.includes('Icone'))
          pairs[pairs.length] = [index, null];
        if (cell.innerText?.includes('Nome'))
          pairs[pairs.length - 1][1] = index;
        return pairs;
      }, []);
    }

    const tables = document.querySelectorAll('table');

    return Array.from(tables).flatMap((table) => {
      const pairs = getColumnPairs(table);

      const rows = table.querySelectorAll('tr');

      const pokemon = Array.from(rows).flatMap((row) => {
        return pairs.map(([icon, name]) => {
          const cells = row.querySelectorAll(`td`);

          return {
            url: cells[name]?.querySelector('a')?.href,
            name: cells[name]?.innerText,
            image: cells[icon]?.querySelector('img')?.src,
          };
        });
      });

      return pokemon.filter(isPokemon);
    });
  });

  console.log('Page was scraped');

  const file = path.resolve(__dirname, '../data/pokemon.json');

  const json = JSON.stringify(pokemon, null, 2);

  await new Promise((resolve, reject) => {
    fs.writeFile(file, json, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

  console.log('JSON was written');

  for (const { image } of pokemon) {
    const file = path.resolve(
      __dirname,
      '../data/images/' + (image.split('/').pop() ?? 'Unknown'),
    );

    await download(image, file);
  }

  console.log('Images were downloaded');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
