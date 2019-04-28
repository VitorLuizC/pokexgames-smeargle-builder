import "./App.css";
import moves from "./data.json";
import Table from "./Table";
import React, { useState } from "react";
import PokemonIcon from "./components/PokemonIcon";

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

      <Table
        cols={[
          {
            label: "Position",
            value: move => move.position,
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
              <td key={"pokemon-" + move.id}>
                <a
                  href={move.pokemon.link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <PokemonIcon
                    name={move.pokemon.name}
                    icon={move.pokemon.icon}
                  />
                  <span className="name">{move.pokemon.name}</span>
                </a>
              </td>
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
            value: move => move.cooldown,
            render: ({ row: move }) => (
              <td key={"cooldown-" + move.id}>
                {move.cooldown ? move.cooldown + "s" : "-"}
              </td>
            )
          },
          {
            label: "Level",
            value: move => move.level
          }
        ]}
        rows={filteredMoves.slice(0, 50)}
      />
    </main>
  );
}

export default App;
