import "./App.css";
import moves from "./data.json";
import SortableTable from "./components/SortableTable";
import React, { useState } from "react";
import PokemonName from "./components/PokemonName";

function App() {
  const [term, setTerm] = useState("");

  const filteredMoves = moves.filter(move => {
    if (!term) {
      return true;
    }

    return [move.name, move.type, move.pokemon.name].some(text =>
      text.includes(term)
    );
  });

  return (
    <main className="App">
      <form onSubmit={event => event.preventDefault()}>
        <input
          type="search"
          value={term}
          onChange={event => setTerm(event.target.value)}
        />
      </form>

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
            value: move => move.cooldown,
            render: ({ row: move }) =>
              move.cooldown ? move.cooldown + "s" : "-"
          },
          {
            label: "Level",
            align: "right",
            value: move => move.level
          }
        ]}
      />
    </main>
  );
}

export default App;
