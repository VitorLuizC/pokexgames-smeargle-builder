import "./App.css";
import moves from "./data.json";
import React, { useState } from "react";

const Sortment = Object.freeze({
  NONE: 0,
  ASCENDING: 1,
  DESCENDING: 2,
});

function SearchLabel({ label, sortment, onChange = () => undefined }) {
  return (
    <th onClick={onChange}>
      <span>{label}</span>
      {
        sortment !== Sortment.NONE && (
          <span>{sortment === Sortment.ASCENDING ? '▲' : '▼'}</span>
        )
      }
    </th>
  );
}

function App() {
  const [term, setTerm] = useState("");
  const [sorter, setSorter] = useState(undefined);
  const [sortment, setSortment] = useState(Sortment.NONE);

  const sortMoves = (moves) => {
    if (!sorter || sortment === Sortment.NONE)
      return moves;

    const positionToValue = (move) => {
      const [, value = 10000] = /M(\d+)/i.exec(move.position || '') || [];
      return +value;
    }

    const compare = (moveA, moveB) => {
      if (sorter === 'position')
        return positionToValue(moveA) - positionToValue(moveB);
      if (sorter === 'pokemon')
        return moveA.pokemon.name.localeCompare(moveB.pokemon.name);
      if (sorter === 'move')
        return moveA.name.localeCompare(moveB.name);
      if (sorter === 'type')
        return moveA.type.localeCompare(moveB.type);
      if (sorter === 'cooldown')
        return (moveA.cooldown || 0) - (moveB.cooldown || 0);
      if (sorter === 'level')
        return (moveA.level || 0) - (moveB.level || 0);
      throw new Error('Can\'t sort moves.')
    };

    if (sortment === Sortment.ASCENDING)
      return [...moves].sort(compare);
    return [...moves].sort(compare).reverse();
  }

  const filteredMoves = moves.filter(move => {
    if (!term) {
      return true;
    }

    return [move.name, move.type, move.pokemon.name].some(text =>
      text.includes(term)
    );
  });

  console.log(sortMoves(filteredMoves))

  const onChangeFor = (key) => () => {
    if (key !== sorter || sortment === Sortment.NONE) {
      setSorter(key);
      setSortment(Sortment.ASCENDING);
      return;
    }

    if (sortment === Sortment.ASCENDING) {
      setSortment(Sortment.DESCENDING);
      return;
    }

    if (sortment === Sortment.DESCENDING) {
      setSorter(undefined);
      setSortment(Sortment.NONE);
      return;
    }

    throw new Error('Unexpected `sorter` or `sortment` on `onChange` callback.');
  };

  return (
    <main className="App">
      <form onSubmit={event => event.preventDefault()}>
        <input
          type="search"
          value={term}
          onChange={event => setTerm(event.target.value)}
        />
      </form>

      <table>
        <thead>
          <tr>
            <SearchLabel
              label="Position"
              sortment={sorter === 'position' ? sortment : Sortment.NONE}
              onChange={onChangeFor('position')}
            />
            <SearchLabel
              label="Pokémon"
              sortment={sorter === 'pokemon' ? sortment : Sortment.NONE}
              onChange={onChangeFor('pokemon')}
            />
            <SearchLabel
              label="Move"
              sortment={sorter === 'move' ? sortment : Sortment.NONE}
              onChange={onChangeFor('move')}
            />
            <SearchLabel
              label="Type"
              sortment={sorter === 'type' ? sortment : Sortment.NONE}
              onChange={onChangeFor('type')}
            />
            <SearchLabel
              label="Cooldown"
              sortment={sorter === 'cooldown' ? sortment : Sortment.NONE}
              onChange={onChangeFor('cooldown')}
            />
            <SearchLabel
              label="Level"
              sortment={sorter === 'level' ? sortment : Sortment.NONE}
              onChange={onChangeFor('level')}
            />
          </tr>
        </thead>

        <tbody>
          {
            sortMoves(filteredMoves)
            .slice(0, 50)
            .map(move => (
              <tr key={move.id}>
                <td>{move.position}</td>
                <td>
                  <a
                    href={move.pokemon.link}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <img
                      className="icon"
                      src={move.pokemon.icon}
                      alt={move.pokemon.name}
                      title={move.pokemon.name}
                    />
                    <span className="name">{move.pokemon.name}</span>
                  </a>
                </td>
                <td>{move.name}</td>
                <td>{move.type}</td>
                <td>{move.cooldown}s</td>
                <td>{move.level}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;
