'use strict';

const saveJSON = require('./utils/saveJSON');

const data = require('../data/moves.json');

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

/** @type {(move: Move, reason: string) => never} */
function showError(move, reason) {
  throw new Error(`
    Error at ${move.name} of ${move.pokemon.name}
    ${reason}
  `);
}

/** @type {(move: Move) => string} */
function resolvePosition(move) {
  if (!move.position) {
    showError(move, 'No position.');
  }

  if (/m(\d+)/i.test(move.position)) {
    return move.position.toUpperCase();
  }

  if (/p(assive)?/i.test(move.position)) {
    return 'Passive';
  }

  showError(move, 'Invalid position');
}

/** @type {(move: Move) => string} */
function resolveName(move) {
  if (!move.name) {
    showError(move, 'No name.');
  }

  if (/[^\(\)]+\( ?\d*s ?\)/i.test(move.name)) {
    const [, name] = /([^\(\)]+)\( ?\d*s ?\)/.exec(move.name) ?? [];

    if (!name?.trim()) {
      showError(move, 'Can\'t separate name from cooldown.');
    }

    return name.trim();
  }

  return move.name.trim();
}

/** @type {(move: Move) => (number | null)} */
function resolveCooldown(move) {
  if (!move.name) {
    return null;
  }

  if (/[^\(\)]+\( ?\d+s ?\)/i.test(move.name)) {
    const [, cooldown] = /[^\(\)]+\( ?(\d+)s ?\)/i.exec(move.name) ?? [];

    if (!cooldown) {
      showError(move, 'Can\'t separate cooldown from name.');
    }

    return parseFloat(cooldown);
  }

  return null;
}

/** @type {(move: Move) => (number | null)} */
function resolveLevel(move) {
  if (!move.level?.trim()) {
    return null;
  }

  // Not a space.
  if (move.level === '⠀') {
    return null;
  }

  // Was empty in the site.
  if (move.pokemon.name === 'Sentret' && move.position === 'M3') {
    return 10;
  }

  // Was empty in the site.
  if (move.pokemon.name === 'Claydol' && move.position === 'M9') {
    return 80;
  }

  // Was empty in the site.
  if (move.pokemon.name === 'Sableye' && move.position === 'M4') {
    return 60;
  }

  // Was empty in the site and I don't have sure if its 40.
  if (move.pokemon.name === 'Snover' && move.position === 'M7') {
    return 40;
  }

  // Was empty in the site.
  if (move.pokemon.name === 'Shiny Scyther' && move.position === 'M10') {
    return 100;
  }

  // Was empty in the site.
  if (move.pokemon.name === 'Shiny Glaceon' && move.position === 'P') {
    return 100;
  }

  // Was empty in the site.
  if (move.pokemon.name === 'Shiny Vileplume' && move.position === 'M9') {
    return 100;
  }

  // Was empty in the site.
  if (move.pokemon.name === 'Shiny Mega Lucario' && move.position === 'P') {
    return 200;
  }

  if (/\d+/i.test(move.level)) {
    return parseInt(move.level, 10);
  }

  if (/level \d+/i.test(move.level)) {
    const [, level] = /level (\d+)/i.exec(move.level) ?? []

    if (!level) {
      showError(move, 'Can\'t get level.');
    }

    return parseInt(level, 10);
  }

  showError(move, 'Invalid level.');
}

/** @type {(pokemon: Pokemon) => string} */
function resolvePokemonName(pokemon) {
  if (pokemon.name === 'Nidoranfe') {
    return 'Nidoran♀';
  }

  if (pokemon.name === 'Nidoranma') {
    return 'Nidoran♂';
  }

  return pokemon.name;
}

const moves = data
  .map((move, index) => ({
    id: index.toString(10).padStart(4, '0'),
    position: resolvePosition(move),
    name: resolveName(move),
    type: move.type,
    cooldown: resolveCooldown(move),
    statuses: move.status ?? [],
    level: resolveLevel(move),
    pokemon: {
      name: resolvePokemonName(move.pokemon),
      icon: move.pokemon.image.split('/').pop(),
      link: move.pokemon.url,
    },
  }))
  .reduce((moves, moveA, index) => {
    const duplicated = moves.findIndex((moveB) => (
      moveA.name === moveB.name &&
      moveA.position === moveB.position &&
      moveA.pokemon.name === moveB.pokemon.name
    ));

    if (duplicated === -1 || moveA.pokemon.name === 'Castform' || moveA.pokemon.name === 'Rotom') {
      moves.push(moveA);
    }

    moves[duplicated] = moveA;

    return moves;
  }, []);

saveJSON('data.json', moves)
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
