import "./App.scss";
import moves from "./data.json";
import SortableTable from "./components/SortableTable";
import React, { useState } from "react";
import PokemonName from "./components/PokemonName";
import normalize from "./helpers/normalize";
import SearchField from "./components/SearchField";

/**
 * Returns a filter function by term.
 * @param {string} term
 * @returns {(move: Move) => boolean}
 */
function filterBy(term) {
  return move => {
    if (!term) {
      return true;
    }

    const targets = [move.name, move.type, move.pokemon.name].map(normalize);

    return targets.some(target => target.includes(normalize(term)));
  };
}

function App() {
  const [term, setTerm] = useState("");

  const filteredMoves = moves.filter(filterBy(term));

  return (
    <main className="App">
      <SearchField
        value={term}
        onChange={setTerm}
        placeholder="Search by Pokémon, move name or even type."
      />

      <SortableTable
        rows={filteredMoves}
        cols={[
          {
            label: "Position",
            value: move => move.position,
            align: "center",
            sort: (moveA, moveB) => {
              const toValue = move => {
                const [, value = 10000] =
                  /M(\d+)/i.exec(move.position || "") || [];
                return +value;
              };

              return toValue(moveA) - toValue(moveB);
            }
          },
          {
            label: "Pokémon",
            value: move => move.pokemon.name,
            render: ({ row: move }) => (
              <PokemonName
                icon={move.pokemon.icon}
                link={move.pokemon.link}
                name={move.pokemon.name}
              />
            )
          },
          {
            label: "Move",
            value: move => move.name
          },
          {
            label: "Type",
            value: move => move.type
          },
          {
            label: "Cooldown",
            align: "right",
            value: move => move.cooldown || 0,
            render: ({ row: move }) =>
              move.cooldown ? move.cooldown + "s" : "-"
          },
          {
            label: "Level",
            align: "right",
            value: move => move.level || 0,
            render: ({ row: move }) => (move.level ? move.level : "-")
          }
        ]}
      />
    </main>
  );
}

export default App;
