'use strict';

const puppeteer = require('puppeteer');

const data = require('../data/pokemon.json');
const saveJSON = require('./utils/saveJSON');

/**
 * @typedef {Object} Move
 * @property {Pokemon} pokemon
 * @property {string | null} name
 * @property {string | null} type
 * @property {string[]} status
 * @property {string | null} position
 * @property {string | null} level
 */


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

  const allMoves = [];

  for (const pokemon of data) {
    await page.goto(pokemon.url);

    console.log(`Opened "${pokemon.name}" page`);

    /** @type {Omit<Move, 'pokemon'>[]} */
    const moves = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tr[align="center"]'));
      return rows.reduce((moves, row) => {
        const position = row.querySelector('th');
      
        if (position) {
          moves.push({
            name: row.querySelector('td:nth-of-type(2)')?.innerText?.trim() || null,
            type: row.querySelector('td:nth-of-type(5)')?.querySelector('a')?.title?.trim() || null,
            level: null,
            status: Array.from(row.querySelector('td:nth-of-type(4)')?.querySelectorAll('a') ?? [], link => link?.title?.trim()).filter(Boolean),
            position: position.innerText?.trim() ?? null,
          });
        } else {
          const move = moves[moves.length - 1];
          if (move) {
            move.level = row.querySelector('td:nth-of-type(2)')?.innerText?.trim() || null
          }
        }
      
        return moves;
      }, /** @type {Omit<Move, 'pokemon'>[]} */([]));
    });

    console.log(`Evaluated "${pokemon.name}" moves`);

    allMoves.push(...moves.map((move) => ({ ...move, pokemon })));

    await saveJSON('moves.json', allMoves);
  
    console.log('JSON was updated');
  }

  await page.close();

  console.log('Page was closed');

  await browser.close();

  console.log('Browser was closed');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
